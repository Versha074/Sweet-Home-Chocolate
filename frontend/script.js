// ===============================
// 1. PRODUCTS
// ===============================

console.log("JavaScript is working!");

const backendURL = "http://localhost:5000";

let products = [];


// ===============================
// LOAD PRODUCTS FROM MONGODB
// ===============================

function loadProducts() {

    fetch(backendURL + "/api/products")

        .then(function(response) {

            if (!response.ok) {

                throw new Error(
                    "Failed to load products"
                );

            }

            return response.json();

        })

        .then(function(data) {

            console.log(
                "Products from MongoDB:",
                data
            );

            products = data.products || [];

            displayProducts();

        })

        .catch(function(error) {

            console.log(
                "Products Error:",
                error
            );

            const productContainer =
                document.querySelector(
                    "#product-container"
                );

            if (productContainer) {

                productContainer.innerHTML = `

                    <p>
                        Unable to load products.
                        Please make sure the backend is running.
                    </p>

                `;

            }

        });

}


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts() {

    const productContainer =
        document.querySelector(
            "#product-container"
        );


    if (!productContainer) {

        console.log(
            "Product container not found!"
        );

        return;

    }


    productContainer.innerHTML = "";


    if (products.length === 0) {

        productContainer.innerHTML = `

            <p>
                No chocolates available right now. 🍫
            </p>

        `;

        return;

    }


    products.forEach(function(product) {

        const productCard =
            document.createElement("div");


        productCard.classList.add(
            "product-card"
        );


        productCard.innerHTML = `

            <h3>
                ${product.name}
            </h3>

            <p>
                ${product.description || ""}
            </p>

            <p>
                ₹${product.price}
            </p>

            <button
                class="add-to-cart"
                data-id="${product._id}"
            >
                Add to Cart
            </button>

        `;


        productContainer.appendChild(
            productCard
        );

    });


    setupCartButtons();

}


// ===============================
// 2. CART
// ===============================

let cart = [];


// ===============================
// 3. DISPLAY CART
// ===============================

function displayCart() {

    const cartItems =
        document.querySelector("#cart-items");

    const cartTotal =
        document.querySelector("#cart-total");

    const checkoutTotal =
        document.querySelector("#checkout-total");


    // Clear previous cart display

    cartItems.innerHTML = "";

    let total = 0;


    // Go through every product in cart

    cart.forEach(function(product) {


        // ===============================
        // CREATE CART ITEM
        // ===============================

        const item =
            document.createElement("div");

        item.classList.add("cart-item");


        // ===============================
        // PRODUCT NAME AND PRICE
        // ===============================

        const productInfo =
            document.createElement("span");

        productInfo.innerText =
            product.name +
            " | ₹" +
            (product.price * product.quantity);

        item.appendChild(productInfo);


        // ===============================
        // MINUS BUTTON
        // ===============================

        const minusButton =
            document.createElement("button");

        minusButton.innerText = "-";

        item.appendChild(minusButton);


        // ===============================
        // QUANTITY
        // ===============================

        const quantityText =
            document.createElement("span");

        quantityText.innerText =
            product.quantity;

        item.appendChild(quantityText);


        // ===============================
        // PLUS BUTTON
        // ===============================

        const plusButton =
            document.createElement("button");

        plusButton.innerText = "+";

        item.appendChild(plusButton);


        // ===============================
        // REMOVE BUTTON
        // ===============================

        const removeButton =
            document.createElement("button");

        removeButton.innerText = "Remove";

        item.appendChild(removeButton);


        // Add item to cart section

        cartItems.appendChild(item);


        // ===============================
        // PLUS BUTTON EVENT
        // ===============================

        plusButton.addEventListener(
            "click",
            function() {

                product.quantity++;

                displayCart();

            }
        );


        // ===============================
        // MINUS BUTTON EVENT
        // ===============================

        minusButton.addEventListener(
            "click",
            function() {

                if (product.quantity > 1) {

                    product.quantity--;

                } else {

                    cart = cart.filter(
                        function(item) {

                            return item.id != product.id;

                        }
                    );

                }

                displayCart();

            }
        );


        // ===============================
        // REMOVE BUTTON EVENT
        // ===============================

        removeButton.addEventListener(
            "click",
            function() {

                cart = cart.filter(
                    function(item) {

                        return item.id != product.id;

                    }
                );

                displayCart();

            }
        );


        // ===============================
        // CALCULATE TOTAL
        // ===============================

        total =
            total +
            (product.price * product.quantity);

    });


    // ===============================
    // SHOW CART TOTAL
    // ===============================

    cartTotal.innerText = total;


    // ===============================
    // SHOW CHECKOUT TOTAL
    // ===============================

    checkoutTotal.innerText = total;

}


// ===============================
// 4. ADD TO CART BUTTONS
// ===============================

let cartButtons = [];


// ===============================
// 5. SETUP ADD TO CART
// ===============================

