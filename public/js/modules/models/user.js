define(['namespace', 'backbone', 'domReady!'],
    function(NS, Backbone, DOM){

        var User = Backbone.Model.extend({
            defaults : {
                name : DOM.getElementById('credentials-name').value || 'user',
                firstName : DOM.getElementById('credentials-first-name').value || 'user',
                lastName : DOM.getElementById('credentials-last-name').value || 'user',
                pic : DOM.getElementById('credentials-pic').value|| 'https://placehold.it/128x128'
            },
            initialize: function(){

            }
        });

        NS.User = new User();

        return NS.User;
    });