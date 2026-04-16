var defaultItems = [
    {
        id: "default-1",
        name: "Blue Bottle",
        status: "Lost",
        description: "Blue water bottle left in the classroom after lecture.",
        contact: "9876543210",
        location: "CL 603",
        reportedBy: "Sunita Shukla",
        image: "bottle.jpg"
    },
    {
        id: "default-2",
        name: "Keychain",
        status: "Lost",
        description: "Metal keychain with two keys attached.",
        contact: "9876543211",
        location: "Room 101",
        reportedBy: "Rohit Kumar",
        image: "keychain.jpg"
    },
    {
        id: "default-3",
        name: "Wallet",
        status: "Lost",
        description: "Brown wallet with ID cards and some cash.",
        contact: "9876543212",
        location: "Library",
        reportedBy: "Anjali Verma",
        image: "wallet.jpg"
    },
    {
        id: "default-4",
        name: "ID Card",
        status: "Found",
        description: "Student ID card found near the cafeteria entrance.",
        contact: "9876543213",
        location: "Cafeteria",
        reportedBy: "Aman Gupta",
        image: "card.jpg"
    },
    {
        id: "default-5",
        name: "Earbuds",
        status: "Found",
        description: "Wireless earbuds found under a chair.",
        contact: "9876543214",
        location: "Mini Auditorium",
        reportedBy: "Neha Singh",
        image: "earbuds.jpg"
    },
    {
        id: "default-6",
        name: "Pouch",
        status: "Lost",
        description: "Small zipper pouch with stationery items inside.",
        contact: "9876543215",
        location: "Library",
        reportedBy: "Kashvi K",
        image: "zipper.jpg"
    }
];

function login() {
    var sapInput = document.getElementById("sap");
    var nameInput = document.getElementById("name");

    if (!sapInput || !nameInput) {
        return;
    }

    var sap = sapInput.value.trim();
    var name = nameInput.value.trim();

    if (!sap || !name) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("user", JSON.stringify({ sap: sap, name: name }));
    window.location.href = "dashboard.html";
}

function initializeItemsStorage() {
    var storedItems = localStorage.getItem("portalItems");

    if (!storedItems) {
        var oldLostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
        var oldFoundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
        var migratedItems = [];

        oldLostItems.forEach(function (item, index) {
            migratedItems.push({
                id: "old-lost-" + index + "-" + Date.now(),
                name: item.name || item.item || "Lost Item",
                status: "Lost",
                description: item.description || item.desc || "",
                contact: item.contact || "9876543210",
                location: item.location || "Campus",
                reportedBy: item.reportedBy || "Student",
                image: item.image || "wallet.jpg"
            });
        });

        oldFoundItems.forEach(function (item, index) {
            migratedItems.push({
                id: "old-found-" + index + "-" + Date.now(),
                name: item.name || item.item || "Found Item",
                status: "Found",
                description: item.description || item.desc || "",
                contact: item.contact || "9876543210",
                location: item.location || "Campus",
                reportedBy: item.reportedBy || "Student",
                image: item.image || "card.jpg"
            });
        });

        localStorage.setItem("portalItems", JSON.stringify(defaultItems.concat(migratedItems)));
    }
}

function getPortalItems() {
    initializeItemsStorage();
    return JSON.parse(localStorage.getItem("portalItems")) || [];
}

function savePortalItems(items) {
    localStorage.setItem("portalItems", JSON.stringify(items));
}

function submitLost() {
    var nameInput = document.getElementById("lostItem");
    var descriptionInput = document.getElementById("lostDesc");
    var locationInput = document.getElementById("lostLocation");
    var phoneInput = document.getElementById("lostPhone");
    var dateInput = document.getElementById("lostDate");

    if (!nameInput || !descriptionInput || !locationInput || !phoneInput || !dateInput) {
        return;
    }

    var name = nameInput.value.trim();
    var description = descriptionInput.value.trim();
    var location = locationInput.value.trim();
    var contact = phoneInput.value.trim();
    var date = dateInput.value;

    if (!name || !description || !location || !contact || !date) {
        alert("Please fill all fields");
        return;
    }

    if (contact.length !== 10 || isNaN(contact)) {
        alert("Enter a valid 10-digit phone number");
        return;
    }

    var user = JSON.parse(localStorage.getItem("user"));
    var reportedBy = user && user.name ? user.name : "Student";
    var items = getPortalItems();
    var lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];

    var newItem = {
        id: "item-" + Date.now(),
        name: name,
        status: "Lost",
        description: description,
        contact: contact,
        location: location,
        date: date,
        reportedBy: reportedBy,
        image: "wallet.jpg"
    };

    items.push(newItem);
    lostItems.push(newItem);

    savePortalItems(items);
    localStorage.setItem("lostItems", JSON.stringify(lostItems));
    alert("Lost item submitted");

    var form = document.getElementById("lostForm");
    if (form) {
        form.reset();
    }
}

