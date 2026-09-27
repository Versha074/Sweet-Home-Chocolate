// ==========================================
// SWEET HOME ADMIN DASHBOARD
// ==========================================

const admin = localStorage.getItem("admin");
const token = localStorage.getItem("token");

if (!admin || !token) {
    window.location.href = "frontend/admin-login.html";
}

const backendURL = "http://localhost:5000";
function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

function handleUnauthorized(response) {
    if (response.status === 401) {
        localStorage.removeItem("admin");
        localStorage.removeItem("token");

        window.location.href = "frontend/admin-login.html";

        return true;
    }

    return false;
}


// ==========================================
// LOAD DASHBOARD
// ==========================================

function loadDashboard() {

    fetch(backendURL + "/api/orders", {
        headers: getAuthHeaders()
    })

        .then(function(response) {

        if (handleUnauthorized(response)) {
            return;
        }

         return response.json();
        })

        .then(function(data) {

            console.log("Dashboard Data:", data);

            const orders = data.orders || [];

            updateStatistics(orders);

            displayOrders(orders);

        })

        .catch(function(error) {

            console.log(
                "Dashboard Error:",
                error
            );

        });

}

// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(orders) {

    const totalOrders = orders.length;

    let totalRevenue = 0;

    orders.forEach(function(order) {

        totalRevenue += Number(order.total);

    });


    const customers = new Set();

    orders.forEach(function(order) {

        customers.add(order.customerPhone);

    });


    const totalCustomers =
        customers.size;


    document.querySelector("#total-orders").innerText =
        totalOrders;


    document.querySelector("#total-revenue").innerText =
        totalRevenue;


    document.querySelector("#total-customers").innerText =
        totalCustomers;

}


// ==========================================
// DISPLAY ORDERS
// ==========================================

