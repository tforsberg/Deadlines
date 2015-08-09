define(['backbone', 'namespace','config', 'utils', 'user', 'text!views/html/todo-item.html', 'moment', 'timePicker', 'datePicker', 'history', 'domReady!'],
    function(Backbone, NameSpace, Config, Utils, User, todoItemHtml, moment){
        var TodoItemView = Backbone.View.extend({
            tagName:  'li',
            className : 'todo-item card',
            initialize : function(){
                //console.log('TodoItemView.initialize(): ', this);
                this.el.id = this.model.get('_id');
                this.listenTo(this.model, 'change:dueDate', this.updateDueDateText);
                //this.listenTo(this.model, 'change:dueDate', function(arguments){
                //    console.log(arguments);
                //})
            },
            events : {
                'blur input' : 'updateValues'
                ,'click .btn-set-date' : 'onShowDateSettings'
                ,'click .btn-set-time' : 'onShowTimeSettings'
                ,'click .toggle-options' : 'onToggleOptions'
                ,'click .btn-add-comment' : 'onAddComment'
                ,'click .toggle-comment-bar' : 'onToggleComments'
                ,'click .btn-remove' : 'onDelete'
                ,'click .btn-save' : 'updateValues'
                //,'change' : 'render'
            },
            onShowTimeSettings : function(evt){
                if(evt) evt.preventDefault();
                this.timePicker.open(false);

                //location.hash = 'settime';
            },
            onShowDateSettings : function(evt){
                if(evt) evt.preventDefault();
                this.datePicker.open(false);
            },
            onToggleOptions : function(){
                this.toggleView('wrap-options-menu');
            },
            onToggleComments : function(){
                this.toggleView('comment-bar');
            },
            onAddComment : function(){
                //console.log('adding comment: ',this.$('input[name="new-comment"]'));
                var self = this,
                    newComment = {
                    body : this.$('.comment-input').val() || this.$('.comment-input').html(),
                    author : User.get('name'),
                    iconUrl : User.get('pic'),
                    postTime : new Date()
                };
                this.model.save('comments', this.model.get('comments').concat([newComment]), {
                    success : function(){
                        self.render();
                    }
                });
            },
            onDelete : function(evt){
                if (evt) evt.preventDefault();
                //console.log(self, evt);
                var $targetEl = this.$(evt.currentTarget),
                    restore = $targetEl.html(),
                    self = this;
                $targetEl.html('Sure?');
                $targetEl.one('click', function(event){
                    if (event.currentTarget == evt.currentTarget){
                        self.model.destroy({
                            success : function(){
                                self.remove();
                            },
                            error : function(){
                                $targetEl.html(restore);
                            }
                        });
                    } else{
                        $targetEl.html(restore);
                    }
                });
                return this;
            },
            toggleView: function(selector){
                this.$('.wrap-toggle-section').each(function(index, el){
                    var $el = Backbone.$(el);
                    //console.log($thisEl);
                    if($el.hasClass(selector)){
                        $el.toggleClass('toggled');
                        if ($el.hasClass('toggled')){
                            $el.fadeIn();
                        } else{
                            $el.fadeOut();
                        }
                    } else{
                        $el.removeClass('toggled').hide();
                    }
                });
            },
            log : function(){
                console.log('log: ', arguments);
            },
            initPickers : function(){
                var self = this;
                self.$inputs.each(function(index, el){
                    var $input = jQuery(el);
                    //console.log('init: ', $input);
                    if($input.hasClass('date-input')) {

                        self.$dateInputEl = $input.pickadate({
                            'format' : 'mmm dd, yyyy'
                        });
                        self.datePicker = self.$dateInputEl.pickadate('picker');
                        self.datePicker.on({
                            set : self.updateValues.bind(self)
                        });

                    } else if($input.hasClass('time-input')){

                        self.$timeInputEl = $input.pickatime({
                            min: [8,30],
                            max: [18,30]
                        });
                        self.timePicker = self.$timeInputEl.pickatime('picker');
                        self.timePicker.on({
                            set : self.updateValues.bind(self)
                        });
                    } else if($input.attr('type') == 'text'){
                        // init task name
                    } else{
                        console.warn('Wasted initialization on todo-item unknown input el.');
                    }

                });
                return self;
            },
            updateDueDateText : function(){
                this.$date.html('Due '+Utils.timeUntil(this.model.get('dueDate')));
            },
            updateValues : function(){
                var self = this,
                    updatedDueDateString = this.timePicker.get('value')+" "+this.datePicker.get('value'),
                    updatedDueDate = moment(updatedDueDateString, 'h:mm A MMMM DD, YYYY');
                this.model.save({
                    dueDate: new Date(updatedDueDate.toDate()),
                    name : this.$name.val()
                }, {
                    success : function(model, response, options){
                        //console.log('saved: ', model);
                        //self.render();
                    }
                });
            },
            compileHTML : _.template(todoItemHtml, {
                imports : {
                    utils : Utils,
                    _ : _
                }
            }),
            render : function(){
                //console.log('todo-item.render()');
                this.$el.html(this.compileHTML({ 'model': this.model}));
                this.$inputs = this.$('input.duedate');
                this.$name = this.$("input[name='name']");
                this.$date = this.$('a.date');
                this.initPickers();

                return this;
            }
        });

        NameSpace.TodoItemView = TodoItemView;
    return NameSpace.TodoItemView;
});