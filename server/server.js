const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
var session = require('express-session');
var jsonParser = bodyParser.json();
var app = express();
const hbs = require('hbs');
const User = require('./schemas/user');
const nodeMailer = require('./nodeMailer');


app.use(bodyParser.urlencoded({ extended: false }));

const publicPath = path.join(__dirname,'./../public');
app.use(express.static(publicPath));

app.set('view engine', 'hbs');

var {mongoose} = require('./db/mongoose');

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: true
  }));

//cargar las rutas
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.get('/',(req,res)=>{
    res.render('index',{session: req.session.userId});
});

app.post('/test',(req,res)=>{
    console.log('se resibio este pedo',req.body);
    res.send(req.body);
});

app.post('/',(req,res)=>{
    var spo2 = req.body.spo2;
    var ecg = req.body.ecg;
    var userId = req.body.userId;
    if(spo2 <= 94){
        io.to(userId).emit('alerta');
    }
    console.log(req.body);
    console.log('spo2',spo2);
    console.log('ecg',ecg)
    console.log('----------------');
    io.to(userId).emit('spo2',spo2);
    io.to(userId).emit('ecg',ecg);
    res.status(200).send(req.body);
});

app.get('/profile',(req,res)=>{
    if(!req.session.userId){
        res.redirect('auth/login');
    }
    User.findById({_id: req.session.userId}).then((user)=>{
        console.log(user); 
        if(!user){
            return res.status(404).send();
        }
        var session = {
        userId: req.session.userId,
        name: user.username 
        }
        console.log(user);
        res.render('profile',session);  

    }).catch((e)=> res.status(400).send(e));
});

app.get('/grafica',(req,res)=>{
    res.render('grafica');
});

app.post('/grafica',jsonParser,(req,res)=>{
    var ecg = req.body.ecg;
    ecg = JSON.parse(ecg);
    console.log('ecg', ecg);
    console.log('ecg length',ecg.length);
    io.emit('grafica',ecg);
    res.status(200).send(req.body);
});

app.get('/monitoreo',(req,res)=>{
    const userId = req.session.userId;
    res.render('monitoreo',{userId});
});
//termina de cargar las rutas 

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket)=>{
    console.log('new user connected');

    socket.on('joinRoom',(data)=>{
        console.log('socket joining room',data.userId);
        socket.join(data.userId);
    });

    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
});

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`);
});
