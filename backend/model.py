from app import mongo
from passlib.hash import pbkdf2_sha256 as sha256
from bson.json_util import dumps
import json


class UserModel:
    def __init__(self, email, password):
        self.email = email
        self.password = password

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, jwt_hash):
        return sha256.verify(password, jwt_hash)

    @staticmethod
    def check_username(email):
        result = mongo.db.principal.find({'email': email}).count()
        if result > 0:
            return True
        else:
            return False

    # def register(self):
        # data = {
        #     "schoolName": self.schoolName,
        #     "name": ,
        #     "email": "raman@email.com",
        #     "password": sha256.hash('1234')
        # }
        # inserted = mongo.db.principal.insert_one(data)

    def login(self):
        email = self.email
        password = self.password

        check_email = self.check_username(email)

        if check_email:
            details = json.loads(dumps(mongo.db.principal.find({'email': email})))
            correct_pass = details[0]['password']
            _id = details[0]['_id']['$oid']
            true_pass = self.verify_hash(password, correct_pass)
            if true_pass:
                return {'status': True, 'data': details[0], 'message': 'Login Successful'}
            else:
                return {'status': False, 'error': 'The Email and Password you entered do not match.'}

        else:
            return {'status': False, 'error': 'The Email and Password you entered do not match.'}


class RevokedTokenModel:
    def __init__(self, jti):
        self.jti = jti

    def add(self):
        data = {
            'jti': self.jti
        }
        mongo.db.blacklisted.insert_one(data)
        return True

    @classmethod
    def is_jti_blacklisted(cls, jti):
        result = mongo.db.blacklisted.find({'jti': jti}).count()
        if result > 0:
            return True
        else:
            return False