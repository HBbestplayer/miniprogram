// pages/watch/watch.js
const db=wx.cloud.database()
var token = '';
var timestamp = '';
var util = require('../../utils/md5.js');
var appSecret = '283ab1385cba403e99fc16aefb0aa8';    //如果后期有多人使用，需要将appSecret储存在数据库每个用户词条下，每个用户用不同的appSecret，该参数确定用户，该参数下的通道数确定哪个摄像头
var sign = '';
var id = '';
var nonce = ''; 
var get='';      //wx.getStorageSync('kitToken');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['监控1', '监控2', '监控3', '监控4'], //后面要发送请求去后端来查询有多少个监控，再去改变array
    //  condition:true ,   //后期将将此作为是否有设备添加的监控，有添加设备为true，无则为false，即有设备时this.setData({condition:true})即可,这个可设置为全局变量
    //  text:"暂无设备，请添加设备",
    //  src:""  ,//后面写函数去获取后端的视频，然后成功后将地址赋值给src
    src: 'imou://open.lechange.com/6L088A7RAJD6B81/0/1?streamId=0',
    url: '',//测试获取图片
    kitToken:'', 
     index:"0",
     numb:""

  },
  getUrl(){
    db.collection("users").get()
   
  },
 add:function(){
   wx.reLaunch({
     url: '/pages/demo/demo',
   })
 },
 video:function(){
  wx.reLaunch({
    url:"/pages/watch/watch"
  })
},
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var num= parseInt(e.detail.value)+1   //js中实现数学加法，用parseInt(data)+1
    console.log(num)         
    this.setData({
      index: e.detail.value,            //后期这个index就是设备的通道号，传到请求处
       numb:num // 这里后期可以设置，选择不同的设置，url变得不同，用数据库存储用户信息然后有不同的url然后一一对应
    })
  },
  closeVideo() {
    //视频结束后，执行退出全屏方法
    var videoContext = wx.createVideoContext('myvideo', this);  // wx.createVideoContext('id', this)，配合id使用，将创建videoContext对象
    videoContext.exitFullScreen();
    
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
    
    judgeTime(){ //判断缓存是否过期
      let nowTime =timestamp;
      let oldTime = wx.getStorageSync('overtime');
      if(oldTime && nowTime < oldTime){
       return false;
      }
      return true;
    },
    //判断是否过期
    setCache(){
      if(this.judgeTime()){ //判断缓存是否过期，过期就重新添加一个
      this.getOvertime()
      }
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
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //后期需要先询问index是什么值，用switch来选择此时的设备overtime可以共用，
    // switch(this.index){                   //使用该函数，前面储存的步骤也按此函数操作
    //   case 0:
    //    var storagekit = wx.getStorageSync("kitToken")        //存储时就用 wx.setStorageSync('kitToken', this.data.kitToken)
    //     break;
    //   case 1:
    //    var storagekit = wx.getStorageSync("kitToken1")       //存储时就用 wx.setStorageSync('kitToken1', this.data.kitToken)
    //     break;
    //   case 2:
    //    var storagekit = wx.getStorageSync("kitToken")        //存储时就用 wx.setStorageSync('kitToken2', this.data.kitToken)
    //     break;  
    // }


    //判断的请求移到了首页，但是还是需要这样用才行，因为小程序退出后不一定会完全退出，以防万一
    this.getNew()
    console.log(get)
    //进入页面前先查看是否有overtime的缓存，没有则表明是首次请求，有则非首次请求
    var storagetime = wx.getStorageSync("overtime")
    var storagekit = wx.getStorageSync("kitToken")
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})