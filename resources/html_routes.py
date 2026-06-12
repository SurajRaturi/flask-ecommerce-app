from flask import render_template,Blueprint


html_blp=Blueprint("html Page",__name__)

@html_blp.route("/")
def dashboard():
    return render_template("user_dhasboard.html")

@html_blp.route("/login")
def login():
    return render_template("login.html")

@html_blp.route('/admin')
def admin():
    return render_template('admin.html')

@html_blp.route('/addProduct')
def addproduct():
    return render_template('add_product.html')

@html_blp.route('/editproduct/<int:product_id>')
def editproduct(product_id):
    return render_template('editproduct.html')

@html_blp.route('/cart')
def cart():
    return render_template('cart.html')

@html_blp.route("/signup")
def signup():
    return render_template("signup.html")

@html_blp.route("/orders")
def orders():
    return render_template("orders.html")