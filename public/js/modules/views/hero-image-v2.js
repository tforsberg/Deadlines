define(['utils', 'config'], function (utils, config) {
    var HeroImage = function (element){
        element.init = function(){
            var win = window;
            this.rect = this.getBoundingClientRect();
            this.classList.add('HeroV2Image');
            this.maxShiftAmount = this.getAttribute('data-max-shift') || 60;
            //this.style.backgroundSize = "auto "+ (100 + this.maxShiftAmount) + '%';
            this.scrollInitPoint = (function(el, w){
                var point = el.offsetTop - w.innerHeight;
                if (point < 0) point = 0;
                return point;
            })(this, win);
            this.scrollOutPoint = (function(el, w){
                if (el.offsetTop < w.innerHeight){
                    return (el.scrollInitPoint + el.offsetTop + el.clientHeight);
                } else{
                    return (el.scrollInitPoint + w.innerHeight + el.clientHeight);
                }
            })(this, win);
            this.isActive = true;
        };
        element.init();
        if (element.getAttribute('data-debug')){
            console.log( "element.scrollInitPoint", element.scrollInitPoint, "element.scrollOutPoint:", element.scrollOutPoint );
        }
        element.onVisible = function(){
            // TODO onVisible Implementation
            var bodyEl = document.body || document.documentElement,
                scrollYPosition = bodyEl.scrollTop,
                shiftPercentage =  ((this.scrollInitPoint + scrollYPosition)/ this.scrollOutPoint) -1,
                baseBackgroundPercent = 50,
                shiftAmount =  (this.maxShiftAmount * shiftPercentage) + baseBackgroundPercent;

            if(!utils.isMobile()){
                if (this.getAttribute('data-debug')){
                    console.log("shiftPercentage:", shiftPercentage);
                }
                this.style.backgroundPosition = 'center '+shiftAmount+"%";
            }

        };
        element.isVisible = function() {
            var bodyEl = document.body || document.documentElement,
                scrollYPosition = bodyEl.scrollTop,
                scrollInPoint = this.scrollInitPoint,
                scrollOutPoint = this.scrollOutPoint;
            return (scrollInPoint <= scrollYPosition && scrollYPosition <= scrollOutPoint);
        };

        element.isActivated = function(){
            return this.isActive;
        };

        element.activate = function(){
            this.style.backgroundAttachment = 'fixed';
            this.isActive = true;
        };

        element.deactivate  = function(){
            this.style.backgroundAttachment = 'local';
            this.isActive = false;
        };

        return element;
    };

    return HeroImage;
});