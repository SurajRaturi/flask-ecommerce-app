from Models.db import db
from sqlalchemy import Column,Integer,String,DateTime
from datetime import datetime


class UsersModel(db.Model):
    __tablename__="users"

    user_id=Column(Integer,primary_key=True)
    username=Column(String(80),unique=True,nullable=False)
    email=Column(String(100),unique=True,nullable=False)
    password=Column(String(80),nullable=False)
    role=Column(String,nullable=False)
    created_at=Column(DateTime,default=datetime.utcnow)

    cart_item= db.relationship('Cart_itemModel', backref='users', lazy=True,cascade='all,delete')
    orders_item= db.relationship('Order_itemsModel', backref='users', lazy=True,cascade='all,delete')
    

