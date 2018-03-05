/**
 * Created by Dell on 2016/11/7.
 */
    // 图例基类
L.Control.Legend =  L.Control.extend({
    options: {
        position: 'topright' //初始位置
    },
    onShow:function(map){
        map.addControl(this);
    },
    onHidden:function(map){
        map.removeControl(this);
    }
});

// 创建雨量图例
L.Control.RainLegend = L.Control.Legend.extend({
    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'rainlegend');
        this._container.innerHTML =
            '<ul><li>0~30mm</li>' +
            '<li>30~50mm</li>' +
            '<li>50~80mm</li>' +
            '<li>80~100mm</li>' +
            '<li>100mm以上</li>' +
            '</ul>';
        return this._container;
    }
});
L.control.rainLegend = function(){
    return new L.Control.RainLegend();
};

// 创建水情图例
L.Control.WaterLegend = L.Control.Legend.extend({
    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'waterlegend');
        this._container.innerHTML =
            '<ul><li>超汛限</li>' +
            '<li>超警戒</li>' +
            '<li>超保证</li>' +
            '<li>一般站</li></ul>';
        return this._container;
    }
});
L.control.waterLegend = function(){
    return new L.Control.WaterLegend();
};

// 水雨情信息基类
L.Class.FloodInfo = L.Class.extend({

    _jsonData:null,     // 地图数据
    _map:null,          // 地图引用
    _pointLayer:null,   //点图层
    _legendLayer:null,  // 图例图层
    _isVisible:false,   // 图层是否可见
    _CenterPoint:null,  // 地图中心点
    _ShowNoteLevle:13,   //当等级大于4时显示
    // 查看当前图层是否可见
    isVisible:function(){
        return this._isVisible;
    },

    // 图层缩放时
    _mapZoomend: function() {
        // 图标标注的显示与隐藏
        {
            //console.log("0000000000000000");

            if (this.getZoom() >= this._ShowNoteLevle) {
                //console.log(layer);
                //console.log(this._curLayer);
                this._curLayer.eachLayer(function (layer) {
                    layer.openTooltip();
                    //console.log(layer);
                    layer.on("mouseout", function () {
                        this.openTooltip()

                    });
                });
            }
            else {
                this._curLayer.eachLayer(function (layer) {
                    layer.closeTooltip();
                    //console.log(layer);
                    layer.on("mouseout", function () {
                        this.closeTooltip()
                    });
                });
            }
            //this.update();

        }
    },

    // 显示图层
    showLayer : function () {
        this._map._curLayer = this._pointLayer;
        //this._map.on("zoomend",this._mapZoomend);
        this._map.fire("zoomend");
        if (this._isVisible) return;
        this._map.addLayer(this._pointLayer);//地图站点显示
        if(this._CenterPoint!=null) this._map.panTo(this._CenterPoint);
        if(this._legendLayer!=null)this._legendLayer.onShow(this._map);// 图例显示
        this._isVisible = true;

    },

    // 隐藏图层
    hiddenLayer:function () {
        this._map.fire("zoomend");
        if (!this._isVisible) return;
        this._map.removeLayer(this._pointLayer);// 地图站点隐藏
        if(this._legendLayer!=null)this._legendLayer.onHidden(this._map);// 图例隐藏
        this._isVisible = false;
    },
    //初始化
    init : function (map,layerlegend) {
        if(arguments.length==0) {
            map = null;
            layerlegend = null;
        }
        else if(arguments.length==1) {
            layerlegend = null;
        }
        this._map = map;
        // 加入点图层
        this._pointLayer = new L.LayerGroup();
        if(this._map!=null) this._pointLayer.addTo(this._map);
        // 加入图例图层
        this._legendLayer = layerlegend;
        if(this._map!=null&&this._legendLayer!=null) this._legendLayer.addTo(this._map);

        this._isVisible = true;
        this._CenterPoint = null;
        this._map._ShowNoteLevle = this._ShowNoteLevle;
        this._map._mapZoomend = this._mapZoomend;
        this._map.on("zoomend",this._mapZoomend);
        return this;
    },

    //清空地图上的站点信息
    ClearStationInfo:function(){
        this._pointLayer.clearLayers();
    }
});















