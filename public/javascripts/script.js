const { response } = require("express");

function addTocart(prodId){
    $.ajax({
        url:'/add-to-cart/'+prodId,
        method: 'get',
        success: function (responce) {
            if(response.status){
                
            }
            alert(responce);
          }
    })
}