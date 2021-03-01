const express = require('express');

//bring in mongoose
const mongoose = require('mongoose');

//bring in method override
const methodOverride = require('method-override');

const blogRouter = require('./routes/blogs');
const Blog = require('./models/Blog');
const app = express();

const URI = "mongodb+srv://rizkyfransisca:rizkyroyal456@cluster0.1kkmq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//connect to mongoose
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//set template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'));
//route for the index
app.get('/admin', async (req, res) => {
  let blogs = await Blog.find().sort({ timeCreated: 'desc' });
  if (user == true) {
      setTimeout(function () {
        user = false;
      }, 900000)
      res.render('indexAdmin', { blogs: blogs });
  } else {
      res.redirect('/admin/login');
  }
});

app.get('/', async(req,res)=>{
  let blogs = await Blog.find().sort({ timeCreated: 'desc' });
  res.render('indexViewer', { blogs: blogs });
})

app.get('/admin/logout',(req,res)=>{
  user = false
  res.redirect('/admin/login')
})

app.use(express.static('public'));
app.use('/blogs', blogRouter);

// admin
let user = false
app.get('/admin/login',(req,res)=>{
  user = false
  res.render('loginadmin')
})


let check = "";
app.post('/loginadmin', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username == "admin" && password == "rahasia") {
      user = true;
      res.redirect("/admin");
  } else if (username == "admin" && password != "rahasia") {
      check = "passwordsalah";
      res.redirect('/admin/login');
  } else if (username != "admin" && password == "rahasia") {
      check = "usernamesalah";
      res.redirect('/admin/login');
  } else {
      check = "keduanyasalah";
      res.redirect('/admin/login');
  }
})
app.get('*', function (req, res) {
  res.render('404');
});


//listen port
app.listen(process.env.PORT || 5000);
