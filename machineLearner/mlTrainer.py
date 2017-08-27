from sklearn import svm
from sklearn.neural_network import MLPClassifier
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

eachTweetWord = []
tweetDictionary = {}
eachTweetSer = []
tweetCategorisation = []


eachFriendWord = []
friendDictionary = {}
eachFriendSer = []
friendCategorisation = []


# You need to get the ids as well as the text so you can update afterwards.
# You can use collection.find({}, {text: 1})
# It gives all the ids and text.

async def friendCleaner():
    for friendString in collection.distinct('Text', {'Classification': 0, 'Category': 'Politics'}):
        friendCategorisation.append(0)
        friendList = friendString.split(', ');
        eachFriendWord.append(friendList)
        for friend in friendList:
            try:
                friendDictionary[friend] = friendDictionary[friend] + 1 
            except KeyError:
                friendDictionary[friend] = 1
    for friendString in collection.distinct('Text', {'Classification': 1, 'Category': 'Politics'}):
        friendCategorisation.append(1)
        friendList = friendString.split(', ');
        eachFriendWord.append(friendList)
        for friend in friendList:
            try:
                friendDictionary[friend] = friendDictionary[friend] + 1 
            except KeyError:
                friendDictionary[friend] = 1
    return eachFriendWord

async def tweetCleaner():
    for tweet in collection.distinct('Text', {'Classification': 0, 'Category': 'Gender'}):
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
            stemmed = SnowballStemmer("english").stem(word)
            try:
                tweetDictionary[stemmed] = tweetDictionary[stemmed] + 1 
            except KeyError:
                tweetDictionary[stemmed] = 1
            clean.append(stemmed)
        eachTweetWord.append(clean)
        tweetCategorisation.append(0)

    for tweet in collection.distinct('Text', {'Classification': 1, 'Category': 'Gender'}):
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
            stemmed = SnowballStemmer("english").stem(word)
            try:
                tweetDictionary[stemmed] = tweetDictionary[stemmed] + 1 
            except KeyError:
                tweetDictionary[stemmed] = 1
            clean.append(stemmed)
        eachTweetWord.append(clean)
        tweetCategorisation.append(1)

    return eachTweetWord;

# compares words in trainingModel to each word in every tweet
# creates a new array with a 1 where each word matched and a 0 otherwise
# returns [[0,1,0,0], [1,1,0,0], [0,0,1,1]]

async def serialize(list, dictionary, container):
    for item in list:
        temp = []
        for word in dictionary:
            if word in item:
                temp.append(1)
            else:
                temp.append(0)
        container.append(temp)
    return container

# # tweet analysis

# async def tweetEngine():
#     eachTweetWord = await tweetCleaner()
#     dictionaryList = []
#     for key, value in tweetDictionary.items():
#         if value > 2 and len(key) > 2:
#             dictionaryList.append(key)
#     f = open('genderDictionary.txt','w')
#     f.write(' '.join(dictionaryList))
#     f.close()
#     Xarray = await serialize(eachTweetWord, dictionaryList, eachTweetSer)

# loop = asyncio.get_event_loop()
# loop.run_until_complete(tweetEngine())
# loop.close()

# parameters = {'alpha':[1e-4, 1e-5, 1e-6]}
# X = np.array(eachTweetSer)
# y = np.array(tweetCategorisation)
# NNgender = MLPClassifier(solver='lbfgs', hidden_layer_sizes=(20,20,20), random_state=1)
# # SVMgender = svm.SVC(probability=True)
# genderOp = GridSearchCV(NNgender, parameters)
# genderOp.fit(X, y)

# joblib.dump(genderOp, 'genderPrediction.pkl') 

# friend analysis 

async def friendEngine():
    eachFriendWord = await friendCleaner()
    friendList = []
    for key, value in friendDictionary.items():
        if value > 1:
            friendList.append(key)
    f = open('politicsFriends.txt', 'w')
    f.write(' '.join(friendList))
    f.close()
    Xarray = await serialize(eachFriendWord, friendList, eachFriendSer)

loop = asyncio.get_event_loop()
loop.run_until_complete(friendEngine())
loop.close()

parameters = {'alpha':[1e-4, 1e-5, 1e-6]}
X = np.array(eachFriendSer)
y = np.array(friendCategorisation)
NNpolitics = MLPClassifier(solver='lbfgs', random_state=1)
# SVMpolitics = svm.SVC(probability=True)
politicsOp = GridSearchCV(NNpolitics, parameters)
politicsOp.fit(X, y)

joblib.dump(politicsOp, 'politicsPrediction.pkl') 







