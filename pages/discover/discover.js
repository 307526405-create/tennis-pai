var api = require('../../utils/api');

function mapPlayer(p) {
  var n = p.name || '';
  return { id: p.id, n: n, a: n[0] || '?', c: '#2E8B57', lv: p.level || '',
    g: (p.equipment && p.equipment.model) || p.gear || '', el: String(p.elo || '1500'),
    pct: p.win_rate != null ? Math.round(p.win_rate * 100) + '%' : '0%', gm: p.match_count || 0,
    ds: '', active: !!p.active, st: p.style || '', court: p.court || '', city: p.city || '' };
}
function mapEvent(e) {
  return { id: e.id, t: e.title || '', d: (e.date || '') + ' ' + (e.time || ''),
    ct: e.court || '', lv: e.level || '', tn: e.max_players || 4, n: e.current_players || 0,
    f: e.status === 'full', joined: false, avs: [] };
}

Page({
  data: {
    s: 44, a: 0,
    ps: [
      { id: 1, n: '老赵', a: '赵', c: '#4A90D9', lv: '3.5', g: 'Blade 98 v9', el: '1510', pct: '55%', gm: 32, ds: '1.8km', active: true },
      { id: 2, n: '小美', a: '美', c: '#E07B5A', lv: '3.5', g: 'Pure Aero', el: '1490', pct: '48%', gm: 28, ds: '2.1km', active: false },
      { id: 3, n: '阿强', a: '强', c: '#2EBD85', lv: '4.0', g: 'Speed Pro', el: '1620', pct: '68%', gm: 45, ds: '2.3km', active: true },
      { id: 4, n: '小王', a: '王', c: '#7C5CE7', lv: '4.0', g: 'VCORE 98', el: '1605', pct: '62%', gm: 38, ds: '1.8km', active: false },
      { id: 5, n: '小李', a: '李', c: '#E74C3C', lv: '3.0', g: 'Pure Drive', el: '1350', pct: '42%', gm: 18, ds: '2.1km', active: true },
      { id: 6, n: '大刘', a: '刘', c: '#E84393', lv: '3.5', g: 'Clash 100', el: '1455', pct: '50%', gm: 24, ds: '1.8km', active: false }
    ],
    es: [
      { id: 1, t: '周六 3.5级单打切磋', d: '6.21 周六 14:00', ct: '朝阳公园', lv: '3.5级', avs: ['#4A90D9', '#2EBD85', '#7C5CE7'], n: 3, tn: 4, f: false },
      { id: 2, t: '周日早场 双打找搭子', d: '6.22 周日 08:00', ct: '国家网球中心', lv: '3.0级', avs: ['#E07B5A', '#E74C3C'], n: 2, tn: 4, f: false },
      { id: 3, t: '周三夜场 高水平对抗', d: '6.18 周三 19:00', ct: '国家网球中心', lv: '4.0级', avs: ['#2EBD85', '#7C5CE7', '#E74C3C', '#9B59B6'], n: 4, tn: 4, f: true }
    ],
    cs: [
      { id: 1, name: '国家网球中心', fd: '36', io: '室内+室外', ft: '有教练', ds: '2.3km', y: 55, x: 25 },
      { id: 2, name: '朝阳公园网球中心', fd: '12', io: '室外', ft: '可停车', ds: '1.8km', y: 30, x: 45 },
      { id: 3, name: '望京网球馆', fd: '8', io: '室内', ft: '有淋浴', ds: '3.5km', y: 18, x: 68 },
      { id: 4, name: '奥体中心', fd: '6', io: '红土+硬地', ft: '会员制', ds: '4.1km', y: 65, x: 55 }
    ]
  },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });

    try {
      api.get('/api/players').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          that.setData({ ps: data.map(mapPlayer) });
        }
      }).catch(function() {});
    } catch (e) {}

    try {
      api.get('/api/events?status=open').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          that.setData({ es: data.map(mapEvent) });
        }
      }).catch(function() {});
    } catch (e) {}
  },
  sw(e) { this.setData({ a: e.currentTarget.dataset.i }); },
  goCreate() { wx.navigateTo({ url: '/pages/create/create' }); },
  toP(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/profile/profile?id=' + id });
  },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  join(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;

    try {
      api.post('/api/events/' + id + '/join', { player_id: wx.getStorageSync('currentUserId') || 1 }).then(function(res) {
        var data = res.data || res;
        if (data) {
          api.get('/api/events?status=open').then(function(r2) {
            var d2 = r2.data || r2;
            if (d2 && d2.length > 0) {
              that.setData({ es: d2.map(mapEvent) });
            }
          }).catch(function() {});
        }
      }).catch(function() {
        that.localJoin(id);
      });
    } catch (e) {
      that.localJoin(id);
    }
  },
  localJoin(id) {
    var es = this.data.es.map(function(ev) {
      if (ev.id === id) {
        if (ev.f) return ev;
        ev.joined = !ev.joined;
        ev.n += ev.joined ? 1 : -1;
        ev.f = ev.n >= ev.tn;
      }
      return ev;
    });
    this.setData({ es: es });
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  }
});
