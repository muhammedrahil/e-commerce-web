let db = require('../config/connection')
let collection = require('../config/collection')
const objectId = require('mongodb').ObjectId;
let bcrypt = require('bcrypt');
const { response } = require('express');
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(data.insertedId) }).then((user) => {
                    resolve(user)
                })
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('false');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('failed');
                resolve({ status: false })
            }
        })
    },
    addToCart: (proId, userId) => {
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTIONS).findOne({ user: objectId(userId) })
            if (userCart) {
                db.get().collection(collection.CART_COLLECTIONS)
                    .updateOne({ user: objectId(userId) },
                        {
                            $push: {
                                product: objectId(proId)
                            }
                        }
                    ).then((response) => {
                        resolve()
                    })
            } else {
                let cartObj = {
                    user: objectId(userId),
                    product: [objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTIONS).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }

        })
    },
    getCartProduct: (userId) => {
        return new Promise(async(resolve, reject) => {
            let cartItem =await db.get().collection(collection.CART_COLLECTIONS).aggregate([
                {
                    $match: { user: objectId(userId) }

                }, {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        let: { proList: "$product" },
                        pipeline: [
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id','$$proList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            console.log(cartItem);
             resolve(cartItem[0].cartItems)
        })
    },
    getCartCount :(userId)=>{
        return new Promise (async(resolve,reject)=>{
            let count=0
            let Cart =await db.get().collection(collection.CART_COLLECTIONS).findOne({user:objectId(userId)})
            if(Cart){
                count = Cart.product.length
            }
            resolve(count)
        })
    }

}


