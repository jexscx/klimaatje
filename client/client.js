/*------------------------------Current location---------------------------------------*/
var socket = io();

setInterval(function () {
    getLocation();
}, 9000);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}
function showPosition(position) {
    let currLat = position.coords.latitude;
    currLat = currLat.toFixed(2);
    let currLon = position.coords.longitude;
    currLon = currLon.toFixed(2);
    console.log("Current Latitude: " + currLat +
        " Current Longitude: " + currLon)
    weatherData();
}


/*---------------------------Buienradar API-----------------------------*/
async function weatherData() {
    console.log('in de weatherdata api check!');

    let weatherMainDesc = "";
    let weatherTemp = "";
    let lang = "nl";

    // API url voor actuele weerdata
    const api_url = `http://api.openweathermap.org/data/2.5/weather?q=Edinburgh&&units=metric&lang=${lang}&appid=5b63afb9ed6a8c7f7a26bc666ca83c82`;
    //`http://api.openweathermap.org/data/2.5/weather?lat=${currLat}&lon=${currLon}&units=metric&lang=${lang}&appid=5b63afb9ed6a8c7f7a26bc666ca83c82`;
    const response = await fetch(api_url);

    // Doet data in een constante variable data zetten
    const data = await response.json();
    weatherTemp = data.main.temp;
    weatherMainDesc = data.weather[0].main;
    console.log(weatherTemp + " graden celcius");
    console.log(weatherMainDesc);

    // verzend de temperatuur naar de websocket, om het te gebruiken bij de Arduino
    socket.emit('weatherDescription', data.weather[0].main);
}




