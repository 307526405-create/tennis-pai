var api = require('../../utils/api');

Page({
  data: { s: 44, title: '', date: '', time: '', court: '', lv: '', tn: '4', note: '', price: '', levels: ['不限', '2.5', '3.0', '3.5', '4.0', '4.5'], counts: ['2', '3', '4', '5', '6', '8'], prices: ['AA制', '免费', '50元/人', '80元/人', '100元/人', '150元/人'] },
  onLoad() { this.setData({ s: wx.getWindowInfo().statusBarHeight }); },
  setT(e) { this.setData({ title: e.detail.value }); },
  setCt(e) { this.setData({ court: e.detail.value }); },
  setNote(e) { this.setData({ note: e.detail.value }); },

  pickDate() { var that=this; wx.showActionSheet({ itemList: ['今天','明天','后天','选择日期'], success: function(r) { if(r.tapIndex===0) that.setData({ date: '今天' }); else if(r.tapIndex===1) that.setData({ date: '明天' }); else if(r.tapIndex===2) that.setData({ date: '后天' }); } }); },
  
  pickTime() { var that=this; wx.showActionSheet({ itemList: ['08:00-10:00','10:00-12:00','14:00-16:00','16:00-18:00','18:00-20:00','20:00-22:00'], success: function(r) { that.setData({ time: ['08:00-10:00','10:00-12:00','14:00-16:00','16:00-18:00','18:00-20:00','20:00-22:00'][r.tapIndex] }); } }); },
  
  pickLevel() { var that=this; wx.showActionSheet({ itemList: this.data.levels, success: function(r) { that.setData({ lv: that.data.levels[r.tapIndex] }); } }); },
  
  pickCount() { var that=this; wx.showActionSheet({ itemList: this.data.counts, success: function(r) { that.setData({ tn: that.data.counts[r.tapIndex] }); } }); },
  pickPrice() { var that=this; wx.showActionSheet({ itemList: this.data.prices, success: function(r) { that.setData({ price: that.data.prices[r.tapIndex] }); } }); },

  publish() {
    var d = this.data;
    if (!d.title || !d.date || !d.court) { wx.showToast({ title: '请填写标题/日期/地点', icon: 'none' }); return; }
    try {
      api.post('/api/events', { title: d.title, date: d.date, time: d.time || '14:00-16:00', court: d.court, level: d.lv || '不限', max_players: parseInt(d.tn) || 4, price: d.price || 'AA制', creator_id: wx.getStorageSync('currentUserId') || 1 }).then(function() {
        wx.showToast({ title: '约球发布成功' });
        setTimeout(function() { wx.navigateBack(); }, 800);
      }).catch(function() { wx.showToast({ title: '发布失败', icon: 'none' }); });
    } catch (e) {}
  },
  back() { wx.navigateBack(); }
});
