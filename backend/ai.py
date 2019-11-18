import pandas as pd
from sklearn import preprocessing
from pandas.plotting import scatter_matrix
from matplotlib import pyplot
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.externals import joblib
# import numpy as np
# from pandas import read_csv
# from sklearn.model_selection import train_test_split
# from sklearn.model_selection import cross_val_score
# from sklearn.model_selection import StratifiedKFold
# from sklearn.metrics import classification_report
# from sklearn.metrics import confusion_matrix
# from sklearn.metrics import accuracy_score
# from sklearn.linear_model import LogisticRegression
# from sklearn.neighbors import KNeighborsClassifier
# from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
# from sklearn.naive_bayes import GaussianNB
# from sklearn.svm import SVC


class MultiColumnLabelEncoder:
    def __init__(self, columns=None):
        self.columns = columns  # array of column names to encode

    def fit(self, X, y=None):
        return self # not relevant here

    def transform(self, X):
        '''
        Transforms columns of X specified in self.columns using
        LabelEncoder(). If no columns specified, transforms all
        columns in X.
        '''
        output = X.copy()
        if self.columns is not None:
            for col in self.columns:
                output[col] = LabelEncoder().fit_transform(output[col])
        else:
            for colname, col in output.iteritems():
                output[colname] = LabelEncoder().fit_transform(col)
        return output

    def fit_transform(self, X, y=None):
        return self.fit(X, y).transform(X)


def generateModel(file, _id):

    dataset = MultiColumnLabelEncoder(columns=['gender', 'caste']).fit_transform(file)

    array = dataset.values
    X = array[:, 1:8]
    Y = array[:, 11]
    # print(Y)
    Y = Y.astype('int')

    model = DecisionTreeClassifier()
    model.fit(X, Y)
    filename = 'schoolModels/' + _id + '.pkl'
    joblib.dump(model, filename)

    return True


def get_prediction(data, _id):

    filename = 'schoolModels/' + _id + '.pkl'
    predict_from_joblib = joblib.load(filename)

    X_predict = {}
    for key, value in data.items():
        X_predict[key] = [value]

    X_predict = pd.DataFrame(data, index=[0])

    le = preprocessing.LabelEncoder()

    X_predict['gender'] = le.fit_transform(X_predict['gender'])
    X_predict['caste'] = le.fit_transform(X_predict['caste'])

    X_predict.to_numpy()
    prediction = predict_from_joblib.predict(X_predict)

    return prediction


def get_collective_prediction(file, _id):

    filename = 'schoolModels/' + _id + '.pkl'
    predict_from_joblib = joblib.load(filename)


    dataset = MultiColumnLabelEncoder(columns=['gender', 'caste']).fit_transform(file)
    array = dataset.values
    X = array[:, 1:8]

    names = array[:, 0]

    predictions = predict_from_joblib.predict(X)
    print('predictions: ')
    print(predictions)

    finalArray = zip(names, predictions)
    finalDict = {}
    for value in finalArray:
        finalDict[value[0]] = str(value[1])
    return finalDict


# X_train, X_validation, Y_train, Y_validation = train_test_split(X, Y, test_size=0.20, random_state=1)
    #
    # models = []
    # models.append(('LR', LogisticRegression(solver='liblinear', multi_class='ovr')))
    # models.append(('KNN', KNeighborsClassifier()))
    # models.append(('CART', DecisionTreeClassifier()))
    # models.append(('NB', GaussianNB()))
    # models.append(('SVM', SVC(gamma='auto')))

    # evaluate each model in turn
    # results = []
    # names = []
    # for name, model in models:
    #     model.fit(X_train, Y_train)
    #     prediction = model.predict(X_validation)
    #     results.append(accuracy_score(Y_validation, prediction))
    #     names.append(name)
    #     print('%s: %f (%f)' % (name, cv_results.mean(), cv_results.std()))

    # print(results)


    # print(X_validation)
    # predictions = model.predict([[1, 90, 3, 0, 2, 20]])
    # Evaluate predictions
    # print(accuracy_score(Y_validation, predictions))
    # print(confusion_matrix(Y_validation, predictions))
    # print(classification_report(Y_validation, predictions))


