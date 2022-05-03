// pages/test2/test2.js
var token = '';
var timestamp = '';
var util = require('../../utils/md5.js');
var appSecret = '283ab1385cba403e99fc16aefb0aa8';
var sign = '';
var id = '';
var nonce = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
   src1:'',
   src2:'',
   index:''
  },
  //获取id
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

  KitToken() {
    this.getTime();   //获得时间戳
    nonce = this.Nonce()
    id = this.Id()
    this.Sign(timestamp, nonce, appSecret)
    console.log('这是nonce:' + nonce, '这是id:' + id, '这是sign:' + sign)
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
        name: 'live',
        data: {
          id: id,
          time: timestamp,
          nonce: nonce,
          sign: sign,
          token: storagetoken
        }
      }).then(res => {
        console.log('成功获取直播地址')
        console.log(res)
        var STR = JSON.parse(res.result)
        console.log('这是res的数据：' +STR.result.data.lives[0].streams[0].hls) 
        this.setData({
          src1:STR.result.data.lives[0].streams[0].hls,
          src2:STR.result.data.lives[0].streams[1].hls
        })
        
      })
    })
  },
  biaoqing(){
    this.setData({
      index:true
    })
  },
  gaoqing(){
    this.setData({
      index:false
    })
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.KitToken()
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