const cloud = require('wx-server-sdk');
const got = require('got'); 
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  var token=event.token
  var time=event.time
  var nonce=event.nonce
  var id=event.id
  var sign=event.sign
  let getResponse = await got('https://openapi.lechange.cn/openapi/setDeviceSnapEnhanced',{   //乐橙的http请求，获取Access Token
     method: 'POST', //post请求
     headers: {
      'Content-Type': 'application/json' 
    },
    body:JSON.stringify({             //把json数据（对象）解析成字符串
      "system":{                       
           "ver":"1.0",
           "appId":"lcc1fd3bb197a14577",   //设备的appid
           "sign":sign,                  //MD5签名
           "time":time,                  //时间戳从前端处传来
            "nonce":nonce         
        },
        "id":id,  
        "params":{
        "token":token,
        "deviceId":"6L088A7RAJD6B81",
        "channelId":0,
                                         //其他的api接口的参数都在这里输入即可，不知道是否可以连同Token一起请求返回，应该不行
          }
     })
    })
    // body:{
    //   'code':'code'
    // }  //get方式不能用body
     
 
   return  getResponse.body //返回数据
}