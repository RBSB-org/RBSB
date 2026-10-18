import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

console.log("EVENTWALE auth-nav.js loaded");
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
        "eventwale_profile_picture_" + user.uid
    );

    const profilePicture =
        savedPicture ||
        user.photoURL ||
        "https://placehold.co/100x100?text=User";

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
                >

                <span class="shared-profile-name">
                    ${safeName}
                </span>

                <span aria-hidden="true">▾</span>
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

                <a href="profile.html">My Profile</a>
                <a href="booking.html">My Bookings</a>
                <a href="budget.html">Budget Planner</a>

                <button
                    type="button"
                    id="sharedLogoutButton"
                    class="shared-logout-button"
                >
                    Logout
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

// Refresh navigation when returning to a cached page
window.addEventListener("pageshow", () => {
   /* const user = auth.currentUser;

    if (user) {
        showUserNavigation(user);
    } else {
        showGuestNavigation();
    }*/
});