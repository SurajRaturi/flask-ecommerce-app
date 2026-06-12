from marshmallow import Schema,fields,validate


class buyproductschema(Schema):
    quantity=fields.Int(validate=validate.Range(min=0,error="Quantity can not be less than 0"),required=True)

    
    