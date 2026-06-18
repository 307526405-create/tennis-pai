const app = getApp();
Page({
  data: { statusBar: 44, eqTab: 0, rackets: app.globalData.rackets },
  onLoad() { this.setData({ statusBar: wx.getSystemInfoSync().statusBarHeight }); },
  setTab(e) { this.setData({ eqTab: e.currentTarget.dataset.i }); },
  toDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }); },
  go(e) { wx.switchTab({ url: '/pages/' + e.currentTarget.dataset.p + '/' + e.currentTarget.dataset.p }); }
});
