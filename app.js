
 
 


  
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  const nodemailer = require('nodemailer')
  require('dotenv').config()
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  const users = []
  app.use(express.static(__dirname+'/public'));
  app.use('/public', express.static('public'));
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: 'session-secret-here',
    resave: false,
    saveUninitialized: true,
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.render('dashboard.ejs', { name: req.user.name })
  })
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })

  app.get('/',  (req, res) => {
    res.render('home.ejs')
  })
  app.get('/shop',  (req, res) => {
    res.render('shop.ejs')
  })
  app.get('/about',  (req, res) => {
    res.render('about.ejs')
  })
  app.get('/contact',  (req, res) => {
    res.render('contact.ejs')
  })

  app.post('/', (req, res)=>{
    const userName = process.env.MY_USER_NAME
    const mypassword = process.env.MY_PASSWORD
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: userName,
        pass: mypassword,
      }
    })
    const mailOptions = {
      from: req.body.email,
      to: userName,
      text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info)=>{
      if(error){
        console.log(error)
        res.send('error')
      }else{
        console.log('Email sent:' + info.response)
        res.send('Success')
      }
    })
  })
  app.get('/blog',  (req, res) => {
    res.render('blog.ejs')
  })
  
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.fname,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.delete('/logout', (req, res) => {
    req.logout(function(err){
      if(err){
         return next(err); 
      }
      res.redirect('/login');
    })
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/home')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard')
    }
    next()
  }
  
  app.listen(3000, ()=>{
    console.log('Port has started')
  })