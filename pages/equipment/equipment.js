const app=getApp();
Page({data:{s:44,rs:app.globalData.rackets},onLoad(){this.setData({s:wx.getSystemInfoSync().statusBarHeight})},toD(e){wx.navigateTo({url:'/pages/detail/detail?id='+e.currentTarget.dataset.id})},disc(){wx.switchTab({url:'/pages/discover/discover'})},pf(){wx.switchTab({url:'/pages/profile/profile'})}});
