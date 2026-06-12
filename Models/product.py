from Models.db import db
from sqlalchemy import Column,Integer,String,Float,DateTime,ForeignKey
from datetime import datetime

class ProductModel(db.Model):
    __tablename__="products"

    product_id=Column(Integer,primary_key=True)
    name=Column(String,unique=True,nullable=False)
    description=Column(String,nullable=False)
    price=Column(Float,nullable=False)
    offer=Column(Integer,nullable=True)
    stock=Column(String(20),nullable=False)
    img_url=Column(String,nullable=False)
    created_at=Column(DateTime,default=datetime.utcnow)
    
    category_id=Column(Integer,ForeignKey('category.category_id'),nullable=False)


