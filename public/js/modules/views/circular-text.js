define(['config','CSSClass','CSSApplier','EventManager'], function (config, CSSClass, CSSApplier, EventManager) {

    var CSSApplier = new CSSApplier();

    function isNumber(obj) { return !isNaN(parseFloat(obj)) }

    var Point = function (x, y){
        return { x:x, yDelta:y };
    };

    /**
     *
     * @param circleElement
     * @param index
     * @param height
     * @returns {{xDelta: number, yDelta: number, leftElement: (Node|*), rightElement: (HTMLElement|*)}}
     * @constructor
     */
    var PaddingElement = function(circleElement, index, height){

        var radius = circleElement.getElementHeight()/ 2,
            yDelta = radius - (index * height),
            xDelta = (radius - Math.sqrt( ((Math.pow(radius,2) - Math.pow(yDelta,2))) ));

        this.rightBlockElement = document.createElement("div");

        if ( !( isNumber(xDelta) && isNumber(yDelta) ) ){
            console.error(xDelta, yDelta);
            throw 'Non Number used for padding element';
        }

        this.rightBlockElement = document.createElement("div");

        this.updateStyles = function(){
            var padding = 24,
                styles = new CSSClass({
                    width: (xDelta+padding)+'px',
                    height: height+'px',
                    lineHeight: height+'px',
                    maxWidth: '50%',
                    overflow: 'hidden'
                });

            CSSApplier.applyCSS(this.rightBlockElement,styles);

            this.leftBlockElement = this.rightBlockElement.cloneNode(true);

            this.rightBlockElement.style.float = 'right';
            this.rightBlockElement.style.clear = 'right';

            this.leftBlockElement.style.float = 'left';
            this.leftBlockElement.style.clear = 'left';



        };

        this.updateStyles();

        return {
            xDelta:xDelta,
            yDelta: yDelta,
            leftElement : this.leftBlockElement,
            rightElement : this.rightBlockElement
        };
    };


    var CircularTextElement = function(element){
        //console.log(element.children);
        var contentChildElement = element.getElementsByClassName('content')[0] || element.children[(element.children.length-1)], // TODO: Shouldn't be hardcoded
            topChild = element.children[0];
        element.boundaryElements = {left :  [], right: [], size: 0};


        element.getElementHeight = function(){ return element.offsetHeight};
        element.getContentHeight = function(){ return contentChildElement.offsetHeight};
        element.getRadius  = function(){return element.getElementHeight()/2};

        element.buildCircularBoundary = function(){
            var numOfBoundaryElements = this.boundaryElements.size;
            /**
             * Reset the array of boundary elements in the DOM and backend
             */
            for (var i = 0 ; i < numOfBoundaryElements; i++){
                this.boundaryElements.left[i].parentNode.removeChild( this.boundaryElements.left[i]);
                this.boundaryElements.right[i].parentNode.removeChild( this.boundaryElements.right[i]);
                this.boundaryElements.left[i] = null; // garbage collection?
                this.boundaryElements.right[i] = null;// garbage collection?
                this.boundaryElements.size = 0;
            }

            var defaultPaddingHeightpxsans = config.fontSize || 16,
                numOfTextLines = element.getElementHeight() / defaultPaddingHeightpxsans;
            //console.log('Num of text lines required:['+element.getElementHeight()+'/'+defaultPaddingHeightpxsans+'] '+numOfTextLines);
            for (i = 0; i < numOfTextLines; i++){
                var paddingElement = new PaddingElement( this, i, defaultPaddingHeightpxsans);

                var topElement = (i < numOfTextLines/2)?topChild:contentChildElement;


                this.boundaryElements.left[i] =  element.insertBefore(paddingElement.leftElement, topElement);
                this.boundaryElements.right[i] = element.insertBefore(paddingElement.rightElement, topElement);
                this.boundaryElements.size++;

            }

            var currentFontSize = window.getComputedStyle(contentChildElement, null).getPropertyValue('font-size');
            currentFontSize = parseInt(currentFontSize);
            i = 0;
            if (element.getContentHeight() > element.getRadius()){
                while(element.getContentHeight() > element.getRadius()){
                    contentChildElement.style.fontSize = (currentFontSize - 0.1) + 'px';
                }
            }

        };
        element.buildCircularBoundary();


        return element;
    };


    return CircularTextElement;
});