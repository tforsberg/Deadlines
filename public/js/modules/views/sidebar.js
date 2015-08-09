define(['namespace', 'utils', 'backbone', 'config', 'text!views/html/sidebar.html', 'models/todo-list', "domReady!", 'semantic-ui'],
    function(NS, utils, Backbone, Config, sideBarHTML, TodoList, DOM){

        var SideBar = Backbone.View.extend({
            //tagName : 'div',
            //className : 'ui left vertical inverted labeled icon sidebar overlay menu',
            initialize: function(attrs){

                var self = this;
                Backbone.$('#toggle-sidebar').click(function(){
                    if(!self.$el.hasClass('visible')){
                        self.$el.sidebar('toggle');
                    }
                });
                this.$sortbuttons = this.$('.toggle-sort');
                this.$sortbuttonIcons = this.$('.toggle-sort i');
                this.listenTo(TodoList, 'sort', this.updateIcons);
                return this;
            },
            events : {
                'click .toggle-sort.name' : 'toggleSortByName',
                'click .toggle-sort.dueDate' : 'toggleSortByDate',
                'click .toggle-sort-created' : 'toggleSortByCreationDate',
                'click .link-login' : 'login'
            },
            login : function(evt){
                //if (evt) evt.preventDefault();
                //utils.createCookie('deadlines_requestAuthentication', true);
                //location.reload(true);
            },
            toggleSortByDate : function(evt){
                if(evt) evt.preventDefault();
                if(TodoList.comparator == 'dueDate'){
                    Config.isSortAscending = !Config.isSortAscending;
                    TodoList.sort();
                } else{
                    TodoList.comparator = 'dueDate';
                    TodoList.sort();
                    TodoList.sort();
                }
                TodoList.trigger('render');
            },
            toggleSortByName : function(evt){
                if(evt) evt.preventDefault();
                if(TodoList.comparator == 'name'){
                    Config.isSortAscending = !Config.isSortAscending;
                    TodoList.sort();
                } else{
                    TodoList.comparator = 'name';
                    TodoList.sort();
                    TodoList.sort();
                }
                TodoList.trigger('render');
            },
            toggleSortByCreationDate : function(){
                console.log('sort by creation');
            },
            updateIcons : function(){
                this.$sortbuttonIcons.removeClass('active');
                var $activeSort = this.$('.toggle-sort.'+TodoList.comparator+'>i');
                if(Config.isSortAscending){
                    $activeSort.removeClass('descending');
                    $activeSort.addClass('ascending');
                } else {
                    $activeSort.removeClass('ascending');
                    $activeSort.addClass('descending');
                }
                $activeSort.addClass('active');
            },
            template : _.template(sideBarHTML, {
                exports: {
                    Config : Config
                }
            }),
            render : function(){
                //this.$el.html(this.template());
                this.$nameSortIcon = this.$('.icon.alphabet');
                this.$dateSortIcon = this.$('.icon.numeric');
                //this.$el.prependTo($('body'));
                this.$el.sidebar('toggle');
                setTimeout(function(){
                    this.$el.sidebar('toggle');
                }.bind(this), 1500);
                return this;
            }
        });

        var el = DOM.getElementById('sidebar');
        NS.Sidebar = (el)? new SideBar({el : el}).render(): NS.Sidebar = SideBar;
        return NS.Sidebar;
        //var sideBar = new SideBar();
        //sideBar.render();
        //return sideBar;
    });