
const asRoutes = {
    as61: "SEA>JNU>YAK>CDV>ANC",
    as62: "FAI>ANC>JNU>SIT>KTN>SEA",
    as64: "ANC>JNU>PSG>WRG>KTN>SEA",
    as65: "SEA>KTN>WRG>PSG>JNU>ANC",
    as66: "ANC>CDV>YAK>JNU>SEA",
    as67: "SEA>KTN>SIT>JNU>ANC"
}



function routeChange(flightNumber) {
    console.log("routechange called with flightNumber: " + flightNumber);

    document.getElementById('route').innerHTML = asRoutes[flightNumber];
}

function departureDateChange(carrier) {
    const departureDate = document.getElementById('asdeparturedatepicker').value;
    
    console.log("date changed")
    console.log(carrier)
    console.log(buildUrl(carrier, document.getElementById('route').textContent, departureDate));
}

function buildUrl(carrier, route, departureDate) {
    if (carrier === 'AS') {
        const baseUrl = "https://www.alaskaair.com/search/results?";
        const suffix = "&A=1&RT=false&ShoppingMethod=multicity";
        const airports = route.split(">");
        var airportsString = "";

        for (var i = 0; i < airports.length-1; i++) {
            if (i == 0) {
                airportString += "O=" + airports[i] + "&D=" + airports[i+1] + "&OD=" + departureDate;
            } else {
                airportString += "&O" + (i+1) + "=" + airports[i] + "&D" + (i+1) + "=" + airports[i+1] + "&OD" + (i+1) + "=" + departureDate;
            }
        }

        return baseUrl + airportsString + suffix;
    }
}

// todo: dynamic time zone based on departure airport, is currently based off PST

var minDate = new Date();
const offset = minDate.getTimezoneOffset();
minDate = new Date(minDate.getTime() - (offset*60*1000) - (8*60*60*1000));

document.getElementById('asdeparturedatepicker').setAttribute('min', minDate.toISOString().split('T')[0]);