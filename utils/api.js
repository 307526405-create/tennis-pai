var BASE = 'http://localhost:8080';
function get(url) {
  return new Promise(function(resolve, reject) {
    wx.request({ url: BASE + url, method: 'GET', success: function(r) { resolve(r.data); }, fail: reject });
  });
}
function post(url, data) {
  return new Promise(function(resolve, reject) {
    wx.request({ url: BASE + url, method: 'POST', data: data, success: function(r) { resolve(r.data); }, fail: reject });
  });
}
module.exports = { get: get, post: post };
