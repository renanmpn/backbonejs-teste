//Category Model and Collection
var Category = Backbone.Model.extend();

var Categories = Backbone.Collection.extend({
    model: Category,    
    url: '/api/categories'
});


//Category View to fill the select input
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

//Board Model and Collection
var Board = Backbone.Model.extend({urlRoot:'/api/boards'});
var Boards = Backbone.Collection.extend({
    model: Board
});


//Board View to fill the select input
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
        if(categoryId){
            this.setCategoryId(categoryId);    
        }else{
            this.collection.reset();
            this.collection.add({id:"",name:"Selecione um board"})
            this.render();
        }        
        
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






//Call the function to fill the select
var categories = new Categories();
categories.fetch({
    success: function(){
        var categoriesView = new CategoriesView({el: "#category",model: categories});
        categoriesView.render(); 
    }
});


var boardsView = new BoardsView({el: $("#board"),collection: new Boards()});


// Listen the click event to change the layout  
var ChangeView = Backbone.View.extend({
    events: {
    "click": "changeLayout"
    },
    
    changeLayout: function(){
        
        //Getting the Id of Category and Board
        var boardId = $("#board").val();
        var categoryId = $("#category").val();
        
        if(boardId){
            //Finding the models
            var board = boardsView.collection.where({id:parseInt(boardId)})[0];
            var category = categories.where({id:parseInt(categoryId)})[0];    
            
            //Setting the layout
            $("#main").text(board.get("name"));
            $("#second").text(category.get("name"));
            if(board.get("background_image")){
                $(".board").css("background-image", "url("+ board.get("background_image") + ")");
                $("#main,#second").css("color","white");
            }else{
                $(".board").css("background-image", "none");
                $("#main,#second").css("color","black");
            }
        }
    }
});




var changeView = new ChangeView({ el: $('#change') });