function setupCartButtons() {

    cartButtons =
        document.querySelectorAll(
            ".add-to-cart"
        );


    cartButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {


                    // Get product ID

                    const productId =
                        button.dataset.id;


                    console.log(
                        "Clicked Product ID:",
                        productId
                    );


                    // Find product

                    const product =
                        products.find(
                            function(item) {

                                return String(
                                    item._id
                                ) === String(
                                    productId
                                );

                            }
                        );


                    console.log(
                        "Selected Product:",
                        product
                    );


                    if (!product) {

                        console.log(
                            "Product not found!"
                        );

                        return;

                    }


                    // Check if product already exists

                    const existingProduct =
                        cart.find(
                            function(item) {

                                return String(
                                    item.id
                                ) === String(
                                    product._id
                                );

                            }
                        );


                    // If product already exists

                    if (existingProduct) {

                        existingProduct.quantity++;

                    }


                    // If product is new

                    else {

                        cart.push({

                            id: product._id,

                            name: product.name,

                            price: Number(
                                product.price
                            ),

                            quantity: 1

                        });

                    }


                    console.log(
                        "Cart:",
                        cart
                    );


                    // Update cart

                    displayCart();


                    // Change button text

                    button.innerText =
                        "Added ✓";

                }
            );

        }
    );

}


// ===============================
// 6. CHECKOUT FORM
// ===============================

const checkoutForm =
    document.querySelector("#checkout-form");


checkoutForm.addEventListener(
    "submit",
    function(event) {


        // Stop page from refreshing

        event.preventDefault();


        console.log(
            "Checkout form submitted!"
        );


        // ===============================
        // GET CUSTOMER DETAILS
        // ===============================

        const customerName =
            document
                .querySelector("#customer-name")
                .value
                .trim();

        const customerPhone =
            document
                .querySelector("#customer-phone")
                .value
                .trim();

        const customerAddress =
            document
                .querySelector("#customer-address")
                .value
                .trim();

        const customerCity =
            document
                .querySelector("#customer-city")
                .value
                .trim();

        const customerPincode =
            document
                .querySelector("#customer-pincode")
                .value
                .trim();


        // ===============================
        // VALIDATION
        // ===============================

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;

        }


        if (customerName === "") {

            alert("Please enter your name.");

            return;

        }


        if (customerPhone === "") {

            alert("Please enter your phone number.");

            return;

        }


        if (!/^\d{10}$/.test(customerPhone)) {

            alert(
                "Phone number must contain exactly 10 digits."
            );

            return;

        }


        if (customerAddress === "") {

            alert(
                "Please enter your delivery address."
            );

            return;

        }


        if (customerCity === "") {

            alert("Please enter your city.");

            return;

        }


        if (!/^\d{6}$/.test(customerPincode)) {

            alert(
                "Pincode must contain exactly 6 digits."
            );

            return;

        }


        // ===============================
        // CREATE ORDER
        // ===============================

        const order = {

            customerName: customerName,

            customerPhone: customerPhone,

            customerAddress: customerAddress,

            customerCity: customerCity,

            customerPincode: customerPincode,

            items: cart.map(function(item) {

                return {

                    id: item.id,

                    name: item.name,

                    price: item.price,

                    quantity: item.quantity

                };

            }),

            total: Number(
                document
                    .querySelector("#checkout-total")
                    .innerText
            )

        };


        // ===============================
        // SHOW ORDER IN CONSOLE
        // ===============================

        console.log(
            "ORDER CREATED:",
            order
        );


        // ===============================
        // SEND ORDER TO BACKEND
        // ===============================

        fetch(
            backendURL + "/api/orders",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(order)

            }
        )

        .then(function(response) {

            if (!response.ok) {

                throw new Error(
                    "Failed to create order"
                );

            }

            return response.json();

        })

        .then(function(data) {

            console.log(
                "Backend Response:",
                data
            );

        })

        .catch(function(error) {

            console.log(
                "Backend Error:",
                error
            );

        });


        // ===============================
        // SHOW ORDER CONFIRMATION
        // ===============================

        const confirmationSection =
            document.querySelector(
                "#order-confirmation"
            );


        const confirmedName =
            document.querySelector(
                "#confirmed-name"
            );


        const confirmedTotal =
            document.querySelector(
                "#confirmed-total"
            );


        // Put customer name

        confirmedName.innerText =
            order.customerName;


        // Put order total

        confirmedTotal.innerText =
            order.total;


        // Show confirmation

        confirmationSection.style.display =
            "flex";


        // Hide checkout

        document.querySelector(
            ".checkout"
        ).style.display = "none";


        // ===============================
        // CLEAR CART
        // ===============================

        cart = [];

        displayCart();


        // ===============================
        // RESET FORM
        // ===============================

        checkoutForm.reset();


        // ===============================
        // RESET ADD TO CART BUTTONS
        // ===============================

        cartButtons.forEach(
            function(button) {

                button.innerText =
                    "Add to Cart";

            }
        );


        // ===============================
        // SCROLL TO CONFIRMATION
        // ===============================

        confirmationSection.scrollIntoView({

            behavior: "smooth"

        });

    }
);


// ===============================
// 7. CONTINUE SHOPPING
// ===============================

const continueShopping =
    document.querySelector(
        "#continue-shopping"
    );


continueShopping.addEventListener(
    "click",
    function() {


        // Hide confirmation

        document.querySelector(
            "#order-confirmation"
        ).style.display = "none";


        // Show checkout again

        document.querySelector(
            ".checkout"
        ).style.display = "flex";


        // Go to products

        document.querySelector(
            "#products"
        ).scrollIntoView({

            behavior: "smooth"

        });

    }
);


// ===============================
// 8. LOAD PRODUCTS
// ===============================

loadProducts();