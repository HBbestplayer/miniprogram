// pages/demo2/demo2.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
　openid: "",
    loginstate: "0",
    denglu:true,   //登陆完成变为false，隐藏登陆框
    userEntity: null,
    terminal: "",
    osVersion: "",
　phoneNumber:"",
    showModal: false,//定义登录弹窗
    condition:false, //登陆完成变为true
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  picture:function(){
   wx.navigateTo({
     url: '/pages/picture/picture',
   })
  },
  button:function(){
   wx.reLaunch({
     url: '/pages/index/index',   //关闭所有页面，跳转到指定页面
   })
  },
  logs:function(){
    wx.reLaunch({
      url:"/pages/change/change"
    })
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  btnTap:function(){
    wx.navigateTo({
      url:"/pages/demo/demo"
    })
  },
  // 下面是尝试内容
//在页面加载的时候，判断缓存中是否有内容，如果有，存入到对应的字段里
  onLoad:function(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserProfile(e) {
   wx.getUserProfile({
     desc:'用于完善个人信息',
     success:(res)=>{
       console.log("获取用户信息成功",res)
       let user=res.userInfo
       wx.setStorageSync('user', user)
       this.setData({
        userInfo: user,
        hasUserInfo: true
      })
     },
     fail:res=>{
       console.log('获取用户信息失败',res)
     }
   })
    
  },
})