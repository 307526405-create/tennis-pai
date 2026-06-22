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
        if (data && data.length > 0) that.setData({ events: data.map(mapEvent) });
      }).catch(function() {});
    } catch (e) {}
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
