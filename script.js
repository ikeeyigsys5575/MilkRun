
const asRoutes = {
    as61: "SEA>JNU>YAK>CDV>ANC",
    as62: "FAI>ANC>JNU>SIT>KTN>SEA",
    as64: "ANC>JNU>PSG>WRG>KTN>SEA",
    as65: "SEA>KTN>WRG>PSG>JNU>ANC",
    as66: "ANC>CDV>YAK>JNU>SEA",
    as67: "SEA>KTN>SIT>JNU>ANC"
}

var asSaveCount = 0;

function routeChange(flightNumber) {
    console.log("routechange called with flightNumber: " + flightNumber);

    document.getElementById('route').innerHTML = asRoutes[flightNumber];

    departureDateChange('AS');
}

function departureDateChange(carrier) {
    const departureDate = document.getElementById('asdeparturedatepicker').value;

    if (!departureDate) {
        console.error("No departure date selected.");
        return;
    }

    console.log(carrier);
    const award = document.getElementById('asawardcheckbox').checked;

    var bookingLink = buildUrl(carrier, document.getElementById('route').textContent, departureDate, award);

    document.getElementById('asopenlink').href = bookingLink;
    document.getElementById('asdeparturebutton').disabled = false;

    document.getElementById('aslinkbox').textContent = bookingLink;
    document.getElementById('aslinkbox').hidden = false;

    if (typeof (Storage) !== "undefined") {
        document.getElementById('assavelinkbutton').hidden = false;
    }

}

function buildUrl(carrier, route, departureDate, award) {
    if (carrier == 'AS') {
        const baseUrl = "https://www.alaskaair.com/search/results?";
        const suffix = "&A=1&RT=false&ShoppingMethod=multicity";
        const airports = route.split(">");
        const segmentWarningElement = document.getElementById('segmentwarning');

        var airportString = "";

        for (var i = 0; i < airports.length - 1; i++) {
            if (i == 0) {
                airportString += "O=" + airports[i] + "&D=" + airports[i + 1] + "&OD=" + departureDate;
            } else {
                airportString += "&O" + (i + 1) + "=" + airports[i] + "&D" + (i + 1) + "=" + airports[i + 1] + "&OD" + (i + 1) + "=" + departureDate;
            }
        }

        if (award) {
            airportString += "&RequestType=AwardMatrix";
        }

        if (airports.length > 5) {
            segmentWarningElement.textContent = `Alaska only allows bookings of up to 4 segments. The segment ${airports[4]} to ${airports[5]} will be omitted.`;
        } else {
            segmentWarningElement.textContent = " ";
        }

        return baseUrl + airportString + suffix;
    }
}

function saveLink(carrier) {
    if (carrier == 'AS') {

        for (var i = 0; i < asSaveCount; i++) { 
            if (localStorage.getItem(`asSaveLink${i}`) === document.getElementById('aslinkbox').textContent) {
                return;
            }
        }
        localStorage.setItem(`asSaveLink${asSaveCount}`, document.getElementById('aslinkbox').textContent);
        localStorage.setItem(`asSaveDate${asSaveCount}`, document.getElementById('asdeparturedatepicker').value);
        localStorage.setItem(`asSaveRoute${asSaveCount}`, document.getElementById('route').textContent);
        localStorage.setItem(`asSaveAward${asSaveCount}`, document.getElementById('asawardcheckbox').checked);

        asSaveCount++;

        localStorage.setItem("asSaveCount", asSaveCount);

        loadSaves('AS');
    }
}

function loadSaves(carrier) {
    if (carrier == 'AS') {
        document.getElementById('ascardcontainer').innerHTML = "";
        for (var i = 0; i < asSaveCount; i++) {
            const link = localStorage.getItem(`asSaveLink${i}`);
            const date = localStorage.getItem(`asSaveDate${i}`);
            const route = localStorage.getItem(`asSaveRoute${i}`);
            const award = localStorage.getItem(`asSaveAward${i}`);
            document.getElementById('ascardcontainer').innerHTML += createCard(link, date, route, award);
        }
    }
}

function createCard(link, date, route, award) {

    if (award === 'true') {
        route += " (Award)";
    }

    var segmentWarningElement = ``;

    if (route.split(">").length > 5) {
        segmentWarningElement = `<p class="text-warning">Alaska only allows bookings of up to 4 segments. The last segment will be omitted</p>`;
    }

    return `<div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${route}</h5>
                    <p class="card-text">${date}</p>
                    ${segmentWarningElement}
                    <a href="${link}" class="btn btn-primary float-end" target="_blank">View options</a>
                </div>
            </div>`;
}

// todo: dynamic time zone based on departure airport, is currently based off PST

var minDate = new Date();
const offset = minDate.getTimezoneOffset();
minDate = new Date(minDate.getTime() - (offset * 60 * 1000) - (8 * 60 * 60 * 1000));

document.getElementById('asdeparturedatepicker').setAttribute('min', minDate.toISOString().split('T')[0]);

if (typeof (Storage) !== "undefined") {
    if (localStorage.getItem("asSaveCount")) {
        asSaveCount = parseInt(localStorage.getItem("asSaveCount"));

        if (document.getElementById('as-tab').classList.contains('active')) {

            loadSaves('AS');
        }
    } else {
        localStorage.setItem("asSaveCount", asSaveCount);
    }

    console.log(asSaveCount);
}

window.onload = function () {
    if (document.getElementById('as-tab').classList.contains('active')) {
        console.log("AS tab is checked");
        departureDateChange('AS');
    } else if (document.getElementById('ua-tab').classList.contains('active')) {
        departureDateChange('UA');
    }
}

