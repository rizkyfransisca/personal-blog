require('dotenv').config()
const { request, response } = require('express');
const express = require('express');
const Blog = require('./../models/Blog');
const Contact = require('./../models/Contact')
const router = express.Router();
const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const CLIENT_ID = '645057018506-bc56gr1c20gqvq3jb137f5rqhd28lnrf.apps.googleusercontent.com'
const CLIENT_SECRET = 'cM3JOKNZCeSi_xrxomTWd4vJ'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04AuXU4V7tCsLCgYIARAAGAQSNwF-L9Ir17At4_kszvTdEjkg9U-ahS5WKbuNEAzapQg39e5ga9VdVFvbPMuJTxzZn3wsJ0eYV38'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

router.get('/new', (req, res) => {
  res.render('new');
});

router.get('/admin/contact',async(req,res)=>{
  let contacts = await Contact.find().sort({ timeCreated: 'desc' })
  res.render('contact', { contacts: contacts });
})

router.get('/admin/send-mail/:id',async(req,res)=>{
  let user = await Contact.findById(req.params.id);
  res.render('sendMail', {user : user})
})

router.post('/send-mail',async(req,res)=>{
  try {
    const accessToken = await oAuth2Client.getAccessToken()
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          type: 'OAuth2',
          user: process.env.EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken
      }
    })
  
    let mailOption = {
        from: 'rizky.royal@gmail.com',
        to: `${req.body.email}`,
        subject: `${req.body.subject}`,
        text: `${req.body.description}`
    }
  
  // Step 3
    await transporter.sendMail(mailOption,function(err,data){
        if(err){
            console.log("Error Occurs",err);
        }else{
            console.log("Email sent!!!");
        }
    })
    res.render('successMail')
  } catch (error) {
    console.log(error);
  }
})

router.post('/contacts',async(req,res)=>{
  let contact = new Contact({
    nama: req.body.nama,
    email: req.body.email,
    telp: req.body.telp,
    pesan: req.body.pesan
  });

  try {
    contact = await contact.save();
    res.render('thankyou')
  } catch (error) {
    console.log(error);
  }
})

//view route
router.get('/admin/:slug', async (req, res) => {
  let blog = await Blog.findOne({ slug: req.params.slug });

  if (blog) {
    res.render('showAdmin', { blog: blog });
  } else {
    res.redirect('/admin');
  }
});

router.get('/:slug',async(req,res)=>{
  let blog = await Blog.findOne({ slug: req.params.slug });

  if (blog) {
    res.render('showViewer', { blog: blog });
  } else {
    res.redirect('/');
  }
})

//route that handles new post
router.post('/', async (req, res) => {
  let blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description
  });

  try {
    blog = await blog.save();
    res.redirect(`blogs/admin/${blog.slug}`);
  } catch (error) {
    console.log(error);
  }
});

// route that handles edit view
router.get('/edit/:id', async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  res.render('edit', { blog: blog });
});

//route to handle updates
router.put('/:id', async (req, res) => {
  req.blog = await Blog.findById(req.params.id);
  let blog = req.blog;
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.description = req.body.description;

  try {
    blog = await blog.save();
    //redirect to the view route
    res.redirect(`/blogs/admin/${blog.slug}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/seblogs/edit/${blog.id}`, { blog: blog });
  }
});

///route to handle delete
router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

router.delete('/delete-mail/:id',async(req,res)=>{
  await Contact.findByIdAndDelete(req.params.id);
  res.redirect('/blogs/admin/contact')
})


module.exports = router;
