var api = require('../../utils/api');

function getDist(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var km = R * c;
  return km < 1 ? (km*1000).toFixed(0)+'m' : km.toFixed(1)+'km';
}

Page({
  data: { s: 44, courts: [], allCourts: [], markers: [], centerLat: 39.92, centerLng: 116.40, 
    activeId: null, curCity: '全部', cityList: [], showForm: false, rn: '', rc: '', rf: '',
    myLat: null, myLng: null
  },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    this.getLocation();
    try {
      api.get('/api/courts').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          var cities = [];
          var seen = {};
          data.forEach(function(c) { if (!seen[c.city]) { seen[c.city]=1; cities.push(c.city); } });
          // 算距离
          if (that.data.myLat) {
            data = data.map(function(c) {
              c.dist = getDist(that.data.myLat, that.data.myLng, c.lat, c.lng);
              return c;
            });
          }
          that.setData({ allCourts: data, courts: data, cityList: cities });
          that.buildMarkers(data);
          var bj = data.filter(function(c) { return c.city === '北京'; });
          if (bj.length > 0) that.setData({ centerLat: bj[0].lat, centerLng: bj[0].lng });
        }
      }).catch(function() {});
    } catch (e) {}
  },

  getLocation() {
    var that = this;
    wx.getLocation({ type: 'gcj02', success: function(res) {
      that.setData({ myLat: res.latitude, myLng: res.longitude });
    }, fail: function() {} });
  },

  goMyLoc() {
    if (this.data.myLat) {
      this.setData({ centerLat: this.data.myLat, centerLng: this.data.myLng });
    }
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

  buildMarkers(data) {
    var markers = data.map(function(c) {
      return { id: c.id, latitude: c.lat, longitude: c.lng, title: c.name, width: 30, height: 30, callout: { content: c.name, fontSize: 12, padding: 6, bgColor: '#1B5E3B', color: '#fff', display: 'BYCLICK', borderRadius: 4 } };
    });
    this.setData({ markers: markers });
  },

  onTap(e) {
    var item = e.currentTarget.dataset.item;
    this.setData({ centerLat: item.lat, centerLng: item.lng, activeId: item.id });
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
