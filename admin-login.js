// RBSB ORG ADMIN LOGIN

const ADMIN_EMAIL = ["karxnsharma211@gmail.com", "aizenkun430@gmail.com","rbsborg@gmail.com"];
const ADMIN_PASSWORD = "karan@1234";
const loginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (
            ADMIN_EMAIL.includes(email) &&
            password === ADMIN_PASSWORD
        ) {
            message.textContent = "Login successful! Opening dashboard...";
            message.style.color = "green";

            sessionStorage.setItem("RBSB-orgAdminDemo", "true");

            window.location.replace("admin.html");
        } else {
            message.textContent = "Incorrect email or password.";
            message.style.color = "red";
        }
    });
}