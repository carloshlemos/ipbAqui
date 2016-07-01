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

        var mapOptions = {
            center: latLong,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        console.info(" ##################### CARREGOU O MAPA #####################");

        $.getJSON("ajax/igrejas.json", function (data) {
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
            });;
    },

    onError: function (error) {
        alert("the code is " + error.code + ". \n" + "message: " + error.message);
    },
};

app.initialize();