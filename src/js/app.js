var w = window;
var stops = [];
var map;
var model = {
    inputval:ko.observable(),
    items: ko.observableArray()
}
//ko.observableArray();
var icon, icon_large;
  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };
function init() {
    icon = {
        url: './img/spotlight-poi_hdpi.png',
        size: new google.maps.Size(44, 80),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(22/4, 80/4),
        scaledSize: new google.maps.Size(44/4, 80/4)
    };
    icon_large = {
        url: './img/spotlight-poi_hdpi.png',
        size: new google.maps.Size(44, 80),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(22/2, 80/2),
        scaledSize: new google.maps.Size(44/2, 80/2)
    };
    google.maps.Marker.prototype.mouseover = function() {
        this.selected = true;
        this.setSelect();
    }
    google.maps.Marker.prototype.mouseout = function() {
        this.selected = false;
        this.setSelect();
    }
    google.maps.Marker.prototype.setSelect = function(){
        if(this.selected){
            this.setIcon(icon_large);
            return;
        }
        this.setIcon(icon);     
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.286077066609675, lng: 120.11394867673516},
        zoom: 15
    });
    loadData(model.items,function(m){
        // loadDetail(m);
        dispMarker(model.items);
    });
    
}

// function initMap(map, center){
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: center,
//         zoom: 15
//     });
//     // map.addListener('click', function(e) {
//     //     console.log({lat: e.latLng.lat(), lng: e.latLng.lng()})
//     // })
// }
function render(m){
    m(m());
    m().forEach(function(e){
        e.setSelect()
    })
}
function dispMarker(m) {
    m().forEach(function(marker,i) {
        marker.setMap(map);
    })
}
function loadDetail(m) {
    var query = [];
    m().forEach(function(station,i) {
        query.push(station.title);
    })
    var apiurl = ''+query.join('+')
    $.ajax({
        type: "GET",
        url: apiurl,
        contentType:"application/json",
        success: function (result, status){
            // console.log(status)
            // console.dir(result);

        }
    });
}
function loadData(items,callback){   
    var service = new google.maps.places.PlacesService(map);
    var request = {
        location: {lat: 30.284863403785405, lng: 120.11222183704376},
        radius: '500',
        query: 'bus stop'
    };
    service.textSearch(request, function(result, status){
        items.removeAll();
        result.forEach(function(e,i) {
            var marker = new google.maps.Marker({
                position: {lat: e.geometry.location.lat(), lng: e.geometry.location.lng()},
                title: e.name,
                icon: icon,
                visible: i%2?true:false,
                zIndex: 1,
                selected: false
            })
            items.push(marker);
        })
        callback();
                ko.applyBindings(model);

    });
}

// $('#filter').change(function(e){
//     var value = e.target.value;
//     model.items(model.items().map(function(marker,index) {
//         if(marker.title.match(value)){
//             marker.visible = true;
//         }else{
//             marker.visible = false;
//         }
//         marker.setMap(map);
//         return marker
//     }));
// })
function inputChange(m){
    var value = m.inputval();
    // console.log(value)
    var list = model.items().map(function(marker,index) {
        if(marker.title.match(value)){
            marker.visible = true;
            marker.title0 = 'val';
        }else{
            marker.visible = false;
            marker.title0 = 'val'
        }
        marker.setMap(map);
        return marker
    });
    // window.list = list
    // console.log(list)
    model.items.removeAll();
    model.items(list);
}
$.ajax({
       type: "GET",
       url: juhe_url,
       contentType:"application/json",
       success: function (result, status){
           console.log(status)
           console.dir(result);
       }
});
