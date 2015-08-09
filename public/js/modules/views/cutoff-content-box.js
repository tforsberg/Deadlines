define(["utils"],function(utils){
    "use strict";

    /**
     *
     * @returns {HTMLElement|Node}
     * @constructor
     */
    function Viewport(props){
        var newViewport = document.createElement('div');
        newViewport.className = 'cutoff-content-wrapper';
        newViewport.style.overflow = 'hidden';
        newViewport.slantAngle = parseInt(props.angle) || 0;
        newViewport.xTranslation  = (typeof props.xTranslation == 'string')?props.xTranslation : '50%';
        newViewport.yTranslation  = (typeof props.yTranslation == 'string')?props.yTranslation : 0;
        return newViewport;
    }


    /**
     *
     * @param element
     * @param props
     * @returns {Node}
     * @constructor
     */
    var CutoffContentBox = function(element, props){
        if ( element == null){
            throw new Error('No element was passed for slanted image construction.');
        }

        var parentElement = element.parentNode;

        if ( parentElement == null){
            throw new Error( 'Element is not attached to the DOM.');
        }

        /**
         * default properties
         * @type {{angle: (string|*), xTranslation: (string|*), yTranslation: (string|*)}}
         */
        var defaultProps = {
            angle : element.getAttribute('data-angle-deg') || 45,
            xTranslation : element.getAttribute('data-x-offset-percent') || 50,
            yTranslation : element.getAttribute('data-y-offset-percent') || 0
        };

        var mergedProps = defaultProps;

        /**
         * Assign passed properties
         */
        if (props){
            for( var propertyName in defaultProps){
                if (defaultProps.hasOwnProperty(propertyName)){
                    if (props[propertyName]){
                        mergedProps[propertyName] = props[propertyName];
                    }
                }
            }
        }

        //console.log('creating new CutoffBox with params: ', mergedProps);

        parentElement.style.position = 'relative';
        parentElement.style.overflow = 'hidden';

        var prefix = utils.browserPrefix;

        element.originalParent = parentElement;
        element.createViewport = function(){

            var newViewport = new Viewport(mergedProps);
            newViewport.appendChild(element);
            this.outerViewport = newViewport;
            this.attachToParent();
            element.isActive = true;
        };

        element.attachToParent = function(){
            parentElement.appendChild(this.outerViewport);
        };

        element.insertToParent = function(){
            parentElement.insertBefore(this.outerViewport, parentElement.firstChild);
        };


        /**
         *
         * @param newAngle [optional]
         * @param translateX [optional]
         * @param translateY [optional]
         */
        element.updateViewportPosition = function(newAngle, translateX, translateY){
            if (!this.isActive) throw new Error('Tried to update a deactivated element');
            this.draw(newAngle, translateX, translateY);

        };

        element.draw = function(newAngle, translateX, translateY){
            var outerViewPort = this.outerViewport,

                angle = newAngle || outerViewPort.slantAngle,

                yTranslateValue = translateY || outerViewPort.yTranslation || 0,
                xTranslateValue = outerViewPort.xTranslation-50, //translateX || 50-outerViewPort.xTranslation || 50,

                scaleXRatio = (this.clientHeight > this.clientWidth)?(this.clientHeight/this.clientWidth)*2.5:2.5,
                scaleYRatio =  (this.clientWidth > this.clientHeight)?(this.clientWidth/this.clientHeight)*1.5:1.5,

                transformOrigin = 50+'%' + " 0",

                transformMarkup = 'translate('+xTranslateValue+'%, '+yTranslateValue+'%) rotateZ('+(-angle)+'deg) scale3d('+scaleXRatio+', '+scaleYRatio+', 1)',
                invertedTransformMarkup = ' scale3d('+(1/scaleXRatio)+', '+(1/scaleYRatio)+', 1)  rotateZ('+angle+'deg) translate('+(-xTranslateValue)+'%, '+(-yTranslateValue)+'%)';


            outerViewPort.style[prefix+'TransformOrigin'] = transformOrigin;
            outerViewPort.style['transformOrigin'] = transformOrigin;

            this.style[prefix+'TransformOrigin'] = transformOrigin;
            this.style['transformOrigin'] = transformOrigin;

            outerViewPort.style[prefix+'Transform'] = transformMarkup;
            outerViewPort.style['transform'] = transformMarkup;

            this.style[prefix+'Transform'] = invertedTransformMarkup;
            this.style['transform'] = invertedTransformMarkup;
        };

        window.addEventListener('resize', function(){
            if (element.isActivated()) {
                element.updateViewportPosition();
            }
        });

        element.createViewport();
        element.updateViewportPosition();

        /**
         * Adjusts the distance of the cutoff border from the origin
         * @param translateY
         */
        element.updateYPosition = function(translateY){
            this.outerViewport.yTranslation = translateY;
            this.updateViewportPosition();

        };
        element.updateAngle = function(angle){
            this.outerViewport.slantAngle = angle;
            this.updateViewportPosition();
        };

        element.updateXPosition = function (amount){
            this.outerViewport.xTranslation = amount;
            this.updateViewportPosition();
        };


        element.activate = function(){
            this.outerViewport.slantAngle = this.getAttribute('data-angle-deg');
            this.outerViewport.xTranslation = this.getAttribute('data-x-offset-percent');
            this.outerViewport.yTranslation = this.getAttribute('data-y-offset-percent');
            this.isActive = true;
            this.updateViewportPosition();
        };

        element.deactivate = function(){
            this.outerViewport.slantAngle = 0;
            this.outerViewport.xTranslation = 50;
            this.outerViewport.yTranslation = 0;
            this.draw();
            this.isActive = false;
        };

        element.isActivated = function(){
            return this.isActive;
        };

        return element;
    };


    return CutoffContentBox;
});
