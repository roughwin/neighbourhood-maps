var w = window;
var model = ko.observableArray();
function initMap() {
    w.map = new google.maps.Map(document.getElementById('map'), {
        center:  {lat: 30.284863403785405, lng: 120.11222183704376},
        zoom: 15
    });
    map.addListener('click', function(e) {
        // placeMarkerAndPanTo(e.latLng, map);
        console.log({lat:e.latLng.lat(),lng:e.latLng.lng()})
    });

    drawmark();
}

function drawmark() {
    var mark =  {lat: 30.284863403785405, lng: 120.11222183704376}
    window.markers = [];
    var request = {
        location: {lat: 30.284863403785405, lng: 120.11222183704376},
        radius: '500',
        query: 'bus stop'
    };
    var service = new google.maps.places.PlacesService(w.map);
    service.textSearch(request, function(result, status){
        // var re = result.map(function(e,i){
        //     return {lat: e.geometry.location.lat(), lng: e.geometry.location.lng()}
        // })
        window.result = result;
        result.forEach(function(e,i) {
            var marker = new google.maps.Marker({
                position: {lat: e.geometry.location.lat(), lng: e.geometry.location.lng()},
                map: w.map,
                title: e.name
            })
            model.push(marker);
            console.log(e);
        })
        ko.applyBindings(model);

        $('#address').val(markers.length);
    });

}

//AIzaSyAGnhR_0_6K7xOjz3Jy15uoz06JlTi6mME