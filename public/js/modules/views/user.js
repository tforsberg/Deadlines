define(['backbone','user', 'namespace', 'domReady!'],
    function(Backbone, User, NS){
        var UserView = Backbone.View.extend({
            initialize : function(){
                this.$name = this.$('.user-name');
                this.$icon = this.$('.user-icon');
                this.render();
            },
            render : function(){
                this.$name.html(this.model.get('firstName'));
                this.$icon.css({
                    'backgroundImage' : "url('"+this.model.get('pic')+"')"
                });
                return this;
            }
        });

        var el = Backbone.$('.wrap-login-info')[0];
        NS.UserView = (el)?new UserView({el:el,model:User}):UserView;
        return NS.UserView;
    });