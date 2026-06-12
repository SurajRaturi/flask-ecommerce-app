from flask_smorest import Blueprint,abort
from flask.views import MethodView
from schemas.cart_items  import Cart_itemschema
from Models.cart_items import Cart_itemModel
from flask_jwt_extended import jwt_required,get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError,IntegrityError
from Models.db import db
from Models.user import UsersModel


blp_4=Blueprint("User Cart",__name__,description="You can check your products here")

@blp_4.route("/User_Cart")
class user_cart(MethodView):
    @jwt_required()
    @blp_4.response(200,Cart_itemschema(many=True))
    def get(self):
        print("jwt id: ",get_jwt_identity())
        query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        print("query:  ",query)
        user=UsersModel.query.all()
        for i in user:
            print(f" Id : {i.user_id}\nName : {i.username}\nemail : {i.email}\npassword : {i.password}")
        if query.role=="user":
            cart=Cart_itemModel.query.filter(Cart_itemModel.user_id==int(get_jwt_identity())).all()
            return [

                {   "cart_id":i.cartitem_id,
                    "image":i.img_url,
                    "name":i.name,
                    "quantity":i.quantity,
                    "price":i.price
                }for i in cart

            ]
        abort(401,message="You can not access this feature from Admin account , log in from User account")

@blp_4.route("/Empty_Cart/<cartitemid>")
class emptycart_by_id(MethodView):
    @jwt_required()
    def delete(self,cartitemid):
        query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if query.role=="user":
            cart=Cart_itemModel.query.get_or_404(cartitemid)
            try:
                db.session.delete(cart)
                db.session.commit()
                return {
                    "message":"Item removed from Cart"
                },200
            except SQLAlchemyError:
                abort(400,message="something went wrong")
        abort(401,message="You can not access this feature from Admin account , log in from User account")


@blp_4.route("/updatecart/<int:updated_quantity>/<int:cartid>")
class updatecart(MethodView):
    @jwt_required()
    def put(self,updated_quantity,cartid):
        query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if query.role=="user":
            cart=Cart_itemModel.query.filter(Cart_itemModel.cartitem_id==cartid).first()
            try:
                cart.quantity=updated_quantity
                db.session.commit()
                return {"message":"Quantity updated"}
            except SQLAlchemyError:
                abort(400,message="something went wrong")
        abort(401,message="You can not access this feature from Admin account , log in from User account")
