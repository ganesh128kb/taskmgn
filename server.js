var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require('mysql');

/*------ Initialize ------*/

var app = express();
var ip = require('ip');

/*--------Body Parsing--------*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/*----------Session--------*/
var sess;
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

/*--------Template Engine--------*/
app.engine('html',require('ejs').renderFile); // render HTML Files
app.use('/public',express.static(__dirname+'/public')); // Folder Access

/*--------Mysql Connection--------
var connection = mysql.createPool({
    connectionLimit: 3,
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'bd2ae73e3c90c6',
    password: '37758202',
    database: 'heroku_cfcebe98f88ba97'
});
*/

/*--------Mysql Connection--------*/
var connection = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root123',
    password: 'root123',
    database: 'dbcms'
});

/*------Pages-------*/
app.get('/',function(req,res){
	sess=req.session;
	console.log(sess.email);	
	if(sess.email){
		res.redirect('/index');
	}
	else{res.render('login.html');}
})

app.get('/index',function(req,res){
	sess=req.session;
	console.log(sess.email);
	if(sess.email)	
	{
		res.render('index.html');
	}
	else
	{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href='+'/'+'>Login</a>');
	}
	
})

app.get('/SignUp',function(req,res){	
	res.render('signup.html');	
})

app.post('/restService',function(req,res){
	sess=req.session;
	sess.email = req.body.txtEmail;
	var reqPass = req.body.txtPass;	
	var txtPass = reqPass;
	var sessionId = sess.email;
	var _selQuery = "select * from tblregister where txtusername='"+sess.email+"'";
	connection.query(_selQuery,function(err, rows, fields){
		 if(err) { console.log(err.message);}
		 else { 
		 		if((rows.length)>0){
					var _qqPass = "select * from tblregister where txtusername='"+sess.email+"' and txtpassword='"+txtPass+"'";
						connection.query(_qqPass,function(err, rows, fields){
							 if(err) { console.log(err.message)}
							 else{
								 	console.log(rows.length);
									 if((rows.length)>0){										 
										 for(var i in rows){
											var _logId = rows[i].id;
											var qqUpdate = "update tblregister set txtsession='"+sessionId+"',txtIP='"+ip.address()+"',datetime=NOW() where id='"+_logId+"'";						
											connection.query(qqUpdate,function(err,rows,fields){
												if(err) {console.log(err.message);}
												else{res.send({response:'success',username: sess.email});	}
											})
										}										 
										 }
									 else{
										res.send({response:'UserName'});										
									 }
									
								}
					})					
			 	} 
				else{
					res.send({response:'WrongUserPass'});
				}
			  }		 
	})
})

/*--------Register--------*/
app.post('/regiService',function(req,res){	
	var reqFirstName = req.body.txtFirstName;
	var reqUsername = req.body.txtEmailid;
	var reqPassword = req.body.txtPass;		
	var txtPass = reqPassword;		
	var _selQuery = "select * from tblregister where txtusername='"+reqUsername+"'";
	connection.query(_selQuery,function(err, rows, fields){
		 if (err) { console.log(err.message);}
		 else{
			 	if((rows.length)>0){res.send({response:'already'});}				
				else{
					var queryInsert = "insert into tblregister(txtfirstname,txtusername,txtpassword,txtIP,datetime)values('"+reqFirstName+"','"+reqUsername+"','"+txtPass+"','"+ip.address()+"',NOW())";
					console.log(queryInsert);
					connection.query(queryInsert,function(err,rows,fields){
						if(err){
								console.log(err.message);}
								else{
									res.end('success'+reqFirstName);
							}
						 })
					}
			 }
	})
})


app.get('/getService',function(req,res){	
	var user_id = req.param('username');
	var querySel = "select * from tbllisting where txtusername ='"+user_id+"' and status = 0 order by id ASC";	
	connection.query(querySel,function(err, rows, fields){
		if (err){
			console.log(err);
			throw err;
		}
		var finalresponse = JSON.stringify(rows);
		res.setHeader('Content-Type', 'application/json');
		res.send(finalresponse);		
	})
})

app.post('/listService',function(req,res){
	var reqFirstName = req.body.txtName;
	var reqLastName = req.body.txtLastname;
	var reqEmailid = req.body.txtEmailid;
	var reqPhone = req.body.txtPhone;
	var reqUsrName = req.body.txtusername;
	
	var queryInsert = "insert into tbllisting (txtName,txtLastname,txtEmailid,txtPhone,txtusername,datetime)values('"+reqFirstName+"','"+reqLastName+"','"+reqEmailid+"','"+reqPhone+"','"+reqUsrName+"',NOW())";
	console.log(queryInsert);
	connection.query(queryInsert,function(err,rows,fields){
	if(err){
			console.log(err.message);}
			else{res.end('success')
		}
	 });	
})

app.post('/delService',function(req,res){
	var reqFirstName = req.body.delRedId;	
	var queryDel = "update tbllisting set status = 1 where id = '"+reqFirstName+"'";	
	connection.query(queryDel,function(err,rows,fields){
	if(err){
			console.log(err.message);}
			else{res.end('success');
			}
	 })
})

app.get('/logout',function(req,res){
	
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/');
		}
	});

});
app.get('*',function(req,res){
	res.send('404 Error page not found');
})

/*------- Server ---------*/
var port = Number(process.env.PORT || 3000);
app.listen(port);