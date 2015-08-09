define(['namespace', 'backbone', 'config', 'utils', '../models/todo-list', './todo-item', 'domReady!','htmlSortable'],
    function(NameSpace, Backbone, Config, Utils, TodoList, TodoItemView, DOM){

        var TodoListView = Backbone.View.extend({
            initialize : function(){
                this.taskViews = [];
                if (this.collection.isInitialized){
                    console.log('list initiated. rendering...');
                    this.hideLoadScreen();
                    this.render();
                } else{
                    console.warn('waiting for initialization');
                    this.listenTo(this.collection, 'initialized', function(){
                        this.hideLoadScreen();
                        this.render();
                    });
                };
                this.listenTo(this.collection, 'sync', function(){
                    Utils.makeToast('Saved.');
                });
                this.listenTo(this.collection, 'render', function(){
                    this.render(arguments);
                });
                this.$list = this.$('#list');
                //this.$list.sortable();
                return this;
            },
            events : {
                'click .btn-add' : 'addItem'
            },
            log : function(){
                console.log(arguments);
            },
            hideLoadScreen : function(){
                Backbone.$('body').addClass('initialized');
                //this.$el.resize();
            },
            addItem : function(){
                var newTask = this.collection.create();
                var newTaskView = new TodoItemView( {
                    model: newTask
                } );
                this.saveTaskView(newTaskView);
                this.$list.append(newTaskView.render().$el);
                return this;
            },
            saveTaskView : function(taskViewObj){
                this.taskViews.push(taskViewObj);
            },
            render : function(){
                this.$list.html('');
                this.taskViews = [];
                var container = document.createDocumentFragment(),
                    $container = Backbone.$(container),
                    self = this;
                this.collection.sort();
                _.forEach(this.collection.models, function(model, index, arr){
                    var newTaskView = new TodoItemView( {
                        model: model
                    } );
                    self.saveTaskView(newTaskView);
                    if(Config.isSortAscending){
                        $container.append(newTaskView.render().$el);
                    } else{
                        $container.prepend(newTaskView.render().$el);
                    }
                });
                this.$list.prepend($container);
                return this;
            }
        });

        var el = DOM.getElementById('todo-list');
        NameSpace.TodoListView = (el)?NameSpace.TodoListView= new TodoListView({el:el, collection:TodoList}):TodoListView;
        return NameSpace.TodoListView;

    });