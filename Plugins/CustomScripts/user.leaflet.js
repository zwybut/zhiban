(function (factory) {
    //define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], function (L) {
            return factory(L);
        });
        //define a common js module that relies on 'leaflet'
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    if(typeof window !== 'undefined' && window.L){
        factory(window.L);
    }
}(function (L) {
    var UserLeaflet = { //jshint ignore:line
        VERSION: '1.0.0',
        Layers: {},
        Controls: {},
    };
    if(typeof window !== 'undefined' && window.L){
        window.L.user = UserLeaflet;
    }

    (function(UserLeaflet){

        var tileProtocol = (window.location.protocol !== 'https:') ? 'http://' : 'https://';
        var ip = '10.43.15.14';

        UserLeaflet.Layers.BasemapLayer = L.TileLayer.extend({
            statics: {
                TILES: {
					Streets: {
                        //http://mt1.google.cn/vt/v=w2.116&hl=zh-CN&gl=cn&x=420&y=213&z=9
                        urlTemplate: tileProtocol +'mt{s}.google.cn/vt/v=w2.116&hl=zh-CN&x={x}&y={y}&z={z}',
                        options: {
                            hideLogo: false,
                            logoPosition: 'bottomright',
                            minZoom: 1,
                            maxZoom: 19,
                            subdomains: ['1', '2', '3'],
                            attribution: 'Streets,Google inc'
                        }
                    },
                    Local: {
                        //http://10.43.15.14/arcgis/rest/services/hunan/basemap/MapServer/tile/9/213/412
                        urlTemplate: tileProtocol + ip + '/arcgis/rest/services/hunan/basemap/MapServer/tile/{z}/{y}/{x}',
                        options: {
                            hideLogo: false,
                            logoPosition: 'bottomright',
                            minZoom: 1,
                            maxZoom: 19,
                            attribution: 'local,����'
                        }
                    },
                    Terrain: {
                        //http://mt2.google.cn/vt/lyrs=t@132,r@248000000&hl=zh-CN&gl=cn&x=1669&y=856&z=11&s=
                        urlTemplate: tileProtocol + 'mt{s}.google.cn/vt/lyrs=t@132,r@248000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
                        options: {
                            hideLogo: false,
                            logoPosition: 'bottomright',
                            minZoom: 1,
                            maxZoom: 19,
                            subdomains: ['1', '2', '3'],
                            attribution: 'terrain,Google inc'
                        }
                    },
                    Imagery: {
                        //http://www.google.cn/maps/vt?lyrs=s@174&gl=cn&x=3331&y=1713&z=12&s=
                        urlTemplate: tileProtocol + 'www.google.cn/maps/vt?lyrs=s@174&gl=cn&x={x}&y={y}&z={z}',
                        options: {
                            hideLogo: false,
                            logoPosition: 'bottomright',
                            minZoom: 1,
                            maxZoom: 19,
                            attribution: 'imagery,Google inc'
                        }
                    }
                }
            },
            initialize: function(key, options){
                var config;

                // set the config variable with the appropriate config object
                if (typeof key === 'object' && key.urlTemplate && key.options){
                    config = key;
                } else if(typeof key === 'string' && UserLeaflet.BasemapLayer.TILES[key]){
                    config = UserLeaflet.BasemapLayer.TILES[key];
                } else {
                    throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ShadedRelief", "ShadedReliefLabels", "Terrain" or "TerrainLabels"');
                }

                // merge passed options into the config options
                var tileOptions = L.Util.extend(config.options, options);

                // call the initialize method on L.TileLayer to set everything up
                L.TileLayer.prototype.initialize.call(this, config.urlTemplate, L.Util.setOptions(this, tileOptions));

            },
            onAdd: function(map){

                L.TileLayer.prototype.onAdd.call(this, map);

                map.on('moveend', this._updateMapAttribution, this);
            },
            onRemove: function(map){

                L.TileLayer.prototype.onRemove.call(this, map);

                map.off('moveend', this._updateMapAttribution, this);
            },
            getAttribution:function(){
                var attribution = '<span class="esri-attributions" style="line-height:14px; vertical-align: -3px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; display:inline-block;">' + this.options.attribution + '</span>'/* + logo*/;
                return attribution;
            },

            _updateMapAttribution: function(){
                if(this._map && this._map.attributionControl && this._attributions){
                    var newAttributions = '';
                    var bounds = this._map.getBounds();
                    var zoom = this._map.getZoom();

                    for (var i = 0; i < this._attributions.length; i++) {
                        var attribution = this._attributions[i];
                        var text = attribution.attribution;
                        if(!newAttributions.match(text) && bounds.intersects(attribution.bounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
                            newAttributions += (', ' + text);
                        }
                    }
                    newAttributions = newAttributions.substr(2);
                    var attributionElement = this._map.attributionControl._container.querySelector('.esri-attributions');
                    attributionElement.innerHTML = newAttributions;
                    attributionElement.style.maxWidth =  (this._map.getSize().x * 0.65) + 'px';
                    this.fire('attributionupdated', {
                        attribution: newAttributions
                    });
                }
            }
        });

        UserLeaflet.BasemapLayer = UserLeaflet.Layers.BasemapLayer;

        UserLeaflet.Layers.basemapLayer = function(key, options){
            return new UserLeaflet.Layers.BasemapLayer(key, options);
        };

        UserLeaflet.basemapLayer = function(key, options){
            return new UserLeaflet.Layers.BasemapLayer(key, options);
        };

    })(UserLeaflet);

    return UserLeaflet;
}))




