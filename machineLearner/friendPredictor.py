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

friendsModel = joblib.load('politicsPrediction.pkl')
eachFriendWord = []
friendDictionary = {}
eachFriendSer = []
friendCategorisation = []

f = open('politicsFriends.txt', 'r')
dictionaryString = f.read()
dictionaryList = dictionaryString.split(' ')


# async def friendCleaner(friendList):
#     for friendString in collection.distinct('Text', {'Classification': 0, 'Category': 'Politics'}):
#         friendCategorisation.append(0)
#         friendList = friendString.split(',');
#         eachFriendWord.append(friendList)
#         for friend in friendList:
#             try:
#                 friendDictionary[friend] = friendDictionary[friend] + 1 
#             except KeyError:
#                 friendDictionary[friend] = 1
#     for friendString in collection.distinct('Text', {'Classification': 1, 'Category': 'Politics'}):
#         friendCategorisation.append(1)
#         friendList = friendString.split(',');
#         eachFriendWord.append(friendList)
#         for friend in friendList:
#             try:
#                 friendDictionary[friend] = friendDictionary[friend] + 1 
#             except KeyError:
#                 friendDictionary[friend] = 1
#     return eachFriendWord


async def serialiseTweets(friendsArray, trainingModel):
    serialisedFriends = []
    for word in trainingModel:
        if word in friendsArray:
            serialisedFriends.append(1)
        else:
            serialisedFriends.append(0)
    return serialisedFriends

async def predict(friendsArray):
    male = 0
    female = 0
    serialisedFriends = await serialiseTweets(friendsArray, dictionaryList)
    probability = friendsModel.predict_proba([serialisedFriends])
    print(probability)

friendsArray = sys.argv[1].split(';')
loop = asyncio.get_event_loop()
loop.run_until_complete(predict(friendsArray))
loop.close()

