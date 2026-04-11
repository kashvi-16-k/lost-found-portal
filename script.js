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

window.onload = function() {
    let list = document.getElementById('activityList');
    if (list) {
        let lost = JSON.parse(localStorage.getItem('lostItems')) || [];
        let found = JSON.parse(localStorage.getItem('foundItems')) || [];

        [...lost, ...found].forEach(entry => {
            let div = document.createElement('div');
            div.innerHTML = `<b>${entry.type}:</b> ${entry.item} - ${entry.desc}`;
            list.appendChild(div);
        });
    }
}
