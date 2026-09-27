const mongoose = require("mongoose"); 
 
const orderSchema = new mongoose.Schema({ 
 
    customerName: { 
        type: String, 
        required: true 
    }, 
 
    customerPhone: { 
        type: String, 
        required: true 
    }, 
 
    customerAddress: { 
        type: String, 
        required: true 
    }, 
 
    customerCity: { 
        type: String, 
        required: true 
    }, 
 
    customerPincode: { 
        type: String, 
        required: true 
    }, 
 
    items: { 
        type: Array, 
        required: true 
    }, 
 
    total: { 
        type: Number, 
        required: true 
    },

    status: {
        type: String,
        default: "Pending"
    },
 
    orderDate: { 
        type: Date, 
        default: Date.now 
    } 
 
}); 
 
const Order = mongoose.model("Order", orderSchema); 
 
module.exports = Order;