
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

// todo: dynamic time zone based on departure airport, is currently based off PST

var minDate = new Date();
const offset = minDate.getTimezoneOffset();
minDate = new Date(minDate.getTime() - (offset*60*1000) - (8*60*60*1000));

document.getElementById('asdeparturedatepicker').setAttribute('min', minDate.toISOString().split('T')[0]);