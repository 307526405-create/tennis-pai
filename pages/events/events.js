var api = require('../../utils/api');

function mapEvent(e) {
  var left = (e.max_players || 4) - (e.current_players || 0);
  var players = (e.players || []).map(function(p) { return p.name || ''; });
  return {
    id: e.id, t: e.title, d: e.date + ' ' + e.time, ct: e.court,
    lv: e.level, tn: e.max_players, n: e.current_players, left: left,
    f: left <= 0, joined: false, price: e.price || '', players: players,
    creator: e.creator_name || '', dist: e.distance || ''
  };
}

Page({
  data: { s: 44, events: [] },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    this.loadEvents();
  },
  loadEvents() {
    var that = this;
    try {
      api.get('/api/events?status=open').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          that.setData({ events: data.map(mapEvent) });
        }
      }).catch(function() {
        that.loadFallback();
      });
    } catch (e) { that.loadFallback(); }
  },
  loadFallback() {
    // 离线也能看
    this.setData({ events: [
      { id:1,t:'周末双打约球',d:'6.21 09:00',ct:'国家网球中心',lv:'4.0',tn:4,n:1,left:3,f:false,price:'AA制',creator:'老赵',players:['老赵'],dist:'2.3km',joined:false },
      { id:2,t:'工作日晚间单打',d:'6.23 19:00',ct:'朝阳公园',lv:'3.5',tn:2,n:1,left:1,f:false,price:'免费',creator:'小美',players:['小美'],dist:'1.8km',joined:false },
      { id:3,t:'周六早场训练',d:'6.27 08:00',ct:'奥体中心',lv:'3.0',tn:4,n:3,left:1,f:false,price:'50元/人',creator:'阿强',players:['阿强','小王','小李'],dist:'4.1km',joined:false }
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
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 1 });
    this.loadEvents();
  }
});
