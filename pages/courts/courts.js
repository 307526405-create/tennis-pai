var api = require('../../utils/api');

Page({
  data: { s: 44, courts: [], markers: [], showForm: false, rname: '', rcity: '', rfields: '' },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    this.loadCourts();
  },
  loadCourts() {
    var that = this;
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
  showReport() { this.setData({ showForm: true }); },
  hideForm() { this.setData({ showForm: false }); },
  setRname(e) { this.setData({ rname: e.detail.value }); },
  setRcity(e) { this.setData({ rcity: e.detail.value }); },
  setRfields(e) { this.setData({ rfields: e.detail.value }); },
  submitCourt() {
    var that = this;
    var d = this.data;
    if (!d.rname || !d.rcity) { wx.showToast({ title: '请填写名称和城市', icon: 'none' }); return; }
    try {
      api.post('/api/courts', { name: d.rname, city: d.rcity, fields: parseInt(d.rfields) || 1, lat: 0, lng: 0, address: '' }).then(function() {
        wx.showToast({ title: '已提交，审核后显示' });
        that.setData({ showForm: false, rname: '', rcity: '', rfields: '' });
      }).catch(function() { wx.showToast({ title: '提交失败', icon: 'none' }); });
    } catch (e) {}
  },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 2 });
  }
});
