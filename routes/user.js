const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelper = require('../helpers/product-helper');
const userhelper = require('../helpers/user-helper')


const varifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/',async function  (req, res, next) {
  let user= req.session.user
  let cartCount=null
  if(req.session.user){
     cartCount=await userhelper.getCartCount(req.session.user._id)
  }

  productHelper.GetAllProduct().then((products) => {
    res.render('user/view-product', { products,user, admin: false,cartCount })
  })
  router.get('/login', (req, res) => {
    if(req.session.loggedIn){
      res.redirect('/')
    }else{
      res.render('user/login',{login_email_err: req.session.login_email_err,login_password_err: req.session.login_password_err})
      req.session.login_email_err=null
        req.session.login_password_err=null
    }
    

  })
  router.post('/login', (req, res) => {
    userhelper.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.loggedIn = true
        req.session.user = response.user
        res.redirect('/')
      } else {
        req.session.login_email_err="invalide Email Address"
        req.session.login_password_err="invalide password"
        res.redirect('/login')
      }
    })

  })
  router.get('/signup', (req, res) => {
    if(req.session.loggedIn){
      res.redirect('/')
    }else{
      res.render('user/signup')
    }
     

  })
  router.post('/signup', (req, res) => {
    userhelper.doSignup(req.body).then((response) => {
      console.log(response);    
      req.session.loggedIn = true
      req.session.user = response
      res.redirect('/')
     


    })
  })
  router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
  })
   router.get('/cart',varifyLogin,async(req,res) => {
     let product =await userhelper.getCartProduct(req.session.user._id)
     console.log(product);
    
      res.render('user/cart-page',{product})
     
    
    
  })
router.get('/add-to-cart/:id',(req,res)=>{
  console.log('api');
  userhelper.addToCart(req.params.id,req.session.user._id).then(()=>{
    // res.redirect('/')
    res.json({status:true})
  })

})

});

module.exports = router;
