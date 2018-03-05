L.TileLayer.ChinaProvider = L.TileLayer.extend({

    initialize: function(type, options) {
        var providers = L.TileLayer.ChinaProvider.providers;

        var parts = type.split('.');

        var providerName = parts[0];
        var mapName = parts[1];
        var mapType = parts[2];

        var url = providers[providerName][mapName][mapType];
        options.subdomains = providers[providerName].Subdomains;

        L.TileLayer.prototype.initialize.call(this, url, options);
    }
});

L.TileLayer.ChinaProvider.providers = {
    TianDiTu_ZJ : {
        Normal_4326: {
            Map : "http://t{s}.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}",
            Annotation: "http://t{s}.tianditu.com/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}"
        },

        Satellite_4326: {
            Map: "http://srv{s}.zjditu.cn/ZJDOM_2D/wmts?service=WMTS&request=GetTile&version=1.0.0&style=default&format=image/jpgpng&layer=imgmap&TileMatrixSet=default028mm&TileMatrix={z}&TileCol={x}&TileRow={y}",
            Annotation: "http://srv{s}.zjditu.cn/ZJDOMANNO_2D/wmts?service=WMTS&request=GetTile&version=1.0.0&style=default&format=image/jpgpng&layer=TDT_ZJIMGANNO&TileMatrixSet=default028mm&TileMatrix={z}&TileCol={x}&TileRow={y}",
        },

        Terrain: {
            Map: "http://t{s}.tianditu.com/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
            Annotation: "http://t{s}.tianditu.com/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
        },

        Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
    },

    //天地图_浙江绍兴嵊州
    TianDiTu_ZJSXSZ:{
        Normal_4326: {
            Map : "http://srv.tianditusx.cn/SZEMAP/wmts.asmx/wmts?Service=WMTS&VERSION=1.0.0&Request=GetTile&Layer=SZEMAP&Format=image/png&TileMatrixSet=TileMatrixSet0&TileMatrix={z}&Style=default&TileRow={y}&TileCol={x}",
            Annotation: "http://srv.tianditusx.cn/SZEMAPANNO/wmts.asmx/wmts?Service=WMTS&VERSION=1.0.0&Request=GetTile&Layer=SZEMAPANNO&Format=image/png&TileMatrixSet=TileMatrixSet0&TileMatrix={z}&Style=default&TileRow={y}&TileCol={x}"
        },

        Satellite_4326: {
            Map: "http://srv.tianditusx.cn/SZIMG/wmts.asmx/wmts?Service=WMTS&VERSION=1.0.0&Request=GetTile&Layer=SZIMG&Format=image/png&TileMatrixSet=TileMatrixSet0&TileMatrix={z}&Style=default&TileRow={y}&TileCol={x}",
            Annotation: "http://srv.tianditusx.cn/SZIMGANNO/wmts.asmx/wmts?Service=WMTS&VERSION=1.0.0&Request=GetTile&Layer=SZIMGANNO&Format=image/png&TileMatrixSet=TileMatrixSet0&TileMatrix={z}&Style=default&TileRow={y}&TileCol={x}"
        },
        Subdomains: []
    },

};

L.tileLayer.chinaProvider = function(type, options) {
    return new L.TileLayer.ChinaProvider(type, options);
};
