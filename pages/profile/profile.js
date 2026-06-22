var api = require('../../utils/api');

function mapPlayer(p) {
  var n = p.name || '';
  return { name: n, lv: p.level || '', st: p.style || '', g: (p.equipment && p.equipment.model) || p.gear || '', court: p.court || '', city: p.city || '', wxid: p.wxid || '', el: String(p.elo || '1500'), pct: p.win_rate != null ? Math.round(p.win_rate * 100) + '%' : '0%', gm: p.match_count || 0 };
}

Page({
  data: { s: 44, p: null, isSelf: true, favorited: false, favorites: [], currentUserId: 1, pid: null, avail: false, notifications: [], newNote: null },
  onLoad(options) {
    var that = this;
    var uid = wx.getStorageSync('currentUserId') || 1;
    var pid = options.id;
    this.setData({ s: wx.getWindowInfo().statusBarHeight, currentUserId: uid, pid: pid });

    if (pid && pid != uid) {
      // 查看他人
      try {
        api.get('/api/players/' + pid).then(function(res) {
          var data = res.data || res;
          if (data) {
            that.setData({ p: mapPlayer(data), isSelf: false });
            that.checkFavorite(pid);
          }
        }).catch(function() { that.loadLocal(pid); });
      } catch (e) { this.loadLocal(pid); }
    } else {
      // 看自己
      var p = wx.getStorageSync('profile');
      if (p) this.setData({ p: p, isSelf: true });
      this.loadFavorites(uid);
    }
  },
  loadLocal(pid) {
    var app = getApp();
    var players = app.globalData.players;
    var player = null;
    for (var i = 0; i < players.length; i++) {
      if (players[i].id == pid) { player = players[i]; break; }
    }
    if (player) {
      this.setData({ p: { name: player.n, lv: player.lv, st: player.st, g: player.g, court: player.court, city: player.city }, isSelf: false });
    }
  },
  loadFavorites(uid) {
    var that = this;
    try {
      api.get('/api/players/' + uid + '/favorites').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) that.setData({ favorites: data });
      }).catch(function() {});
    } catch (e) {}
  },
  checkFavorite(pid) {
    var that = this;
    try {
      api.get('/api/players/' + this.data.currentUserId + '/favorites').then(function(res) {
        var list = res.data || res || [];
        var found = false;
        for (var i = 0; i < list.length; i++) {
          if (list[i].id == pid) { found = true; break; }
        }
        that.setData({ favorited: found });
      }).catch(function() {});
    } catch (e) {}
  },
  loadNotifications(uid) {
    var that = this;
    try {
      api.get('/api/players/' + uid + '/notifications').then(function(res) {
        var list = res.data || res || [];
        if (list.length > 0) {
          var lastCheck = wx.getStorageSync('lastNotifCheck') || '';
          var latest = list[0];
          // 如果有比上次查看更新的通知，显示第一条
          if (latest.time > lastCheck || !lastCheck) {
            that.setData({ newNote: latest.name + '关注了你' });
            setTimeout(function() { that.setData({ newNote: null }); }, 4000);
          }
          wx.setStorageSync('lastNotifCheck', latest.time);
        }
      }).catch(function() {});
    } catch (e) {}
  },
  toggleFav() {
    var that = this;
    var pid = this.data.pid;
    if (!pid) return;
    try {
      api.post('/api/players/' + pid + '/favorite', { player_id: this.data.currentUserId }).then(function(res) {
        var data = res.data || res;
        if (data && data.favorited !== undefined) {
          that.setData({ favorited: data.favorited });
          if (that.data.isSelf) that.loadFavorites(that.data.currentUserId);
          wx.showToast({ title: data.favorited ? '已添加常约球友' : '已取消关注', icon: 'none', duration: 1200 });
        }
      }).catch(function() {});
    } catch (e) {}
  },
  toggleAvail() {
    var that = this;
    var uid = this.data.currentUserId;
    var newAvail = !this.data.avail;
    this.setData({ avail: newAvail });
    try {
      api.put('/api/players/' + uid + '/active', {}).catch(function() {});
    } catch (e) {}
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 2 });
    if (!this.data.p || this.data.isSelf) {
      var p = wx.getStorageSync('profile');
      if (p) this.setData({ p: p });
    }
    if (this.data.isSelf) {
      this.loadFavorites(this.data.currentUserId);
      this.loadNotifications(this.data.currentUserId);
    }
  },
  toEdit() { wx.navigateTo({ url: '/pages/edit/edit' }); },
  toShare() { wx.navigateTo({ url: '/pages/share/share' }); },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  contact() {
    var that = this;
    wx.showActionSheet({
      itemList: ['添加微信', '复制微信号'],
      success: function(res) {
        if (res.tapIndex === 0) { wx.showToast({ title: '请搜索微信号添加' }); }
        else {
          var w = that.data.p && that.data.p.wxid;
          if (w) { wx.setClipboardData({ data: w }); wx.showToast({ title: '微信号已复制' }); }
          else { wx.showToast({ title: 'TA暂未填写微信号', icon: 'none' }); }
        }
      }
    });
  }
});
