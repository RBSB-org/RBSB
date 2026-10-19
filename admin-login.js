// RBSB EVENTS ADMIN LOGIN

const ADMIN_EMAILS = [
    "karxnsharma211@gmail.com",
    "aizenkun430@gmail.com",
    "rbsborg@gmail.com"
];

const ADMIN_PASSWORD = "karan@1234";

const loginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        const validEmails = ADMIN_EMAILS.map(function (item) {
            return item.toLowerCase();
        });

        if (validEmails.includes(email) && password === ADMIN_PASSWORD) {

            // SAME KEY AS admin.html
            sessionStorage.setItem("rbsbAdminDemo", "true");

            message.textContent = "Login successful! Opening dashboard...";
            message.style.color = "green";

            if (loginButton) {
                loginButton.disabled = true;
                loginButton.textContent = "Opening Dashboard...";
            }

            window.location.href = "./admin.html";

        } else {
            message.textContent = "Incorrect email or password.";
            message.style.color = "red";
        }
    });
}