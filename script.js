function login() {
    var sapInput = document.getElementById("sap");
    var nameInput = document.getElementById("name");

    if (!sapInput || !nameInput) return;

    var sap = sapInput.value.trim();
    var name = nameInput.value.trim();

    // SAP validation
    if (sap.length !== 11 || isNaN(sap)) {
        alert("SAP ID must be 11 digits");
        return;
    }

    if (!sap || !name) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("user", JSON.stringify({ sap: sap, name: name }));
    window.location.href = "dashboard.html";
}

/* ================= LOST ================= */

function submitLost() {
    var item = document.getElementById("lostItem").value.trim();
    var desc = document.getElementById("lostDesc").value.trim();
    var phone = document.getElementById("lostPhone").value.trim();
    
    if (!item || !desc) {
        alert("Please fill all fields");
        return;
    }


    if (phone.length !== 10 || isNaN(phone)) {
        alert("Enter a valid 10-digit phone number");
        return;
    }

    var data = JSON.parse(localStorage.getItem("lostItems")) || [];
    data.push({ type: "Lost", item: item, desc: desc });
    localStorage.setItem("lostItems", JSON.stringify(data));

    alert("Lost item submitted");

    // ✅ clear form properly
    var form = document.getElementById("lostForm");
    if (form) form.reset();
}

/* ================= FOUND ================= */

function submitFound() {
    var item = document.getElementById("foundItem").value.trim();
    var desc = document.getElementById("foundDesc").value.trim();
    var phone = document.getElementById("foundPhone").value.trim();

    if (!item || !desc) {
        alert("Please fill all fields");
        return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
        alert("Enter a valid 10-digit phone number");
        return;
    }

    var data = JSON.parse(localStorage.getItem("foundItems")) || [];
    data.push({ type: "Found", item: item, desc: desc });
    localStorage.setItem("foundItems", JSON.stringify(data));

    alert("Found item submitted");

    // ✅ clear form properly
    var form = document.getElementById("foundForm");
    if (form) form.reset();
}

/* ================= LOAD ================= */

document.addEventListener("DOMContentLoaded", function () {
    showGreeting();
    loadActivity();
});

/* ================= GREETING ================= */

function showGreeting() {
    var user = JSON.parse(localStorage.getItem("user"));
    var greeting = document.getElementById("greeting");
    var welcome = document.getElementById("welcomeText");

    if (user) {
        if (greeting) greeting.innerText = "Hi, " + user.name;
        if (welcome) welcome.innerText = "Welcome back, " + user.name;
    }
}

/* ================= ACTIVITY ================= */

function loadActivity() {
    var list = document.getElementById("activityList");
    if (!list) return;

    var lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
    var foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
    var allItems = lostItems.concat(foundItems);

    list.innerHTML = "";

    allItems.forEach(function (entry) {
        var div = document.createElement("div");
        div.style.margin = "10px";
        div.innerHTML = "<b>" + entry.type + "</b>: " + entry.item + " - " + entry.desc;
        list.appendChild(div);
    });
}