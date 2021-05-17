const router = require('express').Router()
const authController = require('../controllers/authController')
const {validInfo} = require('../middleware/authMiddleware')

router.get('/login', authController.get_login)
router.post('/login',validInfo, authController.post_login)

module.exports = router