var api = require('../../utils/api');

function mapPlayer(p) {
  var n = p.name || '';
  return { name: n, lv: p.level || '', st: p.style || '',
    g: (p.equipment && p.equipment.model) || p.gear || '', court: p.court || '', city: p.city || '',
    wxid: p.wxid || '', el: String(p.elo || '1500'), pct: p.win_rate != null ? Math.round(p.win_rate * 100) + '%' : '0%', gm: p.match_count || 0 };
}

Page({
  data: { s: 44, p: null, isSelf: true },
  onLoad(options) {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    var app = getApp();
    var pid = options.id;
    if (pid) {
      // 查看他人，先尝试后端API
      try {
        api.get('/api/players/' + pid).then(function(res) {
          var data = res.data || res;
          if (data) {
            that.setData({ p: mapPlayer(data), isSelf: false });
          } else {
            that.loadLocalPlayer(app, pid);
          }
        }).catch(function() {
          that.loadLocalPlayer(app, pid);
        });
      } catch (e) {
        this.loadLocalPlayer(app, pid);
      }
    } else {
      var p = wx.getStorageSync('profile');
      if (p) this.setData({ p: p, isSelf: true });
    }
  },
  loadLocalPlayer(app, pid) {
    var player = null;
    var players = app.globalData.players;
    for (var i = 0; i < players.length; i++) {
      if (players[i].id == pid) { player = players[i]; break; }
    }
    if (player) {
      this.setData({ p: { name: player.n, lv: player.lv, st: player.st, g: player.g, court: player.court, city: player.city }, isSelf: false });
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
    var that = this;
    wx.showActionSheet({
      itemList: ['添加微信', '复制微信号'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showToast({ title: '请搜索微信号添加' });
        } else {
          var w = that.data.p && that.data.p.wxid;
          if (w) {
            wx.setClipboardData({ data: w });
            wx.showToast({ title: '微信号已复制' });
          } else {
            wx.showToast({ title: 'TA暂未填写微信号', icon: 'none' });
          }
        }
      }
    });
  }
});
