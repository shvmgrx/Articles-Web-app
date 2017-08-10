var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs=require('mongojs');
var db = mongojs('customerapp', ['users']);

var app = express();

/*
var logger=function(req,res,next){
	console.log('Logging');
	next();
}

app.use(logger);
*/
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')))

app.use(function(req,res,next){
	res.locals.errors=null;
	next();

})


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var users=[
{
	id:1,
	first_name:"Shivam",
	last_name:"Goraksha",
},
{
	id:2,
	first_name:"Shawn",
	last_name:"Mendes",
},
{
	id:3,
	first_name:"Ricky",
	last_name:"Martin",
}
]

app.get('/',function(req,res){
	db.users.find(function(err,docs){
	console.log(docs);
	
		res.render('index',{
		title:'Customers',
		users:docs
	});
	})

});


app.post('/users/add',function(req,res){
	
	req.checkBody('first_name','First name is required').notEmpty();
	req.checkBody('last_name','Last name is required').notEmpty();

	var errors =req.validationErrors();

	if(errors){
		res.render('index',{
		title:'Customers',
		users:users,
		errors: errors
	});
	}
	else{
		var newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name
		}
		
		db.users.insert(newUser,function(err,result){
			if(err){
				console.log(err);
			}
			res.redirect('/');
		});
		

	}

	

		
});



app.listen(8001, function(){
	console.log('Server started on Port 8001...');
})