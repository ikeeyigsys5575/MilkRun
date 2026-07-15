
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

    if (typeof(Storage) !== "undefined") {
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

        for (var i = 0; i < airports.length-1; i++) {
            if (i == 0) {
                airportString += "O=" + airports[i] + "&D=" + airports[i+1] + "&OD=" + departureDate;
            } else {
                airportString += "&O" + (i+1) + "=" + airports[i] + "&D" + (i+1) + "=" + airports[i+1] + "&OD" + (i+1) + "=" + departureDate;
            }
        }

        if (award) {
            airportString += "&RequestType=AwardMatrix";
        }

        if (airports.length > 5) {
            segmentWarningElement.textContent = `Alaska only allows bookings of up to 4 segments. The segment ${airports[4]} to ${airports[5]} will be ommitted.`;
        } else {
            segmentWarningElement.textContent = " ";
        }

        return baseUrl + airportString + suffix;
    }
}

function saveLink(carrier) {
    if (carrier == 'AS') {
        localStorage.setItem(`asSaveLink${asSaveCount}`, document.getElementById('aslinkbox').textContent);
        localStorage.setItem(`asSaveDate${asSaveCount}`, document.getElementById('asdeparturedatepicker').value);
        localStorage.setItem(`asSaveRoute${asSaveCount}`, document.getElementById('route').textContent);
        
        asSaveCount++;
        
        localStorage.setItem("asSaveCount", asSaveCount);
    }
}

// todo: dynamic time zone based on departure airport, is currently based off PST

var minDate = new Date();
const offset = minDate.getTimezoneOffset();
minDate = new Date(minDate.getTime() - (offset*60*1000) - (8*60*60*1000));

document.getElementById('asdeparturedatepicker').setAttribute('min', minDate.toISOString().split('T')[0]);

if (typeof(Storage) !== "undefined") {
    if (localStorage.getItem("asSaveCount")) {
        asSaveCount = parseInt(localStorage.getItem("asSaveCount"));
    } else {
        localStorage.setItem("asSaveCount", asSaveCount);
    }

    console.log(asSaveCount);
}


if (document.getElementById('as-tab').classList.contains('active')) { 
    console.log("AS tab is checked");
    departureDateChange('AS');
} else if (document.getElementById('ua-tab').classList.contains('active')) {
    departureDateChange('UA');
}