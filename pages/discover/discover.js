Page({
  data: {
    location: '北京 · 朝阳区',
    active: 0,
    levels: [
      { name: '全部水平', active: true },
      { name: '2.0–3.0', active: false },
      { name: '3.0–3.5', active: false },
      { name: '3.5–4.0', active: false },
      { name: '4.0+', active: false }
    ],
    players: [
      { id: 1, name: '老赵', avatar: '赵', color: '#4A90D9', level: '3.5', style: '底线进攻型', gear: 'Blade 98 v9', court: '朝阳公园', elo: '1510', pct: '55%' },
      { id: 2, name: '小美', avatar: '美', color: '#E07B5A', level: '3.5', style: '底线防守型', gear: 'Pure Aero', court: '国网中心', elo: '1490', pct: '48%' },
      { id: 3, name: '阿强', avatar: '强', color: '#2EBD85', level: '4.0', style: '发球上网型', gear: 'Speed Pro', court: '国家网球中心', elo: '1620', pct: '68%' },
      { id: 4, name: '小王', avatar: '王', color: '#7C5CE7', level: '4.0', style: '全能型', gear: 'VCORE 98', court: '朝阳公园', elo: '1605', pct: '62%' },
      { id: 5, name: '小李', avatar: '李', color: '#E74C3C', level: '3.0', style: '底线防守型', gear: 'Pure Drive', court: '国网中心', elo: '1350', pct: '42%' },
      { id: 6, name: '大刘', avatar: '刘', color: '#E84393', level: '3.5', style: '全能型', gear: 'Clash 100', court: '朝阳公园', elo: '1455', pct: '50%' }
    ],
    events: [
      { id: 1, badge: '报名中', full: false, title: '周六 3.5级单打切磋', date: '6.21 周六 14:00', court: '朝阳公园', level: '3.5级', avatars: ['#4A90D9','#2EBD85','#7C5CE7'], count: 3, total: 4 },
      { id: 2, badge: '报名中', full: false, title: '周日早场 双打找搭子', date: '6.22 周日 08:00', court: '国家网球中心', level: '3.0级', avatars: ['#E07B5A','#E74C3C'], count: 2, total: 4 },
      { id: 3, badge: '已满', full: true, title: '周三夜场 高水平对抗', date: '6.18 周三 19:00', court: '国家网球中心', level: '4.0级', avatars: ['#2EBD85','#7C5CE7','#E74C3C','#9B59B6'], count: 4, total: 4 }
    ],
    courts: [
      { id: 1, name: '国家网球中心', fields: '36', indoor: '室内+室外', feature: '有教练', dist: '2.3km', top: 55, left: 25 },
      { id: 2, name: '朝阳公园网球中心', fields: '12', indoor: '室外', feature: '可停车', dist: '1.8km', top: 30, left: 45 },
      { id: 3, name: '望京网球馆', fields: '8', indoor: '室内', feature: '有淋浴', dist: '3.5km', top: 18, left: 68 },
      { id: 4, name: '奥体中心', fields: '6', indoor: '红土+硬地', feature: '会员制', dist: '4.1km', top: 65, left: 55 }
    ]
  },
  onTabChange(e) { this.setData({ active: e.detail.index }); },
  onLevelTap(e) {
    const idx = e.currentTarget.dataset.index;
    const levels = this.data.levels.map((l, i) => { l.active = i === idx; return l; });
    this.setData({ levels });
  },
  onPlayerTap(e) {
    wx.navigateTo({ url: '/pages/profile/profile' });
  }
});
