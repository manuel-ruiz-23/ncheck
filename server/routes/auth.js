const router = require('express').Router();
const User = require('./../schemas/user');
const path = require('path');

router.get('/registro',(req,res)=>{
    res.render('registro');
});

router.post('/registro',(req,res)=>{
    
    if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {

        var userData = {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          passwordConf: req.body.passwordConf,
        }

        var user = new User(userData);
        user.save().then((newUser)=>{
            console.log('usuario registrado:',newUser);
            req.session.userId = newUser._id;
            res.redirect('/');
        },(e)=>{
            res.status(400).send(e);
        });
      }
});

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login',(req,res)=>{
    
    if(req.body.email && req.body.password){     

        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user) {
              var err = new Error('Wrong email or password.');
              err.status = 401;
              res.send(err);
            } else {
              req.session.userId = user._id;
              return res.redirect('/profile');
            }
          });
    }
});

router.post('/micro',(req,res)=>{
    console.log('vinculando dispositivo Ncheck');
    console.log(req.body);

    if(req.body.email && req.body.password){   

        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user) {
              res.status(401);
              res.send('usuario no encontrado');
            } else {
              res.send(user._id);
            }
          });
    }
});

router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
