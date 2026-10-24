// 修改此项即可切换："sidebar" = 方案二；"overlay" = 方案一。
window.EXPERIMENT_VIDEO_CONFIG = {
  layout: "sidebar",
  sidebarWidth: "clamp(280px, 26vw, 420px)",
  sync: {
    showControls: false,
    // 视频文件已裁掉机器人前 14.8 秒，两段从同一事件时间 0 秒播放。
    robotOffsetFrames: 0,
    robotFps: 15,
    followUnityInput: true,
    // Metres per second of decoded video time; keyboard still controls direction.
    unityMovementSpeed: 0.9,
    // Degrees per second of video time; reduced to follow the recorded turn.
    unityTurnSpeed: 6,
    // User-reviewed idle/shaking intervals removed equally; action and normal speed retained.
    endTimeSeconds: 59.666666666666664,
    driftToleranceFrames: 1,
    videoBallFireTimeSeconds: 23.333333
  },
  // 方案一：相对 Unity 画布的 CSS 位置。可按实际画中画位置调整。
  overlay: {
    panorama: { top: "18px", right: "18px", width: "clamp(220px, 24vw, 360px)" },
    robot: { bottom: "18px", right: "18px", width: "clamp(220px, 24vw, 360px)" }
  },
  videos: [
    { id: "panorama", title: "实景全景", caption: "场地与机器人动作", src: "experiment-videos/panorama-idle-trim-v3.mp4", poster: "experiment-videos/panorama.jpg" },
    { id: "robot", title: "机器人第一视角", caption: "机器人摄像头录像", src: "experiment-videos/robot-first-person-idle-trim-v3.mp4", poster: "experiment-videos/robot-first-person-aligned.jpg" }
  ]
};
