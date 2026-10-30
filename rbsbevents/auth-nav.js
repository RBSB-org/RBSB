import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

console.log("RBSB Events auth-nav.js loaded");
console.log(
    "Header found:",
    document.querySelector(".header-actions")
);
// Show a loading indicator while Firebase checks login status
function showAuthLoading() {
    const headerActions = document.querySelector(".header-actions");

    if (!headerActions) return;

    headerActions.innerHTML = `
        <span class="auth-loading">
            Checking account...
        </span>
    `;
}
const headerActions = document.querySelector(".header-actions");


// Show navigation for a guest user
function showGuestNavigation() {
    if (!headerActions) return;

    headerActions.innerHTML = `
        <a href="login.html" class="login-button">
            Login
        </a>

        <a href="signup.html" class="signup-button">
            Sign Up
        </a>
    `;
}


// Show the navigation for a logged-in user
function showUserNavigation(user) {
    if (!headerActions) return;

    const displayName = user.displayName || "My Account";
    const email = user.email || "";

    const savedPicture = localStorage.getItem(
        "rbsb_profile_picture_" + user.uid
    );

    const profilePicture =
        savedPicture ||
        user.photoURL ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23e9dfc9'/%3E%3Ccircle cx='50' cy='36' r='18' fill='%2314243a'/%3E%3Cpath d='M16 92c3-22 16-33 34-33s31 11 34 33' fill='%2314243a'/%3E%3C/svg%3E";

    const safeName = escapeHTML(displayName);
    const safeEmail = escapeHTML(email);

    headerActions.innerHTML = `
        <div class="shared-profile-dropdown">

            <button
                type="button"
                class="shared-profile-button"
                id="sharedProfileButton"
                aria-expanded="false"
                aria-controls="sharedProfileMenu"
            >
                <img
                    src="${escapeHTML(profilePicture)}"
                    alt="Profile picture"
                    class="shared-profile-picture"
                    onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 rx=%2250%22 fill=%22%23e9dfc9%22/%3E%3Ccircle cx=%2250%22 cy=%2236%22 r=%2218%22 fill=%22%2314243a%22/%3E%3Cpath d=%22M16 92c3-22 16-33 34-33s31 11 34 33%22 fill=%22%2314243a%22/%3E%3C/svg%3E'"
                >

            </button>

            <div
                class="shared-profile-menu"
                id="sharedProfileMenu"
                hidden
            >
                <div class="shared-profile-info">
                    <strong>${safeName}</strong>
                    <small>${safeEmail}</small>
                </div>

                <a href="profile.html"><span aria-hidden="true">♙</span> Profile</a>
                <a href="my-booking.html"><span aria-hidden="true">▣</span> My Bookings</a>
                <a href="budget.html"><span aria-hidden="true">◷</span> Budget Planner</a>

                <button
                    type="button"
                    id="sharedLogoutButton"
                    class="shared-logout-button"
                >
                    <span aria-hidden="true">⇥</span> Sign out
                </button>
            </div>
        </div>
    `;

    setupProfileMenu();
}


// Escape text before inserting it into HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


// Open and close the profile dropdown
function setupProfileMenu() {
    const profileButton = document.getElementById(
        "sharedProfileButton"
    );

    const profileMenu = document.getElementById(
        "sharedProfileMenu"
    );

    const logoutButton = document.getElementById(
        "sharedLogoutButton"
    );

    if (!profileButton || !profileMenu || !logoutButton) {
        return;
    }

    profileButton.addEventListener("click", () => {
        const isOpen = !profileMenu.hidden;

        profileMenu.hidden = isOpen;

        profileButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );
    });

    document.addEventListener("click", event => {
        if (
            !profileButton.contains(event.target) &&
            !profileMenu.contains(event.target)
        ) {
            profileMenu.hidden = true;

            profileButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    });

    logoutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);

            window.location.href = "index.html";
        } catch (error) {
            console.error("Logout failed:", error);

            alert("Logout failed. Please try again.");
        }
    });
}


// Show loading indicator immediately
showAuthLoading();

// Firebase decides which navigation to show
onAuthStateChanged(auth, user => {
    if (user) {
        showUserNavigation(user);
    } else {
        showGuestNavigation();
    }
});

