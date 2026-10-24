(() => {
  "use strict";
  const settings = window.EXPERIMENT_VIDEO_CONFIG?.sync;
  const panel = document.getElementById("experiment-videos");
  if (!settings || !panel) return;
  const panorama = panel.querySelector('[data-video-id="panorama"] video');
  const robot = panel.querySelector('[data-video-id="robot"] video');
  const canvas = document.getElementById("unity-canvas");
  if (!panorama || !robot || !canvas) return;
  if (canvas.tabIndex < 0) canvas.tabIndex = 0;
  const videos = [panorama, robot];
  const fps = settings.robotFps || 15;
  let offset = settings.robotOffsetFrames / fps;
  let follow = settings.followUnityInput !== false;
  let preview = false, failed = false, initialized = false, duration = 0;
  let pending = null, playing = false, starting = false, generation = 0;
  let mouseUntil = 0, raf = 0, disposed = false, lastCorrection = 0;
  let videoBallFireActive = false;
  const keys = new Set();
  const relevant = new Set(["KeyW", "KeyS", "KeyA", "KeyD", "KeyQ", "KeyE", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
  const controls = document.createElement("section");
  controls.id = "experiment-video-sync";
  controls.hidden = settings.showControls === false;
  controls.setAttribute("aria-label", "录像同步控制");
  controls.innerHTML = `
    <label class="sync-follow"><input id="sync-follow" type="checkbox"> 随 Unity 操作播放</label>
    <p id="sync-status" role="status">正在加载对齐录像…</p>
    <div class="sync-actions"><button id="sync-preview" type="button">同步预览</button><button id="sync-reset" type="button">回到起点</button></div>
    <input id="sync-timeline" type="range" min="0" max="0" step="any" value="0" aria-label="两段录像共同进度" disabled>
    <output id="sync-time">00:00 / 00:00</output>
    <details><summary>逐帧校准</summary><div class="sync-actions"><button id="sync-frame-back" type="button">上一帧</button><button id="sync-frame-forward" type="button">下一帧</button></div>
    <div class="sync-actions"><button id="sync-offset-back" type="button">第一视角 −1 帧</button><button id="sync-offset-forward" type="button">第一视角 +1 帧</button></div><output id="sync-offset"></output></details>
    <label class="sync-audio"><input id="sync-audio" type="checkbox"> 全景声音</label>`;
  panel.insertBefore(controls, panel.querySelector("figure"));
  const el = id => controls.querySelector("#sync-" + id);
  const status = el("status"), timeline = el("timeline");
  el("follow").checked = follow;
  const format = time => `${String(Math.floor(Math.max(0,time)/60)).padStart(2,"0")}:${Math.floor(Math.max(0,time)%60).toString().padStart(2,"0")}`;
  const clamp = time => Math.max(0, Math.min(duration, time));
  const time = () => pending === null ? clamp(robot.currentTime - offset) : pending;
  const clearInput = () => { keys.clear(); mouseUntil = 0; };
  function unityReady() { return !!window.unityInstance; }
  function syncUnityMotion(active = false) {
    if (!unityReady() || document.getElementById('browser-experiment-hud')?.dataset.motionClock !== '1') return;
    window.unityInstance.SendMessage('Browser Keyboard Controller', 'SetVideoMotionState', JSON.stringify({
      time: time(), active,
      speed: Number.isFinite(settings.unityMovementSpeed) ? Math.max(0, settings.unityMovementSpeed) : .9,
      forward: Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown')),
      strafe: Number(keys.has('KeyE')) - Number(keys.has('KeyQ')),
      turn: Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'))
    }));
  }
  function setVideoBallFire(active) {
    const next = !!active;
    if (next === videoBallFireActive || !unityReady()) return;
    videoBallFireActive = next;
    window.unityInstance.SendMessage("FireControl", "SetVideoBallFire", next ? "1" : "0");
  }
  function moving() {
    if (document.activeElement !== canvas || !unityReady()) return false;
    const axis = (positive, negative) => positive.some(key => keys.has(key)) !== negative.some(key => keys.has(key));
    return axis(["KeyW","ArrowUp"],["KeyS","ArrowDown"]) || axis(["KeyD","ArrowRight"],["KeyA","ArrowLeft"]) || axis(["KeyE"],["KeyQ"]) || performance.now() < mouseUntil;
  }
  function wanted() { return !document.hidden && !failed && (preview || (follow && moving())); }
  function stop() {
    generation++;
    playing = false;
    videos.forEach(video => video.pause());
    syncUnityMotion();
  }
  function updateDuration() {
    duration = Math.max(0, Math.min(panorama.duration || 0, (robot.duration || 0) - offset, settings.endTimeSeconds ?? Infinity));
    timeline.max = String(duration);
  }
  function seek(target) {
    if (!initialized) return;
    stop();
    pending = clamp(target);
    panorama.currentTime = pending;
    robot.currentTime = pending + offset;
    panorama.playbackRate = robot.playbackRate = 1;
    setVideoBallFire(pending >= (settings.videoBallFireTimeSeconds || Infinity));
  }
  function alignToMaster() {
    const common = clamp(robot.currentTime - offset);
    panorama.currentTime = common;
    robot.currentTime = common + offset;
    pending = common;
  }
  function render() {
    const current = time();
    if (document.activeElement !== timeline) timeline.value = String(current);
    el("time").textContent = `${format(current)} / ${format(duration)}`;
    el("offset").textContent = `第一视角起点：${Math.round(offset*fps)} 帧（${offset.toFixed(3)} 秒）`;
    el("preview").textContent = preview ? "暂停预览" : "同步预览";
  }
  function ready() {
    if (initialized || failed || !videos.every(video => Number.isFinite(video.duration) && video.readyState >= 1)) return;
    if (offset < 0 || offset >= robot.duration) { failed = true; status.textContent = "视频对齐配置超出录像长度。"; return; }
    initialized = true;
    updateDuration();
    timeline.disabled = false;
    seek(0);
    render();
  }
  async function start() {
    if (starting || playing) return;
    starting = true;
    const token = ++generation;
    try {
      // Both play() calls are asynchronous. Align immediately before them so
      // browser scheduling cannot leave the two decoders on different frames.
      videos.forEach(video => video.pause());
      // Resuming an already-aligned frame must not issue a fresh seek:
      // that seek used to delay the first picture after a key press.
      if (pending === null && Math.abs(panorama.currentTime - clamp(robot.currentTime - offset)) > .025)
        alignToMaster();
      await Promise.all(videos.map(video => video.play()));
      if (token !== generation || !wanted()) videos.forEach(video => video.pause());
      else playing = true;
    } catch (error) {
      videos.forEach(video => video.pause());
      if (token === generation && error.name !== "AbortError") {
        failed = true;
        status.textContent = "播放未能启动，请刷新页面后重试。";
      }
    } finally { starting = false; }
  }
  function tick(now) {
    if (disposed) return;
    ready();
    if (initialized && !failed) {
      if (pending !== null && videos.every(video => !video.seeking && video.readyState >= 2)) pending = null;
      const current = time();
      setVideoBallFire(current >= (settings.videoBallFireTimeSeconds || Infinity));
      if (current >= duration - .012) {
        stop(); preview = false;
        status.textContent = "共同录像已结束，点击“回到起点”可重新开始。";
      } else if (!wanted()) {
        if (playing || starting) stop();
        if (pending === null && !robot.seeking && !panorama.seeking && Math.abs(panorama.currentTime-current) > .008) panorama.currentTime = current;
        status.textContent = follow ? "等待 Unity 移动或转向 · 松开操作即暂停" : "已暂停 · 点击同步预览播放";
      } else if (pending !== null || videos.some(video => video.readyState < 3 || video.seeking)) {
        if (playing) stop();
        status.textContent = "正在缓冲，两段录像一起等待…";
      } else {
        if (!playing) void start();
        const drift = panorama.currentTime - current;
        const tolerance = (settings.driftToleranceFrames || 1) / fps;
        if (Math.abs(drift) > tolerance && now-lastCorrection > 120) {
          lastCorrection = now;
          panorama.currentTime = current;
          robot.currentTime = current + offset;
          pending = current;
        } else panorama.playbackRate = Math.abs(drift) < .015 ? 1 : drift > 0 ? .97 : 1.03;
        status.textContent = preview ? "两段录像同步预览中" : "Unity 操作中 · 两段录像同步播放";
      }
      render();
    }
    // Media can already advance before the asynchronous play() promises settle.
    // Use decoder state and actual media time, so that interval is not dropped.
    syncUnityMotion(initialized && follow && !preview && moving() && pending === null && time() < duration - .012 && videos.every(video => !video.paused && !video.seeking));
    raf = requestAnimationFrame(tick);
  }
  for (const video of videos) {
    video.addEventListener("loadedmetadata", ready);
    video.addEventListener("error", () => { failed=true; stop(); status.textContent="视频加载失败，请刷新页面重试。"; });
    video.addEventListener("waiting", () => { if (playing) stop(); });
  }
  el("follow").addEventListener("change", () => { follow=el("follow").checked; preview=false; clearInput(); stop(); });
  el("preview").addEventListener("click", () => { preview=!preview; clearInput(); if (!preview) stop(); });
  el("reset").addEventListener("click", () => { preview=false; clearInput(); seek(0); });
  timeline.addEventListener("input", () => { preview=false; clearInput(); seek(Number(timeline.value)); render(); });
  for (const [id, direction] of [["frame-back",-1],["frame-forward",1]]) el(id).addEventListener("click", () => { preview=false; clearInput(); seek(time()+direction/fps); render(); });
  for (const [id, direction] of [["offset-back",-1],["offset-forward",1]]) el(id).addEventListener("click", () => {
    if (!initialized) return;
    const current=time();
    offset=Math.max(0,Math.min(robot.duration-1/fps,offset+direction/fps));
    preview=false; clearInput(); updateDuration(); seek(current); render();
  });
  el("audio").addEventListener("change", () => { panorama.muted=!el("audio").checked; });
  // 读取与现有 Unity 键鼠控制器相同的操作，不发送机器人控制命令。
  window.addEventListener("keydown", event => {
    if (document.activeElement !== canvas || !unityReady() || event.ctrlKey || event.metaKey || event.altKey) return;
    if (relevant.has(event.code)) {
      keys.add(event.code); preview=false;
      // Start during the keyboard event, not after the next animation frame
      // and not after waiting for both decoders to report HAVE_FUTURE_DATA.
      if (initialized && !failed && time() < duration - .012 && wanted()) void start();
    }
    if (event.code === "KeyR" && !event.repeat) { preview=false; clearInput(); seek(0); }
  });
  window.addEventListener("keyup", event => keys.delete(event.code));
  canvas.addEventListener("pointerdown", () => { canvas.focus(); preview=false; });
  canvas.addEventListener("pointermove", event => {
    if ((event.buttons & 2) && (event.movementX || event.movementY)) { mouseUntil=performance.now()+120; preview=false; }
  });
  window.addEventListener("pointerup", event => { if (!(event.buttons & 2)) mouseUntil=0; });
  document.addEventListener("focusin", event => { if (event.target !== canvas) { clearInput(); if (!preview) stop(); } });
  window.addEventListener("blur", () => { preview=false; clearInput(); stop(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { preview=false; clearInput(); stop(); } });
  window.addEventListener("pagehide", () => { disposed=true; cancelAnimationFrame(raf); clearInput(); stop(); setVideoBallFire(false); });
  render(); ready(); raf=requestAnimationFrame(tick);
})();
