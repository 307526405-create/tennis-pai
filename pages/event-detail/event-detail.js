var api = require('../../utils/api');

function getInitial(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

Page({
  data: {
    s: 44,
    event: null,
    eventId: null,
    currentUserId: 1
  },

  onLoad(options) {
    var that = this;
    var eventId = options.event_id || options.id;
    var uid = wx.getStorageSync('currentUserId') || 1;

    this.setData({
      s: wx.getWindowInfo().statusBarHeight,
      eventId: eventId,
      currentUserId: uid
    });

    this.loadDetail();
  },

  loadDetail() {
    var that = this;
    var eventId = this.data.eventId;
    if (!eventId) return;

    try {
      api.get('/api/events/' + eventId).then(function(res) {
        var data = res.data || res;
        if (!data) {
          wx.showToast({ title: '活动不存在', icon: 'none' });
          return;
        }
        var event = that.mapEvent(data);
        that.setData({ event: event });

        // 加载发起人信息
        if (data.creator_id) {
          that.loadCreator(data.creator_id);
        }
      }).catch(function() {
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  loadCreator(creatorId) {
    var that = this;
    try {
      api.get('/api/players/' + creatorId).then(function(res) {
        var player = res.data || res;
        if (player && player.name) {
          var event = that.data.event;
          event.creatorName = player.name;
          event.creatorLevel = player.level || '';
          event.creatorInitial = getInitial(player.name);
          that.setData({ event: event });
        }
      }).catch(function() {});
    } catch (e) {}
  },

  mapEvent(data) {
    var uid = this.data.currentUserId;
    var players = (data.players || []).map(function(p) {
      return {
        id: p.id,
        name: p.name,
        level: p.level || '',
        avatar: p.avatar || '',
        initial: getInitial(p.name)
      };
    });

    var joined = players.some(function(p) { return p.id === uid; });
    var isFull = data.current_players >= data.max_players;

    return {
      id: data.id,
      title: data.title,
      date: data.date,
      time: data.time,
      court: data.court,
      level: data.level,
      max_players: data.max_players,
      current_players: data.current_players,
      price: data.price || '',
      status: data.status,
      creator_id: data.creator_id,
      creatorName: '',
      creatorLevel: '',
      creatorInitial: '',
      players: players,
      joined: joined,
      isFull: isFull
    };
  },

  toggleJoin() {
    var that = this;
    var event = this.data.event;
    if (!event) return;

    // 如果是已满且未报名，不允许报名
    if (event.isFull && !event.joined) {
      wx.showToast({ title: '报名已满', icon: 'none' });
      return;
    }

    var eventId = event.id;
    var uid = this.data.currentUserId;

    if (event.joined) {
      // 取消报名
      wx.showModal({
        title: '取消报名',
        content: '确定要取消报名吗？',
        success: function(modalRes) {
          if (!modalRes.confirm) return;
          that.doCancel(eventId, uid);
        }
      });
    } else {
      // 报名
      that.doJoin(eventId, uid);
    }
  },

  doJoin(eventId, uid) {
    var that = this;
    try {
      api.post('/api/events/' + eventId + '/join', { player_id: uid }).then(function(res) {
        wx.showToast({ title: '报名成功', icon: 'success' });
        that.loadDetail();
      }).catch(function() {
        wx.showToast({ title: '报名失败', icon: 'none' });
      });
    } catch (e) {
      wx.showToast({ title: '报名失败', icon: 'none' });
    }
  },

  doCancel(eventId, uid) {
    var that = this;
    try {
      api.post('/api/events/' + eventId + '/cancel', { player_id: uid }).then(function(res) {
        wx.showToast({ title: '已取消', icon: 'success' });
        that.loadDetail();
      }).catch(function() {
        wx.showToast({ title: '取消失败', icon: 'none' });
      });
    } catch (e) {
      wx.showToast({ title: '取消失败', icon: 'none' });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  onShow() {
    // 从报名页返回时刷新
    if (this.data.eventId) {
      this.loadDetail();
    }
  }
});
