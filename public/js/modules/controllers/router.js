define(['backbone', 'namespace', 'utils', './views/todo-list', 'history'],function(Backbone, NameSpace, Utils, TodoListView, history){
    var Router = Backbone.Router.extend({
        initialize : function(){
            _.extend(this, Backbone.Events);
            //Backbone.$(window).ready(function(){
            //    Backbone.history.start({root: "deadlines"});
            //});
        },
        routes : {
            "settime" : 'settime/:id',
            "setdate" : 'setdate/:id',
            "*path" : 'home'
        },
        setTime : function(id){
            console.log('settime: ', id, TodoListView.collection);
        },
        setDate : function(id){
            console.log('setdate', arguments, TodoListView.collection);
        },
        home : function(){
            console.log('home');
            //this.trigger('closeAll');
        }
    });

    NameSpace.Router =  new Router();
    return NameSpace.Router;
});