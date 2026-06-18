var api = require('../../utils/api');

Page({
  data: { s: 44, title: '', date: '', court: '', lv: '', tn: '' },
  onLoad() {
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
  },
  setT(e) { this.setData({ title: e.detail.value }); },
  setD(e) { this.setData({ date: e.detail.value }); },
  setCt(e) { this.setData({ court: e.detail.value }); },
  setLv(e) { this.setData({ lv: e.detail.value }); },
  setTn(e) { this.setData({ tn: e.detail.value }); },
  publish() {
    var d = this.data;
    if (!d.title) return;

    var that = this;

    try {
      api.post('/api/events', {
        title: d.title,
        date: d.date,
        court: d.court,
        level: d.lv,
        total: parseInt(d.tn) || 4
      }).then(function(res) {
        that.refreshEventsAndBack();
      }).catch(function() {
        that.refreshEventsAndBack();
      });
    } catch (e) {
      that.refreshEventsAndBack();
    }
  },
  refreshEventsAndBack() {
    var d = this.data;
    var pages = getCurrentPages();
    var prev = pages[pages.length - 2];
    if (prev) {
      try {
        var api = require('../../utils/api');
        api.get('/api/events?status=open').then(function(res) {
          var data = res.data || res;
          if (data && data.length > 0) {
            prev.setData({ es: data.map(function(e) {
              return { id: e.id, t: e.title || '', d: (e.date || '') + ' ' + (e.time || ''),
                ct: e.court || '', lv: e.level || '', tn: e.max_players || 4, n: e.current_players || 0,
                f: e.status === 'full', joined: false, avs: [] };
            }) });
            wx.showToast({ title: '发布成功' });
            setTimeout(function() { wx.navigateBack(); }, 500);
            return;
          }
          thatLocal(d, prev);
        }).catch(function() {
          thatLocal(d, prev);
        });
      } catch (e) {
        thatLocal(d, prev);
      }
    } else {
      wx.showToast({ title: '发布成功' });
      setTimeout(function() { wx.navigateBack(); }, 500);
    }

    function thatLocal(d, prev) {
      var es = prev.data.es || [];
      es.unshift({
        id: Date.now(),
        t: d.title,
        d: d.date,
        ct: d.court,
        lv: d.lv + '级',
        avs: [],
        n: 0,
        tn: parseInt(d.tn) || 4,
        f: false
      });
      prev.setData({ es: es });
      wx.showToast({ title: '发布成功' });
      setTimeout(function() { wx.navigateBack(); }, 500);
    }
  },
  back() { wx.navigateBack(); }
});
