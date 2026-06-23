var api = require('../../utils/api');

var currentUserId = 1;
var colors = ['#2E8B57','#3A7BD5','#E85D3A','#9B59B6','#F39C12','#1ABC9C','#E74C3C','#3498DB'];

function mapPlayer(p, favIds) {
  var n = p.name || '';
  return { id: p.id, n: n, a: n[0] || '?', c: colors[(p.id-1) % colors.length], lv: p.level || '', g: (p.equipment && p.equipment.model) || '', el: String(p.elo || '1500'), pct: p.win_rate != null ? Math.round(p.win_rate * 100) + '%' : '0%', gm: p.match_count || 0, active: !!p.active, fav: favIds.indexOf(p.id) >= 0 };
}

Page({
  data: { s: 44, ps: [], allPs: [], city: '北京', fl: '', levels: ['2.0','2.5','3.0','3.5','4.0','4.5','5.0'] },
  onLoad() {
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    this.loadData();
  },

  loadData() {
    var that = this;
    var app = getApp();
    var city = (app && app.globalData.city) || '北京';
    this.setData({ city: city });
    try {
      api.get('/api/players/' + currentUserId + '/favorites').then(function(fres) {
        var fdata = fres.data || fres;
        var favIds = (fdata && fdata.data || fdata || []).map(function(f) { return f.id; });
        api.get('/api/players').then(function(res) {
          var data = res.data || res;
          if (data && data.length > 0) {
            var cityFiltered = data.filter(function(p) { return p.city === city; });
            if (cityFiltered.length === 0) cityFiltered = data;
            var mapped = cityFiltered.map(function(p) { return mapPlayer(p, favIds); });
            that.setData({ allPs: mapped });
            that.applyFilter();
          }
        }).catch(function() {});
      }).catch(function() {
        api.get('/api/players').then(function(res) {
          var data = res.data || res;
          if (data && data.length > 0) {
            var cityFiltered = data.filter(function(p) { return p.city === city; });
            if (cityFiltered.length === 0) cityFiltered = data;
            var mapped = cityFiltered.map(function(p) { return mapPlayer(p, []); });
            that.setData({ allPs: mapped });
            that.applyFilter();
          }
        }).catch(function() {});
      });
    } catch (e) {}
  },

  applyFilter() {
    var fl = this.data.fl;
    var ps = this.data.allPs;
    if (fl === 'online') ps = ps.filter(function(p) { return p.active; });
    else if (fl) ps = ps.filter(function(p) { return p.lv === fl; });
    this.setData({ ps: ps });
  },

  setFilter(e) {
    var lv = e.currentTarget.dataset.lv;
    this.setData({ fl: this.data.fl === lv ? '' : lv });
    this.applyFilter();
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
        var allPs = that.data.allPs;
        ps[idx].fav = d.favorited;
        // 同步allPs中的同ID球员
        for (var i = 0; i < allPs.length; i++) {
          if (allPs[i].id === id) allPs[i].fav = d.favorited;
        }
        that.setData({ ps: ps, allPs: allPs });
      }).catch(function() {});
    } catch (e) {}
  },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  onShow() {
    var app = getApp();
    var city = (app && app.globalData.city) || '北京';
    if (city !== this.data.city) this.loadData();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 0 });
  },
  pickCity() { wx.navigateTo({ url: '/pages/city/city' }); },
  onPullDownRefresh() { this.loadData(); setTimeout(function() { wx.stopPullDownRefresh(); }, 500); }
});
