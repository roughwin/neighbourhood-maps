var map;

//mvvm 中的model
var model = {
    inputval:ko.observable(),
    items: ko.observableArray(),
    infoWindow: undefined,
    tips: ko.observable(""),
};
ko.applyBindings(model);
/**
 * 加载超时检测
 */
var mapTimeout = setTimeout(function() {
    model.tips("地图加载超时");
}, 5000);
var icon, icon_large;
/**
 * function init()
 * baidu map api 的回调函数，实现了app的初始化
 */
function init() {
    window.clearTimeout(mapTimeout);
    map = new BMap.Map("map");    // 创建Map实例
    initMarker(BMap.Marker.prototype);
    convert(new BMap.Point(120.11222183704376,30.284863403785405), function(data) {
        //set Map
    	map.centerAndZoom(data.points[0], 16);  // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
        map.setCurrentCity("杭州");          // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        loadData(model.items);
    });
    model.infoWindow  = new BMap.InfoWindow();
}

function convert(point,cb) {
    var convertor = new BMap.Convertor();
    var pointArr = [];
    pointArr.push(point);
    convertor.translate(pointArr,3,5,cb);
}
function init0() {
    window.clearTimeout(mapTimeout);
    if(!google.maps){
        console.log('load fail.');
        return;
    }
    var gmaps = google.maps;
    icon = {
        url: "./img/spotlight-poi_hdpi.png",
        size: new gmaps.Size(44, 80),
        origin: new gmaps.Point(0, 0),
        anchor: new gmaps.Point(22/4, 80/4),
        scaledSize: new gmaps.Size(44/4, 80/4)
    };
    icon_large = {
        url: "./img/spotlight-poi_hdpi.png",
        size: new gmaps.Size(44, 80),
        origin: new gmaps.Point(0, 0),
        anchor: new gmaps.Point(22/2, 80/2),
        scaledSize: new gmaps.Size(44/2, 80/2)
    };

    initMarker(gmaps.Marker.prototype);
    map = new gmaps.Map(document.getElementById("map"), {
        center: {lat: 30.286077066609675, lng: 120.11394867673516},
        zoom: 15
    });
    map.addListener("click",function() {
        model.infoWindow.close();
    });
    // model.infoWindow.setOptions({
    //     pixelOffset:new google.maps.Size(0,-10),
    //     // maxWidth: 100,
    // });
    
}
/**
 * function initMarker()
 * 在google.maps.Marker类的基础上进行扩展
 * 添加了Marker的放大缩小功能，infoWindow的弹出功能等
 * @param {*} proto 
 */
function initMarker(proto){
    proto.setLarge = function() {
        this.selected = true;
        this.setAnimation(BMAP_ANIMATION_BOUNCE);
    };
    proto.setNormal = function() {
        this.selected = false;
        this.setAnimation(null);
    };
    proto.setSelect = function(){
        console.log(this.selected);
        window.icon = this.getIcon();
        this.setAnimation(BMAP_ANIMATION_BOUNCE);
    };
    proto.openWindow = function() {
        model.infoWindow.setContent(this.stationInfo);
        this.openInfoWindow(model.infoWindow);
        this.open = true;
    };
    proto.toggleWindow = function() {
        if(this.open){
            this.closeInfoWindow();
            this.open = false;
            return;
        }
        this.openWindow();
    };

}

function toggleside() {    
    $(".container").toggleClass('side-hide');   
}
/**
 * 实现了地图中 Marker的展示。
 * station数据加载完成后调用
 * @param {*} m 
 */
function dispMarker(m) {
    m().forEach(function(marker,i) {
        marker.setMap(map);
    });
}
/**
 * 实现了bus stop信息的查询，完成Marker的初始化
 * @param {*} items 
 * @param {*} callback 
 */
function loadData(items) {
    map.clearOverlays();
    
    var options = {      
        pageCapacity: 10,
        onSearchComplete: onSucess
    };      
    var local = new BMap.LocalSearch(map, options);
    local.searchInBounds("公交站",map.getBounds());
    function onSucess(results) {
        if (local.getStatus() == BMAP_STATUS_SUCCESS){
            // 判断状态是否正确      
            setMarker(results);
            var nextPage = results.getPageIndex()+1;
            if(nextPage < results.getNumPages())
                local.gotoPage(nextPage);
        }
    }
    function setMarker(results) {
        var curPosi;
        for (var i = 0; i < results.getCurrentNumPois(); i++){      
            // s.push(results.getPoi(i).title + ", " + results.getPoi(i).address); 
            curPosi = results.getPoi(i);

            var marker = new BMap.Marker(curPosi.point,{icon: icon});
            marker.title = curPosi.title;
            marker.visible = true;
            marker.selected= false;
            marker.stationInfo = curPosi.address;
            marker.position = curPosi.point;
            marker.open = false;
            marker.addEventListener("click",function(type,target) {
                this.toggleWindow();
            }.bind(marker));
            items.push(marker);
            map.addOverlay(marker);
        }
    }
}


function showList(){
    $(".sidebar ul").addClass("show");
}
function hideList() {
    window.setTimeout(function(){
        $(".show").toggleClass("show");
    },100);
}
function inputChange(m){
    window.clearTimeout(window.keypressTimer);
    window.keypressTimer = window.setTimeout(function() {
        var value = m.inputval();
        var list = m.items().map(function(marker,index) {
            if(marker.title.match(value)){
                marker.visible = true;
                marker.show();
            }else{
                marker.visible = false;
                marker.hide();
            }
            return marker;
        });
        // m.infoWindow.close();
        m.items.removeAll();
        m.items(list);
    },500);
    return true;
}

/**
 * 
 * google map api权限检测
 */
function gm_authFailure() {
    model.tips("Google Map无权访问");
}