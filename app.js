var fs = require('fs');

var express = require("express");
var app     = express();

var path    = require("path");

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(express.static(__dirname + '/public'));

//Reading the data files
var categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));
var boards = JSON.parse(fs.readFileSync('./data/boards.json', 'utf8'));

//Sort category by name
categories.sort(_compareName);

function _compareName(a,b) {
  if (a.name < b.name)
    return -1;
  else if (a.name > b.name)
    return 1;
  else 
    return 0;
}


function _compareDefault(a,b){
    if(a.default == true && b.default == false){
        return -1;
    }else if (a.default == false && b.default == true){
        return 1;
    }else {
        return 0;
    }
}

function _filterByCategories(categorie){
    return function(obj){
        if('category_id' in obj && obj.category_id == categorie){
            return true;
        }else{
            return false;
        }
    }
}
    
/**
 * Check if the category exists
 */
function _checkCategory(cat){
    for(var x of categories){
        if(x.id == cat){
            return true;
        }
    }
    return false;
}    
    
/**
 * GET function to get all the categories
 */
app.get('/api/categories',function(req,res){
    res.status(200).jsonp(categories);
});


/**
 * GET function that return all the boards based on the category passed
 */
app.get('/api/boards/:category',function(req,res){
    
    var category = req.params.category;
    console.log(category);
    if(category){
        if(!isNaN(category)){            
            if(_checkCategory(category)){
                //It will filter the category by the Id and sort putting the default true on top   
                res.status(200).jsonp(boards.filter(_filterByCategories(category)).sort(_compareDefault)); 
            }else{
                res.status(500).jsonp({error:true,message:'This category does not exist.'});    
            }
        }else{
            res.status(500).jsonp({error:true,message:'Category field is not a number.'});    
        }
    }else{
        res.status(500).jsonp({error:true,message:'Category field is missing. Please check your POST call.'});
    }
});




app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/public/view/index.html'));
	//__dirname : It will resolve to your project folder.
});

app.get('/index.html',function(req,res){
	res.sendFile(path.join(__dirname+'/public/view/index.html'));
	//__dirname : It will resolve to your project folder.
});

app.listen(3000);
console.log("Running at Port 3000");