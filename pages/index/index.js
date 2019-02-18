//index.js
//获取应用实例

const util = require("../../utils/util.js")
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showAll: true,
    lists: [],
    newLi: {
      id: "",
      content: "",
      begin: util.formatDate2(),
    }

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
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
          console.log(res)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 表单清空
  formReset() {
    this.setData({
      'newLi.content': ''
    })
  },
  // 表单提交 A
  formSubmit() {
    let newLists = this.data.lists,
      i = 0,
      newTodo = this.data.newLi;
    if (newLists.length > 0) {
      i = Number(util.sortBy(newLists, 'id', true)[0].id) + 1;
    }
    newTodo.id = i
    if (newTodo.content != '') {
      newLists.push(newTodo)
      this.setData({
        lists: newLists,
        newLi: {
          id: "",
          content: "",
          begin: util.formatDate2(),
        }
      })
    }
    this.remind();
  },
  //提醒功能
  getRemindArr() {
    console.log(1111)
    let thisLists = this.data.lists,
      closeT = 0,
      notDoneLists = [];
    let date = new Date(),
      now = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    thisLists.map(function(l) {
      if (l.needRemind) {
        notDoneLists.push(l)
      }
    })
    if (notDoneLists.length > 0) {
      let newLists = util.sortBy(notDoneLists, 'begin'),
        firstT = (newLists[0].begin).split(':'),
        id = newLists[0].id,
        cnt = newLists[0].content;
      closeT = ((firstT[0] - now[0]) * 60 + (firstT[1] - now[1]) - 1) * 60;
      closeT = closeT >= 0 ? closeT : 0;
      return {
        closeT,
        id,
        cnt
      };
    } else {
      return false;
    }
  },
  //提醒功能提示框，判断是否已完成
  remind() {
    let result = this.getRemindArr(),
      t = result.closeT,
      id = result.id,
      that = this,
      cnt = result.cnt;

    function alarm() {
      let newLists = that.data.lists;
      wx.showModal({
        title: '已经完成了吗？',
        content: cnt,
        cancelText: '否',
        confirmText: '是',
        success: function(res) {
          if (res.confirm) {
            newLists.map(function(l, index) {
              if (l.id == id) {
                newLists[index].done = true;
                newLists[index].needRemind = false;
              }
            })
            that.setData({
              lists: newLists
            })
          } else {
            newLists.map(function(l, index) {
              if (l.id == id) {
                newLists[index].needRemind = false;
              }
            })
            that.setData({
              lists: newLists
            })
          }
        }
      })

    }
    if (result) {
      setTimeout(alarm, Math.floor(t * 1000), function() {
        that.remind();
      })
    }

  },
  // 输入框chang事件
  iptChange(e) {
    this.setData({
      'newLi.content': e.detail.value,
      'newLi.begin': util.formatDate2()
    })
  },
  // picker 组件change事件
  bindDateChange(e) {
    this.setData({
      "newLi.begin": e.detail.value
    })
  }
})