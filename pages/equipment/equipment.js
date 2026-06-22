var app = getApp();
var api = require('../../utils/api');

function mapRacket(r) {
  return { id: r.id, brand: r.brand, model: r.model, head: r.head_size || '',
    weight: r.weight || '', balance: r.balance || '', pattern: r.pattern || '',
    ra: r.stiffness || '', sw: r.swingweight || '', beam: r.beam || '', type: r.type || '', price: r.price || '',
    image: r.image || '' };
}

Page({
  data: {
    s: 44, ci: 0, bi: 0, ti: 0, showBrand: false, showType: false,
    filters: [
      { brands: ['全部', 'Wilson', 'Babolat', 'HEAD', 'Yonex'], types: ['全部', '控制型', '力量型', '旋转型', '全能型'] },
      { brands: ['全部', 'Nike', 'Adidas', 'Asics', 'Wilson'], types: [] },
      { brands: ['全部', '男', '女'], types: ['全部', '网球裙', '连衣裙', 'Polo衫', '短裤'] },
      { brands: ['全部', 'Luxilon', 'Babolat', 'HEAD', 'Solinco'], types: [] }
    ],
    rs: app.globalData.rackets
  },
  onLoad() {
    var that = this;
    this.setData({ s: wx.getWindowInfo().statusBarHeight });

    // 尝试从后端加载装备列表
    try {
      api.get('/api/rackets').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          that.setData({ rs: data.map(mapRacket) });
        }
      }).catch(function() {
      });
    } catch (e) {
    }
  },
  swCat(e) {
    this.setData({ ci: e.currentTarget.dataset.i, showBrand: false, showType: false, bi: 0, ti: 0 });
  },
  toggleBrand() {
    this.setData({ showBrand: !this.data.showBrand, showType: false });
  },
  toggleType() {
    this.setData({ showType: !this.data.showType, showBrand: false });
  },
  selBrand(e) {
    this.setData({ bi: e.currentTarget.dataset.i, showBrand: false });
  },
  selType(e) {
    this.setData({ ti: e.currentTarget.dataset.i, showType: false });
  },
  toD(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },
  toSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },
  onPullDownRefresh() {
    var that = this;
    wx.showNavigationBarLoading();

    // 尝试刷新后端数据
    try {
      api.get('/api/rackets').then(function(res) {
        var data = res.data || res;
        if (data && data.length > 0) {
          that.setData({ rs: data.map(mapRacket) });
        }
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({ title: '已刷新', icon: 'none', duration: 1000 });
      }).catch(function() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({ title: '已刷新', icon: 'none', duration: 1000 });
      });
    } catch (e) {
      setTimeout(function() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({ title: '已刷新', icon: 'none', duration: 1000 });
      }, 800);
    }
  }
});
