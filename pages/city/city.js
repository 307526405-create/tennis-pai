Page({
  data: {
    s: 44, city: '北京', autoCity: '定位中...', kw: '', results: [],
    hots: ['北京','上海','广州','深圳','杭州','成都','武汉','南京'],
    allCities: ['北京','上海','广州','深圳','杭州','成都','武汉','南京','天津','重庆','苏州','西安','长沙','青岛','厦门','大连','宁波','福州','合肥','郑州','济南','昆明','贵阳','南宁','海口']
  },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight, city: (getApp() && getApp().globalData.city) || '北京' });
    // 自动定位
    wx.getLocation({ type: 'gcj02', success: function(res) {
      // 解析城市名
      that.setData({ autoCity: '北京' }); // TODO: 用Tencent API逆地理
    }, fail: function() { that.setData({ autoCity: '' }); } });
  },
  back() { wx.navigateBack(); },
  selAuto() {
    if (this.data.autoCity) this.saveCity(this.data.autoCity);
  },
  selCity(e) {
    this.saveCity(e.currentTarget.dataset.city);
  },
  saveCity(city) {
    var app = getApp();
    if (app) { app.globalData.city = city; wx.setStorageSync('city', city); }
    wx.navigateBack();
  },
  onKw(e) {
    var kw = e.detail.value;
    var that = this;
    if (kw) {
      var results = this.data.allCities.filter(function(c) { return c.indexOf(kw) !== -1; });
      that.setData({ kw: kw, results: results });
    } else {
      that.setData({ kw: '', results: [] });
    }
  }
});
