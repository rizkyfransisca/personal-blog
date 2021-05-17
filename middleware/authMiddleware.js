const jwt = require('jsonwebtoken')

const validInfo = (req,res,next) => {
    const {email,password} = req.body
    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
    if(req.path === '/login'){
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json({msg: 'Format email tidak sesuai'});
        }
    }
    next()
}

const requireAuth = (req,res,next) => {
    // req.cookies.jwt => jwt adalah nama cookies yang ada pada cookies page
    const token = req.cookies.jwt_admin
    
    // check json web token exists & is verified
    // jika token di temukan, atau ada cookies bernama jwt di dalam cookies page
    if(token){
        jwt.verify(token, 'blogsecret123456', (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.cookie('context', 'Token is not valid', {httpOnly: true,maxAge: 3 * 24 * 60 * 60 * 1000})
                res.redirect('/login')
            }else{
                console.log(decodedToken, " authMiddleware.js requireAuth");
                next()
            }
        })
    }else{ // jika token tidak di temukan, atau tidak ada cookies bernama jwt di dalam cookies page
        res.cookie('context', 'Authorization denied', {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000})
        res.redirect('/login')
    }
}

module.exports = {requireAuth, validInfo}