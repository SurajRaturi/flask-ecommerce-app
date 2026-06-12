from Models.db import db
from sqlalchemy import Column,Integer,String,DateTime
from datetime import datetime

class CategoryModel(db.Model):
    __tablename__="category"

    category_id=Column(Integer,primary_key=True)
    name=Column(String,unique=True,nullable=False)
    created_at=Column(DateTime,default=datetime.utcnow)
    
    products=db.relationship("ProductModel", backref="category", lazy=True,cascade="all,delete")
