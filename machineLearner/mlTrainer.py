from sklearn import svm
import numpy as np
from sklearn.externals import joblib

X = np.array([[0, 0], [1, 1]])
y = np.array([0, 1])
politics = svm.SVC(probability=True)
politics.fit(X, y) 
prediction = politics.predict([[2., 2.]])
probability = politics.predict_proba([[2., 2.]])

joblib.dump(politics, 'politicsPrediction.pkl') 
