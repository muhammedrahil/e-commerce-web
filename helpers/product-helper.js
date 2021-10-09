let db = require('../config/connection')
let collection = require('../config/collection');
const objectId = require('mongodb').ObjectId;
const { response } = require('express');
module.exports={
    addproduct:(product,callback)=>{
 
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data);
            callback(data.insertedId)

        })

    },
    GetAllProduct : ()=>{
        return new Promise(async (resolve,reject) => {
            let products =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    productDelete: (prodId)=>{
        return new Promise ((resolve,reject)=>{     
            console.log(objectId(prodId));
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
                resolve(response)
                // console.log(response);
            })
        })
    },
    productEdit: (prodId)=>{
        return new Promise ((resolve,reject)=>{     
            console.log(objectId(prodId));
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(prodId)}).then((product)=>{
                resolve(product)
                
            })
        })
    },
    productUpdates:(prodId,productDeatails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(prodId)},{
                $set:{
                    name:productDeatails.name,
                    catogary:productDeatails.catogary,
                    discripion:productDeatails.discripion,
                    price:productDeatails.price
                }
            }).then((response)=>{
               resolve()
            })
        })

    }
}