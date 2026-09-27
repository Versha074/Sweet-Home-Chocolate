# 🍫 Sweet Home Chocolate

Sweet Home Chocolate is a homemade chocolate ordering website where customers can browse chocolates, add products to their cart, enter their delivery details, and place orders.

The project also includes an admin dashboard for managing products and customer orders.

## ✨ Features

### 👤 Customer Side

- Browse available chocolates
- Products are loaded dynamically from MongoDB
- Add chocolates to cart
- Increase/decrease product quantity
- Remove products from cart
- Automatically calculate cart total
- Checkout form
- Customer name, phone, address, city and pincode
- Place an order
- Order confirmation message

### 🔐 Admin Side

- Admin login
- JWT-based authentication
- Protected admin routes
- Admin dashboard
- View customer orders
- Update order status
- Add new products
- Edit products
- Delete products
- Product information stored in MongoDB
- Admin logout

## 🛠️ Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## 📁 Project Structure

```text
Sweet-Home-Chocolate/
│
├── admin.html
│
├── backend/
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Order.js
│   │   └── products.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── assets/
│   ├── admin-login.html
│   ├── admin-login.js
│   ├── admin.css
│   ├── admin.js
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── .gitignore
