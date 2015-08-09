define(['jquery'], function ($) {
    $.fn.VisibilityAwareElement = function(options){

        this.each(function(index, el){
            var $el = $(el),
                distFromTop = (el.offsetTop - window.innerHeight),
                args = options;
            args = {
                isScrolled : (args && args.isScrolled )?args.isScrolled: false,
                isEntirelyVisible : (args && args.isEntirelyVisible)?args.isEntirelyVisible: false,
                isVisible : (args && !args.isScrolled && !args.isEntirelyVisible)? true:false,

                onScrolled: (args && args.onScrolled)?args.onScrolled: false,
                onVisible: (args && args.onVisible)?args.onVisible: false,
                onEntirelyVisible: (args && args.onEntirelyVisible)?args.onEntirelyVisible: false
            };

            $el.visiProps = {

                offsetTop : el.offsetTop,
                distFromTop : distFromTop,
                initialRect : el.getBoundingClientRect(),

                isEntirelyVisible : args.isEntirelyVisible,
                isScrolled : args.isScrolled,

                onScrolled : args.onScrolled,
                onVisible : args.onVisible,
                onEntirelyVisible : args.onEntirelyVisible,

                scrollInitPoint : (distFromTop < 0)?0:distFromTop,
                scrollOutPoint : (distFromTop < 0)?(el.offsetTop + el.clientHeight):(distFromTop+ window.innerHeight + el.clientHeight)
            };

            if ($el.data('debug')){
                console.log( $el.visiProps, "element.scrollInitPoint", $el.visiProps.scrollInitPoint, "element.scrollOutPoint:", $el.visiProps.scrollOutPoint );
            }

            $el.isEntirelyVisible = function(){
                this.visiProps.currentRect = this[0].getBoundingClientRect();
                return (this.visiProps.currentRect.top > 0 && this.visiProps.currentRect.bottom < window.innerHeight);
            };

            $el.isVisible = function() {
                var scrollYPosition = $('body').scrollTop() || $('html').scrollTop();
                //console.log('scrollYPosition: ', scrollYPosition, $.browser);
                return (scrollYPosition >= this.visiProps.scrollInitPoint && scrollYPosition <= this.visiProps.scrollOutPoint);
            };

            $el.isScrolled = function() {
                var scrollYPosition = $('body').scrollTop() || $('html').scrollTop();
                return (scrollYPosition >= this.visiProps.scrollInitPoint);
            };

            $el.onScroll = function($event){
                if($el.visiProps.isVisible && $el.isVisible()){
                    if($el.visiProps.onVisible) $el.visiProps.onVisible.apply($el);
                    // run callback if provided
                    $el.trigger('visible');
                    //console.log('visible: ', $el.visiProps.scrollInitPoint, $el[0]);
                    //$(window).off('scroll', null, $el.onScroll);
                    clearInterval($el.visiProps.listener);
                } else if($el.visiProps.isEntirelyVisible && $el.isEntirelyVisible()){
                    // run callback if provided
                    if($el.visiProps.onEntirelyVisible) $el.visiProps.onEntirelyVisible.apply($el);
                    $el.trigger('entirelyVisible');
                    //$(window).off('scroll', null, $el.onScroll);
                    clearInterval($el.visiProps.listener);
                } else if($el.visiProps.isScrolled && $el.isScrolled()){
                    // run callback if provided
                    if($el.visiProps.onScrolled) $el.visiProps.onScrolled.apply($el);
                    $el.trigger('scrolled');
                    //$(window).off('scroll', null, $el.onScroll);
                    clearInterval($el.visiProps.listener);
                }
            };

            //$(window).on('scroll', null, {$el: $el}, $el.onScroll);
            $el.visiProps.listener = setInterval($el.onScroll, 250);
        });


        return this;
    };

});
