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

function submitLost() {
    var itemInput = document.getElementById("lostItem");
    var descInput = document.getElementById("lostDesc");

    if (!itemInput || !descInput) {
        return;
    }

    var item = itemInput.value.trim();
    var desc = descInput.value.trim();

    if (!item || !desc) {
        alert("Please fill all fields");
        return;
    }

    var data = JSON.parse(localStorage.getItem("lostItems")) || [];
    data.push({ type: "Lost", item: item, desc: desc });
    localStorage.setItem("lostItems", JSON.stringify(data));
    alert("Lost item submitted");
}

function submitFound() {
    var itemInput = document.getElementById("foundItem");
    var descInput = document.getElementById("foundDesc");

    if (!itemInput || !descInput) {
        return;
    }

    var item = itemInput.value.trim();
    var desc = descInput.value.trim();

    if (!item || !desc) {
        alert("Please fill all fields");
        return;
    }

    var data = JSON.parse(localStorage.getItem("foundItems")) || [];
    data.push({ type: "Found", item: item, desc: desc });
    localStorage.setItem("foundItems", JSON.stringify(data));
    alert("Found item submitted");
}

document.addEventListener("DOMContentLoaded", function () {
    showGreeting();
    loadActivity();
    setupLostFoundForm();
    setupLostFormApi();
    loadRemoteLostItems();
});

function showGreeting() {
    var user = JSON.parse(localStorage.getItem("user"));
    var greeting = document.getElementById("greeting");

    if (user && greeting) {
        greeting.innerText = "Hi, " + user.name;
    }
}

function loadActivity() {
    var list = document.getElementById("activityList");

    if (!list) {
        return;
    }

    var lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
    var foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
    var allItems = lostItems.concat(foundItems);

    list.innerHTML = "";

    allItems.forEach(function (entry) {
        var status = entry.status || entry.type || "Item";
        var title = entry.title || entry.item || "Unnamed item";
        var description = entry.description || entry.desc || "";

        var div = document.createElement("div");
        div.style.margin = "10px";
        div.innerHTML = "<b>" + status + "</b>: " + title + " - " + description;
        list.appendChild(div);
    });
}

function setupLostFoundForm() {
    var form = document.querySelector("form");
    var message = document.getElementById("message");
    var titleInput = document.getElementById("title");
    var descriptionInput = document.getElementById("description");
    var categoryInput = document.getElementById("category");
    var statusInput = document.getElementById("status");
    var locationInput = document.getElementById("location");
    var dateInput = document.getElementById("date");
    var contactInput = document.getElementById("contact");

    if (
        !form ||
        !message ||
        !titleInput ||
        !descriptionInput ||
        !categoryInput ||
        !statusInput ||
        !locationInput ||
        !dateInput ||
        !contactInput
    ) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var title = titleInput.value.trim();
        var description = descriptionInput.value.trim();
        var category = categoryInput.value.trim();
        var status = statusInput.value.trim();
        var location = locationInput.value.trim();
        var date = dateInput.value.trim();
        var contact = contactInput.value.trim();

        message.textContent = "";
        message.style.color = "red";

        if (!title || !description || !category || !status || !location || !date || !contact) {
            message.textContent = "Please fill in all fields.";
            return;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var phonePattern = /^\d{10}$/;

        if (!emailPattern.test(contact) && !phonePattern.test(contact)) {
            message.textContent = "Please enter a valid email address or 10-digit phone number.";
            return;
        }

        var data = {
            title: title,
            description: description,
            category: category,
            status: status,
            location: location,
            date: date,
            contact: contact
        };

        fetch("http://localhost:3000/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                if (!response.ok) {
                    return response.json()
                        .then(function (errorData) {
                            throw new Error(errorData.message || "Failed to submit item.");
                        })
                        .catch(function () {
                            throw new Error("Failed to submit item.");
                        });
                }

                return response.json().catch(function () {
                    return {};
                });
            })
            .then(function () {
                var storageKey = status === "Lost" ? "lostItems" : "foundItems";
                var savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
                savedItems.push(data);
                localStorage.setItem(storageKey, JSON.stringify(savedItems));

                message.style.color = "green";
                message.textContent = "Item submitted successfully";
                form.reset();
            })
            .catch(function (error) {
                message.style.color = "red";
                message.textContent = error.message || "Something went wrong. Please try again.";
            });
    });
}

function setupLostFormApi() {
    var lostForm = document.getElementById("lostForm");
    var itemInput = document.getElementById("item");
    var descInput = document.getElementById("desc");
    var locationInput = document.getElementById("location");

    if (!lostForm || !itemInput || !descInput || !locationInput) {
        return;
    }

    lostForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var item = itemInput.value.trim();
        var description = descInput.value.trim();
        var location = locationInput.value.trim();

        fetch("http://localhost:5000/addLost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                item: item,
                description: description,
                location: location
            })
        })
            .then(function (response) {
                return response.text();
            })
            .then(function () {
                alert("Item added successfully!");
            })
            .catch(function () {
                alert("Could not submit the item.");
            });
    });
}

function loadRemoteLostItems() {
    var container = document.getElementById("items");

    if (!container) {
        return;
    }

    fetch("http://localhost:5000/getLostItems")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            container.innerHTML = "";

            data.forEach(function (item) {
                var div = document.createElement("div");
                div.innerHTML =
                    "<h3>" + item.item_name + "</h3>" +
                    "<p>" + item.description + "</p>" +
                    "<p><b>Location:</b> " + item.location + "</p><hr>";
                container.appendChild(div);
            });
        })
        .catch(function () {
            container.innerHTML = "<p>Could not load items.</p>";
        });
}
