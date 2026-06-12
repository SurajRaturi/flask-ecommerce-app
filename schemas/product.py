from marshmallow import Schema,fields,validate

class adminProductschema(Schema):
    product_id=fields.Int(dump_only=True)
    name=fields.Str(required=True)
    description=fields.Str()
    price=fields.Float(validate=validate.Range(min=0,error="Price can not be negative"),required=True)
    stock=fields.Str(required=True)
    offer=fields.Float(validate=validate.Range(min=0,error="Offer cannot be this much less"))
    image_url=fields.Str()


class adminupdateproductSchema(Schema):
    product_id=fields.Int(dump_only=True)
    name=fields.Str(required=True)
    description=fields.Str()
    price=fields.Float(validate=validate.Range(min=0,error="Price can not be negative"),required=True)
    stock=fields.Str(required=True)
    offer=fields.Float(validate=validate.Range(min=0,error="Offer cannot be this much less"))
    image_url=fields.Str()


class Userproductschema(Schema):
    Category=fields.Str(dump_only=True)
    product_id=fields.Int(dump_only=True)
    name=fields.Str(dump_only=True)
    price=fields.Float(dump_only=True)
    description=fields.Str(dump_only=True)
    stock=fields.Str(dump_only=True)
    offer=fields.Float(validate=validate.Range(min=0,error="Offer cannot be this much less"))
    image_url=fields.Str()
    
    