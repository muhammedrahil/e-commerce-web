let db = require('../config/connection')
let collection = require('../config/collection')
const objectId = require('mongodb').ObjectId;
let bcrypt = require('bcrypt')
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
    doLogin:(userData) => {
        return new Promise(async (resolve, reject) => {
            let response ={}
            let user =await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password,user.Password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.user=user
                        response.status=true
                        resolve(response)
                    } else {
                        console.log('false');
                        resolve({status:false})
                    }
                })
            } else {
                console.log('failed');
                resolve({status:false})
            }
        })
    },
    addToCart:(proId,userId)=>{
        return new Promise (async(resolve,reject)=>{
            let Cart= await db.get().collection(collection.CART_COLLECTIONS).findOne({user:objectId(userId)})

        })
    }
}


