from flask_smorest import Blueprint,abort
from flask.views import MethodView
from schemas.user  import Userschema,Userloginschema
from schemas.buyproduct import buyproductschema
from Models.user import UsersModel
from passlib.hash import pbkdf2_sha256
from sqlalchemy.exc import SQLAlchemyError,IntegrityError
from flask_jwt_extended import jwt_required,get_jwt_identity,create_access_token,create_refresh_token,get_jwt
from Models.db import db
from blacklist import Blacklist

blp_3=Blueprint("User",__name__,description="this  page is for authentication")

@blp_3.route("/register")
class userregister(MethodView):
    @blp_3.arguments(Userschema)
    def post(self,data):
        if UsersModel.query.filter(UsersModel.username==data["username"]).first():
            return {"message":"User already exist"},404
        if UsersModel.query.filter(UsersModel.email==data["email"]).first():
            return {"message":"Given Email already Registered"}
        user=UsersModel(username=data["username"],email=data["email"],password=pbkdf2_sha256.hash(data["password"]),role="user")
        try:

            db.session.add(user)
            db.session.commit()
            return {"message":"User added successfully"},201
        except SQLAlchemyError:
            abort(404,message="something went wrong")
        

@blp_3.route("/login")
class userlogin(MethodView):
    @blp_3.arguments(Userloginschema)
    def post(self,data):
        query=UsersModel.query.filter(UsersModel.username==data["username"]).first()
        if query:
            if pbkdf2_sha256.verify(data["password"],query.password):
                access_token=create_access_token(identity=str(query.user_id),fresh=True,additional_claims={
                    "role":query.role
                })
                refersh_token=create_refresh_token(identity=str(query.user_id),additional_claims={
                    "role":query.role
                })
                return {
                    "meassage":"Successfully Logged in",
                    "Access token":access_token,
                    "refersh token":refersh_token
                }
        return {"message":"Invalid Credientials"},400
@blp_3.route("/logout")
class userlogout(MethodView):
    @jwt_required()
    def post(self):
        jti=get_jwt()["jti"]
        Blacklist.add(jti)
        return {"message":"You logged Out successfully"},200

@blp_3.route("/refresh")
class userrefresh_token(MethodView):
    @jwt_required(refresh=True)
    def post(self):
        access_token=create_access_token(identity=int(get_jwt_identity),fresh=False)
        refresh_token=create_refresh_token(identity=int(get_jwt_identity))
        jti=get_jwt()["jti"]
        Blacklist.add(jti)
        return {
            "message":"Token refreshed",
            "Access Token":access_token,
            "Refresh Token":refresh_token
        }
        


@blp_3.route("/Delete_Account")
class user_delete_account(MethodView):
    @jwt_required(fresh=True)
    def delete(self):
        query=UsersModel.query.get_or_404(int(get_jwt_identity()))
        try:
            print(f"Account deleted , jti:  {get_jwt_identity()}")
            jti=get_jwt()["jti"]
            Blacklist.add(jti)
            db.session.delete(query)
            db.session.commit()
            return {
                "message":"Account deleted successfully"
            }
        except SQLAlchemyError:
            abort(404,message="something went wrong")
        

@blp_3.route("/user")       
class get_user(MethodView):
    @jwt_required()
    def get(self):
        current=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if current:
            return {
                "user_id":current.user_id,
                "username":current.username,
                "email": current.email,
                "role":current.role
            },200
        abort(400,message="User not Found")









        
