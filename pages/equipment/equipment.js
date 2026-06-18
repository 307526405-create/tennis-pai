const app = getApp();
Page({
  data: { active: 0, rackets: app.globalData.rackets },
  onTabChange(e) { this.setData({ active: e.detail.index }); },
  onTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  }
});
