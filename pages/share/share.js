Page({
  data:{s:44,p:null},
  onLoad(){
    this.setData({s:wx.getSystemInfoSync().statusBarHeight});
    const p=wx.getStorageSync('profile')||{};
    this.setData({p});
  },
  saveImg(){
    const query=wx.createSelectorQuery();
    query.select('#card').boundingClientRect();
    query.exec((res)=>{
      const rect=res[0];
      const canvas=wx.createOffscreenCanvas({type:'2d',width:600,height:Math.ceil(rect.height*2)});
      const ctx=canvas.getContext('2d');
      ctx.fillStyle='#1B5E3B';ctx.fillRect(0,0,600,100);
      ctx.fillStyle='#fff';ctx.font='bold 36px sans-serif';ctx.fillText(this.data.p.name||'老张',30,60);
      ctx.font='20px sans-serif';ctx.fillText('NTRP '+(this.data.p.lv||'3.5'),30,90);
      const img=canvas.toDataURL();
      const fs=wx.getFileSystemManager();
      const path=`${wx.env.USER_DATA_PATH}/card.png`;
      fs.writeFile({filePath:path,data:img.replace(/^data:image\/\w+;base64,/,''),encoding:'base64',success:()=>{
        wx.saveImageToPhotosAlbum({filePath:path,success:()=>wx.showToast({title:'已保存到相册'})});
      }});
    });
  },
  onShareAppMessage(){return{title:'这是我的网球身份，你也来创建吧！',path:'/pages/discover/discover'};}
});
