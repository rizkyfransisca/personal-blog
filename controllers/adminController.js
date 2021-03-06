require('dotenv').config()
const express = require('express');
const Blog = require('./../models/Blog');
const Contact = require('./../models/Contact')
const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const CLIENT_ID = '645057018506-bc56gr1c20gqvq3jb137f5rqhd28lnrf.apps.googleusercontent.com'
const CLIENT_SECRET = 'cM3JOKNZCeSi_xrxomTWd4vJ'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04AuXU4V7tCsLCgYIARAAGAQSNwF-L9Ir17At4_kszvTdEjkg9U-ahS5WKbuNEAzapQg39e5ga9VdVFvbPMuJTxzZn3wsJ0eYV38'
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
module.exports.get_admin_new_blog = (req,res) => {
    res.render('new');
}

module.exports.post_admin_new_blog = async (req,res) => {
    let blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description
    });
    
    try {
        blog = await blog.save();
        res.redirect(`/admin/view/${blog.slug}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports.get_admin_slug = async (req,res) => {
    let blog = await Blog.findOne({ slug: req.params.slug });

    if (blog) {
        res.render('showAdmin', { blog: blog });
    } else {
        res.redirect('/admin');
    }
}

module.exports.get_admin_edit_blog = async (req,res)=>{
    let blog = await Blog.findById(req.params.id);
    res.render('edit', { blog: blog });
}

module.exports.put_admin_edit_blog = async (req,res) => {
    req.blog = await Blog.findById(req.params.id);
    blog = req.blog;
    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.description = req.body.description;

    try {
        blog = await blog.save();
        //redirect to the view route
        res.redirect(`/admin/view/${blog.slug}`);
    } catch (error) {
        console.log(error);
        res.redirect(`/admin/edit/${blog.id}`, { blog: blog });
    }
}

module.exports.delete_admin_blog = async (req,res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
}

module.exports.get_admin_list_contact = async (req,res) => {
    let contacts = await Contact.find().sort({ timeCreated: 'desc' })
    res.render('contact', { contacts: contacts });
}

module.exports.get_admin_send_email = async (req,res) => {
    let user = await Contact.findById(req.params.id);
    res.render('sendMail', {user : user})
}

module.exports.post_admin_send_email = async (req,res) => {
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
            },
            tls: {
                rejectUnauthorized: false
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
}

module.exports.delete_admin_list_contact = async (req,res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/admin/contact')
}

module.exports.get_admin_page = async (req,res) => {
    let blogs = await Blog.find().sort({ timeCreated: 'desc' });
    res.render('indexAdmin', { blogs: blogs });
}

