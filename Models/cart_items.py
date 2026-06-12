from Models.db import db
from sqlalchemy import Column,Integer,String,Float,DateTime,ForeignKey
from datetime import datetime

class Cart_itemModel(db.Model):
    __tablename__="Cartitems"

    cartitem_id=Column(Integer,primary_key=True)
    name=Column(String,nullable=False)
    quantity=Column(Integer,nullable=False)
    price=Column(Float,nullable=False)
    img_url=Column(String)
    
    
    user_id=Column(Integer,ForeignKey("users.user_id"),nullable=False)