function displayOrders(orders) {

    const ordersContainer =
        document.querySelector("#orders-container");


    if (!orders || orders.length === 0) {

        ordersContainer.innerHTML = `

            <div class="glass-card empty-order">

                <div class="empty-icon">
                    🍫
                </div>

                <h3>
                    No Orders Yet
                </h3>

                <p>
                    Your customer orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    ordersContainer.innerHTML = "";


    orders.forEach(function(order) {

        const orderCard =
            document.createElement("div");


        orderCard.className =
            "order-card";


        let itemsHTML = "";


        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        items.forEach(function(item) {

            itemsHTML += `

                <p>

                    🍫 ${item.name}
                    × ${item.quantity}

                </p>

            `;

        });


        const status =
            order.status || "Pending";


        orderCard.innerHTML = `

            <h3>
                ${order.customerName}
            </h3>


            <p>
                📞 ${order.customerPhone}
            </p>


            <p>
                📍 ${order.customerCity}
            </p>


            <p>
                🏠 ${order.customerAddress}
            </p>


            <p>
                📮 ${order.customerPincode}
            </p>


            <div class="order-items">

                ${itemsHTML}

            </div>


            <p class="order-total">

                Total:
                ₹${order.total}

            </p>


            <div class="order-status">

                <label>
                    Status:
                </label>


                <select
                    class="status-select"
                    data-id="${order._id}"
                >

                    <option
                        value="Pending"
                        ${status === "Pending"
                            ? "selected"
                            : ""}
                    >

                        🟡 Pending

                    </option>


                    <option
                        value="Confirmed"
                        ${status === "Confirmed"
                            ? "selected"
                            : ""}
                    >

                        🟢 Confirmed

                    </option>


                    <option
                        value="Delivered"
                        ${status === "Delivered"
                            ? "selected"
                            : ""}
                    >

                        🔵 Delivered

                    </option>

                </select>

            </div>

        `;


        ordersContainer.appendChild(
            orderCard
        );

    });

}


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.classList.contains(
                "status-select"
            )
        ) {

            const orderId =
                event.target.dataset.id;


            const newStatus =
                event.target.value;


            console.log(
                "Updating status:",
                orderId,
                newStatus
            );


            fetch(
                backendURL +
                "/api/orders/" +
                orderId +
                "/status",
            {

                method: "PUT",

                headers: getAuthHeaders(),

                body: JSON.stringify({

                status: newStatus

            })

            }
            )

            .then(function(response) {

            if (handleUnauthorized(response)) {
                return;
            }

            return response.json();

            })

            .then(function(data) {

                console.log(
                    "Status Update Response:",
                    data
                );


                if (data.order) {

                    alert(
                        "Order status updated successfully! 🍫"
                    );

                }

            })

            .catch(function(error) {

                console.log(
                    "Status Update Error:",
                    error
                );

            });

        }

    }
);


// ==========================================
// LOAD PRODUCTS
// ==========================================

function loadProducts() {

    fetch(
        backendURL + "/api/products"
    )

        .then(function(response) {

            return response.json();

        })

        .then(function(data) {

            console.log(
                "Products Data:",
                data
            );


            const products =
                data.products || [];


            displayProducts(products);

        })

        .catch(function(error) {

            console.log(
                "Products Error:",
                error
            );

        });

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(products) {

    const productsGrid =
        document.querySelector(
            "#products-grid"
        );


    if (!productsGrid) {

        console.log(
            "Products grid not found!"
        );

        return;

    }


    productsGrid.innerHTML = "";


    if (
        !products ||
        products.length === 0
    ) {

        productsGrid.innerHTML = `

            <div class="glass-card">

                <div class="empty-icon">
                    🍫
                </div>

                <h3>
                    No Products Yet
                </h3>

                <p>
                    Add your first chocolate product.
                </p>

            </div>

        `;

        return;

    }


    products.forEach(function(product) {

        const productCard =
            document.createElement("article");


        productCard.className =
            "product-card";


        productCard.innerHTML = `

            <div class="product-visual dark">

                <div class="product-glow"></div>

                <div class="product-3d">

                    🍫

                </div>

            </div>


            <div class="product-info">

                <span>

                    ${product.category || "Chocolate"}

                </span>


                <h3>

                    ${product.name}

                </h3>


                <p>

                    ${product.description}

                </p>


                <div class="product-footer">

                    <strong>

                        ₹${product.price}

                    </strong>


                    <button
                        class="edit-product-btn"
                        data-id="${product._id}"
                        type="button"
                    >

                        Edit

                    </button>


                    <button
                        class="delete-product-btn"
                        data-id="${product._id}"
                        type="button"
                    >

                        Delete

                    </button>

                </div>

            </div>

        `;


        productsGrid.appendChild(
            productCard
        );


        // Style Delete button

        const deleteButton =
            productCard.querySelector(
                ".delete-product-btn"
            );


        if (deleteButton) {

            deleteButton.style.cursor =
                "pointer";

            deleteButton.style.marginLeft =
                "8px";

            deleteButton.style.background =
                "#7f1d1d";

            deleteButton.style.color =
                "#ffffff";

            deleteButton.style.border =
                "none";

            deleteButton.style.padding =
                "8px 14px";

            deleteButton.style.borderRadius =
                "8px";

        }

    });

}


// ==========================================
// DELETE PRODUCT
// ==========================================

document.addEventListener(
    "click",
    function(event) {

        const deleteButton =
            event.target.closest(
                ".delete-product-btn"
            );


        if (!deleteButton) {

            return;

        }


        const productId =
            deleteButton.dataset.id;


        console.log(
            "Delete Product ID:",
            productId
        );


        const confirmDelete =
            confirm(
                "Are you sure you want to delete this product? 🍫"
            );


        if (!confirmDelete) {

            return;

        }


        fetch(
            backendURL +
            "/api/products/" +
            productId,
            {

                method: "DELETE",
                headers: getAuthHeaders()

            }

        )
            .then(function(response) {

            if (handleUnauthorized(response)) {
                return;
            }

            if (!response.ok) {
             throw new Error(
              "Failed to delete product"
            );
            }

            return response.json();

            })

            .then(function(data) {

                console.log(
                    "Delete Product Response:",
                    data
                );


                if (data.product) {

                    alert(
                        "Product deleted successfully! 🍫"
                    );


                    loadProducts();

                }

                else {

                    alert(
                        data.message ||
                        "Failed to delete product."
                    );

                }

            })

            .catch(function(error) {

                console.log(
                    "Delete Product Error:",
                    error
                );


                alert(
                    "Something went wrong while deleting the product."
                );

            });

    }
);


// ==========================================
// EDIT PRODUCT
// ==========================================

document.addEventListener(
    "click",
    function(event) {

        const editButton =
            event.target.closest(
                ".edit-product-btn"
            );


        if (!editButton) {

            return;

        }


        const productId =
            editButton.dataset.id;


        console.log(
            "Edit Product ID:",
            productId
        );


        fetch(
            backendURL + "/api/products"
        )

            .then(function(response) {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load products"
                    );

                }

                return response.json();

            })

            .then(function(data) {

                const products =
                    data.products || [];


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


                if (!product) {

                    alert(
                        "Product not found."
                    );

                    return;

                }


                openEditProductForm(product);

            })

            .catch(function(error) {

                console.log(
                    "Edit Product Error:",
                    error
                );

                alert(
                    "Unable to load product."
                );

            });

    }
);


// ==========================================
// OPEN EDIT PRODUCT FORM
// ==========================================

function openEditProductForm(product) {

    const productForm =
        document.createElement("div");


    productForm.className =
        "product-form-container";


    productForm.style.position =
        "fixed";

    productForm.style.top =
        "0";

    productForm.style.left =
        "0";

    productForm.style.width =
        "100%";

    productForm.style.height =
        "100%";

    productForm.style.background =
        "rgba(0, 0, 0, 0.75)";

    productForm.style.backdropFilter =
        "blur(8px)";

    productForm.style.display =
        "flex";

    productForm.style.alignItems =
        "center";

    productForm.style.justifyContent =
        "center";

    productForm.style.zIndex =
        "99999";

    productForm.style.padding =
        "20px";

    productForm.style.boxSizing =
        "border-box";


    productForm.innerHTML = `

        <div class="product-form">

            <h2>
                ✏️ Edit Chocolate
            </h2>


            <input
                type="text"
                id="edit-product-name"
                placeholder="Product Name"
                value="${escapeHTML(product.name)}"
            >


            <input
                type="number"
                id="edit-product-price"
                placeholder="Price"
                value="${product.price}"
            >


            <textarea
                id="edit-product-description"
                placeholder="Product Description"
            >${escapeHTML(product.description)}</textarea>


            <input
                type="text"
                id="edit-product-image"
                placeholder="Image URL"
                value="${escapeHTML(product.image)}"
            >


            <input
                type="text"
                id="edit-product-category"
                placeholder="Category"
                value="${escapeHTML(
                    product.category || "Chocolate"
                )}"
            >


            <div class="product-form-buttons">

                <button
                    id="update-product-btn"
                    type="button"
                >
                    Save Changes
                </button>


                <button
                    id="cancel-edit-product-btn"
                    type="button"
                >
                    Cancel
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        productForm
    );


    const formBox =
        productForm.querySelector(
            ".product-form"
        );


    formBox.style.width =
        "450px";

    formBox.style.maxWidth =
        "100%";

    formBox.style.padding =
        "35px";

    formBox.style.background =
        "#2b1008";

    formBox.style.border =
        "1px solid #9a641e";

    formBox.style.borderRadius =
        "20px";

    formBox.style.boxShadow =
        "0 25px 80px rgba(0, 0, 0, 0.7)";

    formBox.style.color =
        "#f8e4c0";

    formBox.style.boxSizing =
        "border-box";


    const formHeading =
        formBox.querySelector("h2");


    if (formHeading) {

        formHeading.style.marginBottom =
            "25px";

    }


    const formInputs =
        formBox.querySelectorAll(
            "input, textarea"
        );


    formInputs.forEach(
        function(input) {

            input.style.width =
                "100%";

            input.style.padding =
                "14px";

            input.style.marginBottom =
                "15px";

            input.style.boxSizing =
                "border-box";

            input.style.background =
                "#1a0804";

            input.style.border =
                "1px solid #70451b";

            input.style.borderRadius =
                "10px";

            input.style.color =
                "#ffffff";

            input.style.fontSize =
                "15px";

        }
    );


    const formButtons =
        formBox.querySelector(
            ".product-form-buttons"
        );


    if (formButtons) {

        formButtons.style.display =
            "flex";

        formButtons.style.gap =
            "12px";

        formButtons.style.marginTop =
            "10px";

    }


    const buttons =
        formBox.querySelectorAll(
            "button"
        );


    buttons.forEach(
        function(button) {

            button.style.flex =
                "1";

            button.style.padding =
                "13px";

            button.style.border =
                "none";

            button.style.borderRadius =
                "10px";

            button.style.cursor =
                "pointer";

            button.style.fontSize =
                "15px";

        }
    );


    const updateButton =
        formBox.querySelector(
            "#update-product-btn"
        );


    updateButton.style.background =
        "#d99a27";

    updateButton.style.color =
        "#1a0804";


    const cancelButton =
        formBox.querySelector(
            "#cancel-edit-product-btn"
        );


    cancelButton.style.background =
        "#542015";

    cancelButton.style.color =
        "#f8e4c0";


    cancelButton.addEventListener(
        "click",
        function() {

            productForm.remove();

        }
    );


    updateButton.addEventListener(
        "click",
        function() {

            const name =
                document.querySelector(
                    "#edit-product-name"
                ).value.trim();


            const price =
                document.querySelector(
                    "#edit-product-price"
                ).value;


            const description =
                document.querySelector(
                    "#edit-product-description"
                ).value.trim();


            const image =
                document.querySelector(
                    "#edit-product-image"
                ).value.trim();


            const category =
                document.querySelector(
                    "#edit-product-category"
                ).value.trim();


            if (
                name === "" ||
                price === "" ||
                description === "" ||
                image === ""
            ) {

                alert(
                    "Please fill all product details."
                );

                return;

            }


            if (
                Number(price) <= 0
            ) {

                alert(
                    "Price must be greater than 0."
                );

                return;

            }


            const updatedProduct = {

                name: name,

                price: Number(price),

                description:
                    description,

                image: image,

                category:
                    category ||
                    "Chocolate",

                available:
                    product.available !== undefined
                        ? product.available
                        : true

            };


            console.log(
                "Updated Product:",
                updatedProduct
            );


            fetch(
                backendURL +
                "/api/products/" +
                product._id,
                {

                    method: "PUT",

                    headers: getAuthHeaders(),
                    body:
                        JSON.stringify(
                            updatedProduct
                        )

                }

            )

            .then(function(response) {

            if (handleUnauthorized(response)) {
                return;
            }

                if (!response.ok) {
                throw new Error(
                "Failed to update product"
            );
            }

            return response.json();

            })

                .then(function(data) {

                    console.log(
                        "Update Product Response:",
                        data
                    );


                    if (data.product) {

                        alert(
                            "Product updated successfully! 🍫"
                        );


                        productForm.remove();

                        loadProducts();

                    }

                    else {

                        alert(
                            data.message ||
                            "Failed to update product."
                        );

                    }

                })

                .catch(function(error) {

                    console.log(
                        "Update Product Error:",
                        error
                    );


                    alert(
                        "Something went wrong while updating the product."
                    );

                });

        }
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ==========================================
// ADD PRODUCT BUTTON
// ==========================================

const addProductButton =
    document.querySelector(
        "#add-product-btn"
    );


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        function() {

            const productForm =
                document.createElement("div");


            productForm.className =
                "product-form-container";


            productForm.style.position =
                "fixed";

            productForm.style.top =
                "0";

            productForm.style.left =
                "0";

            productForm.style.width =
                "100%";

            productForm.style.height =
                "100%";

            productForm.style.background =
                "rgba(0, 0, 0, 0.75)";

            productForm.style.backdropFilter =
                "blur(8px)";

            productForm.style.display =
                "flex";

            productForm.style.alignItems =
                "center";

            productForm.style.justifyContent =
                "center";

            productForm.style.zIndex =
                "99999";

            productForm.style.padding =
                "20px";

            productForm.style.boxSizing =
                "border-box";


            productForm.innerHTML = `

                <div class="product-form">

                    <h2>
                        🍫 Add New Chocolate
                    </h2>


                    <input
                        type="text"
                        id="product-name"
                        placeholder="Product Name"
                    >


                    <input
                        type="number"
                        id="product-price"
                        placeholder="Price"
                    >


                    <textarea
                        id="product-description"
                        placeholder="Product Description"
                    ></textarea>


                    <input
                        type="text"
                        id="product-image"
                        placeholder="Image URL"
                    >


                    <input
                        type="text"
                        id="product-category"
                        placeholder="Category"
                        value="Chocolate"
                    >


                    <div class="product-form-buttons">

                        <button
                            id="save-product-btn"
                            type="button"
                        >
                            Save Product
                        </button>


                        <button
                            id="cancel-product-btn"
                            type="button"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(
                productForm
            );


            const formBox =
                productForm.querySelector(
                    ".product-form"
                );


            formBox.style.width =
                "450px";

            formBox.style.maxWidth =
                "100%";

            formBox.style.padding =
                "35px";

            formBox.style.background =
                "#2b1008";

            formBox.style.border =
                "1px solid #9a641e";

            formBox.style.borderRadius =
                "20px";

            formBox.style.boxShadow =
                "0 25px 80px rgba(0, 0, 0, 0.7)";

            formBox.style.color =
                "#f8e4c0";

            formBox.style.boxSizing =
                "border-box";


            const formInputs =
                formBox.querySelectorAll(
                    "input, textarea"
                );


            formInputs.forEach(
                function(input) {

                    input.style.width =
                        "100%";

                    input.style.padding =
                        "14px";

                    input.style.marginBottom =
                        "15px";

                    input.style.boxSizing =
                        "border-box";

                    input.style.background =
                        "#1a0804";

                    input.style.border =
                        "1px solid #70451b";

                    input.style.borderRadius =
                        "10px";

                    input.style.color =
                        "#ffffff";

                    input.style.fontSize =
                        "15px";

                }
            );


            const formButtons =
                formBox.querySelector(
                    ".product-form-buttons"
                );


            formButtons.style.display =
                "flex";

            formButtons.style.gap =
                "12px";

            formButtons.style.marginTop =
                "10px";


            const buttons =
                formBox.querySelectorAll(
                    "button"
                );


            buttons.forEach(
                function(button) {

                    button.style.flex =
                        "1";

                    button.style.padding =
                        "13px";

                    button.style.border =
                        "none";

                    button.style.borderRadius =
                        "10px";

                    button.style.cursor =
                        "pointer";

                    button.style.fontSize =
                        "15px";

                }
            );


            const saveButton =
                formBox.querySelector(
                    "#save-product-btn"
                );


            saveButton.style.background =
                "#d99a27";

            saveButton.style.color =
                "#1a0804";


            const cancelButton =
                formBox.querySelector(
                    "#cancel-product-btn"
                );


            cancelButton.style.background =
                "#542015";

            cancelButton.style.color =
                "#f8e4c0";


            cancelButton.addEventListener(
                "click",
                function() {

                    productForm.remove();

                }
            );


            saveButton.addEventListener(
                "click",
                function() {

                    const name =
                        document.querySelector(
                            "#product-name"
                        ).value.trim();


                    const price =
                        document.querySelector(
                            "#product-price"
                        ).value;


                    const description =
                        document.querySelector(
                            "#product-description"
                        ).value.trim();


                    const image =
                        document.querySelector(
                            "#product-image"
                        ).value.trim();


                    const category =
                        document.querySelector(
                            "#product-category"
                        ).value.trim();


                    if (
                        name === "" ||
                        price === "" ||
                        description === "" ||
                        image === ""
                    ) {

                        alert(
                            "Please fill all product details."
                        );

                        return;

                    }


                    if (
                        Number(price) <= 0
                    ) {

                        alert(
                            "Price must be greater than 0."
                        );

                        return;

                    }


                    const product = {

                        name: name,

                        price: Number(price),

                        description:
                            description,

                        image: image,

                        category:
                            category ||
                            "Chocolate",

                        available: true

                    };


                    console.log(
                        "New Product:",
                        product
                    );


                    fetch(
                        backendURL +
                        "/api/products",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    product
                                )

                        }

                    )

                        .then(function(response) {

                            if (handleUnauthorized(response)) {
                                 return;
                        }

                        if (!response.ok) {
                           throw new Error(
                            "Failed to add product"
                        );
                        }

                         return response.json();

                        })

                        .then(function(data) {

                            console.log(
                                "Product Response:",
                                data
                            );


                            if (data.product) {

                                alert(
                                    "Product added successfully! 🍫"
                                );


                                productForm.remove();

                                loadProducts();

                            }

                            else {

                                alert(
                                    data.message ||
                                    "Failed to add product."
                                );

                            }

                        })

                        .catch(function(error) {

                            console.log(
                                "Product Error:",
                                error
                            );


                            alert(
                                "Something went wrong while adding the product."
                            );

                        });

                }
            );

        }
    );

}


// ==========================================
// START DASHBOARD
// ==========================================

// ==========================================
// START DASHBOARD
// ==========================================

loadDashboard();

loadProducts();


// ==========================================
// ADMIN LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

    // Remove admin login information
    localStorage.removeItem("admin");
    localStorage.removeItem("token");

    // Redirect to admin login page
    window.location.href = "frontend/admin-login.html";

    });

}