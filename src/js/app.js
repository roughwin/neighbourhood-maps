var w = window;
var stops = [];
var map;
var model = {
    inputval:ko.observable(),
    items: ko.observableArray(),
    infoWindow: undefined
}
// var model = new function() {
//     this.inputval = ko.observable();
//     this.items = ko.observableArray();
//     this.test = ko.computed(function() {
//         return 'test: ' + this.inputval()
//     },this)
// }

var icon, icon_large;
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
    google.maps.Marker.prototype.setLarge = function() {
        this.selected = true;
        this.setSelect();
    }
    google.maps.Marker.prototype.setNormal = function() {
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
    google.maps.Marker.prototype.openWindow = function() {
        model.infoWindow.close();
        model.infoWindow.open(map);
        model.infoWindow.setContent( this.stationInfo)
        model.infoWindow.setPosition(this.position)
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.286077066609675, lng: 120.11394867673516},
        zoom: 15
    });
    map.addListener('click',function() {
        model.infoWindow.close()
    })
    model.infoWindow  = new google.maps.InfoWindow();

    loadData(model.items,function(m){
        // loadDetail(m);
        var list = m().map(function(e,i) {
            return e.title;
        })
        // console.log(list)
        getDetail(list, function(response){
            m(m().map(function(e,i){
                e.stationInfo = response[e.title]
                return e
            }))
        })
        dispMarker(model.items);
    }.bind(null, model.items));
    
}
// function closeWindow(){
//     model.items().forEach(function(e){
//         e.infoWindow.close();
//     })
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
                zIndex: 1,
                selected: false,
                stationInfo: 'loading..'
            })
            marker.addListener('click', marker.openWindow)
            items.push(marker);
        })
        callback();
        ko.applyBindings(model);

    });
}


function inputChange(m){
    var value = m.inputval();
    var list = m.items().map(function(marker,index) {
        if(marker.title.match(value)){
            marker.visible = true;
        }else{
            marker.visible = false;
        }
        marker.setMap(map);
        return marker
    });
    m.items.removeAll();
    m.items(list);
}
function getDetail(list, callback){
    var xhr = new XMLHttpRequest();
    xhr.timeout = 3000;
    xhr.responseType = "";
    xhr.onload = function(){
        // window.res = this
        // console.log(JSON.parse(this.responseText))
        callback(JSON.parse(this.responseText));
    }

    var data = {'city': "杭州",s:list};
    xhr.open('post','http://busapi.applinzi.com/api',true) 
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded'); 

    xhr.send(encodeFormData(data));
    // ontimeout = this.ontimeout.bind(this.xhr)
    // onerror = this.onerror.bind(this.xhr)
    
}
function encodeFormData(data){
    if(!data) return '';
    var pairs = [];
    for(var name in data){
        if(!data.hasOwnProperty(name)) continue;
        if(typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name.replace('%20','+'));
        value = encodeURIComponent(value.replace('%20','+'));
        pairs.push(name+'='+value);
    }
    return pairs.join('&');
}
