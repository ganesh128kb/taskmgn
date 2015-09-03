var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');

/*------ Initialize ------*/

var app = express();
var ip = require('ip');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
	
/*--------Encrypt--------*/
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

/*--------Body Parsing--------*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/*----------Session--------*/
var sess;
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}));

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
	if(sess.email){
		res.redirect('/index');
	}
	else{res.render('login.html');}
})

app.get('/index',function(req,res){	
	res.render('index.html');
})

app.get('/SignUp',function(req,res){	
	res.render('signup.html');	
})

app.post('/restService',function(req,res){
	sess=req.session;
	sess.reqUser = req.body.txtEmail;
	var reqPass = req.body.txtPass;	
	var txtPass = encrypt(reqPass);
	var sessionId = encrypt(sess.reqUser);
	var _selQuery = "select * from tblregister where txtusername='"+sess.reqUser+"'";
	connection.query(_selQuery,function(err, rows, fields){
		 if(err) { console.log(err.message);}
		 else { 
		 		if((rows.length)>0){
					var _qqPass = "select * from tblregister where txtusername='"+sess.reqUser+"' and txtpassword='"+txtPass+"'";
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
												else{res.send({response:'success',username: sess.reqUser});	}
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
		 /*
		 	var _qqPass = "select * from tblregister where txtusername='"+sess.reqUser+"' and txtpassword='"+txtPass+"'";
					connection.query(_selQuery,function(err, rows, fields){
						 if(err) { console.log(err.message)}
						 else 
						 	{
								res.send({response:'UserPass'}); 
							}
					})
		 else{ 
				if((rows.length)>0){
					for(var i in rows){
						var _logId = rows[i].id;
						var qqUpdate = "update tblregister set txtsession='"+sessionId+"',txtIP='"+ip.address()+"',datetime=NOW() where id='"+_logId+"'";						
						connection.query(qqUpdate,function(err,rows,fields){
							if(err) {console.log(err.message);}
							else{res.send({response:'success',username: sess.reqUser});	}
						})
					}
				}
				else{
					res.end('wrong');
				}
			}*/
	})
})

/*--------Register--------*/
app.post('/regiService',function(req,res){	
	var reqFirstName = req.body.txtFirstName;
	var reqUsername = req.body.txtEmailid;
	var reqPassword = req.body.txtPass;		
	var txtPass = encrypt(reqPassword);		
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
		/*var objToJson = rows;
		var response = [];
		for (var key in rows) {
			response.push(rows[key]);
		}
		objToJson.response = response;*/
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
	var queryDel = "delete from tbllisting where id = '"+reqFirstName+"'";	
	connection.query(queryDel,function(err,rows,fields){
	if(err){
			console.log(err.message);}
			else{res.end('success');
			}
	 })
})

app.get('*',function(req,res){
	res.send('404 Error page not found');
})

/*------- Server ---------*/
var port = Number(process.env.PORT || 3000);
app.listen(port);