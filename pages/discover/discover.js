var api = require('../../utils/api');

var currentUserId = 1;

function mapPlayer(p, favIds) {
  var n = p.name || '';
  return { id: p.id, n: n, a: n[0] || '?', c: '#2E8B57', lv: p.level || '', g: (p.equipment && p.equipment.model) || '', el: String(p.elo || '1500'), pct: p.win_rate != null ? Math.round(p.win_rate * 100) + '%' : '0%', gm: p.match_count || 0, active: !!p.active, fav: favIds.indexOf(p.id) >= 0 };
}

Page({
  data: { s: 44, ps: [], city: '北京' },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    this.loadData();
  },

  loadData() {
    var that = this;
    try {
      api.get('/api/players/' + currentUserId + '/favorites').then(function(fres) {
        var fdata = fres.data || fres;
        var favIds = (fdata && fdata.favorites || fdata || []).map(function(f) { return f.id; });
        api.get('/api/players').then(function(res) {
          var data = res.data || res;
          if (data && data.length > 0) that.setData({ ps: data.map(function(p) { return mapPlayer(p, favIds); }) });
        }).catch(function() {});
      }).catch(function() {
        api.get('/api/players').then(function(res) {
          var data = res.data || res;
          if (data && data.length > 0) that.setData({ ps: data.map(function(p) { return mapPlayer(p, []); }) });
        }).catch(function() {});
      });
    } catch (e) {}
  },
  toP(e) {
    wx.navigateTo({ url: '/pages/profile/profile?id=' + e.currentTarget.dataset.id });
  },
  toggleFav(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.index;
    try {
      api.post('/api/players/' + id + '/favorite', { user_id: currentUserId }).then(function(res) {
        var d = res.data || res;
        var ps = that.data.ps;
        ps[idx].fav = d.favorited;
        that.setData({ ps: ps });
      }).catch(function() {});
    } catch (e) {}
  },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  onShow() {
    var app = getApp();
    if (app) this.setData({ city: app.globalData.city || '北京' });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 0 });
  },
  pickCity() { wx.navigateTo({ url: '/pages/city/city' }); },
  onPullDownRefresh() { this.loadData(); setTimeout(function() { wx.stopPullDownRefresh(); }, 500); }
});
