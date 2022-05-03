// pages/demo3/demo3.js
const db = wx.cloud.database();
var util2 = require('../../utils/util.js');
var token = '';
var timestamp = '';
var util = require('../../utils/md5.js');
var appSecret = '283ab1385cba403e99fc16aefb0aa8';
var sign = '';
var id = '';
var nonce = '';
var src ='';
var src1 ='';
var src2 ='';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //后期banner从请求中获取地址
    banner: [src, src1,src2], 
    xindex: 0,
    time:'',
    tips:false
  
  },
  clickImg(res){
    console.log(res)
    var num=res.currentTarget.dataset.index
   wx.previewImage({
    urls:[this.data.banner[num]]
   })
  //  var time = util2.formatTime(new Date());
  //  this.setData({          //后期要存放获取该图片地址时的时间，每个框的图片设置四小时重新请求一次，每个框的图片时间间隔一小时
  //    time:time ,
  //    tips:true,
  //  })

  },
  onChange: function (e) {
    this.setData({
      xindex: e.detail.current
    });
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
  



   //下面是抓图的函数
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
    var overtime = timestamp + 3600 //一个小时后是过期时间
    wx.setStorageSync('overtime', overtime)
    console.log('过期时间:' + overtime)
  },

  //kitToken()的集合
    KitToken(S) {
     wx.cloud.callFunction({
      name: 'http',
      data: {
        id: id,
        time: timestamp,
        nonce: nonce,
        sign: sign
      }
    }).then( res => {
      var STR = JSON.parse(res.result)
      console.log(STR.result.data.accessToken)
      this.getTime()
      nonce = this.Nonce()
      id = this.Id()
      this.Sign(timestamp, nonce, appSecret)
       wx.cloud.callFunction({
        name: 'snap',
        data: {
          id: id,
          time: timestamp,
          nonce: nonce,
          sign: sign,
          token:STR.result.data.accessToken
        }
      }).then(res => {
        console.log('成功获取kittoken')
        console.log(res)
        var STR = JSON.parse(res.result)
        console.log('这是res的数据：' + STR.result.data.url)
        S=STR.result.data.url
        this.Base(S,0)
      })
    })
  },
  //
  KitToken1(S) {
    wx.cloud.callFunction({
     name: 'http',
     data: {
       id: id,
       time: timestamp,
       nonce: nonce,
       sign: sign
     }
   }).then( res => {
     var STR = JSON.parse(res.result)
     console.log(STR.result.data.accessToken)
     this.getTime()
     nonce = this.Nonce()
     id = this.Id()
     this.Sign(timestamp, nonce, appSecret)
      wx.cloud.callFunction({
       name: 'snap',
       data: {
         id: id,
         time: timestamp,
         nonce: nonce,
         sign: sign,
         token:STR.result.data.accessToken
       }
     }).then(res => {
       console.log('成功获取kittoken')
       console.log(res)
       var STR = JSON.parse(res.result)
       console.log('这是res的数据：' + STR.result.data.url)
       S=STR.result.data.url
       this.Base1(S,1)
     })
   })
 },
//
KitToken2(S) {
  wx.cloud.callFunction({
   name: 'http',
   data: {
     id: id,
     time: timestamp,
     nonce: nonce,
     sign: sign
   }
 }).then( res => {
   var STR = JSON.parse(res.result)
   console.log(STR.result.data.accessToken)
   this.getTime()
   nonce = this.Nonce()
   id = this.Id()
   this.Sign(timestamp, nonce, appSecret)
    wx.cloud.callFunction({
     name: 'snap',
     data: {
       id: id,
       time: timestamp,
       nonce: nonce,
       sign: sign,
       token:STR.result.data.accessToken
     }
   }).then(res => {
     console.log('成功获取kittoken')
     console.log(res)
     var STR = JSON.parse(res.result)
     console.log('这是res的数据：' + STR.result.data.url)
     S=STR.result.data.url
     this.Base2(S,2)
   })
 })
},




  //Base()函数的重复
  Base(S,num=0){
    db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').update({   //有异步的问题，存储不到数据库中存储到数据库里，然后定时刷新
      data: {
        url: S
      }
    })
    db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').get()
      .then(res => {
        console.log(res)
        let user = res.data
        if (user.url != '') {
          this.setData({
            // [`banner[${num}]`]:S
            [`banner[${num}]`]: user.url
          })
          console.log(this.data.banner)
        }
      })
  },
