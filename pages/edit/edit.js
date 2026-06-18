const app=getApp();
Page({
  data:{s:44,name:'',lv:2,st:0,racket:0,court:'',city:'',levels:['2.0','2.5','3.0','3.5','4.0','4.5','5.0+'],styles:['底线进攻型','底线防守型','发球上网型','全能型'],rackets:[],racketName:''},
  onLoad(){
    this.setData({s:wx.getWindowInfo().statusBarHeight,rackets:app.globalData.rackets.map(r=>r.brand+' '+r.model)});
    var p=wx.getStorageSync('profile');if(p)this.setData(p);
  },
  setName(e){this.setData({name:e.detail.value})},
  setLv(e){this.setData({lv:e.currentTarget.dataset.i})},
  setSt(e){this.setData({st:e.currentTarget.dataset.i})},
  setRacket(e){var i=parseInt(e.detail.value);this.setData({racket:i,racketName:this.data.rackets[i]})},
  setCourt(e){this.setData({court:e.detail.value})},
  setCity(e){this.setData({city:e.detail.value})},
  save(){
    var d=this.data;
    var name=d.name||'球友';
    var lv=d.levels[d.lv];
    var g=app.globalData.rackets[d.racket]?app.globalData.rackets[d.racket].model:'';
    var p={name:name,lv:lv,st:d.styles[d.st],g:g,court:d.court,city:d.city};
    wx.setStorageSync('profile',p);
    var players=app.globalData.players;
    var me=null;
    for(var i=0;i<players.length;i++){if(players[i].me){me=players[i];break}}
    if(me){me.n=name;me.a=name[0];me.lv=lv;me.g=g;me.active=true}
    else{players.unshift({id:Date.now(),n:name,a:name[0],c:'#2E8B57',lv:lv,g:g,el:'1500',pct:'0%',gm:0,ds:'',active:true,me:true})}
    wx.showToast({title:'保存成功，已加入发现列表'});setTimeout(function(){wx.navigateBack()},800);
  },
  onAvatar(e){this.setData({avatar:e.detail.avatarUrl})},
  back(){wx.navigateBack()}
});
