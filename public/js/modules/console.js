
define(['config'], function(config){
    function CustomConsole(){
        var pConsole = document.createElement('div');
        pConsole.style.backgroundColor = 'white';
        pConsole.style.padding = '1em';
        pConsole.style.maxWidth = '33%';
        pConsole.style.maxHeight = '5em';
        pConsole.style.overflowY = 'scroll';
        pConsole.style.position = 'fixed';
        pConsole.style.top = '5em';
        pConsole.style.left = '1em';

        pConsole.id = 'console';
        pConsole.lineIndex = 0;

        pConsole.log = function(text){
            this.innerHTML += this.lineIndex+": "+text+'<br/>';
            this.lineIndex++;
        };

        pConsole.replace = function(text){
            this.innerHTML = text;
        };
        document.body.appendChild(pConsole);
        return pConsole;
    }
    return ( CustomConsole);
});
