# 消防救援机器人虚拟仿真实验

- [实验导览](https://siriuess.github.io/robot-virtual-lab-demo/experiment-guide/)
- [Unity WebGL 实验](https://siriuess.github.io/robot-virtual-lab-demo/unity/)

同步自学校服务器 2026-10-24 正式发布的网站与 Unity WebGL，构建版本为 `video-clock-20261024-161314`。包括教学介绍、导览视频、Unity 场景、全景与机器人第一视角视频及同步脚本。Unity 工程源码仍由原项目维护。

大型文件保存在同版本 GitHub Release。Pages 工作流依照 `release-assets.json` 下载资源，校验体积及 SHA-256，再发布为同站点资源。网页入口使用相对路径，兼容仓库子路径。保留 Pages 加载器的进度、错误提示与分块缓存，更新其构建体积和缓存版本。

正式服务器保持现有部署。旧 Release 保留以便回退。导览视频原有 LFS 指针由发布流程中的校验后 Release 文件替代，不需要额外拉取 LFS。
