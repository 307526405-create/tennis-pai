var app = getApp();
var api = require('../../utils/api');

function mapPlayer(p) {
  var n = p.name || '';
  return { id: p.id, n: n, a: n[0] || '?', c: '#2E8B57', lv: p.level || '',
    g: (p.equipment && p.equipment.model) || p.gear || '', el: String(p.elo || '1500'),
    pct: p.win_rate != null ? Math.round(p.win_rate * 100) + '%' : '0%', gm: p.match_count || 0,
    ds: '', active: !!p.active, st: p.style || '', court: p.court || '', city: p.city || '' };
}
function mapRacket(r) {
  return { id: r.id, brand: r.brand, model: r.model, head: r.head_size || '',
    weight: r.weight || '', balance: r.balance || '', pattern: r.pattern || '',
    ra: r.stiffness || '', sw: r.swingweight || '', beam: r.beam || '', type: r.type || '', price: r.price || '' };
}

Page({
  data: {
    s: 44, q: '', players: [], rackets: [],
    hots: ['Blade 98', 'Pure Aero', '郑钦文', 'Wilson', '3.5约球', '朝阳公园']
  },
  onLoad() {
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
  },
  onInput(e) {
    var that = this;
    var q = e.detail.value;
    this.setData({ q: q });

    if (!q) {
      this.setData({ players: [], rackets: [] });
      return;
    }

    try {
      api.get('/api/players').then(function(res) {
        var data = res.data || res;
        var all = (data && data.length > 0) ? data.map(mapPlayer) : (app.globalData.players || []);
        var ps = all.filter(function(p) {
          return p.n.indexOf(q) >= 0 || (p.g && p.g.indexOf(q) >= 0) || p.lv === q;
        });
        that.setData({ players: ps });
      }).catch(function() {
        var ps = (app.globalData.players || []).filter(function(p) {
          return p.n.indexOf(q) >= 0 || (p.g && p.g.indexOf(q) >= 0) || p.lv === q;
        });
        that.setData({ players: ps });
      });
    } catch (e) {
      var ps = (app.globalData.players || []).filter(function(p) {
        return p.n.indexOf(q) >= 0 || (p.g && p.g.indexOf(q) >= 0) || p.lv === q;
      });
      that.setData({ players: ps });
    }

    try {
      api.get('/api/rackets').then(function(res) {
        var data = res.data || res;
        var all = (data && data.length > 0) ? data.map(mapRacket) : (app.globalData.rackets || []);
        var rs = all.filter(function(r) {
          return r.model.indexOf(q) >= 0 || r.brand.toUpperCase().indexOf(q.toUpperCase()) >= 0;
        });
        that.setData({ rackets: rs.slice(0, 5) });
      }).catch(function() {
        var rs = (app.globalData.rackets || []).filter(function(r) {
          return r.model.indexOf(q) >= 0 || r.brand.toUpperCase().indexOf(q.toUpperCase()) >= 0;
        });
        that.setData({ rackets: rs.slice(0, 5) });
      });
    } catch (e) {
      var rs = (app.globalData.rackets || []).filter(function(r) {
        return r.model.indexOf(q) >= 0 || r.brand.toUpperCase().indexOf(q.toUpperCase()) >= 0;
      });
      that.setData({ rackets: rs.slice(0, 5) });
    }
  },
  tapHot(e) {
    var w = e.currentTarget.dataset.w;
    this.setData({ q: w });
    this.onInput({ detail: { value: w } });
  },
  toP() { wx.navigateTo({ url: '/pages/profile/profile' }); },
  toD(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },
  back() { wx.navigateBack(); }
});
