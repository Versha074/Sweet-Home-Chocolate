const backendURL = "http://localhost:5000";

const loginForm = document.getElementById("admin-login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    loginMessage.innerText = "Logging in...";

    try {

        const response = await fetch(`${backendURL}/api/admin/login`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            loginMessage.innerText = "Login successful! 🍫";

            localStorage.setItem("admin", JSON.stringify(data.admin));

            // Save JWT token
            localStorage.setItem("token", data.token);

            window.location.href = "../admin.html";

        } else {

            loginMessage.innerText = data.message;
        }

    } catch (error) {

        console.error("Login Error:", error);

        loginMessage.innerText =
            "Cannot connect to server. Please try again.";
    }
});