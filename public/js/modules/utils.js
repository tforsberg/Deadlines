define(['config', 'Toast', 'moment'], function (config, Toast, moment) {

    var pre = 'webkit'; // A wild guess. It ultimately probably won't matter

    if (window.getComputedStyle){
        var styles = window.getComputedStyle(document.documentElement, '');
        pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1];
    }

    return {
        browserPrefix : pre,
        isMobile : function(){
            return (window.innerWidth < 768);
        },
        reverseArray: function reverse(a) {
            var temp = [],
                len = a.length;
            while(len--) {
                temp.push(a[len]);
            }
            return temp;
        },
        convertPixelToEm: function(pixels){
            var emVal = pixels / config.DOMProperties.defaultFontSize;
            return emVal+'em';
        },
        convertPixelToEmSans: function(pixels){
            return (pixels / config.DOMProperties.defaultFontSize);
        },
        convertEmtoPixel: function(ems){
            var pxVal = ems * config.DOMProperties.defaultFontSize;
            return pxVal+'px';
        },
        convertEmtoPixelSans: function(ems){
            return ems * (config.DOMProperties.defaultFontSize);
        },
        makeToast : function(message){
            new Toast({content: message}).render();
        },
        formatDate : function(date, pattern){
            return moment(date).format(pattern);
        },
        timeUntil : function(date){
            return  moment(date).fromNow();
        },
        /**
         *
         * @param name
         * @param value
         * @param days
         */
        createCookie : function(name,value,days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        },
        /**
         *
         * @param name
         * @returns {*}
         */
        readCookie : function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },
        /**
         *
         * @param name
         */
        eraseCookie : function(name){
            var value = '',
                days = -1;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        }
    };
});