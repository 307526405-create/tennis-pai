App({
  globalData: {
    city: '北京',
    rackets: require('./data/rackets'),
    players: [
      {id:1,n:'老赵',a:'赵',c:'#4A90D9',lv:'3.5',g:'Blade 98 v9',el:'1510',pct:'55%',gm:32,ds:'1.8km',active:true},
      {id:2,n:'小美',a:'美',c:'#E07B5A',lv:'3.5',g:'Pure Aero',el:'1490',pct:'48%',gm:28,ds:'2.1km',active:false},
      {id:3,n:'阿强',a:'强',c:'#2EBD85',lv:'4.0',g:'Speed Pro',el:'1620',pct:'68%',gm:45,ds:'2.3km',active:true},
      {id:4,n:'小王',a:'王',c:'#7C5CE7',lv:'4.0',g:'VCORE 98',el:'1605',pct:'62%',gm:38,ds:'1.8km',active:false},
      {id:5,n:'小李',a:'李',c:'#E74C3C',lv:'3.0',g:'Pure Drive',el:'1350',pct:'42%',gm:18,ds:'2.1km',active:true},
      {id:6,n:'大刘',a:'刘',c:'#E84393',lv:'3.5',g:'Clash 100',el:'1455',pct:'50%',gm:24,ds:'1.8km',active:false}
    ],
    cities: ['北京','上海','广州','深圳','杭州','成都','武汉','南京']
  },
  onLaunch() {
    var city = wx.getStorageSync('city') || '北京';
    this.globalData.city = city;
    // 尝试定位
    var that = this;
    wx.getLocation({ type: 'gcj02', success: function(res) {
      var qqmapsdk;
      try { qqmapsdk = require('./libs/qqmap'); } catch(e) { return; }
      if (qqmapsdk) {
        qqmapsdk.reverseGeocoder({ location: { latitude: res.latitude, longitude: res.longitude }, success: function(r) {
          if (r.result && r.result.address_component) {
            var c = r.result.address_component.city || '';
            if (c) { c = c.replace('市',''); that.globalData.city = c; wx.setStorageSync('city', c); }
          }
        }});
      }
    }});
  }
});
