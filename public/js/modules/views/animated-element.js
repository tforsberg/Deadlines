define(['jquery', 'VisibilityAwareElement'], function ($) {
    var mainAnimConfig = {
        classes: {
            animationBaseClass: "anim",
            animationName: "fadeIn",
            animationExit: "fadeOut"
        },
        props: {
            duration: "600ms",
            timing: 'ease'
        },
        events: {
            animEnd: 'animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd'
        }
    };

    $.fn.Animatable = function (options) {
        window._anim = {};
        var _anim = window._anim;
        _anim.animQueue = [];

        this.each(function (index, el) {
            var $el = $(el),
                elOptions = options,
                animConfig = {
                    classes: {
                        animationBaseClass: "anim",
                        animationName: "fadeIn",
                        animationExit: "fadeOut"
                    },
                    props: {
                        duration: "250ms",
                        timing: 'linear',
                        delay: 0
                    }
                };

            $el.animOptions = {
                animationName: (elOptions && elOptions.animationName) ? elOptions.animationName : $el.data('animEnter') || animConfig.classes.animationName,
                animationDuration: (elOptions && elOptions.duration) ? elOptions.duration : $el.data('animDuration') || animConfig.props.duration,
                animationTimingFunction: (elOptions && elOptions.timing) ? elOptions.timing : $el.data('animTiming') || animConfig.props.timing,
                animationDelay: (elOptions && elOptions.delay) ? elOptions.delay : animConfig.props.delay,

                isScrolled: (elOptions && elOptions.isScrolled) ? elOptions.isScrolled : false,
                isVisible: (elOptions && elOptions.isVisible) ? elOptions.isVisible : false,
                isEntirelyVisible: (elOptions && elOptions.isEntirelyVisible) ? elOptions.isEntirelyVisible : false,


                onScrolled: (elOptions && elOptions.onScrolled) ? elOptions.onScrolled : null,
                onVisible: (elOptions && elOptions.onVisible) ? elOptions.onVisible : null,
                onEntirelyVisible: (elOptions && elOptions.onEntirelyVisible) ? elOptions.onEntirelyVisible : null,
                onAnimationEnd: (elOptions && elOptions.onAnimationEnd) ? elOptions.onAnimationEnd : null,

                isQueued: (elOptions && elOptions.isQueued) ? elOptions.isQueued : false,
                isOrdered: (elOptions && elOptions.isOrdered) ? elOptions.isOrdered : false
            };

            $el.data('animEnter', $el.animOptions.animationName);
            $el.data('animDelay', $el.animOptions.animationDelay);

            // preset properties for animation
            $el.css({
                visibility: 'hidden',
                animationDuration: $el.animOptions.animationDuration,
                animationTimingFunction: $el.animOptions.animationTimingFunction
            });

            // listen for animation end once, then remove listeners and update state
            $el.one(mainAnimConfig.events.animEnd, function () {
                $el.removeClass($el.data('animEnter'));
                $el.isAnimating = false;
                if ($el.animOptions.onAnimationEnd) $el.animOptions.onAnimationEnd.apply($el);
                //console.log('animationEnd: ', $el[0]);
            });

            // initiates animation via CSS classes
            $el.play = function () {
                $el.isAnimating = true;
                $el.css({
                    visibility: 'visible'
                }).addClass($el.data('animEnter'));
                //console.log('play: ', this[0]);
            };

            $el.animate = function () {
                //console.log('animate: ', this[0]);
                if ($el.data('animDelay')) {
                    setTimeout(function () {
                        $el.play();
                    }, $el.data('animDelay'));
                } else {
                    $el.play();
                }
            };

            $el.startAnimation = function () {
                var $prevAnimatedEl = _anim.animQueue[$el.animIndex - 1] || {isAnimating : false, one : function(){}}; // dummy element
                if ($el.animOptions.isQueued) {
                    $prevAnimatedEl.one(mainAnimConfig.events.animEnd, function () {
                        //console.log('$prevAnimatedEl.animationEnd: ', $el[0]);
                        $el.animate();
                    });
                    if ($prevAnimatedEl.isAnimating == false) {
                        $el.animate();
                    }
                } else {
                    $el.animate();
                }
            };

            $el.queueAnimation = function () {
                //console.log('queueing: ', $el[0]);
                /*
                TODO implement better way to handle first element's wait for animationend. Current implementation uses a dummy element with a permanent isAnimating (false) prop
                 */
                if ($el.animOptions.isQueued) {
                    $el.animIndex = _anim.animQueue.length;
                    _anim.animQueue.push($el);// dummy element
                }
            };

            if (!($el.animOptions.isVisible || $el.animOptions.isScrolled || $el.animOptions.isEntirelyVisible)) {
                //console.log('init: ', $el[0]);
                $el.startAnimation();

            } else if ($el.animOptions.isScrolled) {
                //console.log('init(isScrolled): ', $el[0]);
                if ((typeof  $el.VisibilityAwareElement != 'function')) {
                    throw new Error('VisibilityAwareElement has not been loaded');
                }
                if ($el.animOptions.isOrdered) {
                    $el.queueAnimation();
                    // animations will be played later
                } else {
                    $el.one('scrolled', function () {
                        $el.queueAnimation();
                        $el.startAnimation();
                    });
                    $el.VisibilityAwareElement({
                        isScrolled: $el.animOptions.isScrolled,
                        onScrolled: $el.animOptions.onScrolled
                    });
                }

            } else if ($el.animOptions.isVisible) {
                //console.log('init(isVisible): ', $el[0]);
                if ((typeof  $el.VisibilityAwareElement != 'function')) {
                    throw new Error('VisibilityAwareElement has not been loaded');
                }
                if ($el.animOptions.isOrdered) {
                    $el.queueAnimation();
                    // animations will be played later
                } else {
                    $el.one('visible', function () {
                        $el.queueAnimation();
                        $el.startAnimation();
                    });
                    $el.VisibilityAwareElement({
                        onVisible: $el.animOptions.onVisible
                    });
                }

            } else if ($el.animOptions.isEntirelyVisible) {
                //console.log('init(isEntirelyVisible): ', $el[0]);
                if ((typeof  $el.VisibilityAwareElement != 'function')) {
                    throw new Error('VisibilityAwareElement has not been loaded');
                }
                $el.one('entirelyVisible', function () {
                    $el.queueAnimation();
                    $el.startAnimation();
                });
                $el.VisibilityAwareElement({
                    isEntirelyVisible: true,
                    onEntirelyVisible: $el.animOptions.onEntirelyVisible
                });

            }
        });
        if(options && options.isOrdered){
            //console.log('_anim.animQueue', _anim.animQueue);
            _.forEach(_anim.animQueue, function($el, index){
                if($el.animOptions.isScrolled){
                    $el.one('scrolled', $el.startAnimation);
                    $el.VisibilityAwareElement({
                        isScrolled: $el.animOptions.isScrolled,
                        onScrolled: $el.animOptions.onScrolled
                    });
                } else if ($el.animOptions.isVisible){
                    $el.one('visible', $el.startAnimation);
                    $el.VisibilityAwareElement({
                        onVisible: $el.animOptions.onVisible
                    });
                } else if ($el.animOptions.isEntirelyVisible){
                    $el.one('entirelyVisible', $el.startAnimation);
                    $el.VisibilityAwareElement({
                        isEntirelyVisible: true,
                        onEntirelyVisible: $el.animOptions.onEntirelyVisible
                    });
                }
            });
        }

        return this;
    };
});