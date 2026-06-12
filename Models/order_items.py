from Models.db import db
from sqlalchemy import Column,Integer,String,DateTime,Float,ForeignKey
from datetime import datetime

class Order_itemsModel(db.Model):
    __tablename__="Orderitems"

    order_id=Column(Integer,primary_key=True)
    name=Column(String,unique=True,nullable=False)
    quantity=Column(Integer,nullable=False)
    price=Column(Float,nullable=False)
    total_price=Column(Float,nullable=False)
    status=Column(String,nullable=False)
    img_url=Column(String)
    
    user_id=Column(Integer,ForeignKey('users.user_id'),nullable=False)