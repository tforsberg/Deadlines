define(['backbone','namespace','config', 'text!views/html/toast.html'],
    function(Backbone, NameSpace, Config, toastHtml){
        var ToastView = Backbone.View.extend({
            tagName : 'div',
            className : 'ui compact message black container-toast',
            initialize: function(attrs){
                this.message = attrs.content || attrs;
                return this;
            },
            events : {
                'click .btn-close' : 'exit'
            },
            exit : function(){
                this.remove();
            },
            template : _.template(toastHtml),
            render : function(){
                this.$el.html(this.template({
                    'message': this.message
                }));
                Backbone.$('body').append(this.$el);
                var self = this;
                setTimeout(function(){
                    self.exit()
                }, 2500);
                return this;
            }
        });

        return ToastView;
    });