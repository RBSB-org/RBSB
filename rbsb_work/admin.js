import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { ref, get, push, set, update, remove, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// =====================================
// RBSB Events ADMIN PANEL - FIXED
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
            subtitle: "Manage services offered on RBSB Events."
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

        clearTimeout(window.RBSBEVENTSToastTimer);

        window.RBSBEVENTSToastTimer = setTimeout(function () {
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
        const savedTheme = localStorage.getItem("rbsbAdminTheme");

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
                    "rbsbAdminTheme",
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

// RESET TO DEFAULT THEME
const resetThemeBtn = document.getElementById("resetThemeBtn");

if (resetThemeBtn) {
    resetThemeBtn.addEventListener("click", function () {
        try {
            applyTheme(themes.navy);

            localStorage.setItem(
                "rbsbAdminTheme",
                JSON.stringify(themes.navy)
            );

            if (themeMessage) {
                themeMessage.textContent =
                    "Default theme saved successfully!";
            }

            showToast("Default theme restored and saved!");

        } catch (error) {
            console.error("Theme reset error:", error);
            showToast("Could not reset theme.");
        }
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

    // Save admin-managed content to Firebase Realtime Database.
    if (contentForm) {
        contentForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const type = document.getElementById("contentType")?.value;
            const contentId = document.getElementById("contentId")?.value;
            const title = document.getElementById("contentTitle")?.value.trim();
            const category = document.getElementById("contentCategory")?.value.trim();
            const location = document.getElementById("contentLocation")?.value.trim();
            const priceValue = document.getElementById("contentPrice")?.value;
            const description = document.getElementById("contentDescription")?.value.trim();
            const collection = ({ event: "events", venue: "venues", service: "services", location: "locations" })[type];

            if (!collection || !title) {
                showToast("Please enter a title and choose valid content type.");
                return;
            }

            const saveButton = contentForm.querySelector('button[type="submit"]');
            if (saveButton) saveButton.disabled = true;
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("Please sign in again.");
                const adminSnapshot = await get(ref(db, `admins/${user.uid}`));
                if (adminSnapshot.val() !== true) throw new Error("Admin access is required.");

                const now = Date.now();
                const payload = {
                    title,
                    name: title,
                    category,
                    location,
                    price: priceValue === "" ? null : Number(priceValue),
                    description,
                    type,
                    updatedAt: now
                };
                if (contentId) {
                    await update(ref(db, `${collection}/${contentId}`), payload);
                } else {
                    const newRef = push(ref(db, collection));
                    await set(newRef, { ...payload, createdAt: now });
                }
                showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully.`);
                contentForm.reset();
                closeModal();
            } catch (error) {
                console.error(`Could not save ${type}:`, error);
                showToast(error?.code === "PERMISSION_DENIED"
                    ? "Save denied. Check Firebase Database Rules and admin UID."
                    : `Could not save content: ${error.message || "unknown error"}`);
            } finally {
                if (saveButton) saveButton.disabled = false;
            }
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
                signOut(auth).finally(() => window.location.replace("admin-login.html"));
            }
        });
    }

    console.log("RBSB Events admin panel initialized.");

    // =====================================
    // LIVE BOOKINGS + AUTHORIZATION
    // =====================================
    const bookingBody = document.getElementById("bookingsTable");
    const recentBody = document.getElementById("recentBookings");
    const totalBookingsEl = document.getElementById("totalBookings");
    const totalPendingEl = document.getElementById("totalPending");
    const pendingBadgeEl = document.getElementById("pendingBadge");
    let bookingsUnsubscribe = null;

    function safeText(value) {
        return String(value ?? "").replace(/[&<>"']/g, ch => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[ch]));
    }
    function statusLabel(status) {
        return String(status || "pending").replace(/_/g, " ");
    }
    function renderBookingRows(allBookings) {
        const rows = allBookings.slice().sort((a,b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
        const pending = rows.filter(b => b.status === "pending").length;
        if (totalBookingsEl) totalBookingsEl.textContent = String(rows.length);
        if (totalPendingEl) totalPendingEl.textContent = String(pending);
        if (pendingBadgeEl) pendingBadgeEl.textContent = String(pending);

        if (bookingBody) {
            bookingBody.innerHTML = rows.length ? rows.map(b => `
              <tr>
                <td>${safeText(b.bookingId)}</td>
                <td>${safeText(b.customerName)}<br><small>${safeText(b.customerEmail)}<br>${safeText(b.customerPhone)}</small></td>
                <td>${safeText(b.eventName)}<br><small>${safeText(b.eventType)}</small></td>
                <td>${safeText(b.eventDate)} ${safeText(b.eventTime)}</td>
                <td>${safeText(statusLabel(b.status))}</td>
                <td>${b.status === "pending" ? `
                  <button type="button" data-booking-action="approved" data-uid="${safeText(b.userId)}" data-id="${safeText(b.bookingId)}">Approve</button>
                  <button type="button" data-booking-action="rejected" data-uid="${safeText(b.userId)}" data-id="${safeText(b.bookingId)}">Reject</button>` : "Locked"}
                </td>
              </tr>`).join("") : '<tr><td colspan="6" class="empty-cell">No bookings found yet.</td></tr>';
        }
        if (recentBody) {
            recentBody.innerHTML = rows.slice(0,5).length ? rows.slice(0,5).map(b => `
              <tr><td>${safeText(b.bookingId)}</td><td>${safeText(b.customerName)}</td><td>${safeText(b.eventName)}</td><td>${safeText(statusLabel(b.status))}</td></tr>
            `).join("") : '<tr><td colspan="4" class="empty-cell">No bookings found yet.</td></tr>';
        }
    }

    // =====================================
    // LIVE ANALYTICS (Firebase-backed)
    // =====================================
    let analyticsBookingChart = null;
    let analyticsCategoryChart = null;

    function countCollection(value) {
        if (!value || typeof value !== "object") return 0;
        return Object.keys(value).length;
    }

    function renderAnalytics(bookings, eventCount = 0, serviceCount = 0, venueCount = 0) {
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(value);
        };
        setText("analyticsEvents", eventCount);
        setText("analyticsBookings", bookings.length);
        setText("analyticsServices", serviceCount);
        setText("analyticsVenues", venueCount);

        // If Chart.js failed to load, leave useful stats visible and log the cause.
        if (typeof window.Chart !== "function") {
            console.error("Analytics charts unavailable: Chart.js did not load.");
            return;
        }

        const monthLabels = [];
        const monthCounts = {};
        const now = new Date();
        for (let offset = 5; offset >= 0; offset--) {
            const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            monthLabels.push(d.toLocaleDateString(undefined, { month: "short", year: "2-digit" }));
            monthCounts[key] = 0;
        }
        bookings.forEach(booking => {
            const raw = Number(booking.createdAt || booking.updatedAt || 0);
            if (!raw) return;
            const d = new Date(raw);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            if (Object.prototype.hasOwnProperty.call(monthCounts, key)) monthCounts[key]++;
        });

        const trendCanvas = document.getElementById("analyticsChart");
        if (trendCanvas) {
            if (analyticsBookingChart) analyticsBookingChart.destroy();
            analyticsBookingChart = new window.Chart(trendCanvas, {
                type: "line",
                data: { labels: monthLabels, datasets: [{ label: "Bookings", data: Object.values(monthCounts), tension: 0.3, fill: false }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
            });
        }

        const categories = {};
        bookings.forEach(booking => {
            const label = String(booking.eventType || "Unspecified").trim() || "Unspecified";
            categories[label] = (categories[label] || 0) + 1;
        });
        const categoryCanvas = document.getElementById("categoryChart");
        if (categoryCanvas) {
            if (analyticsCategoryChart) analyticsCategoryChart.destroy();
            const labels = Object.keys(categories);
            analyticsCategoryChart = new window.Chart(categoryCanvas, {
                type: "doughnut",
                data: { labels: labels.length ? labels : ["No booking data yet"], datasets: [{ label: "Bookings by event type", data: labels.length ? labels.map(label => categories[label]) : [1] }] },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }

    function safeCollectionCount(path, callback) {
        get(ref(db, path)).then(snapshot => callback(countCollection(snapshot.val())))
            .catch(error => {
                console.warn(`Analytics could not read ${path}; showing 0. Check database rules/path.`, error);
                callback(0);
            });
    }

    // LIVE CONTENT TABLES: events, venues, services, and locations.
    // The previous build wrote records to Firebase but never subscribed to these
    // collections or rendered their table rows, making saved content appear missing.
    const contentCollections = {
        events: { tableId: "eventsTable", type: "event", columns: ["title", "category", "location"] },
        venues: { tableId: "venuesTable", type: "venue", columns: ["title", "location", "price"] },
        services: { tableId: "servicesTable", type: "service", columns: ["title", "description", "price"] },
        locations: { tableId: "locationsTable", type: "location", columns: ["title", "description"] }
    };
    const contentCache = { events: {}, venues: {}, services: {}, locations: {} };

    function displayContentValue(item, key) {
        if (key === "title") return item.title || item.name || item.eventName || "Untitled";
        if (key === "price") return item.price === null || item.price === undefined || item.price === "" ? "—" : item.price;
        return item[key] ?? "—";
    }

    function renderContentCollection(collection, value) {
        const config = contentCollections[collection];
        const table = document.getElementById(config.tableId);
        contentCache[collection] = value && typeof value === "object" ? value : {};
        const entries = Object.entries(contentCache[collection]);
        const total = entries.length;
        const overviewId = collection === "events" ? "totalEvents" : collection === "venues" ? "totalVenues" : null;
        if (overviewId) {
            const overviewEl = document.getElementById(overviewId);
            if (overviewEl) overviewEl.textContent = String(total);
        }
        if (!table) return;
        if (!entries.length) {
            const colCount = config.columns.length + 1;
            table.innerHTML = `<tr><td colspan="${colCount}" class="empty-cell">No ${collection} found yet. Use the Add button to create one.</td></tr>`;
            return;
        }
        table.innerHTML = entries.map(([id, item]) => {
            item = item && typeof item === "object" ? item : {};
            const cells = config.columns.map(key => `<td>${safeText(displayContentValue(item, key))}</td>`).join("");
            return `<tr>${cells}<td><button type="button" data-content-action="edit" data-collection="${collection}" data-id="${safeText(id)}">Edit</button> <button type="button" data-content-action="delete" data-collection="${collection}" data-id="${safeText(id)}">Delete</button></td></tr>`;
        }).join("");
    }

    document.querySelectorAll("#eventsTable, #venuesTable, #servicesTable, #locationsTable").forEach(table => {
        table.addEventListener("click", async event => {
            const button = event.target.closest("[data-content-action]");
            if (!button) return;
            const collection = button.dataset.collection;
            const id = button.dataset.id;
            const item = contentCache[collection]?.[id];
            if (!contentCollections[collection] || !id || !item) return;
            if (button.dataset.contentAction === "edit") {
                openModal(contentCollections[collection].type);
                document.getElementById("contentId").value = id;
                document.getElementById("contentTitle").value = item.title || item.name || item.eventName || "";
                document.getElementById("contentCategory").value = item.category || "";
                document.getElementById("contentLocation").value = item.location || "";
                document.getElementById("contentPrice").value = item.price ?? "";
                document.getElementById("contentDescription").value = item.description || "";
                const modalTitle = document.getElementById("modalTitle");
                if (modalTitle) modalTitle.textContent = `Edit ${contentCollections[collection].type}`;
                return;
            }
            if (button.dataset.contentAction === "delete") {
                if (!confirm(`Delete this ${contentCollections[collection].type}? This cannot be undone.`)) return;
                button.disabled = true;
                try {
                    await remove(ref(db, `${collection}/${id}`));
                    showToast(`${contentCollections[collection].type} deleted.`);
                } catch (error) {
                    console.error(`Could not delete ${collection}/${id}:`, error);
                    showToast(`Delete failed: ${error.message || "check Firebase rules"}`);
                    button.disabled = false;
                }
            }
        });
    });

    async function setBookingStatus(uid, bookingId, status) {
        if (!["approved", "rejected"].includes(status)) return;
        const action = status === "approved" ? "approve" : "reject";
        if (!confirm(`Are you sure you want to ${action} this booking?`)) return;
        try {
            await update(ref(db, `bookings/${uid}/${bookingId}`), {
                status,
                updatedAt: Date.now()
            });
            showToast(`Booking ${status}.`);
        } catch (error) {
            console.error("Could not update booking status:", error);
            showToast("Update failed. Check admin access and Firebase rules.");
        }
    }

    if (bookingBody) bookingBody.addEventListener("click", event => {
        const button = event.target.closest("[data-booking-action]");
        if (button) setBookingStatus(button.dataset.uid, button.dataset.id, button.dataset.bookingAction);
    });

    onAuthStateChanged(auth, async user => {
        if (!user) {
            window.location.replace("./admin-login.html");
            return;
        }
        try {
            const adminSnap = await get(ref(db, `admins/${user.uid}`));
            if (adminSnap.val() !== true) {
                await signOut(auth);
                window.location.replace("./admin-login.html");
                return;
            }
            let latestBookings = [];
            let latestCounts = { events: 0, services: 0, venues: 0 };
            // Render both the Analytics page charts AND the Overview page charts.
            let overviewBookingChart = null;
            let overviewStatusChart = null;
            const refreshAnalytics = () => {
                renderAnalytics(latestBookings, latestCounts.events, latestCounts.services, latestCounts.venues);
                renderOverviewCharts(latestBookings);
                const setOverviewCount = (id, value) => {
                    const node = document.getElementById(id);
                    if (node) node.textContent = String(value);
                };
                setOverviewCount("totalEvents", latestCounts.events);
                setOverviewCount("totalBookings", latestBookings.length);
                setOverviewCount("totalVenues", latestCounts.venues);
                setOverviewCount("totalPending", latestBookings.filter(b => String(b.status || "pending").toLowerCase() === "pending").length);
            };

            function renderOverviewCharts(bookings) {
                if (typeof window.Chart !== "function") {
                    console.error("Overview charts unavailable: Chart.js did not load.");
                    return;
                }
                const bookingCanvas = document.getElementById("bookingChart");
                if (bookingCanvas) {
                    const labels = [], values = [], counts = {};
                    const now = new Date();
                    for (let offset = 5; offset >= 0; offset--) {
                        const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
                        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                        labels.push(d.toLocaleDateString(undefined, { month: "short", year: "numeric" }));
                        counts[key] = 0;
                    }
                    bookings.forEach(b => {
                        const stamp = Number(b.createdAt || b.updatedAt || 0);
                        if (!stamp) return;
                        const d = new Date(stamp);
                        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                        if (Object.prototype.hasOwnProperty.call(counts, key)) counts[key]++;
                    });
                    values.push(...Object.values(counts));
                    if (overviewBookingChart) overviewBookingChart.destroy();
                    overviewBookingChart = new window.Chart(bookingCanvas, {
                        type: "line",
                        data: { labels, datasets: [{ label: "Bookings", data: values, tension: 0.3, fill: false }] },
                        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
                    });
                }
                const statusCanvas = document.getElementById("statusChart");
                if (statusCanvas) {
                    const counts = { pending: 0, approved: 0, rejected: 0 };
                    bookings.forEach(b => {
                        const status = String(b.status || "pending").toLowerCase();
                        if (Object.prototype.hasOwnProperty.call(counts, status)) counts[status]++;
                    });
                    if (overviewStatusChart) overviewStatusChart.destroy();
                    overviewStatusChart = new window.Chart(statusCanvas, {
                        type: "doughnut",
                        data: { labels: ["Pending", "Approved", "Rejected"], datasets: [{ label: "Booking Status", data: Object.values(counts) }] },
                        options: { responsive: true, maintainAspectRatio: false }
                    });
                }
            }

            onValue(ref(db, "bookings"), snapshot => {
                const list = [];
                snapshot.forEach(userSnap => {
                    userSnap.forEach(bookingSnap => {
                        const booking = bookingSnap.val() || {};
                        list.push({ ...booking, userId: booking.userId || userSnap.key, bookingId: booking.bookingId || bookingSnap.key });
                    });
                });
                latestBookings = list;
                renderBookingRows(list);
                refreshAnalytics();
            }, error => {
                console.error("Booking read failed:", error);
                if (bookingBody) bookingBody.innerHTML = '<tr><td colspan="6" class="empty-cell">Could not load bookings. Check Firebase Realtime Database rules.</td></tr>';
            });

            // Keep analytics counts live when an admin adds/edits content too.
            ["events", "services", "venues", "locations"].forEach(collection => {
                onValue(ref(db, collection), snapshot => {
                    const value = snapshot.val() || {};
                    latestCounts[collection] = countCollection(value);
                    renderContentCollection(collection, value);
                    refreshAnalytics();
                }, error => {
                    console.error(`Database read failed for ${collection}:`, error);
                    latestCounts[collection] = 0;
                    renderContentCollection(collection, {});
                    refreshAnalytics();
                    showToast(`Could not load ${collection}. Check database rules and connection.`);
                });
            });
        } catch (error) {
            console.error("Admin verification failed:", error);
            window.location.replace("./admin-login.html");
        }
    });


});