from sklearn import svm
import numpy as np
from sklearn.externals import joblib

politics = joblib.load('politicsPrediction.pkl') 

prediction2 = politics.predict([[2., 2.]])
probability2 = politics.predict_proba([[2., 2.]])

print prediction2
print probability2