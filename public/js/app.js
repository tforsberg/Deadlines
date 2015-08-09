var require = requirejs.config({
    appDir : '/deadlines/js',
    baseUrl: '/deadlines/js/modules',
    waitSeconds : 0,
    paths: {
        //"angular" : "//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.min",
        //"ngApp" : "../ng-app",
        "domReady" : "vendors/domReady",
        "text" : "vendors/text",
        "config": "config",
        "utils": "utils",
        "console": "console",
        "namespace": "namespace",
        "CSSClass" : 'models/css-class',
        "CircleElement" : "views/circular-text",
        "AnimatedElement" : "views/animated-element",
        "ClippedElement" : "views/cutoff-content-box",
        "HeroImage" : "views/hero-image-v2",
        "HeroImageV1" : "views/hero-image",
        "VisibilityAwareElement" : "views/visibility-aware-element",
        "Toast" : "views/toast",
        "SideBar" : "views/sidebar",
        "user": "models/user",
        "Router" : "controllers/router",
        "history" : "controllers/history",
        "historyJS" : "vendors/jquery.history",
        "live" : "vendors/live",
        "lightbox" : "vendors/lightbox.min",
        "jquery" : "vendors/jquery",
        "flexslider" : "vendors/jquery.flexslider-min",
        "underscore" : "vendors/lodash",
        "material" : "vendors/material",
        "backbone" : "vendors/backbone",
        "datePicker" : "vendors/picker.date",
        "timePicker" : "vendors/picker.time",
        "moment" : "vendors/moment",
        "htmlSortable" : "vendors/html.sortable",
        "semantic-ui" : "vendors/semantic",
        "uikit" : "vendors/semantic"
    },
    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        //"angular" : {
        //    "exports" : "angular"  //attaches "Backbone" to the window object
        //},
        "live" : [],
        "material" :  {
            "deps": ["jquery"]
        },
        "semantic-ui" : {
            "deps": ["jquery"]
        },
        "uikit" : {
            "deps": ["jquery"]
        },
        "historyJS" : {
            "deps": ["jquery"],
            "exports" : "History"
        },
        "flexslider" : {
            "deps": ["jquery"]
        },
        "lightbox" : {
            "deps": ["jquery"]
        },
        'htmlSortable' : [],
        'datePicker' : {
            "deps": ["jquery", "vendors/picker"]
        },
        'timePicker' : {
            "deps": ["jquery", "vendors/picker"]
        }
    }
});


require([
    'require',
    'config',
    'semantic-ui',
    'SideBar',
    'views/user',
    'views/todo-list',
    //'live',
    'utils',
    'domReady!'], function(require) {
    var utils = require( 'utils');
});
