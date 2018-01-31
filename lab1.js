'use strict';
/* global google */

let googleMap;

function initMap() {
    console.log('Initmap called');
    const centerPoint = new google.maps.LatLng(60.16, 24.93);
    const mapConf =
    {
        center: centerPoint,
        zoom: 13,
    };

    const target = document.getElementById('mapDiv');
    googleMap = new google.maps.Map(target, mapConf);
}

function initEventListeners() {
    console.log('initEventListeners');
    const form = document.getElementById('searchForm');
    form.addEventListener('submit', onSearchFormSubmit);
}

function onSearchFormSubmit(event) {
    event.preventDefault();
    const searchPhrase = document.getElementById('searchField').value;
    console.log('onSearchFormSubmit, search for \''+searchPhrase+'\'');
    searchWithPhrase(searchPhrase);
}

function searchWithPhrase(word) {
    const geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({'address': word}, onSearchResult);
}

function onSearchResult(result, status) {
    console.log('onSearchResult');
    if(status == google.maps.GeocoderStatus.OK) {
        console.log('Results ok!');
        const coordinates = result[0].geometry.location;
        console.log('Got location: '+coordinates);
        googleMap.setCenter(coordinates);
    }
}

initMap();
initEventListeners();

// 2 lab below

let markers = [];

function cleanMarkers() {
    if (markers.length > 0) {
        markers.forEach((item) => { item.setMap(null)} );
        markers.length = 0;
    };
}

function ajaxSuccess(response) {
    cleanMarkers();
    response.geonames.forEach((item, i) => {
        let marker = new google.maps.Marker({
            position: {lat: item.lat, lng: item.lng},
            map: googleMap,
            title: item.title,
            label: item.title
        });
        let infowindow = new google.maps.InfoWindow({
            content: item.summary
        })
        marker.addListener('click', function() {
            infowindow.open(googleMap, marker);
        });
        markers.push(marker);
    });
}

// let ajax_params = {
//     url: "http://api.geonames.org/findNearbyWikipediaJSON",
//     dataType: "json", 
//     data: {"lat": googleMap.getCenter().lat(),
//     "lng": googleMap.getCenter().lng(), "username": "marksel"},
//     success: ajaxSuccess
// };

const button = document.getElementById('fetching');
button.addEventListener('click', () => { $.ajax({
    url: "https://secure.geonames.org/findNearbyWikipediaJSON",
    dataType: "json", 
    data: {"lat": googleMap.getCenter().lat(),
    "lng": googleMap.getCenter().lng(), "username": "marksel"},
    success: ajaxSuccess
})});
const cleanButton = document.getElementById('clean');
cleanButton.addEventListener('click', () => { cleanMarkers() });