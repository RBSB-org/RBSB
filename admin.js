// =====================================
// EVENTWALE ADMIN PANEL - FIXED
// Navigation + Theme + Modal + Mobile
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const toast = document.getElementById("toast");

    // PAGE INFORMATION
    const pageInfo = {
        overview: {
            title: "Overview",
            subtitle: "Your event platform at a glance."
        },
        events: {
            title: "Manage Events",
            subtitle: "Add and maintain event listings."
        },
        venues: {
            title: "Manage Venues",
            subtitle: "Maintain your venue directory."
        },
        services: {
            title: "Manage Services",
            subtitle: "Manage services offered on EVENTWALE."
        },
        locations: {
            title: "Locations",
            subtitle: "Manage your platform locations."
        },
        approvals: {
            title: "Event Approvals",
            subtitle: "Review events submitted by website users."
        },
        bookings: {
            title: "Booking Management",
            subtitle: "Review and manage customer bookings."
        },
        analytics: {
            title: "Platform Analytics",
            subtitle: "Understand bookings and platform activity."
        },
        theme: {
            title: "Theme Customizer",
            subtitle: "Personalize your admin dashboard."
        }
    };

    // TOAST MESSAGE
    function showToast(message) {
        if (!toast) {
            console.log(message);
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(window.eventwaleToastTimer);

        window.eventwaleToastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    // =====================================
    // FIXED NAVIGATION
    // =====================================

    const navButtons = document.querySelectorAll("[data-page]");
    const sections = document.querySelectorAll(".page-section");
    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("pageSubtitle");

    function openPage(pageName) {

        const targetSection = document.getElementById("page-" + pageName);

        if (!targetSection) {
            showToast("Page not found: " + pageName);
            console.error("Missing section:", "page-" + pageName);
            return;
        }

        // Hide all sections
        sections.forEach(function (section) {
            section.classList.remove("active");
            section.hidden = true;
        });

        // Show selected section
        targetSection.hidden = false;
        targetSection.classList.add("active");

        // Update sidebar buttons
        navButtons.forEach(function (button) {
            button.classList.toggle(
                "active",
                button.dataset.page === pageName
            );
        });

        // Update heading
        if (pageTitle && pageInfo[pageName]) {
            pageTitle.textContent = pageInfo[pageName].title;
        }

        if (pageSubtitle && pageInfo[pageName]) {
            pageSubtitle.textContent = pageInfo[pageName].subtitle;
        }

        // Close mobile sidebar
        if (sidebar) {
            sidebar.classList.remove("open");
        }
    }

    navButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            openPage(button.dataset.page);
        });
    });

    // "View all" button on Overview
    document.querySelectorAll("[data-go]").forEach(function (button) {
        button.addEventListener("click", function () {
            openPage(button.dataset.go);
        });
    });

    // Set initial page
    openPage("overview");

    // =====================================
    // MOBILE MENU
    // =====================================

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });
    }

    // =====================================
    // THEME CUSTOMIZER
    // =====================================

    const themes = {
        navy: {
            primary: "#14243A",
            accent: "#C5A46D",
            background: "#FAF8F3"
        },

        purple: {
            primary: "#30204D",
            accent: "#B69AF8",
            background: "#F7F3FF"
        },

        forest: {
            primary: "#173D32",
            accent: "#83C5A1",
            background: "#F2F7F1"
        },

        midnight: {
            primary: "#17191F",
            accent: "#65C7D0",
            background: "#20232B"
        }
    };

    const sidebarColor = document.getElementById("sidebarColor");
    const accentColor = document.getElementById("accentColor");
    const backgroundColor = document.getElementById("backgroundColor");
    const themeMessage = document.getElementById("themeMessage");

    function applyTheme(theme) {

        const root = document.documentElement;

        root.style.setProperty("--primary", theme.primary);
        root.style.setProperty("--accent", theme.accent);
        root.style.setProperty("--page-bg", theme.background);

        // Update color inputs
        if (sidebarColor) sidebarColor.value = theme.primary;
        if (accentColor) accentColor.value = theme.accent;

        if (backgroundColor) {
            backgroundColor.value = theme.background;
        }

        // Update live preview
        const previewSidebar = document.querySelector(".preview-sidebar");
        const previewContent = document.querySelector(".preview-content");
        const previewButton = document.querySelector(".preview-button");

        if (previewSidebar) {
            previewSidebar.style.backgroundColor = theme.primary;
        }

        if (previewContent) {
            previewContent.style.backgroundColor = theme.background;
        }

        if (previewButton) {
            previewButton.style.backgroundColor = theme.accent;
        }

        // Highlight selected preset
        document.querySelectorAll("[data-theme]").forEach(function (button) {
            button.classList.toggle(
                "active",
                button.dataset.theme === getThemeName(theme)
            );
        });
    }

    function getThemeName(theme) {
        for (const name in themes) {
            if (
                themes[name].primary === theme.primary &&
                themes[name].accent === theme.accent &&
                themes[name].background === theme.background
            ) {
                return name;
            }
        }

        return "";
    }

    function getCurrentTheme() {
        return {
            primary: sidebarColor ? sidebarColor.value : themes.navy.primary,
            accent: accentColor ? accentColor.value : themes.navy.accent,
            background: backgroundColor
                ? backgroundColor.value
                : themes.navy.background
        };
    }

    // Load saved theme
    try {
        const savedTheme = localStorage.getItem("eventwaleAdminTheme");

        applyTheme(savedTheme ? JSON.parse(savedTheme) : themes.navy);
    } catch (error) {
        console.error("Could not load saved theme:", error);
        applyTheme(themes.navy);
    }

    // Theme preset buttons
    document.querySelectorAll("[data-theme]").forEach(function (button) {
        button.addEventListener("click", function () {
            const theme = themes[button.dataset.theme];

            if (!theme) return;

            applyTheme(theme);

            if (themeMessage) {
                themeMessage.textContent = "Theme selected. Click Save Theme to keep it.";
            }

            showToast("Theme selected!");
        });
    });

    // Custom colors
    [sidebarColor, accentColor, backgroundColor].forEach(function (input) {
        if (input) {
            input.addEventListener("input", function () {
                applyTheme(getCurrentTheme());

                if (themeMessage) {
                    themeMessage.textContent = "Custom colours previewed.";
                }
            });
        }
    });

    // Save theme
    const saveThemeBtn = document.getElementById("saveThemeBtn");

    if (saveThemeBtn) {
        saveThemeBtn.addEventListener("click", function () {
            try {
                localStorage.setItem(
                    "eventwaleAdminTheme",
                    JSON.stringify(getCurrentTheme())
                );

                if (themeMessage) {
                    themeMessage.textContent = "Theme saved successfully!";
                }

                showToast("Theme saved!");
            } catch (error) {
                showToast("Could not save theme.");
            }
        });
    }

    // Reset theme
    const resetThemeBtn = document.getElementById("resetThemeBtn");

    if (resetThemeBtn) {
        resetThemeBtn.addEventListener("click", function () {
            applyTheme(themes.navy);

            localStorage.removeItem("eventwaleAdminTheme");

            if (themeMessage) {
                themeMessage.textContent = "Default theme restored.";
            }

            showToast("Default theme restored!");
        });
    }

    // =====================================
    // ADD CONTENT MODAL
    // =====================================

    const contentModal = document.getElementById("contentModal");
    const contentForm = document.getElementById("contentForm");

    function openModal(type) {
        if (!contentModal) return;

        if (contentForm) contentForm.reset();

        const typeInput = document.getElementById("contentType");
        const idInput = document.getElementById("contentId");
        const modalTitle = document.getElementById("modalTitle");

        if (typeInput) typeInput.value = type;
        if (idInput) idInput.value = "";

        if (modalTitle) {
            modalTitle.textContent =
                "Add " + type.charAt(0).toUpperCase() + type.slice(1);
        }

        contentModal.hidden = false;
        contentModal.classList.add("open");
    }

    function closeModal() {
        if (!contentModal) return;

        contentModal.classList.remove("open");
        contentModal.hidden = true;
    }

    document.querySelectorAll("[data-open-form]").forEach(function (button) {
        button.addEventListener("click", function () {
            openModal(button.dataset.openForm);
        });
    });

    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener("click", closeModal);
    }

    if (contentModal) {
        contentModal.addEventListener("click", function (event) {
            if (event.target === contentModal) {
                closeModal();
            }
        });
    }

    // IMPORTANT:
    // Firebase save/approve/delete operations are not connected yet.
    if (contentForm) {
        contentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            showToast(
                "Form UI ready. Secure database connection is the next step."
            );
        });
    }

    // =====================================
    // SIGN OUT BUTTON
    // =====================================

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            const confirmed = confirm("Leave the admin dashboard?");

            if (confirmed) {
                window.location.href = "login.html";
            }
        });
    }

    console.log("EVENTWALE admin panel initialized.");
});