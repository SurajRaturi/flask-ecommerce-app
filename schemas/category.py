from marshmallow import Schema,fields,validate

class Categoryschema(Schema):
    # category_id=fields.Int(dump_only=True)
    Category_name=fields.Str(validate=validate.Length(min=5,error="Please Enter a valid category"),required=True)
    