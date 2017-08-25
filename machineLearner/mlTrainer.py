from sklearn import svm
import numpy as np
from sklearn.externals import joblib

X = np.array([[0, 0], [1, 1]])
y = np.array([0, 1])
politics = svm.SVC(probability=True)
politics.fit(X, y) 

joblib.dump(politics, 'politicsPrediction.pkl') 
