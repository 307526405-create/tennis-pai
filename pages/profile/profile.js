Page({
  data: { s: 44, p: null, isSelf: true },
  onLoad(options) {
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    var app = getApp();
    var pid = options.id;
    if (pid) {
      var player = null;
      var players = app.globalData.players;
      for (var i = 0; i < players.length; i++) {
        if (players[i].id == pid) { player = players[i]; break; }
      }
      if (player) {
        this.setData({ p: { name: player.n, lv: player.lv, st: player.st, g: player.g, court: player.court, city: player.city }, isSelf: false });
      }
    } else {
      var p = wx.getStorageSync('profile');
      if (p) this.setData({ p: p, isSelf: true });
    }
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 2 });
    if (!this.data.p || this.data.isSelf) {
      var p = wx.getStorageSync('profile');
      if (p) this.setData({ p: p });
    }
  },
  eq() { wx.navigateTo({ url: '/pages/detail/detail?id=0' }); },
  toEdit() { wx.navigateTo({ url: '/pages/edit/edit' }); },
  toShare() { wx.navigateTo({ url: '/pages/share/share' }); },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  contact() {
    wx.showActionSheet({
      itemList: ['添加微信', '复制微信号'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showToast({ title: '请搜索微信号添加' });
        } else {
          var w = this.data.p && this.data.p.wxid;
          if (w) {
            wx.setClipboardData({ data: w });
            wx.showToast({ title: '微信号已复制' });
          } else {
            wx.showToast({ title: 'TA暂未填写微信号', icon: 'none' });
          }
        }
      }.bind(this)
    });
  }
});
