/**
 * 加载本地arcgis切片类
 * 继承自TileLayer
 * @param {Object} tomcat中映射该切片目录url
 * @param {Object} options
*/

    L.TileLayer.AgTileLoad = L.TileLayer.extend({
        initialize: function (url, options) {
            options = L.setOptions(this, options);
            this.url = url + "/{z}/{x}/{y}.png";
            L.TileLayer.prototype.initialize.call(this, this.url, options);
        }
    });


    /**
     * 重写TileLayer中获取切片url方法
     * @param {Object} tilePoint
     */
    L.TileLayer.AgTileLoad.prototype.getTileUrl = function(tilePoint) {
        return L.Util.template(this._url, L.extend({
            s: this._getSubdomain(tilePoint),
            z: function() {
                var value = (tilePoint.z+1).toString(10);
                return "L" + pad(value, 2);
            },
            x: function() {
                var value = tilePoint.y.toString(16);
                return "R" + pad(value, 8);
            },
            y: function() {
                var value = tilePoint.x.toString(16);
                return "C" + pad(value, 8);
            }
        }));
    };

    var AgTileLayer = function(url){
        this.origin = [-180, 90];
        var resolutions = [
            1.40625,
            0.703125,
            0.3515625,
            0.17578125,
            0.087890625,
            0.0439453125,
            0.02197265625,
            0.01098632812,
            0.005493164062,
            0.00274658203125,
            0.001373291015625,
            0.0006866455078125,
            0.00034332275390625,
            0.000171661376953125,
            8.58306884765625E-05,
            4.29153442382813E-05,
            2.14576721191406E-05,
            1.0728836060E-05,
            5.3644180298E-06,
            2.6822090149E-06
        ];

        // 设置地图边界
        // this.southWest = L.latLng(27.1994, 116.8404);//左下西南
        // this.northEast = L.latLng(30.2578, 122.2547);//右上
        // this.bounds = L.latLngBounds(this.southWest, this.northEast);

        //this.crs = new L.Proj.CRS(
        //    '','+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs' ,{
        //        origin:  this.origin,
        //        resolutions: this.resolutions,
        //        bounds:this.bounds
        //    });


        this.tileLayer = new L.TileLayer.AgTileLoad(url, {
            maxZoom: 19,
            minZoom: 7,
            tileSize:256,
            continuousWorld: true,
            //bounds:this.bounds,
            opacity:1.0,
            //zoomOffset: 1,
        });
    };

    L.tileLayer.agTileLoad = function(url, options){
        return new L.TileLayer.AgTileLoad(url, options);
    };

    /**
     * 高位补全方法
     * @param {Object} 数字类型字符串
     * @param {Object} 总位数，不足则高位补0
     */
    var pad = function(numStr, n) {
        var len = numStr.length;
        while(len < n) {
            numStr = "0" + numStr;
            len++;
        }
        return numStr;
    };

