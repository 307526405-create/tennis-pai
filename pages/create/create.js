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

    // 同步到后端
    try {
      api.post('/api/events', {
        title: d.title,
        date: d.date,
        court: d.court,
        level: d.lv,
        total: parseInt(d.tn) || 4
      }).then(function(res) {
        // 后端保存成功
        that.updateLocalAndBack();
      }).catch(function() {
        // 后端失败，仍更新本地
        that.updateLocalAndBack();
      });
    } catch (e) {
      that.updateLocalAndBack();
    }
  },
  updateLocalAndBack() {
    var d = this.data;
    var pages = getCurrentPages();
    var prev = pages[pages.length - 2];
    if (prev) {
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
    }
    wx.showToast({ title: '发布成功' });
    setTimeout(function() { wx.navigateBack(); }, 500);
  },
  back() { wx.navigateBack(); }
});
