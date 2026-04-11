function login() {
    let sap = document.getElementById('sap').value;
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;

    if (sap && name && password) {
        localStorage.setItem('user', JSON.stringify({sap, name}));
        window.location.href = 'dashboard.html';
    } else {
        alert('Please fill all fields');
    }
}

function submitLost() {
    let item = document.getElementById('lostItem').value;
    let desc = document.getElementById('lostDesc').value;

    let data = JSON.parse(localStorage.getItem('lostItems')) || [];
    data.push({type: 'Lost', item, desc});
    localStorage.setItem('lostItems', JSON.stringify(data));

    alert('Lost item submitted');
}

function submitFound() {
    let item = document.getElementById('foundItem').value;
    let desc = document.getElementById('foundDesc').value;

    let data = JSON.parse(localStorage.getItem('foundItems')) || [];
    data.push({type: 'Found', item, desc});
    localStorage.setItem('foundItems', JSON.stringify(data));

    alert('Found item submitted');
}

window.onload = function () {
    let user = JSON.parse(localStorage.getItem('user'));
    let greet = document.getElementById('greeting');

    if (user && greet) {
        greet.innerText = "Hi, " + user.name;
    }

    let list = document.getElementById('activityList');

    if (list) {
        let lost = JSON.parse(localStorage.getItem('lostItems')) || [];
        let found = JSON.parse(localStorage.getItem('foundItems')) || [];

        let all = [...lost, ...found];

        if (all.length === 0) {
            list.innerHTML = "<p>No activity yet.</p>";
            return;
        }

        all.forEach(entry => {
            let card = document.createElement('div');
            card.className = 'activity-card';

            card.innerHTML = `
                <h3>${entry.type}</h3>
                <p><b>Item:</b> ${entry.item}</p>
                <p><b>Description:</b> ${entry.desc}</p>
            `;

            list.appendChild(card);
        });
    }
};