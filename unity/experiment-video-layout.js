(() => {
  "use strict";
  const config = window.EXPERIMENT_VIDEO_CONFIG;
  if (!config || document.getElementById("experiment-videos")) return;
  const params = new URLSearchParams(location.search);
  const preview = params.get("videoLayout");
  const layout = ["sidebar", "overlay"].includes(preview) ? preview : config.layout;
  document.body.dataset.videoLayout = layout === "overlay" ? "overlay" : "sidebar";
  document.body.style.setProperty("--video-sidebar-width", config.sidebarWidth);
  const panel = document.createElement("aside");
  panel.id = "experiment-videos";
  panel.setAttribute("aria-label", "实验实景录像");
  const title = document.createElement("h1");
  title.textContent = "实景对照";
  const intro = document.createElement("p");
  intro.className = "video-intro";
  intro.textContent = "点击 Unity 场景后移动、转向或按住 G 喷射干粉，两段录像同步前进；松开操作即暂停。";
  panel.append(title, intro);
  for (const entry of config.videos) {
    const card = document.createElement("figure");
    card.className = "experiment-video-card";
    card.dataset.videoId = entry.id;
    const caption = document.createElement("figcaption");
    const heading = document.createElement("strong");
    heading.textContent = entry.title;
    const description = document.createElement("small");
    description.textContent = entry.caption;
    caption.append(heading, description);
    const video = document.createElement("video");
    video.src = entry.src;
    video.poster = entry.poster;
    video.controls = !config.sync;
    video.muted = !!config.sync;
    video.playsInline = true;
    // Buffer the first frames while Unity loads so keyboard input can start immediately.
    video.preload = "auto";
    video.setAttribute("aria-label", entry.title);
    video.addEventListener("error", () => {
      if (card.querySelector(".experiment-video-error")) return;
      const error = document.createElement("p");
      error.className = "experiment-video-error";
      error.setAttribute("role", "status");
      error.textContent = "视频加载失败，请刷新页面重试。";
      card.append(error);
    });
    card.append(caption, video);
    if (document.body.dataset.videoLayout === "overlay") {
      const position = config.overlay[entry.id] || {};
      for (const key of ["top", "right", "bottom", "left", "width"]) {
        if (position[key]) card.style[key] = position[key];
      }
    }
    panel.append(card);
  }
  // 播放器按键由播放器处理，避免空格、方向键同时传给 Unity。
  for (const type of ["keydown", "keyup"]) panel.addEventListener(type, event => event.stopPropagation());
  document.body.append(panel);
  window.addEventListener("pagehide", () => panel.querySelectorAll("video").forEach(video => video.pause()));
})();
