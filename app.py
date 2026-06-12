from flask import Flask,jsonify
from flask_smorest import Api
from resources.category import blp_1 as categoryblp
from resources.product import blp_2 as productblp
from resources.user import blp_3 as userblp
from resources.cart import blp_4 as cartblp
from resources.order import blp_5 as orderblp
from resources.html_routes import html_blp
import Models
from Models.category import CategoryModel
from Models.product import ProductModel
from Models.user import UsersModel
from Models.cart_items import Cart_itemModel
from Models.order_items import Order_itemsModel
from Models.db import db
from flask_jwt_extended import JWTManager
from blacklist import Blacklist
import os
from passlib.hash import pbkdf2_sha256
from flask_cors import CORS
from datetime import timedelta
from werkzeug.utils import secure_filename
from dotenv import load_dotenv


load_dotenv()

app=Flask(__name__)

app.config["PROPAGATE_EXCEPTION"]=True
app.config["API_TITLE"] = "My API"
app.config["API_VERSION"] = "v1"
app.config["OPENAPI_VERSION"] = "3.0.3"
app.config["OPENAPI_URL_PREFIX"] = "/"
app.config["OPENAPI_SWAGGER_UI_PATH"] = "/docs"
app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

app.config["SQLALCHEMY_DATABASE_URI"]=os.getenv("DATABASE_URL","sqlite:///data.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False

app.config["JWT_SECRET_KEY"]=os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)

app.config["UPLOAD_FOLDER"] = "static/uploads"

app.config["API_SPEC_OPTIONS"] = {
    "security": [{"BearerAuth": []}],
    "components": {
        "securitySchemes": {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    }
}

CORS(app,resources={r"/*": {"origins": "http://127.0.0.1:5501"}})


jwt=JWTManager(app)

db.init_app(app)

with app.app_context():
    db.create_all()
    user=UsersModel.query.filter(UsersModel.role=="admin").first()
    if not user:
        query=UsersModel(username="suraj",email="surajraturi.51220006@gmail.com",password=pbkdf2_sha256.hash("suraj$5122006&"),role="admin")
        db.session.add(query)
        db.session.commit()


api=Api(app)

api.register_blueprint(categoryblp)
api.register_blueprint(productblp)
api.register_blueprint(cartblp)
api.register_blueprint(orderblp)
api.register_blueprint(userblp)
app.register_blueprint(html_blp)


@jwt.expired_token_loader
def expired_token_loader(header,payload):
    return jsonify({
        "message":"The token is expired",
        "error":"Expired_token"
    }),401

@jwt.invalid_token_loader
def invalid_token_loader(error):
    return jsonify({
        "message":"The token is Invalid",
        "error":"Inavlid_token"
    }),401

@jwt.token_in_blocklist_loader
def token_in_blocklist_loader(header,payload):
    return payload["jti"] in Blacklist

@jwt.revoked_token_loader
def revoked_token_loader(header,payload):
    return jsonify({
        "message":"The token is expired",
        "error":"Expired_token"
    }),401

@jwt.unauthorized_loader
def unauthorized_loader(error):
    return jsonify({
        "message":"Can not access without token",
        "error":"Need_token"

    }),401





if __name__=="__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)
