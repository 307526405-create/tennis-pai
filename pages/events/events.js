var api = require('../../utils/api');

function calDist(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var km = R * c;
  if (km < 1) return Math.round(km * 1000) + 'm';
  return km.toFixed(1) + 'km';
}

function mapEvent(e, myLat, myLng) {
  var left = (e.max_players || 4) - (e.current_players || 0);
  var dist = '';
  if (myLat && e.lat && e.lng) dist = calDist(myLat, myLng, e.lat, e.lng);
  return {
    id: e.id, t: e.title, d: e.date + ' ' + e.time, ct: e.court,
    lv: e.level, tn: e.max_players, n: e.current_players, left: left,
    f: left <= 0, joined: false, price: e.price || '', dist: dist,
    creator: e.creator_name || '', city: e.city || ''
  };
}

Page({
  data: { s: 44, events: [], allEvents: [], city: '北京', fl: '', levels: ['2.0','2.5','3.0','3.5','4.0','4.5','5.0'], myLat: null, myLng: null },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    wx.getLocation({ type: 'gcj02', success: function(r) {
      that.setData({ myLat: r.latitude, myLng: r.longitude });
    }, fail: function() {} });
    this.loadEvents();
  },
  loadEvents() {
    var that = this;
    try {
      api.get('/api/events?status=open').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          var mlat = that.data.myLat, mlng = that.data.myLng;
          var mapped = data.map(function(e) { return mapEvent(e, mlat, mlng); });
          that.setData({ allEvents: mapped });
          that.applyFilter();
        }
      }).catch(function() { that.loadFallback(); });
    } catch (e) { that.loadFallback(); }
  },
  applyFilter() {
    var city = this.data.city;
    var fl = this.data.fl;
    var filtered = this.data.allEvents;
    if (city !== '全部') filtered = filtered.filter(function(e) { return e.city === city || !e.city; });
    if (fl) filtered = filtered.filter(function(e) { return e.lv === fl; });
    this.setData({ events: filtered });
  },
  setFilter(e) {
    var lv = e.currentTarget.dataset.lv;
    this.setData({ fl: this.data.fl === lv ? '' : lv });
    this.applyFilter();
  },
  loadFallback() {
    this.setData({ events: [
      { id:1,t:'周末双打约球',d:'6.21 09:00',ct:'国家网球中心',lv:'4.0',tn:4,n:1,left:3,f:false,price:'AA制',creator:'老赵',dist:'',joined:false,city:'北京' },
      { id:2,t:'工作日晚间单打',d:'6.23 19:00',ct:'朝阳公园',lv:'3.5',tn:2,n:1,left:1,f:false,price:'免费',creator:'小美',dist:'',joined:false,city:'北京' },
      { id:3,t:'周六早场训练',d:'6.27 08:00',ct:'奥体中心',lv:'3.0',tn:4,n:3,left:1,f:false,price:'50元/人',creator:'阿强',dist:'',joined:false,city:'上海' }
    ]});
  },
  join(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uid = wx.getStorageSync('currentUserId') || 1;
    try {
      api.post('/api/events/' + id + '/join', { player_id: uid }).then(function() {
        that.loadEvents();
      }).catch(function() {});
    } catch (e) {}
  },
  goCreate() { wx.navigateTo({ url: '/pages/create/create' }); },
  toDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/event-detail/event-detail?event_id=' + id });
  },
  onShow() {
    var app = getApp();
    var city = (app && app.globalData.city) || '北京';
    if (city !== this.data.city) { this.setData({ city: city }); this.loadEvents(); }
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 1 });
  },
  pickCity() { wx.navigateTo({ url: '/pages/city/city' }); },
  onPullDownRefresh() { this.loadEvents(); setTimeout(function() { wx.stopPullDownRefresh(); }, 500); },
});
