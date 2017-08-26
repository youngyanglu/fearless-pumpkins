from sklearn import svm
from sklearn.externals import joblib
from sklearn.model_selection import GridSearchCV
from pymongo import MongoClient
import re
import nltk
import numpy as np
# nltk.download_shell()
from nltk.corpus import stopwords
from nltk.stem.porter import *
stemmer = PorterStemmer()
from nltk.stem.snowball import SnowballStemmer
from multiprocessing import Pool
pool =  Pool()
import asyncio


client = MongoClient('localhost', 27017)
db = client['dataSet']

collection = db.trainings
patrick = []
jasper = []
dictionary = set()
eachTweet = []

# You need to get the ids as well as the text so you can update afterwards.
# You can use collection.find({}, {text: 1})
# It gives all the ids and text.
async def patrick_populater(category):
    patrick = []
    for tweet in collection.distinct('Text', {'Classification': 0, 'Category': category}):
        meaningful_words = []
        nonum = re.sub("[\d*]",
            "number ",
            tweet)
        letters_only = re.sub("[^a-zA-Z]",
            " ",
            nonum)
        nourlwords = re.sub(r'^https?:\/\/.*[\r\n]*', 'http ', letters_only, flags=re.MULTILINE)
        words =  nourlwords.lower().split()
        stops = set(stopwords.words("english"))
        meaningful_words = [w for w in words if not w in stops]
        clean = []
        for word in meaningful_words:
            dictionary.add(word)
            clean.append(SnowballStemmer("english").stem(word))
        patrick.append(clean)
        jasper.append(0)

    for tweet in collection.distinct('Text', {'Classification': 1, 'Category': category}):
        meaningful_words = []
        nonum = re.sub("[\d*]",
            " number ",
            tweet)
        letters_only = re.sub("[^a-zA-Z]",
            " ",
            nonum)
        nourlwords = re.sub(r'^https?:\/\/.*[\r\n]*', 'http ', letters_only, flags=re.MULTILINE)
        words =  nourlwords.lower().split()
        stops = set(stopwords.words("english"))
        meaningful_words = [w for w in words if not w in stops]
        clean = []
        for word in meaningful_words:
            dictionary.add(word)
            clean.append(SnowballStemmer("english").stem(word))
        patrick.append(clean)
        jasper.append(1)

    return patrick;

# compares words in trainingModel to each word in every tweet
# creates a new array with a 1 where each word matched and a 0 otherwise
# returns [[0,1,0,0], [1,1,0,0], [0,0,1,1]]

async def seralizeTweets(tweets, trainingModel):
    for tweet in tweets:
        temp = []
        for word in trainingModel:
            if word in tweet:
                temp.append(1)
            else:
                temp.append(0)
        eachTweet.append(temp)
    return eachTweet

async def engine(category):
    patrick = await patrick_populater(category)
    dictionaryList = list(dictionary)
    print(dictionaryList[0])
    Xarray = await seralizeTweets(patrick, dictionaryList)
    print(eachTweet[300])
    print(jasper[300])

politics = joblib.load('politicsPrediction.pkl')
gender = joblib.load('genderPrediction.pkl')
religion = joblib.load('religionPrediction.pkl')

# async def wordClassifier():
    # create array of same legnth as dictionary
    # at each index, make it a 1
    # predict probability
    # if probability of one side exceeds 70%
    # store the word and the side it belongs to in dict
categories = ['Politics', 'Religion', 'Gender']

for category in categories:    
    loop = asyncio.get_event_loop()
    loop.run_until_complete(engine(category))
    loop.close()

# parameters = {'kernel':('linear', 'rbf'), 'C':[1, 10, 50]}
# X = np.array(eachTweet)
# y = np.array(jasper)
# politics = svm.SVC(probability=True)
# politicsOp = GridSearchCV(politics, parameters)
# politicsOp.fit(X, y)
            
# joblib.dump(politicsOp, 'politicsPrediction.pkl') 
joblib.dump(politics, 'politicsPrediction.pkl') 

# parameters = {'kernel':('linear', 'rbf'), 'C':[1, 10, 50]}
# X = np.array(eachTweet)
# y = np.array(jasper)
# religion = svm.SVC(probability=True)
# religion = GridSearchCV(religion, parameters)
# religion.fit(X, y)

joblib.dump(religion, 'relgionPrediction.pkl')

# parameters = {'kernel':('linear', 'rbf'), 'C':[1, 10, 50]}
# X = np.array(eachTweet)
# y = np.array(jasper)
# gender = svm.SVC(probability=True)
# gender = GridSearchCV(gender, parameters)
# gender.fit(X, y)

joblib.dump(gender, 'genderPrediction.pkl')

