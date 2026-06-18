const app=getApp();
Page({data:{s:44,name:'',lv:2,st:0,racket:0,court:'',city:'',levels:['2.0','2.5','3.0','3.5','4.0','4.5','5.0+'],styles:['底线进攻型','底线防守型','发球上网型','全能型'],rackets:[],racketName:''},
onLoad(){const rs=app.globalData.rackets;this.setData({s:wx.getSystemInfoSync().statusBarHeight,rackets:rs.map(r=>r.brand+' '+r.model)});
  const p=wx.getStorageSync('profile');if(p)this.setData(p);},
setName(e){this.setData({name:e.detail.value})},setLv(e){this.setData({lv:e.currentTarget.dataset.i})},
setSt(e){this.setData({st:e.currentTarget.dataset.i})},setRacket(e){const i=parseInt(e.detail.value);this.setData({racket:i,racketName:this.data.rackets[i]})},
setCourt(e){this.setData({court:e.detail.value})},setCity(e){this.setData({city:e.detail.value})},
save(){const d=this.data;const p={name:d.name,lv:d.levels[d.lv],st:d.styles[d.st],racket:d.racket,g:app.globalData.rackets[d.racket]?.model,court:d.court,city:d.city};wx.setStorageSync('profile',p);wx.showToast({title:'保存成功'});setTimeout(()=>wx.navigateBack(),500)},
back(){wx.navigateBack()}});