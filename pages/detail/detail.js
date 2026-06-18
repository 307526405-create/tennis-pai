const app = getApp();
Page({
  data: { statusBar: 44, r: null },
  onLoad(options) {
    const id = parseInt(options.id) || 0;
    this.setData({ statusBar: wx.getSystemInfoSync().statusBarHeight, r: app.globalData.rackets[id] || app.globalData.rackets[0] });
  },
  back() { wx.navigateBack(); }
});