function submitFound() {
    var nameInput = document.getElementById("foundItem");
    var descriptionInput = document.getElementById("foundDesc");
    var locationInput = document.getElementById("foundLocation");
    var phoneInput = document.getElementById("foundPhone");
    var dateInput = document.getElementById("foundDate");

    if (!nameInput || !descriptionInput || !locationInput || !phoneInput || !dateInput) {
        return;
    }

    var name = nameInput.value.trim();
    var description = descriptionInput.value.trim();
    var location = locationInput.value.trim();
    var contact = phoneInput.value.trim();
    var date = dateInput.value;

    if (!name || !description || !location || !contact || !date) {
        alert("Please fill all fields");
        return;
    }

    if (contact.length !== 10 || isNaN(contact)) {
        alert("Enter a valid 10-digit phone number");
        return;
    }

    var items = getPortalItems();
    var foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
    var matchedItem = null;

    items.forEach(function (item) {
        if (item.name.toLowerCase() === name.toLowerCase() && item.status === "Lost" && !matchedItem) {
            matchedItem = item;
        }
    });

    if (!matchedItem) {
        alert("No matching lost item found on dashboard.");
        return;
    }

    var user = JSON.parse(localStorage.getItem("user"));
    matchedItem.status = "Found";
    matchedItem.description = description;
    matchedItem.contact = contact;
    matchedItem.location = location;
    matchedItem.date = date;
    matchedItem.reportedBy = user && user.name ? user.name : matchedItem.reportedBy;

    savePortalItems(items);
    foundItems.push({
        id: matchedItem.id,
        name: matchedItem.name,
        status: "Found",
        description: matchedItem.description,
        contact: matchedItem.contact,
        location: matchedItem.location,
        date: matchedItem.date,
        reportedBy: user && user.name ? user.name : "Student",
        image: matchedItem.image
    });
    localStorage.setItem("foundItems", JSON.stringify(foundItems));
    alert("Item status updated to Found");

    var form = document.getElementById("foundForm");
    if (form) {
        form.reset();
    }
}

function showGreeting() {
    var user = JSON.parse(localStorage.getItem("user"));
    var greeting = document.getElementById("greeting");
    var welcomeText = document.getElementById("welcomeText");

    if (user && greeting) {
        greeting.innerText = "Hi, " + user.name;
    }

    if (user && welcomeText) {
        welcomeText.innerText = "Welcome back, " + user.name;
    }
}

function openItemDetails(itemId) {
    var items = getPortalItems();
    var selectedItem = null;

    items.forEach(function (item) {
        if (item.id === itemId) {
            selectedItem = item;
        }
    });

    if (selectedItem) {
        localStorage.setItem("selectedItem", JSON.stringify(selectedItem));
        window.location.href = "item-details.html";
    }
}

function createDashboardCard(item) {
    var card = document.createElement("div");
    card.className = "card clickable-card";
    card.onclick = function () {
        openItemDetails(item.id);
    };

    var statusClass = item.status === "Found" ? "status-found" : "status-lost";

    card.innerHTML =
        '<img src="' + item.image + '" alt="' + item.name + '">' +
        '<div class="card-body">' +
        "<h3>" + item.name + "</h3>" +
        '<p class="status-text ' + statusClass + '">Status: ' + item.status + "</p>" +
        "<p>" + item.location + "</p>" +
        "</div>";

    return card;
}

function renderDashboardItems() {
    var container = document.getElementById("dashboardCards");
    if (!container) {
        return;
    }

    var searchInput = document.getElementById("searchInput");
    var filterSelect = document.getElementById("filterSelect");
    var items = getPortalItems();
    var searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var filterValue = filterSelect ? filterSelect.value : "All";

    container.innerHTML = "";

    items.forEach(function (item) {
        var matchesSearch =
            item.name.toLowerCase().includes(searchText) ||
            item.location.toLowerCase().includes(searchText);

        var matchesFilter = filterValue === "All" || item.status === filterValue;

        if (matchesSearch && matchesFilter) {
            container.appendChild(createDashboardCard(item));
        }
    });
}

function setupSearch() {
    var searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", renderDashboardItems);
}

function setupFilterDropdown() {
    var filterSelect = document.getElementById("filterSelect");
    if (!filterSelect) {
        return;
    }

    filterSelect.addEventListener("change", renderDashboardItems);
}

function renderItemDetails() {
    var name = document.getElementById("detailName");
    if (!name) {
        return;
    }

    var item = JSON.parse(localStorage.getItem("selectedItem"));

    if (!item) {
        name.innerText = "No item selected";
        return;
    }

    document.getElementById("detailImage").src = item.image;
    document.getElementById("detailImage").alt = item.name;
    document.getElementById("detailName").innerText = item.name;
    document.getElementById("detailStatus").innerText = item.status;
    document.getElementById("detailDescription").innerText = item.description;
    document.getElementById("detailContact").innerText = item.contact;
    document.getElementById("detailLocation").innerText = item.location;
    document.getElementById("detailPerson").innerText = item.reportedBy;
}

function loadActivity() {
    var lostList = document.getElementById("lostActivityList");
    var foundList = document.getElementById("foundActivityList");
    var userName = document.getElementById("activityUserName");
    var userSap = document.getElementById("activityUserSap");

    if (!lostList || !foundList) {
        return;
    }

    var user = JSON.parse(localStorage.getItem("user"));
    var lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
    var foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
    var userLostItems = [];
    var userFoundItems = [];

    if (user) {
        if (userName) {
            userName.innerText = user.name;
        }

        if (userSap) {
            userSap.innerText = user.sap;
        }
    }

    lostItems.forEach(function (item) {
        if (!user || item.reportedBy === user.name) {
            userLostItems.push(item);
        }
    });

    foundItems.forEach(function (item) {
        if (!user || item.reportedBy === user.name) {
            userFoundItems.push(item);
        }
    });

    renderActivityColumn(lostList, userLostItems);
    renderActivityColumn(foundList, userFoundItems);
}

function renderActivityColumn(container, items) {
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = '<p class="empty-message">No items reported yet</p>';
        return;
    }

    items.forEach(function (item) {
        var card = document.createElement("div");
        card.className = "activity-item";
        card.innerHTML =
            "<p><b>Item:</b> " + item.name + "</p>" +
            "<p><b>Description:</b> " + item.description + "</p>";
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initializeItemsStorage();
    showGreeting();
    setupSearch();
    setupFilterDropdown();
    renderDashboardItems();
    renderItemDetails();
    loadActivity();
});
