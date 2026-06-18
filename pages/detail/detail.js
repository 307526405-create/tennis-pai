const app = getApp();
Page({
  data: { racket: null },
  onLoad(options) {
    const id = parseInt(options.id) || 0;
    const rackets = app.globalData.rackets;
    this.setData({ racket: rackets[id] || rackets[0] });
  }
});
