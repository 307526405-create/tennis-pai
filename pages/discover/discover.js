var api = require('../../utils/api');

function mapPlayer(p) {
  var n = p.name || '';
  return { id: p.id, n: n, a: n[0] || '?', c: '#2E8B57', lv: p.level || '', g: (p.equipment && p.equipment.model) || '', el: String(p.elo || '1500'), pct: p.win_rate != null ? Math.round(p.win_rate * 100) + '%' : '0%', gm: p.match_count || 0, active: !!p.active };
}

Page({
  data: { s: 44, ps: [], city: '北京' },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    try {
      api.get('/api/players').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) that.setData({ ps: data.map(mapPlayer) });
      }).catch(function() {});
    } catch (e) {}
  },
  toP(e) {
    wx.navigateTo({ url: '/pages/profile/profile?id=' + e.currentTarget.dataset.id });
  },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  onShow() {
    var app = getApp();
    if (app) this.setData({ city: app.globalData.city || '北京' });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 0 });
  },

  pickCity() {
    var that = this;
    var app = getApp();
    var cities = (app && app.globalData.cities) || ['北京','上海','广州','深圳','杭州','成都','武汉','南京'];
    wx.showActionSheet({
      itemList: cities.slice(0, 6),
      success: function(r) {
        var city = cities[r.tapIndex];
        if (app) { app.globalData.city = city; wx.setStorageSync('city', city); }
        that.setData({ city: city });
      }
    });
  },
});