//
Base1(S,num=1){
  db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').update({   //有异步的问题，存储不到数据库中存储到数据库里，然后定时刷新
    data: {
      url1: S
    }
  })
  db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').get()
    .then(res => {
      console.log(res)
      let user = res.data
      if (user.url1 != '') {
        this.setData({
          // [`banner[${num}]`]:S
          [`banner[${num}]`]: user.url1
        })
        console.log(this.data.banner)
      }
    })
},
//
Base2(S,num=2){
  db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').update({   //有异步的问题，存储不到数据库中存储到数据库里，然后定时刷新
    data: {
      url2: S
    }
  })
  db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').get()
    .then(res => {
      console.log(res)
      let user = res.data
      if (user.url2 != '') {
        this.setData({
          // [`banner[${num}]`]:S
          [`banner[${num}]`]: user.url2
        })
        console.log(this.data.banner)
      }
    })
},


  //Btn()函数的重复
  //对url赋值
  Btn(S) {
    var that = this
      that.getTime();   //获得时间戳
      nonce = that.Nonce();
      id = that.Id();
      that.Sign(timestamp, nonce, appSecret);
      console.log('这是nonce:' + nonce, '这是id:' + id, '这是sign:' + sign);
      //请求获得access token
      that.KitToken(S);
    },
    
//对url1赋值
Btn1(S,num=1){
  var that = this
      that.getTime();  
      nonce = that.Nonce();
      id = that.Id();
      that.Sign(timestamp, nonce, appSecret);
      console.log('这是nonce:' + nonce, '这是id:' + id, '这是sign:' + sign);
      that.KitToken1(S);
},
//对url2赋值
Btn2(S,num=2){
  var that = this
   that.getTime();   //获得时间戳
   nonce = that.Nonce();
   id = that.Id();
   that.Sign(timestamp, nonce, appSecret);
   console.log('这是nonce:' + nonce, '这是id:' + id, '这是sign:' + sign);
   //请求获得access token
   that.KitToken2(S);
  
},


  //3小时执行一次封装好的函数
  startInter(){
    let that = this;
    setInterval(
        function () {
           that.All()
        }, 180000);    
      },
      //一小时执行一次
      Hour1(S,num=1,time){
        let that = this;
        setTimeout(
          function () {
             that.Btn1(S,num)
          },time);    
        },
        //两小时执行
        Hour2(S,num=1,time){
          let that = this;
          setTimeout(
            function () {
               that.Btn2(S,num)
            },time);    
          },
        //封装,分别延迟一小时和两小时执行
        All(){
          this.Btn(src);
          this.Hour1(src1,1,60000);
          this.Hour2(src2,2,120000);
        },
   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   //想清除循环要在onUnload中用clearInterval去清除循环
     // 从数据库中获取之前的地址，然后再慢慢地执行
       db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').get()
          .then(res=>{
            console.log(res)
            if(res.data.url!=''&&res.data.url2!=''&&res.data.url!=''){
              this.setData({
                "banner[0]":res.data.url,
                "banner[1]":res.data.url1,
                "banner[2]":res.data.url2
              })
              this.startInter()
            }
            else if(res.data.url==''){  //首次执行
              console.log("首次执行")
              this.All()
              this.startInter()
            }else if(res.data.url!=''||res.data.url1==''){ //执行到一半，小程序退出了,url1无数据，就直接执行将地址填到scr1中显示，然后再过半小时抓图3
              console.log('url1无值')
              this.Btn1(src1)
              this.Hour2(src2,2,6000)   //延迟半小时抓一次图
              this.startInter()
            }else if(res.data.url!=''||res.data.url1!=''||res.data.url2==""){
              console.log('url2无值')
              this.Btn2(src2)
              this.startInter()
            }

          })    
    
  //  this.Btn(src)  //如果这个可行，就用这个，多写几个函数
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