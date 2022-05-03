// pages/denglu/denglu.js
let app = getApp();
// 获取数据库引用
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  src:"../../images/fengmian.jpg",
  acount:"",
  code:'',
  defaultType: true,
  passwordType: true    //defaultType：眼睛状态   passwordType：密码可见与否状态
  },
  // eyeStatus: function(){
  //   this.data.defaultType= !this.data.defaultType
  //   this.data.passwordType= !this.data.passwordType
  //   this.setData({
  //     defaultType: this.data.defaultType,
  //     passwordType: this.data.passwordType
  // })

  // },

  getAccount(res){
  this.setData({
    account:res.detail.value
  })
  },
  getCode(res){
    this.setData({
      code:res.detail.value
    })
  },
  login(){
  let account=this.data.account
  let code=this.data.code
  //登陆
  db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').get()     //要考虑怎么校验多人用户，即不同服务用户怎么get.,用where去get？
  .then(res=>{
    console.log("获取数据成功",res)
    let user=res.data
    if(account==user.account){
    if(code==user.code){
    console.log("登陆成功")
    wx.showToast({
      title: '登陆成功',
    })
    wx.reLaunch({
      url: '../../pages/index/index',
    })
    }
    else if(code!=user.code){
      console.log("登陆失败")
      wx.showToast({
        icon:'error',
        title: '账号或密码错误',
      })
    }
    }else if(account!=user.account){
    wx.showToast({
      icon:'error',
      title: '账号或密码错误',
    })
  }
  })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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