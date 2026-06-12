from flask_smorest import Blueprint,abort
from flask.views import MethodView
from schemas.product  import adminProductschema,Userproductschema,adminupdateproductSchema
from schemas.buyproduct import buyproductschema
from Models.product import ProductModel
from Models.category import CategoryModel
from Models.user import UsersModel
from Models.cart_items import Cart_itemModel
from sqlalchemy.exc import SQLAlchemyError,IntegrityError
from flask_jwt_extended import jwt_required,get_jwt_identity
from Models.db import db
from werkzeug.utils import secure_filename
from flask import request,current_app
import os


blp_2=Blueprint("Product",__name__,description="This is Product page")

@blp_2.route("/products")
class get_all_products(MethodView):

    @blp_2.response(200,Userproductschema(many=True))
    def get(self):
        query=ProductModel.query.all()
        return [{
            "product_id":i.product_id,
            "name":i.name,
            "price":i.price,
            "description":i.description,
            "stock":i.stock,
            "offer":i.offer,
            "image_url":i.img_url
        } for i in query]


@blp_2.route("/products/<category>")
class product_by_category(MethodView):
    @blp_2.response(200,Userproductschema(many=True))
    def get(self,category):
        category_name=CategoryModel.query.filter(CategoryModel.name==category.lower()).first()
        if category_name:

            querry=ProductModel.query.filter(ProductModel.category_id==category_name.category_id).all()
            return [
                {
                    "product_id":i.product_id,
                    "name":i.name,
                    "price":i.price,
                    "description": i.description,
                    "stock":i.stock,
                    "offer":i.offer,
                    "image_url":i.img_url


                }for i in querry
            ]
        return {"message":"category Not found"},404

    @jwt_required()
    @blp_2.arguments(adminProductschema,location="form")
    def post(self,data,category):
        category_name=CategoryModel.query.filter(CategoryModel.name==category).first()
        query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        
        form=request.form
        image_url=None
        image=request.files.get("image")
        if image:
            image_name=secure_filename(image.filename)

            upload_folder=os.path.join(current_app.root_path,"static/uploads")
            path=os.path.join(upload_folder,image_name)
            
            os.makedirs(upload_folder, exist_ok=True)
            image.save(path)

            image_url=f"/static/uploads/{image_name}"

            

            if query.role=="admin":
                product=ProductModel(name=form.get("name"),description=form.get("description"),price=form.get("price"),stock=form.get("stock"),offer=form.get("offer"),img_url=image_url,category_id=category_name.category_id)
                try:
                    db.session.add(product)
                    db.session.commit()
                    return {
                        "message":"Product Added"
                        },201
                except IntegrityError:
                    abort(400,message="Product already exist!")
                    db.session.rollback()
                except SQLAlchemyError:
                    abort(400,message="Something went wrong")
                    db.session.rollback()

            abort(401,message="You are not Authorized as Admin for this route,login from admin account")


        return {"message":"Image Not uploaded Correctly"},400




        
        

@blp_2.route("/addtocart/<product_id>")
class buy_product(MethodView):
    @jwt_required()
    @blp_2.arguments(buyproductschema)
    def post(self,data,product_id):
        query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if query.role=="user":
            query=ProductModel.query.get_or_404(product_id)
            image_url=ProductModel.query.filter(ProductModel.product_id==product_id).first()
            if query:
                cart_item=Cart_itemModel(name=query.name,quantity=data["quantity"],user_id=int(get_jwt_identity()),price=query.price,img_url=image_url.img_url)
                try:
                    db.session.add(cart_item)
                    db.session.commit()
                    return {"message":"Now the product is in Your cart"},201
                except IntegrityError:
                    abort(400,message="Data already exists")
                except SQLAlchemyError:
                    abort(404,message="something went wrong")
        abort(401,message="You can not access this feature from Admin account , log in from User account")

@blp_2.route("/product/<int:productid>")
class editproduct(MethodView):
    @jwt_required()
    @blp_2.arguments(adminupdateproductSchema,location="form")
    def put(self,data,productid):
        form=request.form
        image_url=None
        image=request.files.get("image")
        if image:
            image_name=secure_filename(image.filename)

            upload_folder=os.path.join(current_app.root_path,"static/uploads")
            path=os.path.join(upload_folder,image_name)
            
            os.makedirs(upload_folder, exist_ok=True)
            image.save(path)

            image_url=f"/static/uploads/{image_name}"
        user_query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if user_query.role=="admin":
            query=ProductModel.query.filter(ProductModel.product_id==productid).first()
            try:
                query.name=form.get("name")
                query.description=form.get("description")
                query.price=form.get("price")
                query.offer=form.get("offer")
                query.stock=form.get("stock")
                query.img_url=image_url
                db.session.commit()
                return {"message":"Product Edited"},200
            except SQLAlchemyError:
                abort(400,message="Something went wrong")
        abort(401,message="You can not access this feature from Admin account , log in from User account")








    @jwt_required()
    def delete(self,productid):
        user_query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if user_query.role=="admin":
            product=ProductModel.query.filter(ProductModel.product_id==productid).first()
            if product:
                    # Delete image file
                if product.img_url:
                    image_path = os.path.join(current_app.root_path,product.img_url.lstrip('/'))

                    if os.path.exists(image_path):
                        os.remove(image_path)
                try:
                    db.session.delete(product)
                    db.session.commit()
                    return {"message":"Product Deleted"},200
                except SQLAlchemyError:
                    abort(400,message="Something went wrong")
            return {"message":"Product Doesnt Exists"},404

        abort(401,message="You can not access this feature from Admin account , log in from User account")
        

