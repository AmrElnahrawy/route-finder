// light/dark mode
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-bs-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-bs-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});
//----------------------------------------------------------------------------------
// setting up leaflet map
var map = L.map('map').setView([31.20717, 29.92422], 17);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//----------------------------------------------------------------------------------
// select start/end points
const points = { start: null, end: null };
const colors = { start: '#198754', end: '#dc3545' };
let nextPoint = 'start';          

function setPoint(type, lat, lng) {
    if (points[type]) {
        points[type].setLatLng([lat, lng]);
    } else {
        points[type] = L.circleMarker([lat, lng], {
            radius: 9,
            color: '#fff',
            weight: 2,
            fillColor: colors[type],
            fillOpacity: 1
        }).addTo(map).bindTooltip(type === 'start' ? 'Start' : 'End');
    }
    document.getElementById(`${type}-latitude`).value = lat.toFixed(6);
    document.getElementById(`${type}-longitude`).value = lng.toFixed(6);
}


map.on('click', e => {
    setPoint(nextPoint, e.latlng.lat, e.latlng.lng);
    nextPoint = nextPoint === 'start' ? 'end' : 'start';
});


['start', 'end'].forEach(type => {
    ['latitude', 'longitude'].forEach(axis => {
        document.getElementById(`${type}-${axis}`).addEventListener('change', () => {
            const lat = parseFloat(document.getElementById(`${type}-latitude`).value);
            const lng = parseFloat(document.getElementById(`${type}-longitude`).value);
            if (lat !== null && lng !== null) {
                setPoint(type, lat, lng);
                map.panTo([lat, lng]);
            }
        });
    });
});

function resetPoints() {
    ['start', 'end'].forEach(type => {
        if (points[type]) map.removeLayer(points[type]);
        points[type] = null;
        document.getElementById(`${type}-latitude`).value = '';
        document.getElementById(`${type}-longitude`).value = '';
    });
    nextPoint = 'start';
}
//----------------------------------------------------------------------------------
// run/reset buttons
const runButton = document.getElementById('run');
const resetButton = document.getElementById('reset');

runButton.addEventListener('click', () => {
  runButton.disabled = true;
});

resetButton.addEventListener('click', () => {
  resetPoints();
  runButton.disabled = false;
});