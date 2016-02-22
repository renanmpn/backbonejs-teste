var Category = Backbone.Model.extend();

var Categories = Backbone.Collection.extend({
    model: Category,    
    url: '/api/categories'
});



var CategoryView = Backbone.View.extend({
    tagName: "option",

    render: function(){      
        this.$el.attr('value',this.model.get('id')).html(this.model.get('name'));
        return this;
    },
    setSelectedId: function(categoryId) {
            this.boardsView.selectedId = null;
            this.boardsView.setCategoryId(categoryId);
            
    }
});

var CategoriesView = Backbone.View.extend({
    events: {
        "change": "changeSelected"
    },
    render: function(){
        var self = this;
        
        this.model.each(function(category){
           var categoryView = new CategoryView({model: category});
           self.$el.append(categoryView.render().$el); 
        });
    },
    changeSelected: function(){
        boardsView.setSelectedId(this.$el.val());
    }
});


var Board = Backbone.Model.extend({urlRoot:'/api/boards'});
var Boards = Backbone.Collection.extend({
    model: Board
});



var BoardView = Backbone.View.extend({
    tagName: "option",

    render: function(){
        $(this.el).attr('value',
            this.model.get('id')).html(this.model.get('name'));
        return this;
    }
});

var BoardsView = Backbone.View.extend({
    setSelectedId: function(categoryId) {        
        this.setCategoryId(categoryId);
    },
    setCategoryId: function(countryId) {
        this.populateFrom("/api/boards/"+countryId);
    },
    populateFrom: function(url) {
        this.collection.url = url;
        this.collection.fetch({
            success: function(){ 
                               
                boardsView.render();
            }
        });
        
    },
    render: function() {
        this.$el.empty();
		this.collection.each(function( item ){
			this.renderBoard( item );
		}, this);
	},
	renderBoard: function ( item ) {
		var boarview = new BoardView ({
			model: item
		});            
		this.$el.append( boarview.render().el );
	}
});







var categories = new Categories();
categories.fetch({
    success: function(){
        var categoriesView = new CategoriesView({el: "#category",model: categories});
        categoriesView.render(); 
    }
});


var boardsView = new BoardsView({el: $("#board"),collection: new Boards()});


  
