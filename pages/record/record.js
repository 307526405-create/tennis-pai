var api = require('../../utils/api');

Page({
  data: {
    s: 44,
    players: [],
    playerNames: [],
    opponentName: '',
    opponentId: null,
    myScore: '',
    oppScore: '',
    courts: [],
    courtNames: [],
    courtName: '',
    courtId: null,
    courtInput: '',
    date: '',
    note: '',
    currentUserId: 1
  },

  onLoad() {
    var that = this;
    var uid = wx.getStorageSync('currentUserId') || 1;
    this.setData({ s: wx.getWindowInfo().statusBarHeight, currentUserId: uid });

    // 获取球员列表
    try {
      api.get('/api/players').then(function(res) {
        var list = res.data || res || [];
        // 过滤掉当前用户
        var filtered = [];
        for (var i = 0; i < list.length; i++) {
          if (list[i].id != uid) filtered.push(list[i]);
        }
        var names = [];
        for (var j = 0; j < filtered.length; j++) {
          names.push(filtered[j].name || ('球员' + filtered[j].id));
        }
        that.setData({ players: filtered, playerNames: names });
      }).catch(function() {
        // 使用本地数据
        var app = getApp();
        var all = app.globalData.players;
        var filtered = [];
        for (var i = 0; i < all.length; i++) {
          if (all[i].id != uid) filtered.push(all[i]);
        }
        var names = [];
        for (var j = 0; j < filtered.length; j++) {
          names.push(filtered[j].n);
        }
        that.setData({ players: filtered, playerNames: names });
      });
    } catch (e) {
      // 使用本地数据
      var app = getApp();
      var all = app.globalData.players;
      var filtered = [];
      for (var i = 0; i < all.length; i++) {
        if (all[i].id != uid) filtered.push(all[i]);
      }
      var names = [];
      for (var j = 0; j < filtered.length; j++) {
        names.push(filtered[j].n);
      }
      this.setData({ players: filtered, playerNames: names });
    }

    // 获取球场列表
    try {
      api.get('/api/courts').then(function(res) {
        var list = res.data || res || [];
        var names = [];
        for (var i = 0; i < list.length; i++) {
          names.push(list[i].name || list[i].court_name || '');
        }
        that.setData({ courts: list, courtNames: names });
      }).catch(function() {});
    } catch (e) {}
  },

  setOpponent(e) {
    var i = parseInt(e.detail.value);
    var p = this.data.players[i];
    this.setData({
      opponentName: this.data.playerNames[i],
      opponentId: p ? p.id : null
    });
  },

  setMyScore(e) {
    this.setData({ myScore: e.detail.value });
  },

  setOppScore(e) {
    this.setData({ oppScore: e.detail.value });
  },

  setCourt(e) {
    var i = parseInt(e.detail.value);
    var c = this.data.courts[i];
    this.setData({
      courtName: this.data.courtNames[i],
      courtId: c ? c.id : null,
      courtInput: ''
    });
  },

  setCourtInput(e) {
    this.setData({ courtInput: e.detail.value, courtName: '', courtId: null });
  },

  setDate(e) {
    this.setData({ date: e.detail.value });
  },

  setNote(e) {
    this.setData({ note: e.detail.value });
  },

  submit() {
    var d = this.data;
    var opponentId = d.opponentId;
    if (!opponentId) {
      wx.showToast({ title: '请选择对手', icon: 'none' });
      return;
    }
    if (!d.myScore || !d.oppScore) {
      wx.showToast({ title: '请输入比分', icon: 'none' });
      return;
    }
    var myS = parseInt(d.myScore);
    var oppS = parseInt(d.oppScore);
    var score = myS + '-' + oppS;
    var result = myS > oppS ? 'W' : 'L';

    var court = d.courtName || d.courtInput || '';
    if (!court) {
      wx.showToast({ title: '请选择或输入球场', icon: 'none' });
      return;
    }
    if (!d.date) {
      wx.showToast({ title: '请选择日期', icon: 'none' });
      return;
    }

    var that = this;
    try {
      api.post('/api/matches', {
        player1_id: d.currentUserId,
        player2_id: opponentId,
        score: score,
        court: court,
        date: d.date,
        result: result
      }).then(function() {
        wx.showToast({ title: '战绩已录入', icon: 'success' });
        setTimeout(function() {
          wx.switchTab({ url: '/pages/profile/profile' });
        }, 800);
      }).catch(function(err) {
        wx.showToast({ title: '提交失败，请稍后重试', icon: 'none' });
      });
    } catch (e) {
      wx.showToast({ title: '提交失败，请稍后重试', icon: 'none' });
    }
  },

  back() {
    wx.navigateBack();
  }
});
