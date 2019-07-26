const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/User');

// mongoose.connect('mongodb://localhost:27017/epicchat', {useNewUrlParser: true});

// mongoose.connect('mongodb://localhost:27017/epicchat');
mongoose.connect('mongodb://localhost:27017/epicchat').then(() => {
	console.log("Connected to Database");
}).catch((err) => {
	console.log("Not Connected to Database ERROR! ", err);
});
mongoose.Promise = global.Promise;

app.use(bodyParser.json());// paser all the requests that are going in and  out with json parser
app.use(express.static(path.join(__dirname,'../dist')));
//events listeners

app.post('register',(req,res) => {
	const newUser = new User({
		name: req.body.fullName,
		email: req.body.email
	});
	newUser.password = newUser.genarateHash(req,body.password);
	newUser.save().then(rec => {
		res.status(201).json(rec);
	});
});

app.post('login',(req,res) => {
	User.findOne({email: req.body.email}).then(loginUser => {
		if(!loginUser){
			return res.status(401).json({message: 'This email does not exist!'});
		}
		if(!loginUser.validatePassword(req.body.password)){
			return res.status(401).json({message: 'Invalid username or password!'});
		}
		res.status(200).json(loginUser);
	});
});

app.get('users',(req,res) => {
	User.find().then(rec => {
		res.status(200).json(rec);
	});
});

app.get('*',(req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'))
});

app.listen(3000, () => console.log('Listening on port 3000...'));