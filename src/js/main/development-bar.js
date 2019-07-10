import getTimeLeftString from "./timer-helper";

export default function developmentBar(api, mapDTO, map) {
    document.querySelector("#mapName").innerHTML = 'Map: ' + mapDTO.Name;
    document.querySelector("#employeeName").innerHTML = 'User: ' + mapDTO.Employee.Name;
    userTokenExpiresUpdate(api);
    map.on('zoomend', function () {
            document.querySelector("#currentZoom").innerHTML = 'Zoom: ' + Math.round(map.getZoom() * 100) / 100;
        }
    );
}

let userTokenExpiresUpdate = function (api) {
    let callback = function() {
        document.querySelector("#userTokenExpires").innerHTML = 'Timeout: ' + getTimeLeftString(api.user.msLeft);
    };
    callback();
    window.setInterval(callback, 1000);
};