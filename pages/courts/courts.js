var api = require('../../utils/api');

Page({
  data: { s: 44, courts: [], allCourts: [], markers: [], centerLat: 39.92, centerLng: 116.40, activeId: null, curCity: '全部', cityList: [], showForm: false, rn: '', rc: '', rf: '' },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    this.loadData();
  },

  loadData() {
    var that = this;
    var app = getApp();
    var globalCity = (app && app.globalData.city) || '北京';
    this.setData({ curCity: globalCity });
    try {
      api.get('/api/courts').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          var cities = [];
          var seen = {};
          data.forEach(function(c) { if (!seen[c.city]) { seen[c.city]=1; cities.push(c.city); } });
          // 按全局城市过滤
          var filtered = data.filter(function(c) { return c.city === globalCity; });
          if (filtered.length === 0) filtered = data; // 没数据就全显示
          that.setData({ allCourts: data, courts: filtered, cityList: cities });
          that.buildMarkers(filtered);
          if (filtered.length > 0) that.setData({ centerLat: filtered[0].lat, centerLng: filtered[0].lng });
        }
      }).catch(function() {});
    } catch (e) {}
  },

  setCity(e) {
    var city = e.currentTarget.dataset.city;
    var filtered;
    if (city === '全部') filtered = this.data.allCourts;
    else filtered = this.data.allCourts.filter(function(c) { return c.city === city; });
    this.setData({ curCity: city, courts: filtered });
    this.buildMarkers(filtered);
    if (filtered.length > 0) this.setData({ centerLat: filtered[0].lat, centerLng: filtered[0].lng });
  },

  pickCity() { wx.navigateTo({ url: '/pages/city/city' }); },
  onPullDownRefresh() {
    var that = this;
    var globalCity = this.data.curCity;
    try {
      api.get('/api/courts').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          var filtered = data.filter(function(c) { return c.city === globalCity; });
          if (filtered.length === 0) filtered = data;
          that.setData({ courts: filtered, allCourts: data });
          that.buildMarkers(filtered);
        }
      }).catch(function() {});
    } catch (e) {}
    setTimeout(function() { wx.stopPullDownRefresh(); }, 500);
  },

  buildMarkers(data) {
    var that = this;
    var markers = data.map(function(c) {
      return { id: c.id, latitude: c.lat, longitude: c.lng, title: c.name, width: 30, height: 30, callout: { content: c.name, fontSize: 12, padding: 6, bgColor: '#1B5E3B', color: '#fff', display: 'BYCLICK', borderRadius: 4 } };
    });
    this.setData({ markers: markers });
  },

  onTap(e) {
    var item = e.currentTarget.dataset.item;
    this.setData({
      centerLat: item.lat,
      centerLng: item.lng,
      activeId: item.id,
      markers: this.data.markers.map(function(m) {
        m.callout = m.id === item.id ? { content: m.title, fontSize: 12, padding: 6, bgColor: '#1B5E3B', color: '#fff', display: 'ALWAYS', borderRadius: 4 } : (m.callout ? Object.assign({}, m.callout, {display: 'BYCLICK'}) : m.callout);
        return m;
      })
    });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 2 });
    this.loadData();
  },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  goNav(e) {
    var item = e.currentTarget.dataset.item;
    wx.openLocation({ latitude: item.lat, longitude: item.lng, name: item.name, address: item.address, scale: 16 });
  },
  goCall(e) {
    var phone = e.currentTarget.dataset.phone;
    if (phone) wx.makePhoneCall({ phoneNumber: phone });
  },
  showReport() { this.setData({ showForm: !this.data.showForm, rn: '', rc: '', rf: '' }); },
  setRn(e) { this.setData({ rn: e.detail.value }); },
  setRc(e) { this.setData({ rc: e.detail.value }); },
  setRf(e) { this.setData({ rf: e.detail.value }); },
  doReport() {
    var that = this;
    var d = this.data;
    if (!d.rn || !d.rc) { wx.showToast({ title: '请填写名称和城市', icon: 'none' }); return; }
    try {
      api.post('/api/courts', { name: d.rn, city: d.rc, lat: 0, lng: 0, fields: parseInt(d.rf) || 1, address: '' }).then(function() {
        wx.showToast({ title: '已提交，审核后显示', icon: 'none' });
        that.setData({ showForm: false, rn: '', rc: '', rf: '' });
      }).catch(function() { wx.showToast({ title: '提交失败', icon: 'none' }); });
    } catch (e) {}
  },
});
