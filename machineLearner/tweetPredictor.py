from sklearn import svm
import numpy as np
from sklearn.externals import joblib
from sklearn.model_selection import GridSearchCV
import re
import nltk
# nltk.download_shell()
from nltk.corpus import stopwords
from nltk.stem.porter import *
stemmer = PorterStemmer()
from nltk.stem.snowball import SnowballStemmer
from multiprocessing import Pool
import asyncio
import sys

pool =  Pool()

politics = joblib.load('genderPrediction.pkl')
cleanedTweets = []
predictions = []
probabilities = []

f = open('genderDictionary.txt', 'r')
dictionaryString = f.read()
dictionaryList = dictionaryString.split(' ')


async def cleanTweets(tweets):
    for tweet in tweets:
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
            clean.append(SnowballStemmer("english").stem(word))
        cleanedTweets.append(clean)
    return cleanedTweets

async def serialiseTweets(cleanedTweets, trainingModel):
    serialisedTweets = []
    for tweet in cleanedTweets:
        temp = []
        for word in trainingModel:
            if word in tweet:
                temp.append(1)
            else:
                temp.append(0)
        serialisedTweets.append(temp)
    return serialisedTweets

async def predict(tweets):
	cleanedTweets = await cleanTweets(tweets)
	male = 0
	female = 0
	serialisedTweets = await serialiseTweets(cleanedTweets, dictionaryList)
	for tweet in serialisedTweets:
		probability = politics.predict_proba([tweet])
		female += probability[0][0]
		male += probability[0][1]
	male = male / len(cleanedTweets)
	female = 1 - male
	print(male, female) 

rawTweets = sys.argv[1].split(';')
loop = asyncio.get_event_loop()
loop.run_until_complete(predict(rawTweets))
loop.close()

prediction3 = gender.predict([test])
probability3 = gender.predict_proba([test])

prediction4 = religion.predict([test])
probability4 = religion.predict_proba([test])


