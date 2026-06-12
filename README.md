# Full-Stack E-Commerce Web Application

A complete, feature-rich E-Commerce application built using a modular **Flask REST API** backend and a responsive, dynamic **HTML5/CSS3/JavaScript (Vanilla JS)** frontend. The application includes robust token-based authentication, user shopping carts, order placements, and a full administrative dashboard for product inventory management.

## 🚀 Features

### Backend (REST API)
- **Robust Authentication:** Secure registration and login utilizing `Flask-JWT-Extended` with hashed passwords via `passlib`.
- **Token Blocklisting:** Active token validation and logout management using an in-memory blocklist mechanism.
- **Role-Based Access Control:** Strict route protections ensuring only authorized administrative users can manage product configurations and inventory.
- **Automated Documentation:** Complete API documentation generated dynamically with Swagger UI via `flask-smorest` and OpenAPI.
- **Relational Database Management:** Modular models constructed with `Flask-SQLAlchemy` mapping categories, products, user data, shopping carts, and past orders.

### Frontend (UI)
- **Dynamic Data Rendering:** Asynchronous operations utilizing the JavaScript `Fetch API` to interact smoothly with the backend without reloading the page.
- **Responsive Layouts:** Clean layouts optimized for both desktop and mobile devices using modern CSS Flexbox and Media Queries.
- **Interactive Cart System:** Client-side tracking of shopping cart additions, state management, updates, and live calculations.
- **Product Filtering:** Category-based querying and real-time frontend product rendering.

---

## 📂 Project Structure

The project strictly follows a highly organized, professional Flask architectural pattern:

```text
flask-ecommerce-api/
│
├── Models/                 # Database tables & SQLAlchemy Schemas
│   ├── db.py               # Database initialization
│   ├── category.py         # Category database model
│   ├── product.py          # Product database model
│   ├── user.py             # User accounts model
│   ├── cart_items.py       # Shopping cart structure
│   └── order_items.py      # Checkout tracking structure
│
├── resources/              # API Blueprints / Route Logic
│   ├── category.py         # Category business endpoints
│   ├── product.py          # Product CRUD endpoints
│   ├── user.py             # Authentication & user endpoints
│   ├── cart.py             # Cart add/delete logic
│   ├── order.py            # Checkout and history logic
│   └── html_routes.py      # Server-rendered layout paths
│
├── static/                 # Static Assets
│   ├── css/                # Custom styling stylesheets
│   └── js/                 # Vanilla JS modules (API integrations)
│
├── templates/              # Semantic HTML files
│
├── screenshots/            #Include sample images
|
├── .env                    # System Environment Variables (Hidden)
├── .gitignore              # Files excluded from GitHub
├── App.py                  # Project gateway and initialization file
└── requirements.txt        # Third-party package dependencies


```
<br>

---
# 🛠️ Tech Stacks 
- **Backend :** Python, Flask, Flask-Smorest, Flask-SQLAlchemy, Flask-JWT-Extended, Marshmallow (Validation), Passlib.
- **Frontend :** HTML5, CSS3, JavaScript (ES6+ Vanilla), FontAwesome Icons.
- **Database :** SQLite (via SQLAlchemy)



<br><br>


---
# 🔧 Installation & Local Setup

Follow these instructions to clone the project and run it on your local environment.

## Prerequisite
Make sure you have Python 3.x installed on your system.

### Steps to Run
**1. Clone the repository:**

<pre>
git clone [https://github.com/SurajRaturi/flask-ecommerce-app.git](https://github.com/SurajRaturi/flask-ecommerce-app.git)
cd flask-ecommerce-api
</pre>

**2. Create and Activate a Virtual Environment:**

### Windows
<pre>
python -m venv venv
.\venv\Scripts\activate
</pre>
### macOS/Linux
<pre>
python3 -m venv venv
source venv/bin/activate
</pre>

**3. Install Dependencies:**
<pre>
pip install -r requirements.txt
</pre>

**4. Configure Environment Variables:**

Create a  `.env`  file in the root directory and define your secret keys securely:
<pre>
JWT_SECRET_KEY=your_custom_secure_random_string_here
</pre>

Add **Admin** info also in `.env` file : 
<pre>
ADMIN_USERNAME=your_name
ADMIN_EMAIL=_your_email_address
ADMIN_PASSWORD=your_password
</pre>

**5. Initialize the Server:**
<pre>flask run
</pre>

Open your browser and navigate to `http://127.0.0.1:5000/` to explore the store.

**6. View API Documentation:**

With the server running, visit `http://127.0.0.1:5000/docs` to interact with the API endpoints via Swagger UI.


---
# Sample Snippet 
## Login Page
<br>

![loginpage](/screenshots/login.png)


## Dashboard Page
<br>

![dashboardpage](/screenshots/dashboard.png)


## Cart-item page
<br>

![cartitems](/screenshots/shopping-cart.png)

## Orders page
<br>

![orderpage](/screenshots/orders.png)