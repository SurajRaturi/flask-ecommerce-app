from flask_smorest import Blueprint,abort
from flask.views import MethodView
from schemas.cart_items  import Cart_itemschema
from schemas.orders import Orderschema
from Models.cart_items import Cart_itemModel
from Models.product import ProductModel
from Models.order_items import Order_itemsModel
from flask_jwt_extended import jwt_required,get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError,IntegrityError
from Models.db import db
from Models.user import UsersModel

blp_5=Blueprint("Order",__name__,description="Place order here")

@blp_5.route("/OrderNow")
class order_now(MethodView):
    @jwt_required()
    def post(self):
        query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if query.role=="user":
            query=Cart_itemModel.query.filter(Cart_itemModel.user_id==int(get_jwt_identity())).all()
            
            for i in query:
                orderitem=Order_itemsModel(name=i.name,quantity=i.quantity,price=i.price,total_price=i.quantity*i.price,status="Pending",img_url=i.img_url,user_id=i.user_id)
                db.session.add(orderitem)
                db.session.delete(i)
            try:
                db.session.commit()
                return {
                    "message":"Your order placed successfully"
                },201
            except IntegrityError:
                abort(400,message="Order already placed")
                db.session.rollback()
            except SQLAlchemyError:
                abort(400,message="Something went wrong")
                db.session.rollback()
        abort(401,message="You can not access this feature from Admin account , log in from User account")


@blp_5.route("/Your-Orders")
class userorders(MethodView):

    @jwt_required()
    @blp_5.response(200,Orderschema(many=True))
    def get(self):
        query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if query.role=="user":
            query=Order_itemsModel.query.filter(Order_itemsModel.user_id==int(get_jwt_identity())).all()
            return [
                {  
                    "image":i.img_url,
                    "order_id":i.order_id,
                    "name":i.name,
                    "quantity":i.quantity,
                    "price":i.price,
                    "total_price":i.total_price,
                    "status":i.status
                    

                }for i in query
            ]
        abort(401,message="You can not access this feature from Admin account , log in from User account")

@blp_5.route("/cancel-order/<int:orderid>")
class cancelorder(MethodView):
    @jwt_required()
    def delete(self,orderid):
        query=UsersModel.query.filter(UsersModel.user_id==int(get_jwt_identity())).first()
        if query.role=="user":
            order=Order_itemsModel.query.get_or_404(orderid)
            try:
                db.session.delete(order)
                db.session.commit()
                return {"message":"Order has been cancelled"},200
            except SQLAlchemyError:
                abort(400,message="Something went wrong")
        abort(401,message="You can not access this feature from Admin account , log in from User account")




@blp_5.route("/delete")
class delteorder(MethodView):
    @jwt_required()
    def delete(self):
        query=Order_itemsModel.query.filter(Order_itemsModel.user_id==int(get_jwt_identity())).all()

        for i in query:
            db.session.delete(i)
            db.session.commit()
        return {"message":"order deleted"},200