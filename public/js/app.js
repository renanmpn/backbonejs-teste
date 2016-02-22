var Category = Backbone.Model.extend();

var Categories = Backbone.Collection.extend({
    model: Category,    
    url: '/api/categories'
});

var CategoryView = Backbone.View.extend({
    tagName: "option",

    render: function(){
        this.$el.html(this.model.get("name"));
        this.$el.attr('value',this.model.get("id"));
        
        //this.$el.attr('value',this.model.get('id')).html(this.model.get('name'));
        return this;
    }
});

var CategoriesView = Backbone.View.extend({
    render: function(){
        var self = this;
        
        this.model.each(function(category){
           var categoryView = new CategoryView({model: category});
           self.$el.append(categoryView.render().$el); 
        });
    }
});

var categories = new Categories();
categories.fetch({
    success: function(){
        var categoriesView = new CategoriesView({el: "#category",model: categories});
        categoriesView.render(); 
    }
});

  
