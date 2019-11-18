import pandas as pd
from os import path
import ai
import json
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required,
                                get_jwt_identity, get_raw_jwt, get_jwt_claims)

from passlib.hash import pbkdf2_sha256 as sha256
import model
from flask_pymongo import PyMongo

app = Flask(__name__)
api = Api(app)

CORS(app, resources={r"*": {'origins': 'http://localhost:3000'}})
# CORS(app)

app.config["MONGO_DBNAME"] = "hackathon"
app.config[
    "MONGO_URI"] = "mongodb+srv://puru:qwertyuiop123456789@learningcluster-1ynap.mongodb.net/hackathon" \
                   "?retryWrites=true&w=majority"

app.config['JWT_SECRET_KEY'] = 'sajdgajh348763hjdg3287847hfhkyg$%#$%^$RTGHF&^%R&TF73'
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

jwt = JWTManager(app)

mongo = PyMongo(app)
mongo.init_app(app)


class UserRegister(Resource):
    @staticmethod
    def post():
        details = request.json
        username = details['username']
        password = details['password']
        new_user = model.UserModel(
            username=details['username'],
            password=details['password']
        )
        access_token = create_access_token(identity=details['username'])
        refresh_token = create_refresh_token(identity=details['username'])
        result, message = new_user.register()
        return jsonify({"status": result, 'code': 200, 'message': message, 'access_token': access_token,
                        'refresh_token': refresh_token})


class UserLogin(Resource):
    @staticmethod
    def post():
        details = request.json
        email = details['email']
        password = details['password']
        new_user = model.UserModel(
            email=details['email'],
            password=details['password']
        )
        result = new_user.login()
        if result['status']:
            access_token = create_access_token(identity=result['data']['_id']['$oid'])
            refresh_token = create_refresh_token(identity=result['data']['_id']['$oid'])
            return jsonify(
                {'access_token': access_token, 'refresh_token': refresh_token, 'userData': result['data'],  'message': 'Login Successful'})
        else:
            return jsonify({'status': 403, 'message': result['error']})


class UploadData(Resource):
    @jwt_required
    def post(self):
        claims = get_jwt_claims()
        dataCSV = request.files['dataCSV']
        names = ['name', 'gender', 'income', 'caste', 'attendance', 'disabled', 'class', 'marks', 'maths', 'science',
                 'language', 'dropped']
        dataset = pd.read_csv(dataCSV, names=names)
        result = ai.generateModel(dataset, claims['id'])
        if result:
            return jsonify({'status': 200, 'message': 'Your Data has been Successfully Uploaded!'})
        else:
            return jsonify({'status': 500, 'message': 'There was an error, please try again later'})


class PredictCollectiveData(Resource):
    @jwt_required
    def post(self):
        claims = get_jwt_claims()
        dataCSV = request.files['dataCSV']
        names = ['name', 'gender', 'income', 'caste', 'attendance', 'disabled', 'class', 'marks']
        dataset = pd.read_csv(dataCSV, names=names)
        result = ai.get_collective_prediction(dataset, claims['id'])
        return jsonify({'status': 500, 'result': result})


class PredictDrop(Resource):
    @jwt_required
    def post(self):
        claims = get_jwt_claims()
        data = request.json
        print(data)
        prediction = ai.get_prediction(data, claims['id']).tolist()
        if prediction:
            return jsonify({'status': 200, 'prediction': prediction})
        else:
            return jsonify(({'status': 300, 'error': 'Sorry, We couldn\'t predict the results. Please try again later.'}))


class CheckModel(Resource):
    @jwt_required
    def post(self):
        claims = get_jwt_claims()
        filename = 'schoolModels/' + claims['id'] + '.pkl'
        result = str(path.exists(filename))
        if result == "True":
            return {'uploadFile': '0'}
        else:
            return {'uploadFile': '1'}


class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = model.RevokedTokenModel(jti=jti)
            revoked_token.add()
            return {'status': 200, 'message': 'Access token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = model.RevokedTokenModel(jti=jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500

class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return {'access_token': access_token}


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return model.RevokedTokenModel.is_jti_blacklisted(jti)

# created for, and must return data that is json serializable
@jwt.user_claims_loader
def add_claims_to_access_token(identity):
    return {
        'id': identity,
    }


api.add_resource(CheckModel, '/checkModel')
api.add_resource(PredictDrop, '/predict')
api.add_resource(UserLogin, '/login')
api.add_resource(UploadData, '/uploadData')
api.add_resource(PredictCollectiveData, '/predictCSV')
api.add_resource(UserLogoutAccess, '/logout/access')
api.add_resource(UserLogoutRefresh, '/logout/refresh')
api.add_resource(TokenRefresh, '/token/refresh')

if __name__ == "__main__":
    app.run(debug=True, port=5000)