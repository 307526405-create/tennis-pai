var app = getApp();
var api = require('../../utils/api');

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

    // 尝试后端搜索球员
    try {
      api.get('/api/players?name=' + q).then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          that.setData({ players: data });
        } else {
          // 后端无结果，本地搜索
          var ps = app.globalData.players ? app.globalData.players.filter(function(p) {
            return p.n.includes(q) || (p.g && p.g.includes(q)) || p.lv === q;
          }) : [];
          that.setData({ players: ps });
        }
      }).catch(function() {
        // 后端失败，本地搜索
        var ps = app.globalData.players ? app.globalData.players.filter(function(p) {
          return p.n.includes(q) || (p.g && p.g.includes(q)) || p.lv === q;
        }) : [];
        that.setData({ players: ps });
      });
    } catch (e) {
      var ps = app.globalData.players ? app.globalData.players.filter(function(p) {
        return p.n.includes(q) || (p.g && p.g.includes(q)) || p.lv === q;
      }) : [];
      that.setData({ players: ps });
    }

    // 尝试后端搜索装备
    try {
      api.get('/api/rackets?brand=' + q).then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          that.setData({ rackets: data.slice(0, 5) });
        } else {
          // 后端无结果，本地搜索
          var rs = app.globalData.rackets.filter(function(r) {
            return r.model.includes(q) || r.brand.toUpperCase().includes(q.toUpperCase());
          });
          that.setData({ rackets: rs.slice(0, 5) });
        }
      }).catch(function() {
        var rs = app.globalData.rackets.filter(function(r) {
          return r.model.includes(q) || r.brand.toUpperCase().includes(q.toUpperCase());
        });
        that.setData({ rackets: rs.slice(0, 5) });
      });
    } catch (e) {
      var rs = app.globalData.rackets.filter(function(r) {
        return r.model.includes(q) || r.brand.toUpperCase().includes(q.toUpperCase());
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
