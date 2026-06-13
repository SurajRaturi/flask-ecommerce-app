from flask_smorest import Blueprint,abort
from flask.views import MethodView
from schemas.category  import Categoryschema
from Models.category import CategoryModel
from flask_jwt_extended import jwt_required,get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError,IntegrityError
from Models.db import db
from Models.user import UsersModel


blp_1=Blueprint("Category",__name__,description="This is category page")

@blp_1.route("/Category")
class category(MethodView):
    @blp_1.response(200,Categoryschema(many=True))
    def get(self):
        querry=CategoryModel.query.all()
        return [{
            "Category_name":i.name
        }for i in querry]
    
    
    @jwt_required()
    @blp_1.arguments(Categoryschema)
    def post(self,update):
        query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if query.role=="admin":
            if CategoryModel.query.filter(CategoryModel.name==update["Category_name"]).first():
                return {"message":"Category already exists"},404
            add_category=CategoryModel(name=(update["Category_name"].lower()).strip())
            try:

                db.session.add(add_category)
                db.session.commit()
                return {"message": "Category Added"},201
            except IntegrityError:
                db.session.rollback()
                abort(409,message="Data already Exists!")
            except SQLAlchemyError:
                db.session.rollback()
                abort(400,message="something went wrong")
        abort(401,message="You are not Authorized as Admin for this route,log in from Admin account")

@blp_1.route("/Catgeory/<category>")
class category_by_categoryname(MethodView):
    @jwt_required()
    def delete(self,category):
        query_user=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        query=CategoryModel.query.filter(CategoryModel.name==(category.lower()).strip()).first()
        if query_user.role=="admin":
            if query:

                
                db.session.delete(query)
                db.session.commit()
                return {"message":"Category deleted"},200
            return {"message":"category Doesnt Exist"},400
        abort(401,message="You are not Authorized as Admin for this route,log in from Admin account")
        


