function login() {
    let sap = document.getElementById("sap").value;
    let name = document.getElementById("name").value;

    if (!sap || !name) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("user", JSON.stringify({ sap, name }));
    window.location.href = "dashboard.html";
}

/* LOST */
function submitLost() {
    let item = document.getElementById("lostItem").value;
    let desc = document.getElementById("lostDesc").value;

    let data = JSON.parse(localStorage.getItem("lostItems")) || [];
    data.push({ type: "Lost", item, desc });

    localStorage.setItem("lostItems", JSON.stringify(data));
    alert("Lost item submitted");
}

/* FOUND */
function submitFound() {
    let item = document.getElementById("foundItem").value;
    let desc = document.getElementById("foundDesc").value;

    let data = JSON.parse(localStorage.getItem("foundItems")) || [];
    data.push({ type: "Found", item, desc });

    localStorage.setItem("foundItems", JSON.stringify(data));
    alert("Found item submitted");
}

/* GREETING + ACTIVITY */
window.onload = function () {
    let user = JSON.parse(localStorage.getItem("user"));
    let greet = document.getElementById("greeting");

    if (user && greet) {
        greet.innerText = "Hi, " + user.name;
    }

    let list = document.getElementById("activityList");

    if (list) {
        let lost = JSON.parse(localStorage.getItem("lostItems")) || [];
        let found = JSON.parse(localStorage.getItem("foundItems")) || [];

        list.innerHTML = "";

        [...lost, ...found].forEach(entry => {
            let div = document.createElement("div");
            div.style.margin = "10px";
            div.innerHTML = `<b>${entry.type}</b>: ${entry.item} - ${entry.desc}`;
            list.appendChild(div);
        });
    }
};
document.getElementById("lostForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const item = document.getElementById("item").value;
    const description = document.getElementById("desc").value;
    const location = document.getElementById("location").value;

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
    .then(res => res.text())
    .then(data => {
        alert("Item added successfully!");
    });
});
fetch("http://localhost:5000/getLostItems")
.then(res => res.json())
.then(data => {
    const container = document.getElementById("items");

    data.forEach(item => {
        const div = document.createElement("div");

        div.innerHTML = `
            <h3>${item.item_name}</h3>
            <p>${item.description}</p>
            <p><b>Location:</b> ${item.location}</p>
            <hr>
        `;

        container.appendChild(div);
    });
});