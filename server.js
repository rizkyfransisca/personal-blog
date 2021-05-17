const express = require('express');
const cookieParser = require('cookie-parser')
//bring in mongoose
const mongoose = require('mongoose');

//bring in method override
const methodOverride = require('method-override');

const blogRouter = require('./routes/blogRoutes');
const adminRouter = require('./routes/adminRoutes');
const authRouter = require('./routes/authRoutes');
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
app.use(express.urlencoded({extended: true})) 
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'));

app.get('/', async(req,res)=>{
  let blogs = await Blog.find().sort({ timeCreated: 'desc' });
  res.render('indexViewer', { blogs: blogs });
})

app.use(express.static('public'));
app.use(authRouter)
app.use('/blog', blogRouter)
app.use('/admin', adminRouter)


app.get('*', function (req, res) {
  res.render('404');
});


//listen port
app.listen(process.env.PORT || 5000);
