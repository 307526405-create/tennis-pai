var api = require('../../utils/api');

Page({
  data: { s: 44, courts: [], markers: [], centerLat: 39.92, centerLng: 116.40, activeId: null, showForm: false, rn: '', rc: '', rf: '' },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    try {
      api.get('/api/courts').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          var markers = data.map(function(c, i) {
            return { id: c.id, latitude: c.lat, longitude: c.lng, title: c.name, width: 30, height: 30, iconPath: c.id === 1 ? '' : '', callout: { content: c.name, fontSize: 12, padding: 6, bgColor: '#1B5E3B', color: '#fff', display: 'BYCLICK', borderRadius: 4 } };
          });
          that.setData({ courts: data, markers: markers });
          // 默认北京
          var bj = data.filter(function(c) { return c.city === '北京'; });
          if (bj.length > 0) that.setData({ centerLat: bj[0].lat, centerLng: bj[0].lng });
        }
      }).catch(function() {});
    } catch (e) {}
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
    var d = this.data;
    if (!d.rn || !d.rc) { wx.showToast({ title: '请填写名称和城市', icon: 'none' }); return; }
    wx.showToast({ title: '已提交，审核后显示', icon: 'none' });
    this.setData({ showForm: false });
  }
});
