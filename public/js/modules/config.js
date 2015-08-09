define(['namespace'], function (NS) {

   NS.Config =  {
       isSortAscending: true,
       animation :{
           classes : {
               animationBaseClass : "anim",
               animationEnter : "fadeIn",
               animationExit : "fadeOut"
           },
           props :{
               duration : "600ms",
               timing : 'ease'
           }
       },
       targets : {
           classNames : {
               heroV2ClassName : 'parallax-hero',
               heroContainer : 'container-hero',
               heroClassName : 'hero-img-placeholder',
               circleElements : 'circle'
           }
       },
       DOMProperties : {
           defaultFontSize: 16
       },
       serverURL : (function(){
           if(location.host.indexOf('khalidhoffman') > -1){
               window.serverURL = 'https://hidden-mesa-1606.herokuapp.com';
               return window.serverURL;
           }
           window.serverURL = 'http://localhost:5000';
           return window.serverURL;
       })()
   };

    return NS.Config;
});