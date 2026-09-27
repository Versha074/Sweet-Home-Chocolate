// ==========================================
// IMPORTS
// ==========================================

const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const Order = require("./models/Order");

const Product = require("./models/products");

const Admin = require("./models/Admin");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();


// ==========================================
// APP
// ==========================================

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());
function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }
}


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", function (req, res) {

    res.send("Sweet Home Backend is Working! 🍫");

});


// ==========================================
// TEST API
// ==========================================

app.get("/api/test", function (req, res) {

    res.json({

        message: "Sweet Home API is working! 🍫"

    });

});


// ==========================================
// ADMIN LOGIN
// ==========================================

app.post("/api/admin/login", async function (req, res) {

    try {

        const email =
            req.body.email;

        const password =
            req.body.password;


        // Check if email and password were provided

        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required"

            });

        }


        // Find admin by email

        const admin =
            await Admin.findOne({

                email: email

            });


        // Admin not found

        if (!admin) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }
        

        // Compare entered password
        // with hashed password

        const passwordMatch =
            await bcrypt.compare(

                password,

                admin.password

            );


        // Password incorrect

        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        // Login successful
        const token = jwt.sign(
        {
        id: admin._id,
        email: admin.email
        },
        process.env.JWT_SECRET,
        {
        expiresIn: "1h"
        }
        );

        res.status(200).json({

            message:
                "Admin login successful! 🍫",
            token: token,

            admin: {

                id: admin._id,

                name: admin.name,

                email: admin.email

            }

        });

    }

    catch (error) {

        console.log(
            "Admin Login Error:",
            error
        );


        res.status(500).json({

            message:
                "Server error during admin login"

        });

    }

});


// ==========================================
// GET ALL ORDERS
// ==========================================

app.get("/api/orders",verifyToken, async function (req, res) {

    try {

        const orders =
            await Order.find()
                .sort({
                    orderDate: -1
                });


        res.status(200).json({

            message:
                "Orders fetched successfully! 🍫",

            orders:
                orders

        });

    }

    catch (error) {

        console.log(

            "Error fetching orders:",

            error

        );


        res.status(500).json({

            message:
                "Failed to fetch orders",

            error:
                error.message

        });

    }

});


// ==========================================
// CREATE ORDER
// ==========================================

app.post("/api/orders", async function (req, res) {

    try {

        console.log(
            "================================"
        );

        console.log(
            "New Order Received:"
        );

        console.log(
            req.body
        );

        console.log(
            "================================"
        );


        const newOrder =
            new Order(req.body);


        const savedOrder =
            await newOrder.save();


        console.log(
            "Order Saved to MongoDB! 🍫"
        );


        res.status(201).json({

            message:
                "Order saved successfully! 🍫",

            order:
                savedOrder

        });

    }

    catch (error) {

        console.log(

            "Error saving order:",

            error

        );


        res.status(500).json({

            message:
                "Failed to save order",

            error:
                error.message

        });

    }

});


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

app.put(
    "/api/orders/:id/status",
    verifyToken,
    async function (req, res) {

        try {

            const orderId =
                req.params.id;


            const newStatus =
                req.body.status;


            const updatedOrder =
                await Order.findByIdAndUpdate(

                    orderId,

                    {

                        status:
                            newStatus

                    },

                    {

                        new: true

                    }

                );


            if (!updatedOrder) {

                return res.status(404).json({

                    message:
                        "Order not found"

                });

            }


            res.status(200).json({

                message:
                    "Order status updated successfully! 🍫",

                order:
                    updatedOrder

            });

        }

        catch (error) {

            console.log(

                "Error updating order status:",

                error

            );


            res.status(500).json({

                message:
                    "Failed to update order status",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// GET ALL PRODUCTS
// ==========================================

app.get(
    "/api/products",
    async function (req, res) {

        try {

            const products =
                await Product.find()
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json({

                message:
                    "Products fetched successfully! 🍫",

                products:
                    products

            });

        }

        catch (error) {

            console.log(

                "Error fetching products:",

                error

            );


            res.status(500).json({

                message:
                    "Failed to fetch products",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// CREATE PRODUCT
// ==========================================

app.post(
    "/api/products",
    verifyToken,
    async function (req, res) {

        try {

            console.log(
                "================================"
            );

            console.log(
                "New Product Received:"
            );

            console.log(
                req.body
            );

            console.log(
                "================================"
            );


            const newProduct =
                new Product(req.body);


            const savedProduct =
                await newProduct.save();


            console.log(
                "Product Saved to MongoDB! 🍫"
            );


            res.status(201).json({

                message:
                    "Product added successfully! 🍫",

                product:
                    savedProduct

            });

        }

        catch (error) {

            console.log(

                "Error saving product:",

                error

            );


            res.status(500).json({

                message:
                    "Failed to add product",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// UPDATE PRODUCT
// ==========================================

app.put(
    "/api/products/:id",
    verifyToken,
    async function (req, res) {

        try {

            const productId =
                req.params.id;


            const updatedProduct =
                await Product.findByIdAndUpdate(

                    productId,

                    req.body,

                    {

                        new: true

                    }

                );


            if (!updatedProduct) {

                return res.status(404).json({

                    message:
                        "Product not found"

                });

            }


            res.status(200).json({

                message:
                    "Product updated successfully! 🍫",

                product:
                    updatedProduct

            });

        }

        catch (error) {

            console.log(

                "Error updating product:",

                error

            );


            res.status(500).json({

                message:
                    "Failed to update product",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// DELETE PRODUCT
// ==========================================

app.delete(
    "/api/products/:id",
    verifyToken,
    async function (req, res) {

        try {

            const productId =
                req.params.id;


            const deletedProduct =
                await Product.findByIdAndDelete(

                    productId

                );


            if (!deletedProduct) {

                return res.status(404).json({

                    message:
                        "Product not found"

                });

            }


            res.status(200).json({

                message:
                    "Product deleted successfully! 🍫",

                product:
                    deletedProduct

            });

        }

        catch (error) {

            console.log(

                "Error deleting product:",

                error

            );


            res.status(500).json({

                message:
                    "Failed to delete product",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// CONNECT DATABASE AND START SERVER
// ==========================================

mongoose.connect(
    process.env.MONGO_URI
)

.then(function () {

    console.log(
        "MongoDB Connected Successfully! 🍫"
    );


    app.listen(

        PORT,

        function () {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        }

    );

})

.catch(function (error) {

    console.log(

        "MongoDB Connection Error:",

        error

    );

});