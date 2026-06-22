var api = require('../../utils/api');

Page({
  data: {
    s: 44, title: '', date: '', dateVal: '', time: '', court: '', showCourtInput: false, lv: '不限', tn: 4,
    note: '', price: '', customPrice: '', priceText: 'AA制',
    topCourts: ['国家网球中心','朝阳公园','奥体中心','海淀体育中心','清华紫荆'],
    times: ['08:00-10:00','10:00-12:00','14:00-16:00','16:00-18:00','18:00-20:00','20:00-22:00'],
    levels: ['不限','1.5','2.0','2.5','3.0','3.5'],
    counts: [2,3,4,5,6,8]
  },
  onLoad() { this.setData({ s: wx.getWindowInfo().statusBarHeight }); },
  setT(e) { this.setData({ title: e.detail.value }); },
  setCt(e) { this.setData({ court: e.detail.value }); },
  setNote(e) { this.setData({ note: e.detail.value }); },
  setCustomPrice(e) { this.setData({ customPrice: e.detail.value }); },

  onDate(e) {
    var d = new Date(e.detail.value);
    var m = d.getMonth() + 1;
    var day = d.getDate();
    var week = ['日','一','二','三','四','五','六'][d.getDay()];
    this.setData({ dateVal: e.detail.value, date: m + '/' + day + ' 周' + week });
  },
  onTime(e) { this.setData({ time: this.data.times[e.detail.value] }); },
  onLevel(e) { this.setData({ lv: this.data.levels[e.detail.value] }); },
  onCount(e) { this.setData({ tn: this.data.counts[e.detail.value] }); },

  pickPrice() {
    var that = this;
    wx.showActionSheet({
      itemList: ['AA制', '免费', '50元/人', '100元/人', '150元/人', '其他金额'],
      success: function(r) {
        if (r.tapIndex === 5) {
          that.setData({ price: 'custom', priceText: '自定义' });
        } else {
          var arr = ['AA制','免费','50元/人','100元/人','150元/人'];
          that.setData({ price: '', priceText: arr[r.tapIndex], customPrice: '' });
        }
      }
    });
  },

  selCourt(e) { this.setData({ court: e.currentTarget.dataset.name, showCourtInput: false }); },
  inputCourt() { this.setData({ showCourtInput: !this.data.showCourtInput, court: '' }); },
  onCourtInput(e) { this.setData({ court: e.detail.value }); },

  publish() {
    var d = this.data;
    if (!d.title || !d.date) { wx.showToast({ title: '请填写标题和日期', icon: 'none' }); return; }
    var price = d.price === 'custom' ? (d.customPrice || '面议') : (d.priceText || 'AA制');
    try {
      api.post('/api/events', {
        title: d.title, date: d.date, time: d.time || '14:00-16:00',
        court: d.court || '待定', level: d.lv, max_players: d.tn,
        price: price, creator_id: wx.getStorageSync('currentUserId') || 1
      }).then(function() {
        wx.showToast({ title: '约球发布成功' });
        setTimeout(function() { wx.navigateBack(); }, 800);
      }).catch(function() { wx.showToast({ title: '发布失败', icon: 'none' }); });
    } catch (e) {}
  },
  back() { wx.navigateBack(); }
});
