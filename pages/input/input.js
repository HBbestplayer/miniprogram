// pages/input/input.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getToken(a,b){   //函数没写完
    wx.request({
      url:""
    })
  },
  btnSub(res){
    var that=this
    var {deviceId,channelId}=res.detail.value  //ES6的解构方法，可以快速对应的赋值，不用一句一句写
    console.log(deviceId,channelId)  //获取到两个重要的参数，然后做下面的请求和获取其他的视频直播的参数，可以引用函数来代替
    this.getToken(deviceId,channelId)   //调用寒素获得Aceess Token

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