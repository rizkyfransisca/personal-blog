const router = require('express').Router()
const blogController = require('../controllers/blogController')

router.get('/:slug', blogController.get_blog_slug)
router.post('/contact', blogController.post_blog_contact)

module.exports = router