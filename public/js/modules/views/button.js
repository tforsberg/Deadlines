define(['backbone'], function(Backbone){
    "use strict";

    var ButtonView = Backbone.View.extend({
        tagName : 'div',
        className : 'button-wrap',
        initialize: function(attrs){
            return this;
        },
        template : _.template(
            '<a class="button" href="<%= url %>"><%= title %></a>'
        ),
        render : function(){
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    return ButtonView;
})