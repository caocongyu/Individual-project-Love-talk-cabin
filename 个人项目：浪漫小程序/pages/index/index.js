const util = require('../../utils/util.js')
const dateTimePicker = require('../../utils/dateTimePicker.js')

Page({

  /**
   * 页面的初始数据
   */
  data:{
    region:['山东省','青岛市','黄岛区'],
    period:['0','0','0','0'],
    now:null,

    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,        //所有时间选项
    dateTime: ['2020','12','01','12','12','12'],
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
  },

//计算两个时间之间的时间差
  timedifference: function (faultDate, completeTime) {
    var that=this;
    console.log('bbbbbbbbbbbbbbb',completeTime)


    var stime = Date.parse(new Date(faultDate));//获得开始时间的毫秒数
    var etime = Date.parse(new Date(completeTime));//获得结束时间的毫秒数
    var usedTime = etime - stime; //两个时间戳相差的毫秒数
    //计算出天数
    var days = Math.floor(usedTime / (24 * 3600 * 1000));
    
    //计算出小时数
    var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));//将剩余的毫秒数转化成小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));//将剩余的毫秒数转化成分钟
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);//计算分钟数后剩余的毫秒数
    var seconds = Math.floor(leave3/1000);//将剩余的毫秒数转化成秒数
    var t = [days,hours,minutes,seconds]
    console.log('bbbbbbbbbbbbbbb',seconds)

    that.setData({period : t})


    },


    regionChang: function(e){
      this.setData({region:e.detail.value});
      this.getWeather();    //更新天气
    },
  

    /**
     * 获取实况天气数据
     */
    getWeather:function(){
      var that=this;
      wx.request({
          url: 'https://geoapi.qweather.com/v2/city/lookup', 
          method: 'GET',
          data: {
            key: "34ea041c321c482ab7c47640ca732c42",
            location: that.data.region[1]  //这个就是前端输入的城市名
          },
          success: (res) => {
            
            // return res.data.location[0].id
            this.setData({
              location: res.data.location[0].id  //提取返回结果中的id
            })
         
            // 获取locationid后，查询当前天气，在success中发起请求
            var location_id = this.data.location;
            // console.log(location_id);
            wx.request({
              url: 'https://devapi.qweather.com/v7/weather/now', 
              method: 'GET',
              data: {
                key: "34ea041c321c482ab7c47640ca732c42",
                location: location_id
              },
              success: (res) => {
                
                this.setData({
                  weather_now: res.data.now,
                  flag: true
                })
              },
            });
              // 获取locationid后，查询天气指数
              wx.request({
                url: 'https://devapi.qweather.com/v7/indices/1d', 
                method: 'GET',
                data: {
                  key: "34ea041c321c482ab7c47640ca732c42",
                  location: location_id,
                  type: 3
                },
                success: (res) => {
                  
                  this.setData({
                    indices: res.data.daily,
                    flag: true
                  })
                },
              });
          },
        })},
  
  
  getCaiHongPi:function(){
    var that=this;
    wx.request({
      url: 'https://api.tianapi.com/caihongpi/index', 
      method: 'POST', 
      data: {
        key:'50b464b8140a0e94cdd0d94619108f48'
      }, 
      header: {
        'Content-Type':'application/x-www-form-urlencoded'
      }, 
      success: function (res) {
        if(res.data.code == 200){
          console.log(res.data);
          that.setData({
            caihongpi : res.data.newslist
          })
        }
      },
      fail: function (err) {
          console.log(err)
      }
    })
  },
   

changeDate(e) {
  this.setData({ date: e.detail.value });
},
changeTime(e) {
  this.setData({ time: e.detail.value });
},
changeDateTime(e) {
 const that=this;
  console.log("打印时间~~~~~~~~~~~~~~~~~~~~~", this.data.dateTimeArray);
  
  this.setData({ dateTime: e.detail.value });

  console.log("打印时间", this.data.dateTime);

  var aaa1 = that.data.dateTime[0];
  var aaa2 = that.data.dateTime[1];
  var aaa3 = that.data.dateTime[2];
  var aaa4 = that.data.dateTime[3];
  var aaa5 = that.data.dateTime[4];
  var aaa6 = that.data.dateTime[5];


  var time1 = that.data.dateTimeArray[0][aaa1];
  var time2 = that.data.dateTimeArray[1][aaa2];
  var time3 = that.data.dateTimeArray[2][aaa3];
  var time4 = that.data.dateTimeArray[3][aaa4];
  var time5 = that.data.dateTimeArray[4][aaa5];
  var time6 = that.data.dateTimeArray[5][aaa6];
  var time = time1 + '-' + time2 + '-' + time3 + ' ' + time4 + ':' + time5 + ':' + time6;
  this.setData({FullInLove:time})
  console.log("时间88888888888888888888888888888:", time);
  that.timedifference(that.data.FullInLove,that.data.now);


  return time;
},

changeDateTimeColumn(e) {
  var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

  arr[e.detail.column] = e.detail.value;
  dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

  this.setData({
    dateTimeArray: dateArr,
    dateTime: arr,

  });
},

  /**
   * 启动定时器
   */
  startInter : function(){
    var that = this;
    that.data.inter= setInterval(
        function () {
            // TODO 你需要无限循环执行的任务
            var date = util.formatTime(new Date());   // 调用函数时，传入new Date()参数，返回值是日期和时间   
            that.setData({now: date});                // 再通过setData更改Page()里面的data，动态更新页面的数据
            that.setData({FullInLove: that.data.FullInLove});              

            that.timedifference(that.data.FullInLove,that.data.now);
            console.log('setInterval 每过1000毫秒执行一次任务');
        }, 1000);    
  },
  /**
   * 结束定时器
   */
  endInter: function(){
    var that = this;
    that.clearInterval(that.data.inter)
  },


onLoad: function () {    
  this.getWeather();    //更新天气
  this.getCaiHongPi();  //获得彩虹屁
  this.startInter();

  var date = util.formatTime(new Date());   // 调用函数时，传入new Date()参数，返回值是日期和时间
  this.setData({now: date});                // 再通过setData更改Page()里面的data，动态更新页面的数据

  // 获取完整的年月日 时分秒，以及默认显示的数组
  var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
  console.log("obj-hhhhhhhhhhhhhhhhh:", obj);


  this.setData({
    dateTime: obj.dateTime,
    FullInLove:obj.dateTime,
    dateTimeArray: obj.dateTimeArray,
  });
},

 /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.endInter()
  }

})
