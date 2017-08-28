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

friendsModel = joblib.load('../machineLearner/politicsPrediction.pkl')
eachFriendWord = []
friendDictionary = {}
eachFriendSer = []
friendCategorisation = []

f = open('../machineLearner/politicsFriends.txt', 'r')
dictionaryString = f.read()
dictionaryList = dictionaryString.split(' ')

async def serialiseFriends(friendsArray, trainingModel):
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
    serialisedFriends = await serialiseFriends(friendsArray, dictionaryList)
    probability = friendsModel.predict_proba([serialisedFriends])
    print(probability[0][1])

friendsArray = sys.argv[1].split(';')
loop = asyncio.get_event_loop()
loop.run_until_complete(predict(friendsArray))
loop.close()

