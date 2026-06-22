Page({
  data: { s: 44, p: null },
  onLoad() {
    this.setData({ s: wx.getWindowInfo().statusBarHeight });
    var p = wx.getStorageSync('profile') || {};
    this.setData({ p: p });
  },
  saveImg() {
    var that = this;
    var p = this.data.p;
    var W = 600;
    var H = 800;
    var canvas = wx.createOffscreenCanvas({ type: '2d', width: W, height: H });
    var ctx = canvas.getContext('2d');

    // 背景
    ctx.fillStyle = '#F7F9F4';
    ctx.fillRect(0, 0, W, H);

    // 卡片背景
    var cardX = 24, cardY = 32, cardW = W - 48, cardH = H - 200;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(cardX + 16, cardY);
    ctx.lineTo(cardX + cardW - 16, cardY);
    ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + 16, 16);
    ctx.arcTo(cardX + cardW, cardY + cardH, cardX + cardW - 16, cardY + cardH, 16);
    ctx.arcTo(cardX, cardY + cardH, cardX, cardY + cardH - 16, 16);
    ctx.arcTo(cardX, cardY, cardX + 16, cardY, 16);
    ctx.closePath();
    ctx.fill();

    // 卡片阴影
    ctx.shadowColor = 'rgba(0,0,0,0.06)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // 品牌绿顶部条
    ctx.fillStyle = '#1B5E3B';
    ctx.beginPath();
    ctx.moveTo(cardX + 16, cardY);
    ctx.lineTo(cardX + cardW - 16, cardY);
    ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + 16, 16);
    ctx.lineTo(cardX + cardW, cardY + 48);
    ctx.lineTo(cardX, cardY + 48);
    ctx.lineTo(cardX, cardY + 16);
    ctx.arcTo(cardX, cardY, cardX + 16, cardY, 16);
    ctx.closePath();
    ctx.fill();

    // 品牌文字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('TENNIS PAI', cardX + 28, cardY + 34);

    // 头像
    var avX = cardX + 36, avY = cardY + 80, avR = 50;
    ctx.fillStyle = '#2E8B57';
    ctx.beginPath();
    ctx.arc(avX + avR, avY + avR, avR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var initial = (p.name || '张')[0];
    ctx.fillText(initial, avX + avR, avY + avR);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // 名字
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(p.name || '张砚清', avX + avR * 2 + 20, avY + 35);

    // 水平
    ctx.fillStyle = '#2E8B57';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('NTRP ' + (p.lv || '3.5'), avX + avR * 2 + 20, avY + 68);

    // 统计区
    var statsY = avY + avR * 2 + 40;
    var stats = [
      { n: String(p.gm || '32'), l: '场次' },
      { n: p.pct || '58%', l: '胜率' },
      { n: '4.7', l: '评分' }
    ];
    var statW = (cardW - 72) / 3;
    for (var i = 0; i < 3; i++) {
      var sx = cardX + 36 + i * statW;
      ctx.fillStyle = '#F7F9F4';
      ctx.beginPath();
      ctx.moveTo(sx + 8, statsY);
      ctx.lineTo(sx + statW - 8, statsY);
      ctx.arcTo(sx + statW, statsY, sx + statW, statsY + 8, 8);
      ctx.arcTo(sx + statW, statsY + 80, sx + statW - 8, statsY + 80, 8);
      ctx.arcTo(sx, statsY + 80, sx, statsY + 80 - 8, 8);
      ctx.arcTo(sx, statsY, sx + 8, statsY, 8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1B5E3B';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stats[i].n, sx + statW / 2, statsY + 34);

      ctx.fillStyle = '#999999';
      ctx.font = '18px sans-serif';
      ctx.fillText(stats[i].l, sx + statW / 2, statsY + 62);
      ctx.textAlign = 'left';
    }

    // 详情行
    var detailY = statsY + 110;
    var detailLines = [
      { l: '风格', v: p.st || '底线进攻型' },
      { l: '装备', v: p.g || 'Wilson Blade 98 v9' },
      { l: '主场', v: (p.court || '朝阳公园') + ' · ' + (p.city || '北京') }
    ];
    for (var j = 0; j < detailLines.length; j++) {
      var dy = detailY + j * 52;
      // 分割线
      if (j > 0) {
        ctx.strokeStyle = '#F0F0F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cardX + 36, dy - 12);
        ctx.lineTo(cardX + cardW - 36, dy - 12);
        ctx.stroke();
      }
      ctx.fillStyle = '#999999';
      ctx.font = '22px sans-serif';
      ctx.fillText(detailLines[j].l, cardX + 36, dy + 8);
      ctx.fillStyle = '#1A1A1A';
      ctx.font = '500 22px sans-serif';
      ctx.fillText(detailLines[j].v, cardX + 110, dy + 8);
    }

    // 底部提示
    var bottomY = cardY + cardH - 40;
    ctx.fillStyle = '#BBBBBB';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('扫码创建你的网球身份', cardX + cardW / 2, bottomY);
    ctx.textAlign = 'left';

    // 按钮区域背景
    ctx.fillStyle = '#F7F9F4';
    ctx.fillRect(0, cardY + cardH + 16, W, H - cardY - cardH - 16);

    // 导出图片
    var imgData = canvas.toDataURL('image/png');
    var fs = wx.getFileSystemManager();
    var path = wx.env.USER_DATA_PATH + '/card.png';
    fs.writeFile({
      filePath: path,
      data: imgData.replace(/^data:image\/\w+;base64,/, ''),
      encoding: 'base64',
      success: function() {
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function() {
            wx.showToast({ title: '已保存到相册', icon: 'success' });
          },
          fail: function(e) {
            if (e.errMsg.indexOf('auth deny') > -1 || e.errMsg.indexOf('authorize') > -1) {
              wx.showModal({
                title: '需要相册权限',
                content: '请在设置中允许小程序保存图片到相册',
                confirmText: '去设置',
                success: function(m) {
                  if (m.confirm) wx.openSetting();
                }
              });
            } else {
              wx.showToast({ title: '保存失败', icon: 'none' });
            }
          }
        });
      },
      fail: function() {
        wx.showToast({ title: '生成图片失败', icon: 'none' });
      }
    });
  },
  onShareAppMessage() {
    return { title: '这是我的网球身份，你也来创建吧！', path: '/pages/discover/discover' };
  }
});
