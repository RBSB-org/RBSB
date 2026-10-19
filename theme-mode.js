/* =====================================
   RBSB EVENTS — GLOBAL MODE SWITCH
===================================== */

(function () {
    const STORAGE_KEY = "rbsbDisplayMode";

    function getSavedMode() {
        try {
            return localStorage.getItem(STORAGE_KEY) || "light";
        } catch (error) {
            return "light";
        }
    }

    function applyMode(mode) {
        const selectedMode = mode === "dark" ? "dark" : "light";

        document.documentElement.setAttribute(
            "data-mode",
            selectedMode
        );

        const toggle = document.getElementById("modeToggle");

        if (toggle) {
            toggle.innerHTML = selectedMode === "dark"
                ? "☀️ <span>Light</span>"
                : "🌙 <span>Dark</span>";

            toggle.setAttribute(
                "aria-label",
                selectedMode === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

            toggle.setAttribute("aria-pressed", String(selectedMode === "dark"));
        }

        try {
            localStorage.setItem(STORAGE_KEY, selectedMode);
        } catch (error) {
            console.warn("Could not save display mode.", error);
        }
    }

    // Apply saved mode immediately.
    applyMode(getSavedMode());

    // Create a toggle button if the page includes the mount point.
    document.addEventListener("DOMContentLoaded", function () {
        let toggle = document.getElementById("modeToggle");

        if (!toggle) {
            const header = document.querySelector("header");

            if (!header) return;

            toggle = document.createElement("button");
            toggle.id = "modeToggle";
            toggle.type = "button";
            toggle.className = "mode-toggle";
            toggle.style.marginLeft = "10px";

            const headerContainer =
                header.querySelector(".container") ||
                header.querySelector(".nav-container") ||
                header;

            headerContainer.appendChild(toggle);
        }

        toggle.addEventListener("click", function () {
            const currentMode =
                document.documentElement.getAttribute("data-mode") || "light";

            applyMode(currentMode === "dark" ? "light" : "dark");
        });

        applyMode(getSavedMode());
    });

    // Sync mode when another same-origin page/tab changes it.
    window.addEventListener("storage", function (event) {
        if (event.key === STORAGE_KEY) {
            applyMode(event.newValue || "light");
        }
    });
})();