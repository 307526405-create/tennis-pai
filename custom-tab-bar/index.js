Component({
  data: { selected: 0 },
  methods: {
    switchTab(e) {
      const path = e.currentTarget.dataset.path;
      const idx = e.currentTarget.dataset.idx;
      this.setData({ selected: idx });
      wx.switchTab({ url: path });
    }
  }
});
