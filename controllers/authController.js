const jwt = require('jsonwebtoken')
require('dotenv').config()

const maxAge = 3 * 24 * 60 * 60
const createToken = (email) => {
    return jwt.sign({email}, 'blogsecret123456', {
        expiresIn: maxAge
    })
}

module.exports.get_login = (req,res) => {
    try {
        const context = req.cookies['context']
        if(context){
            res.cookie('context','', {maxAge: 1})
            res.render('loginadmin', {context: context})
        }else{
            res.render('loginadmin', {context: false})
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports.post_login = async (req,res) => {
    const {email, password} = req.body
    try {
        
        if(email !== process.env.email_admin && password !== process.env.password_admin){
            return res.status(401).json({msg: 'email dan password salah'})
        }else if(email !== process.env.email_admin && password === process.env.password_admin){
            return res.status(401).json({msg: 'email yang anda masukkan salah'})
        }else if(email === process.env.email_admin && password !== process.env.password_admin){
            return res.status(401).json({msg: 'password yang anda masukkan salah'})
        }
        const token = createToken(email)
        res.cookie('jwt_admin', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({user: email})
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
}