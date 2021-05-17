const router = require('express').Router()
const adminController = require('../controllers/adminController')
const {requireAuth} = require('../middleware/authMiddleware')

router.get('/new',requireAuth, adminController.get_admin_new_blog)
router.post('/new',requireAuth, adminController.post_admin_new_blog)
router.get('/view/:slug',requireAuth, adminController.get_admin_slug)
router.get('/edit/:id',requireAuth, adminController.get_admin_edit_blog)
router.put('/edit/:id',requireAuth, adminController.put_admin_edit_blog)
router.delete('/:id',requireAuth, adminController.delete_admin_blog)
router.get('/contact',requireAuth, adminController.get_admin_list_contact)
router.get('/contact/send-mail/:id',requireAuth, adminController.get_admin_send_email)
router.post('/contact/send-mail',requireAuth, adminController.post_admin_send_email)
router.delete('/contact/:id',requireAuth, adminController.delete_admin_list_contact)
router.get('/',requireAuth, adminController.get_admin_page)

module.exports = router