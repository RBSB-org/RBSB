// EVENTWALE ADMIN LOGIN — Firebase Authentication + server-enforced admin allowlist
import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");
function showMessage(text, color = "red") { if (message) { message.textContent = text; message.style.color = color; } }
if (form) form.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginButton.disabled = true;
  loginButton.textContent = "Checking…";
  showMessage("");
  try {
    const credential = await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    const adminSnap = await get(ref(db, `admins/${credential.user.uid}`));
    if (adminSnap.val() !== true) {
      showMessage("This account is not authorized as an administrator.");
      await (await import("https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js")).signOut(auth);
      return;
    }
    showMessage("Login successful. Opening dashboard…", "green");
    window.location.replace("./admin.html");
  } catch (error) {
    console.error(error);
    showMessage(error.code === "auth/invalid-credential" ? "Incorrect email or password." : (error.message || "Sign-in failed."));
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign In to Dashboard";
  }
});
