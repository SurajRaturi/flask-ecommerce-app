from marshmallow import Schema,fields,validate

class Userschema(Schema):
    username=fields.Str(required=True)
    password=fields.Str(validate=validate.Length(min=10,max=120,error="Password length limit voilated"),required=True)
    email=fields.Email(required=True)
    

class Userloginschema(Schema):
    username=fields.Str(required=True)
    password=fields.Str(validate=validate.Length(min=10,max=120,error="Password length limit voilated"),required=True)


