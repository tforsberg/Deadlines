define(['utils', 'config'], function (utils, config) {
    var HeroImage = function (element){
        element.init = function(){
            var win = window,
                parentNode = this.parentNode;
            this.rect = parentNode.getBoundingClientRect();
            this.maxShiftAmount = parentNode.getAttribute('data-max-shift') || 20;
            this.classList.add('HeroImage');
            this.style.height = 100 + this.maxShiftAmount + "%";
            this.scrollInitPoint = (function(el, w){
                var point = el.parentNode.offsetTop - w.innerHeight;
                if (point < 0) point = 0;
                return point;
            })(this, win);
            this.scrollOutPoint = (function(el, w){
                if (el.parentNode.offsetTop < w.innerHeight){
                    return (el.scrollInitPoint + el.parentNode.offsetTop + el.parentNode.clientHeight);
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
            if (!this.isActivated()){
                console.warn('receiving visibility events while element is not activated.')
            } else{
                var bodyEl = document.body || document.documentElement,
                    scrollYPosition = bodyEl.scrollTop,
                    shiftPercentage =  (this.scrollInitPoint + scrollYPosition)/ this.scrollOutPoint,
                    shiftAmount =  (this.maxShiftAmount * shiftPercentage);

                if (this.getAttribute('data-debug')){
                    console.log("shiftPercentage:", shiftPercentage);
                }
                this.style.transform = 'translateY(-'+shiftAmount+"%)";
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
            this.isActive = true;
            this.style.position = 'fixed';
        };

        element.deactivate = function (){
            this.isActive = false;
            this.style.position = 'relative';
        };

        return element;
    };

    return HeroImage;
});