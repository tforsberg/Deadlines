function initialize() {
    var mapCanvas = document.getElementById('container-map'),
        addressLine1 = '201 S. Orange Ave.',
        addressLine2 = 'Orlando, FL 32801',
        mapsExternalLink = 'https://www.google.com/maps/place/201+S+Orange+Ave,+Orlando,+FL+32801/@28.5400755,-81.3780508,17z/data=!3m1!4b1!4m2!3m1!1s0x88e77afe0ea98651:0xb413ff4d3f1e00b8',
        latitude = 28.5400755,
        longitude = -81.3780508;
    if(mapCanvas){
        var mapOptions = {
            scrollwheel: false,
            center: new google.maps.LatLng(latitude,longitude),
            zoom: 17,
            panControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
        };
        var screenWidth = window.innerWidth || jQuery(window).width();
        if ( screenWidth == 320 || screenWidth == 375 || screenWidth == 360 ){
            // common mobile sizes
            mapOptions.draggable = false;
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);
        var iconBaseURL = 'https://maps.google.com/mapfiles/kml/shapes/';
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude,longitude),
            map: map,
            title: 'Directions'
        });
        var addressHTMLText = '<p>'+addressLine1+'<br/>'+addressLine2+'</p>',
            gMapHTMLContent = "<div class='google-map-infowindow'>" +
                "<a href='"+mapsExternalLink+"' target='_blank' >"+addressHTMLText+"</a>" +
                "<div>";

        var infowindow = new google.maps.InfoWindow({
            content: gMapHTMLContent
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });
    } else{
        console.warn('mapCanvas not found.');
        console.log(mapCanvas);
    }
}
google.maps.event.addDomListener(window, 'load', initialize);