from pymongo import MongoClient
import re
import nltk 
# nltk.download_shell()
from nltk.corpus import stopwords
from nltk.stem.porter import *
stemmer = PorterStemmer()
from nltk.stem.snowball import SnowballStemmer


client = MongoClient('localhost', 27017)
db = client['dataSet']

#training
collection = db.trainings
#democrat
# results = collection.find()
# print(results) 
# print(collection.distinct('Text'))
patrick_repub = []
jasper_repub = []

# You need to get the ids as well as the text so you can update afterwards.
# You can use collection.find({}, {text: 1})
# It gives all the ids and text.

for tweet in collection.distinct('Text', {'Classification': 1}):
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
    patrick_repub.append(clean)
    jasper_repub.append(1)


patrick_demo = []
jasper_demo = []

for tweet in collection.distinct('Text', {'Classification': 0}):
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
    patrick_demo.append(clean)
    jasper_demo.append(0)