// pages/change/change.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:"../../images/fengmian.jpg",
    code:"",
    newcode:"",
    newcode2:""
  },
  getCode(res){
    this.setData({
      code:res.detail.value
    })
  },
  newCode(res){
    this.setData({
      newcode:res.detail.value
     })
  },
  changeCode(res){
    this.setData({
     newcode2:res.detail.value
    })
  },
  
  UpData(){
    db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').get()
    .then(res=>{
    console.log("获取数据成功",res)
    let user=res.data
    if(this.data.code==user.code){
      if(this.data.newcode==this.data.newcode2){
      db.collection("users").doc("b00064a7605da2d90be4c532052eb6ed").update({ //没有openid的好像不能更新
        data:{
       code:this.data.newcode
        }
      }).then(res=>{
        console.log(res)
        db.collection("users").doc('b00064a7605da2d90be4c532052eb6ed').get()
        .then(res=>{
          console.log("开始修改密码",res)
          let user2=res.data
          if(this.data.newcode==user2.code){
            console.log("修改成功")
            wx.showModal({
              title: '修改密码成功，请返回登录页面重新登录',
              success (res){
                wx.reLaunch({
                  url:"/pages/denglu/denglu"
                })
              }
            })
        }
      })
  })
      }
      else if(this.data.newcode!=this.data.newcode2){
        wx.showToast({
          title: "新密码提交不一致",
          icon:"error"
        })
      }
}
  else if(this.data.code!=user.code){
    wx.showToast({
      title: "原密码错误",
      icon:"error"
    })
  }
  })
    
  },
  Jump(){
   wx.reLaunch({
     url: '../../pages/person/person',
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