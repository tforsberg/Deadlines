

define(['namespace', 'backbone', 'config', 'utils', './todo-item', 'domReady!'],
    function(NameSpace, Backbone, Config, Utils, TodoItem, DOM) {
        var TodoList = Backbone.Collection.extend({
            model : TodoItem,
            defaults : {
                isSortAscending : false
            },
            initialize : function(){
                var self = this;
                this.fetch({
                    success : function(collection, response, options){
                        self.trigger('initialized');
                        self.on({
                            "add" : this.saveToDB,
                            "remove" : this.removeFromDB
                        });
                    }
                });
                return this;
            },
            isInitialized : false,
            url : '/tasklist',
            comparator : 'dueDate',
            log : function(){
                console.log(arguments);
            }
        });

        NameSpace.TodoList =  new TodoList();
        return NameSpace.TodoList;
    });