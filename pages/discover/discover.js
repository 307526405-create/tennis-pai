Page({data:{s:44,a:0,avail:false,showPs:[],
  ps:app.globalData.players,
  es:[{id:1,t:'周六 3.5级单打切磋',d:'6.21 周六 14:00',ct:'朝阳公园',lv:'3.5级',avs:['#4A90D9','#2EBD85','#7C5CE7'],n:3,tn:4,f:false},{id:2,t:'周日早场 双打找搭子',d:'6.22 周日 08:00',ct:'国家网球中心',lv:'3.0级',avs:['#E07B5A','#E74C3C'],n:2,tn:4,f:false},{id:3,t:'周三夜场 高水平对抗',d:'6.18 周三 19:00',ct:'国家网球中心',lv:'4.0级',avs:['#2EBD85','#7C5CE7','#E74C3C','#9B59B6'],n:4,tn:4,f:true}],
  cs:[{id:1,name:'国家网球中心',fd:'36',io:'室内+室外',ft:'有教练',ds:'2.3km',y:55,x:25},{id:2,name:'朝阳公园网球中心',fd:'12',io:'室外',ft:'可停车',ds:'1.8km',y:30,x:45},{id:3,name:'望京网球馆',fd:'8',io:'室内',ft:'有淋浴',ds:'3.5km',y:18,x:68},{id:4,name:'奥体中心',fd:'6',io:'红土+硬地',ft:'会员制',ds:'4.1km',y:65,x:55}]
},onLoad(){this.setData({s:wx.getWindowInfo().statusBarHeight})},sw(e){this.setData({a:e.currentTarget.dataset.i})},toggleAvail(){this.setData({avail:!this.data.avail})},goCreate(){wx.navigateTo({url:'/pages/create/create'})},toP(){wx.navigateTo({url:'/pages/profile/profile'})},toSearch(){wx.navigateTo({url:'/pages/search/search'})},
join(e){const id=e.currentTarget.dataset.id;const es=this.data.es.map(ev=>{if(ev.id===id){if(ev.f)return ev;ev.joined=!ev.joined;ev.n+=ev.joined?1:-1;if(ev.n>=ev.tn)ev.f=true;else ev.f=false}return ev});this.setData({es})},
onShow(){if(typeof this.getTabBar==='function'&&this.getTabBar())this.getTabBar().setData({selected:0})},
onPullDownRefresh(){wx.showNavigationBarLoading();setTimeout(()=>{wx.hideNavigationBarLoading();wx.stopPullDownRefresh();wx.showToast({title:'已刷新',icon:'none',duration:1000})},800)}})
