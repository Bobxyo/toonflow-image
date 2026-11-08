// 局域网 http 访问时不是 secure context，crypto.randomUUID 未定义，前端会直接“启动失败”。
// 这里补一个等价实现（crypto.getRandomValues 在非安全上下文依然可用）。
if (!("randomUUID" in crypto) || typeof crypto.randomUUID !== "function") {
  crypto.randomUUID = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
      return (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
    });
  };
}
