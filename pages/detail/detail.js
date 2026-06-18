var app = getApp();
var api = require('../../utils/api');

Page({
  data: { statusBar: 44, r: null },
  onLoad(options) {
    var that = this;
    var id = parseInt(options.id) || 0;
    this.setData({ statusBar: wx.getWindowInfo().statusBarHeight });

    // 尝试从后端加载装备详情
    try {
      api.get('/api/rackets/' + id).then(function(res) {
        var data = res.data || res;
        if (data) {
          that.setData({ r: data });
        } else {
          that.setData({ r: app.globalData.rackets[id] || app.globalData.rackets[0] });
        }
      }).catch(function() {
        // fallback 到本地数据
        that.setData({ r: app.globalData.rackets[id] || app.globalData.rackets[0] });
      });
    } catch (e) {
      this.setData({ r: app.globalData.rackets[id] || app.globalData.rackets[0] });
    }
  },
  back() { wx.navigateBack(); },
  goBuy(e) {
    var link = e.currentTarget.dataset.link;
    if (link) wx.setClipboardData({ data: link, success: function() { wx.showToast({ title: '链接已复制，请打开淘宝/京东' }); } });
  }
});
