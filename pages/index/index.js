// index.js
// 获取应用实例
const app = getApp()
var token = '';
var timestamp = '';
var util = require('../../utils/md5.js');
var appSecret = '283ab1385cba403e99fc16aefb0aa8';
var sign = '';
var id = '';
var nonce = ''; 
var get='';      //wx.getStorageSync('kitToken');
Page({
  data: {
    scr:"../../images/芽.jpg",
    src: 'imou://open.lechange.com/6L088A7RAJD6B81/0/1?streamId=0',
    kitToken:'',
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // btnTap:function(){
  //   wx.navigateTo({
  //     url:"/pages/demo/demo"
  //   })
  // },
  //智慧监控
  btnStart: function () {
    wx.reLaunch({
      url: '/pages/watch/watch',
    })
  },
  //使用说明
  btnIntroduce: function () {
    wx.navigateTo({
      url: '/pages/explanation/explanation',
    })
  },
  Id() {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var nums = "";
    for (var i = 0; i < 10; i++) {
      var id = parseInt(Math.random() * 32);
      nums += chars[id];
    }
    return nums;
  },

  //获取随机数nonce
  Nonce() {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var nums = "";
    for (var i = 0; i < 32; i++) {
      var id = parseInt(Math.random() * 32);
      nums += chars[id];
    }
    return nums;
  },

  //获取经MD5校验的sign签名
  Sign(T, N, A) {
    var str = 'time:' + T + ',nonce:' + N + ',appSecret:' + A
    sign = util.hexMD5(str)
  },

  //只获取当前时间戳
  getTime() {
    timestamp = Date.parse(new Date()); //获取到的是毫秒
    timestamp = timestamp / 1000; //转为时间戳 秒
    console.log("当前时间戳为：" + timestamp);
  },
  //获取当前时间，并计算出过期时间

  getOvertime() {
    this.getTime();
    let overtime = timestamp + 3600 //一个小时后是过期时间
    wx.setStorageSync('overtime', overtime)
    console.log('过期时间' + overtime)
  },

  //获取kitToken
    KitToken() {
    wx.cloud.callFunction({
      name: 'http',
      data: {
        id: id,
        time: timestamp,
        nonce: nonce,
        sign: sign
      }
    }).then( res => {
      console.log('成功了')
      console.log(res)
      var STR = JSON.parse(res.result)
      console.log(STR.result.data.accessToken)
      //  token=STR.result.data.accessToken
      //将access token存在本地缓存中，便于后期使用其他的api
      wx.setStorageSync('token', STR.result.data.accessToken)
      var storagetoken = wx.getStorageSync('token')
      console.log('储存了：' + storagetoken)
      this.getOvertime(); //不仅获取时间戳，同时token记录过期时间
      nonce = this.Nonce()
      id = this.Id()
      this.Sign(timestamp, nonce, appSecret)
      wx.cloud.callFunction({
        name: 'video',
        data: {
          id: id,
          time: timestamp,
          nonce: nonce,
          sign: sign,
          token: storagetoken
        }
      }).then(res => {
        console.log('成功获取kittoken')
        console.log(res)
        var STR = JSON.parse(res.result)
        console.log('这是res的数据：' + STR.result.data.kitToken)
        // var 
        this.setData({
         kitToken: STR.result.data.kitToken
        })
        try {
          wx.setStorageSync('kitToken', this.data.kitToken)   //将数据存入kitToken中
        } catch (e) {
          console.log(e)
        }
       
      })
    })
  },

  //获取token,并将data值改变为可用kitToken
  Btn() {
    this.getTime();   //获得时间戳
    nonce = this.Nonce()
    id = this.Id()
    this.Sign(timestamp, nonce, appSecret)
    console.log('这是nonce:' + nonce, '这是id:' + id, '这是sign:' + sign)
    //请求获得access token
    this.KitToken()
  },

  //将本地缓存赋值给get
  getNew() {
   get = wx.getStorageSync('kitToken')
  },
  onLoad() {
  
  },
  onReady: function () {
    //判断的请求移到了首页，但是还是需要这样用才行，因为小程序退出后不一定会完全退出，以防万一
    this.getNew()
    console.log(get)
    //进入页面前先查看是否有overtime的缓存，没有则表明是首次请求，有则非首次请求
    var storagetime = wx.getStorageSync("overtime")
    var storagekit = (wx.getStorageSync("kitToken"))
    if (storagetime != "" && storagekit != "") {
      console.log(wx.getStorageSync("overtime"))
      //拿到现在时间时间戳
      this.getTime();
      //进行时间比较
      //过期了，清空缓存，重新获取token
      if (storagetime < timestamp) {
        console.log("缓存已过期");
        wx.removeStorageSync('kitToken');
        wx.removeStorageSync('overtime');
        //重新请求，并将请求的新的kitToken重新放入本地缓存
       this.Btn()
       this.getOvertime()
       this.setData({
        kitToken:get
      })
      console.log('成功储存了get：' + get + '，同时成功赋值给了data：'+this.data.kitToken)
      }
      else if (storagetime >=timestamp) {
        console.log("可以继续使用get:"+get)
        this.setData({
          kitToken:get
        })
        console.log('成功赋值给了data：'+this.data.kitToken)
        //没过期，就取出本地缓存供kitToken继续使用
      }
    }
    // 有过期时间但是kittoken为空，则清空overtime，重新请求获取新的kitToken和overtime
    else if (storagetime != "" && storagekit == "") {
      wx.removeStorageSync('overtime');
      this.Btn()
      this.getOvertime()
      this.setData({
        KitToken:get
      })
      console.log('设置kitToken成功')
      console.log('这是新的kit' + this.data.kitToken)
    }
    //就是首次请求
    else if (storagetime == "") {
      console.log('这是首次请求')
       this.Btn()
       this.getNew()
       this.setData({
        kitToken:get
      })
      console.log('请求成功')
    }
  },

})
