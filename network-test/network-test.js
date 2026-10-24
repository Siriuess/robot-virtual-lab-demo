'use strict';
(() => {
  const byId = id => document.getElementById(id);
  const start = byId('start');
  const sampleBytes = 16 * 1024 * 1024;
  const resourceBytes = 636381158;
  byId('target').textContent = '目标：' + location.host;
  const url = () => './sample.bin?run=' + Date.now() + '-' + Math.random().toString(36).slice(2);
  async function download(bytes) {
    const began = performance.now();
    const response = await fetch(url(), {cache: 'no-store', headers: {Range: 'bytes=0-' + (bytes - 1)}, signal: AbortSignal.timeout(60000)});
    if (!response.ok || !response.body) throw new Error('资源请求失败（HTTP ' + response.status + '）');
    if (response.status !== 206) throw new Error('服务器未返回分段下载响应，请稍后重试。');
    const reader = response.body.getReader();
    let received = 0;
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      received += value.byteLength;
    }
    if (received !== bytes) throw new Error('下载数据不完整，请检查连接后重试。');
    const seconds = (performance.now() - began) / 1000;
    return {bytes: received, seconds, mbps: received * 8 / seconds / 1e6};
  }
  start.addEventListener('click', async () => {
    start.disabled = true;
    byId('samples').replaceChildren();
    byId('speed').textContent = '—';
    byId('latency').textContent = '—';
    byId('timing').hidden = true;
    byId('progress').hidden = false;
    byId('progress').value = 0;
    document.querySelector('.results').setAttribute('aria-busy', 'true');
    byId('connection').textContent = '连接中';
    try {
      byId('status').textContent = '正在检查实验服务器连接…';
      const began = performance.now();
      const head = await fetch(url(), {method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(15000)});
      const latency = performance.now() - began;
      if (!head.ok) throw new Error('无法读取测速资源（HTTP ' + head.status + '）');
      byId('connection').textContent = '已连接';
      byId('latency').textContent = Math.round(latency) + ' ms';
      byId('status').textContent = '正在预热连接…';
      await download(2 * 1024 * 1024);
      const samples = [];
      for (let i = 0; i < 3; i++) {
        byId('status').textContent = '正在下载测试数据，第 ' + (i + 1) + ' / 3 轮…';
        const sample = await download(sampleBytes);
        samples.push(sample);
        const line = document.createElement('li');
        line.textContent = '第 ' + (i + 1) + ' 轮：' + sample.mbps.toFixed(1) + ' Mbps（16 MiB，' + sample.seconds.toFixed(2) + ' 秒）';
        byId('samples').append(line);
        byId('progress').value = i + 1;
      }
      const received = samples.reduce((sum, sample) => sum + sample.bytes, 0);
      const seconds = samples.reduce((sum, sample) => sum + sample.seconds, 0);
      const mbps = received * 8 / seconds / 1e6;
      byId('speed').textContent = mbps.toFixed(1) + ' Mbps';
      byId('connection').textContent = '测试完成';
      byId('status').textContent = mbps >= 100 ? '当前带宽达到推荐水平，可进行实验资源加载。' : mbps >= 50 ? '当前带宽达到建议水平，首次资源加载请耐心等待。' : '当前带宽低于建议水平，首次加载可能较慢；建议改用更稳定的网络或提前加载资源。';
      byId('timing').textContent = '测试时间：' + new Date().toLocaleString('zh-CN') + '。按本次速度估算，主要资源的纯传输时间约 ' + Math.ceil(resourceBytes * 8 / mbps / 1e6) + ' 秒；不含浏览器解析与场景初始化时间。';
      byId('timing').hidden = false;
      window.networkTestResult = {target: location.origin, downloadMbps: mbps, requestRoundTripMs: latency, samples, testedAt: new Date().toISOString()};
    } catch (error) {
      byId('connection').textContent = '测试未完成';
      byId('status').textContent = error.name === 'TimeoutError' ? '测试超时，请检查网络后重试。' : '测试未完成：' + error.message;
      window.networkTestResult = {error: error.message};
    } finally {
      start.disabled = false;
      start.textContent = '重新测速';
      document.querySelector('.results').setAttribute('aria-busy', 'false');
    }
  });
})();
