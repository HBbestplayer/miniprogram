// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => { //event可以接受前端传来的数据
  var num=event.num;
  var page=event.page;
  return await db.collection("demolist").skip(page).limit(num).get()  //await等待异步请求完成，不加await会直接return，但没有.then（）会无结果
}