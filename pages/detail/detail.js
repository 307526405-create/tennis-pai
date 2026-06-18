const app = getApp();
Page({
  data: { statusBar: 44, r: null },
  onLoad(options) {
    const id = parseInt(options.id) || 0;
    this.setData({ statusBar: wx.getSystemInfoSync().statusBarHeight, r: app.globalData.rackets[id] || app.globalData.rackets[0] });
  },
  back() { wx.navigateBack(); },
  goBuy(e) {
    const link = e.currentTarget.dataset.link;
    if (link) wx.setClipboardData({ data: link, success: () => wx.showToast({ title: '链接已复制，请打开淘宝/京东' }) });
  }
});
