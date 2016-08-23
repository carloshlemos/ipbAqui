var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        // app.receivedEvent('deviceready');
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
    },

    onSuccess: function (position) {
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();

        var mapOptions = {
            center: latLong,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        console.info(" ##################### CARREGOU O MAPA #####################");

        var igrejasAPI = "http://191.222.238.253:8080/igrejas?jsoncallback=?";
        
        $.getJSON(igrejasAPI, function (data) {

                var pinColor = "16A085"; // Verde do site da IPB
                var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                    new google.maps.Size(21, 34),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(10, 34));
                var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
                    new google.maps.Size(40, 37),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(12, 35));

                var marker_local_Atual = new google.maps.Marker({
                    position: latLong,
                    map: map,
                    title: 'Meu Local'
                });
                console.info(" ##################### SETOU O LOCAL ATUAL #####################");

                var infowindow = new google.maps.InfoWindow();

                $.each(data, function (i, marker_data) {
                    console.info(" ##################### IGREJA ##################### " + marker_data.nome);
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(marker_data.latitude, marker_data.longitude),
                        map: map,
                        icon: pinImage,
                        title: marker_data.nome,
                        snippet: '<b>Endereço:</b> ' + marker_data.logradouro + ", " + marker_data.complemento + ", " + marker_data.bairro + " - " + marker_data.cidade
                    });

                    var igreja = '<b>Igreja:</b> ' + marker_data.nome;
                    var endereco = '<br><b>Endereço:</b> ' + marker_data.logradouro + ", " + marker_data.complemento + ", " + marker_data.bairro;
                    var cep = '<br><b>Cep:</b> ' + marker_data.cep;
                    var telefone = '<br><b>Telefone:</b> ' + marker_data.telefone;
                    var email = '<br><b>Email:</b> ' + marker_data.email;

                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            infowindow.setContent(igreja + endereco + cep + telefone);
                            infowindow.open(map, marker);
                        }
                    })(marker, i));
                });
            }).done(function () {
                console.log("second success");
            })
            .fail(function (jqxhr, textStatus, error) {
                console.info(" ##################### " + jqxhr + ", " + textStatus + ", " + error + " ##################### ");
            })
            .always(function () {
                console.log("complete");
            });


        function calcRoute(start, end, directionsDisplay, directionsService, map) {
            start = new google.maps.LatLng(37.334818, -121.884886);
            end = new google.maps.LatLng(37.441883, -122.143019);
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(start);
            bounds.extend(end);
            map.fitBounds(bounds);
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            });
        }

    },

    onError: function (error) {
        alert("the code is " + error.code + ". \n" + "message: " + error.message);
    },
};

app.initialize();