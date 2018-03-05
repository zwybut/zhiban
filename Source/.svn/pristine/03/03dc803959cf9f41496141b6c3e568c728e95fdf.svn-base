/**
 * Created by Administrator on 2017-1-10.
 */

//行政范围图
//var mapTileUrl = 'http://www.zjszsw.cov:8011/BaseMap/';
var mapTileUrl = 'http://115.239.189.18:8011/BaseMap/';


//嵊州地图中心点
var RegionCenterPoint=[29.5792,120.9565];

//嵊州地图Extent
var RegionExtent=[29.5792,120.9565];

var normalMapLayer_A = L.tileLayer.chinaProvider('TianDiTu_ZJ.Normal_4326.Map', {
    maxZoom: 16,
    minZoom: 4,
    zoomOffset: 1
});

var normalAnnoLayer_A = L.tileLayer.chinaProvider('TianDiTu_ZJ.Normal_4326.Annotation', {
    maxZoom: 16,
    minZoom: 4,
    zoomOffset: 1
});

var SatelliteMapLayer_A = L.tileLayer.chinaProvider('TianDiTu_ZJ.Satellite_4326.Map', {
    maxZoom: 16,
    minZoom: 4,
    zoomOffset: 1
});

var SatelliteaAnnolayer_A = L.tileLayer.chinaProvider('TianDiTu_ZJ.Satellite_4326.Annotation', {
    maxZoom: 16,
    minZoom: 4,
    zoomOffset: 1
});

var normalMapLayer_B = L.tileLayer.chinaProvider('TianDiTu_ZJSXSZ.Normal_4326.Map', {
    maxZoom: 19,
    minZoom: 17,
    zoomOffset: 1
});

var normalAnnoLayer_B = L.tileLayer.chinaProvider('TianDiTu_ZJSXSZ.Normal_4326.Annotation', {
    maxZoom: 19,
    minZoom: 17,
    zoomOffset: 1
});

var SatelliteMapLayer_B = L.tileLayer.chinaProvider('TianDiTu_ZJSXSZ.Satellite_4326.Map', {
    maxZoom: 19,
    minZoom: 17,
    zoomOffset: 1
});

var SatelliteaAnnolayer_B = L.tileLayer.chinaProvider('TianDiTu_ZJSXSZ.Satellite_4326.Annotation', {
    maxZoom: 19,
    minZoom: 17,
    zoomOffset: 1
});

var ringsTileLayer_normal = new AgTileLayer(mapTileUrl+'Map_SZ/Rings');

var ringsTileLayer_Satellite = new AgTileLayer(mapTileUrl+'Map_SZ/Rings');

var normalMap = L.layerGroup([normalMapLayer_A,normalAnnoLayer_A,normalMapLayer_B,normalAnnoLayer_B,ringsTileLayer_normal.tileLayer]);

var SatelliteMap = L.layerGroup([SatelliteMapLayer_A, SatelliteaAnnolayer_A,SatelliteMapLayer_B, SatelliteaAnnolayer_B,ringsTileLayer_Satellite.tileLayer]);

var baseLayers = {
    "地图": normalMap,
    "影像": SatelliteMap
};





