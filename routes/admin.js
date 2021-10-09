const { response } = require('express');
var express = require('express');
const productHelper = require('../helpers/product-helper');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelper.GetAllProduct().then((products) => {
    console.log(products);
    res.render('admin/view-product', { products, admin: true })
  })


  router.get('/add-product', (req, res) => {
    res.render('admin/add-product', { admin: true })
  })
  router.post('/add-product', (req, res) => {
    console.log(req.body)
    console.log(req.files.image)
    productHelper.addproduct(req.body, (id) => {
      let image = req.files.image
      console.log(id);
      image.mv('./public/images/' + id + '.jpg', (err, done) => {
        if (!err) {
          res.render('admin/add-product')
        } else {
          console.log(err);

        }
      })

    })

  })
  router.get('/delete-product/:Id', (req, res) => {
    let prodId = req.params.Id
    productHelper.productDelete(prodId).then((response) => {
      res.redirect('/admin/')
    })


  })
  router.get('/edit-product/:id',async (req, res) => {
    let product =await productHelper.productEdit(req.params.id)
       console.log(product);
    
    res.render('admin/edit-product',{product})
  })
  router.post('/edit-product/:id',(req,res)=>{
    productHelper.productUpdates(req.params.id,req.body).then(()=>{
      res.redirect('/admin')
      if(req.files.image){
        let image = req.files.image
      let id = req.params.id
      image.mv('./public/images/' + id + '.jpg')
      }
      
     
    })
  })
});
module.exports = router;
