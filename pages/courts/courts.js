var api = require('../../utils/api');

Page({
  data: { s: 44, courts: [], markers: [] },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    try {
      api.get('/api/courts').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          that.setData({ courts: data });
          var mk = [];
          for (var i = 0; i < data.length; i++) {
            mk.push({ id: data[i].id, latitude: data[i].lat, longitude: data[i].lng, title: data[i].name, width: 28, height: 28 });
          }
          that.setData({ markers: mk });
        }
      }).catch(function() {});
    } catch (e) {}
  },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 1 });
  }
});
