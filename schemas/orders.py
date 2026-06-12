from marshmallow import Schema,fields,validate

class Orderschema(Schema):
    order_id=fields.Int(dump_only=True)
    name=fields.Str(dump_only=True)
    quantity=fields.Int(validate=validate.Range(min=0,error="Quantity can not be less than 0"),dump_only=True)
    price=fields.Float(validate=validate.Range(min=0,error="Price can not be negative"),dump_only=True)
    total_price=fields.Float(validate=validate.Range(min=0,error="Price can not be negative"),dump_only=True)
    status=fields.Str(dump_only=True)
    image=fields.Str(dump_only=True)
    