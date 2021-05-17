const router = require('express').Router()
const adminController = require('../controllers/adminController')

router.get('/new', adminController.get_admin_new_blog)
router.post('/new', adminController.post_admin_new_blog)
router.get('/view/:slug', adminController.get_admin_slug)
router.get('/edit/:id', adminController.get_admin_edit_blog)
router.put('/edit/:id', adminController.put_admin_edit_blog)
router.delete('/:id', adminController.delete_admin_blog)
router.get('/contact', adminController.get_admin_list_contact)
router.get('/contact/send-mail/:id', adminController.get_admin_send_email)
router.post('/contact/send-mail', adminController.post_admin_send_email)
router.delete('/contact/:id', adminController.delete_admin_list_contact)
router.get('/', adminController.get_admin_page)

module.exports = router