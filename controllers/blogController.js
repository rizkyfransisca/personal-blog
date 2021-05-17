const Blog = require('../models/Blog')
const Contact = require('../models/Contact')

module.exports.get_blog_slug = async (req,res) => {
    let blog = await Blog.findOne({ slug: req.params.slug });

    if (blog) {
        res.render('showViewer', { blog: blog });
    } else {
        res.redirect('/');
    }
}

module.exports.post_blog_contact = async (req,res) => {
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
}