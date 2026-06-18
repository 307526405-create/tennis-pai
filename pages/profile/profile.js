Page({
  data: { statusBar: 44 },
  onLoad() { this.setData({ statusBar: wx.getSystemInfoSync().statusBarHeight }); },
  toEquip() { wx.navigateTo({ url: '/pages/detail/detail?id=0' }); },
  go(e) { wx.switchTab({ url: '/pages/' + e.currentTarget.dataset.p + '/' + e.currentTarget.dataset.p }); }
});
