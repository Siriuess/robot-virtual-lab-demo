'use strict';
(() => {
  const home = document.getElementById('home-panel');
  const homeVideos = Array.from(home.querySelectorAll('video'));
  homeVideos.forEach(video => video.addEventListener('play', () => {
    homeVideos.forEach(other => { if (other !== video) other.pause(); });
  }));
  const detail = document.getElementById('detail-panel');
  const title = document.getElementById('detail-title');
  const content = document.getElementById('module-content');
  const tabs = document.getElementById('intro-tabs');
  const experimentName = '面向远程消防救援的智能感知与沉浸式人机协同虚拟仿真实验';
  let currentModule = 'intro';
  let currentTab = 'overview';
  let homeScroll = 0;
  let opener = null;

  const points = (items, start = 1) => `<ol class="reading-points" start="${start}">` + items.map(([heading, text], i) =>
    `<li><span class="point-number" aria-hidden="true">${String(i + start).padStart(2, '0')}</span><div><h4>${heading}</h4><p>${text}</p></div></li>`).join('') + '</ol>';
  const operationRows = [
    [['W', 'S'], '前进 / 后退'], [['A', 'D'], '向左 / 向右转向'], [['Q', 'E'], '向左 / 向右平移'],
    [['鼠标右键'], '按住并拖动，调整观察方向'], [['V'], '切换第一视角与跟随视角'], [['R'], '恢复起点位置与朝向'],
    [['F'], '触发前方可用预设位置的火点'], [['按住 G'], '持续喷射干粉，松开停止']
  ];
  const hardware = [
  [
    "香橙派边缘智能开发板",
    "采用搭载昇腾 Ascend 310B1 的香橙派 Orange Pi AI Pro 20T，运行感知模型并提供目标信息，辅助机器人寻火。课程按 ONNX 导出、昇腾模型转换、开发板部署和推理测试组织边缘智能实践，比较识别效果与推理耗时。"
  ],
  [
    "实体机器人与摄像头",
    "TonyPi 承担实体运动、寻路与模拟灭火动作，并采集现场图像和状态。机器人寻找模拟火源，操作员确认目标后接管，控制其接近目标并执行模拟灭火。"
  ],
  [
    "PICO 沉浸式交互设备",
    "PICO 头显与双手柄提供机器人第一视角观察和遥操作输入。操作员结合现场画面确认目标，通过手柄接管机器人，完成目标接近与模拟灭火。"
  ],
  [
    "实验电脑与 Unity 平台",
    "实验电脑运行 Unity 交互与仿真平台，组织场景和任务状态，显示机器人画面与感知结果。浏览器场景用于键鼠练习，实验室平台用于 VR 操控、模型部署与实体任务验证。"
  ],
  [
    "CAVE 大空间与实体模型",
    "CAVE 大空间用于场景呈现与方案讨论，实体模型用于对照通道、障碍和目标布局。红球代表模拟火源，用于检验目标识别与任务响应；课堂结合现场比拼和展示交流分析方案。"
  ]
];
  const intro = {
    overview: `<h3>${experimentName}</h3><p>本实验依托《感知与人机交互》《虚拟现实与数据可视化》课程，以消防救援中的机器人前出作业为任务原型，将智能感知、自主寻火与人工接管灭火组织为同一工程任务。机器人利用开发板上的感知模型和寻路程序寻找模拟火源，操作员通过 VR 第一视角确认目标后接管，控制机器人接近目标并执行模拟灭火。</p><p>所属课程 40 学时，实验 16 学时，设计 26 项交互操作、8 个知识点。线上通过浏览器熟悉厂房布局，练习视角切换、键鼠操控和模拟处置；线下结合 Unity、PICO、香橙派 AI Pro、TonyPi 与 CAVE 开展沉浸式操控、边缘部署和实体任务验证，再通过现场比拼与小组展示分析方案。</p><h3>实验平台与设备</h3>${points(hardware)}`,
    operation: `<h3>实验室平台操作</h3><p>在实验电脑上运行课程提供的 Unity/PICO 工程，按现场配置连接头显、开发板、机器人及显示设备。先检查画面与控制反馈，再开展自主寻火和人工接管灭火；具体手柄按键以当前工程绑定为准。</p>${points([
      ['观察与输入校准', '在划定区域内佩戴 PICO，校准观察方向并核对手柄输入。检查机器人第一视角画面与现场变化是否对应，再开始任务。'],
      ['移动、转向与停止', '分别测试前进、后退、转向和停止。采用分步输入练习路线执行与目标接近，确认停止响应，并结合画面修正位置与朝向。'],
      ['自主寻火与人工接管灭火', '机器人利用感知模型和寻路程序寻找模拟火源。操作员通过第一视角确认目标后接管，控制机器人接近目标并执行模拟灭火，观察实体动作与虚拟火焰反馈。'],
      ['异常识别与处理', '出现识别偏差、通道受阻、画面停滞或控制反馈异常时，先停止操作并检查原因。由现场人员确认设备与连接正常后，再恢复操作并记录处理过程。']
    ])}<h3>网页预习操作</h3><p>“进入实验”打开现有浏览器三维场景，用于熟悉厂房布局，练习视角切换、键鼠移动、目标接近与模拟灭火。VR 操控、边缘部署和实体机器人实践在线下开展。</p><div class="operation-grid">${operationRows.map(([keys, text]) => `<div class="operation-row"><div class="key-group">${keys.map(key => `<kbd>${key}</kbd>`).join('')}</div><span>${text}</span></div>`).join('')}</div>`,
    interface: `<h3>现场观察与任务反馈</h3>${points([
      ['机器人第一视角与场景布局', '通过机器人前方画面观察目标和障碍，结合场景布局判断方位与通行空间。练习中通过视角切换、移动和转向比较遮挡、停止位置偏差与转向响应。'],
      ['现场视频与控制反馈', '将控制输入、机器人动作和画面反馈对应起来。自主寻火时观察目标识别和路线执行，人工接管后核对目标接近与模拟灭火动作，留意画面更新和控制响应。'],
      ['感知信息与目标确认', '开发板上的感知模型提供目标信息，寻路程序据此支持自主寻火。操作员结合现场画面确认目标；模型测试按实际输出核查识别结果，并分析误检、漏检及推理耗时。'],
      ['模拟火源与灭火反馈', '红球代表模拟火源，并与虚拟场景中的火情反馈对应。接管后观察目标接近、模拟灭火动作和火焰状态变化，核查操作与反馈是否一致。'],
      ['PICO 与 CAVE 课堂展示', 'PICO 用于第一视角观察和遥操作，CAVE 大空间用于场景呈现与方案讨论。结合任务表现、小组作品和操作问题交流方案，说明实现过程与改进依据。']
    ])}`
  };
  const workflowPhases = [
  {
    "title": "一、认知配置",
    "start": 1,
    "steps": [
      [
        "认识场景与任务",
        "观察厂房通道、障碍和模拟火源，在布局示意中标出起点与任务目标，了解自主寻火、人工接管和模拟灭火的任务流程。"
      ],
      [
        "辨认设备与功能分工",
        "对照实验电脑、香橙派 AI Pro、PICO 和 TonyPi，说明感知模型、寻路程序、交互端与实体机器人各自承担的功能。"
      ],
      [
        "核对布局与通行范围",
        "对照虚拟场景和实体模型，标注可通行区域、狭窄通道和目标位置，形成布局与配置记录。"
      ],
      [
        "校准视角与交互输入",
        "在划定区域内校准 PICO 观察方向与手柄输入，或通过网页检查视角切换。以小幅输入核对画面、动作和停止反馈。"
      ]
    ]
  },
  {
    "title": "二、第一视角操控",
    "start": 5,
    "steps": [
      [
        "比较第一视角与全局视角",
        "观察目标方位、遮挡与通道关系。网页按 V 切换视角，线下结合 PICO 与机器人相机画面练习观察。"
      ],
      [
        "检查移动与停止响应",
        "依次练习前进、后退和停止，核对动作与画面反馈。实体操作由现场人员协助，确认停止后再继续。"
      ],
      [
        "练习转向与盲区观察",
        "在通道转角处先停止，再分步转向观察两侧区域，记录转向响应与遮挡变化。"
      ],
      [
        "练习接近目标与停止移动",
        "通过短时输入和分步移动接近目标，观察停止位置偏差，结合第一视角画面修正距离与朝向。"
      ],
      [
        "执行指定路线",
        "通过 VR 或键鼠完成指定路线，在转角、障碍附近和目标位置核查操控效果，整理路线与操控记录。"
      ]
    ]
  },
  {
    "title": "三、感知与部署",
    "start": 10,
    "steps": [
      [
        "接入图像并运行感知",
        "检查机器人相机画面是否持续更新，在开发板上运行感知程序，观察模拟火源标识出现时的目标信息。"
      ],
      [
        "核查识别结果",
        "按所用模型实际输出，对照图像核查目标信息，记录误检、漏检与识别效果。"
      ],
      [
        "核对模型参数与测试条件",
        "记录模型输入与感知参数，在相同测试条件下检查输出变化，说明参数设置与识别结果的关系。"
      ],
      [
        "比较观察位置与遮挡影响",
        "保持目标不变，改变观察位置、朝向或遮挡条件，核对感知结果，分析识别偏差与补充观察的作用。"
      ],
      [
        "开展模型转换与部署",
        "根据所用模型核对输入设置，完成 ONNX 导出、昇腾模型转换和香橙派 AI Pro 部署，保留转换与配置记录。"
      ],
      [
        "测试推理效果与耗时",
        "使用相同测试图像比较识别效果与推理耗时，分析其对任务反馈的影响，整理感知与部署测试记录。"
      ]
    ]
  },
  {
    "title": "四、寻火灭火",
    "start": 16,
    "steps": [
      [
        "观察机器人自主寻火",
        "运行线下综合任务，观察机器人如何利用开发板上的感知模型与寻路程序寻找模拟火源，记录识别与路线执行情况。"
      ],
      [
        "确认目标并人工接管",
        "机器人发现目标后，操作员通过 VR 第一视角确认现场情况，再使用手柄接管机器人，记录接管操作。"
      ],
      [
        "接近目标并模拟灭火",
        "人工控制机器人接近目标，确认距离与朝向后执行模拟灭火。网页练习中按 F 生成火点，对准后按住 G 喷射干粉；线下按当前工程的手柄绑定操作。"
      ],
      [
        "核对任务结果与反馈",
        "比较目标识别、接管操作、实体动作与虚拟火焰变化，核查任务完成情况，整理任务完成与操作记录。"
      ]
    ]
  },
  {
    "title": "五、异常处理",
    "start": 20,
    "steps": [
      [
        "识别感知偏差",
        "对照目标信息与现场画面，发现识别不稳定或目标判断不明确时，先停止并核查观察条件，记录问题。"
      ],
      [
        "检查通道受阻情况",
        "观察障碍与通行空间，发现原路线受阻时先停止，检查障碍范围和路线条件，再由操作员判断后续操作。"
      ],
      [
        "检查画面与控制反馈异常",
        "留意画面更新、控制响应及动作反馈。发现停滞或状态不明确时停止操作，请现场人员协助检查设备与连接。"
      ],
      [
        "确认恢复条件并记录处理",
        "核对设备、连接和控制反馈，确认正常后再恢复操作，整理异常原因、处理过程与结果。"
      ]
    ]
  },
  {
    "title": "六、分析展示",
    "start": 24,
    "steps": [
      [
        "整理功能实现与团队分工",
        "整理场景与交互作品、感知与设备实现以及调试过程，明确小组分工，准备展示实际完成的功能。"
      ],
      [
        "开展现场比拼与结果分析",
        "比较自主寻火与模拟灭火的完成情况、操作用时和操作问题，结合演示结果分析方案特点与问题原因。"
      ],
      [
        "汇报方案并提出改进",
        "结合教师评价与同伴互评，说明实现方法与改进依据，提交报告、作品展示与改进建议。"
      ]
    ]
  }
];
  const modules = {
    intro: { title: '实验介绍' },
    principles: { title: '实验原理', html: `<p class="module-lead">实验将边缘感知、自主寻火与人工接管灭火连接起来。感知模型提供目标信息，寻路程序支持机器人寻找模拟火源，操作员通过 VR 第一视角确认目标后接管，完成目标接近与模拟灭火。</p><div class="principle-sequence" aria-label="边缘感知、自主寻火、人工接管、模拟灭火"><span>边缘感知</span><i aria-hidden="true">→</i><span>自主寻火</span><i aria-hidden="true">→</i><span>人工接管</span><i aria-hidden="true">→</i><span>模拟灭火</span></div><h3>机器人第一视角遥操作</h3><p>机器人相机采集现场图像，Unity 组织场景和任务状态并显示画面与感知结果。PICO 为操作员提供第一视角观察和手柄控制入口，支持目标确认、人工接管、目标接近与模拟灭火。浏览器通过键鼠练习视角切换和基本操控，为线下实践做好准备。</p><h3>边缘感知与自主寻火</h3><p>香橙派 AI Pro 上的感知模型处理相机图像并提供目标信息，寻路程序利用相关信息支持机器人自主寻找模拟火源。学生核查感知结果，记录误检、漏检和识别效果，理解感知信息与路线执行之间的关系。</p><h3>国产边缘设备与模型部署</h3><p>模型部署实践按照 ONNX 导出、昇腾模型转换、香橙派 AI Pro 部署和推理测试展开。学生按所用模型开展转换与测试，比较识别效果和推理耗时，分析其对任务反馈的影响，理解模型从算法到设备应用的实现过程。</p><h3>模拟火源与虚实反馈</h3><p>红球代表模拟火源，用于检验目标识别与任务响应。结合实体模型和虚拟场景的布局对应关系，核查目标信息、机器人动作与虚拟火焰反馈是否一致，分析场景与交互设计是否服务任务。</p><h3>人工接管与模拟灭火</h3><p>机器人发现目标后，操作员通过 VR 画面确认现场情况，接管机器人，控制其接近目标并执行模拟灭火。遇到识别偏差、通道受阻或反馈异常时，先停止操作，再检查原因并记录处理过程，确认恢复条件后继续。</p><h3>学习成果与教学评价</h3><p>评价围绕场景与交互作品、感知与设备实现、现场任务表现、小组汇报与改进分析四类成果展开。现场比拼比较任务完成情况、操作用时和操作问题；小组展示说明场景设计、功能实现和团队分工。结合教师评价与同伴互评，用演示结果和任务记录解释方案选择，分析问题并提出改进方向。</p>` },
    workflow: { title: '实验流程', html: `<p class="module-lead">实验共 26 步，按认知配置、第一视角操控、感知与部署、寻火灭火、异常处理、分析展示六个环节组织。浏览器用于场景观察、键鼠练习与模拟处置；VR 操控、边缘部署及实体机器人任务在线下开展。每个环节整理相应记录，最后通过现场比拼和小组展示交流改进。</p>${workflowPhases.map(phase => `<section class="workflow-phase" aria-label="${phase.title}"><h3>${phase.title}<span class="phase-range">步骤 ${String(phase.start).padStart(2, '0')}—${String(phase.start + phase.steps.length - 1).padStart(2, '0')}</span></h3>${points(phase.steps, phase.start)}</section>`).join('')}` },
  };

  function render() {
    const module = modules[currentModule];
    const isIntro = currentModule === 'intro';
    title.textContent = module.title;
    document.getElementById('location-current').textContent = module.title;
    document.querySelectorAll('[data-nav-module]').forEach(button => {
      if (button.dataset.navModule === currentModule) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.querySelector('.site-navigation [data-home]').removeAttribute('aria-current');
    tabs.hidden = !isIntro;
    content.innerHTML = isIntro ? intro[currentTab] : module.html;
    content.setAttribute('role', isIntro ? 'tabpanel' : 'region');
    content.setAttribute('aria-labelledby', isIntro ? 'tab-' + currentTab : 'detail-title');
    tabs.querySelectorAll('[data-tab]').forEach(button => {
      const selected = button.dataset.tab === currentTab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
  }
  function showHome() {
    if (detail.hidden) { window.scrollTo({ top: 0, behavior: 'auto' }); return; }
    detail.hidden = true;
    home.hidden = false;
    document.querySelectorAll('[data-nav-module]').forEach(button => button.removeAttribute('aria-current'));
    document.querySelector('.site-navigation [data-home]').setAttribute('aria-current', 'page');
    if (opener) opener.focus({ preventScroll: true });
    window.scrollTo({ top: homeScroll, behavior: 'auto' });
    document.title = experimentName + ' · 实验导览';
  }
  document.querySelectorAll('[data-nav-module]').forEach(button => {
    button.addEventListener('click', () => {
      if (!home.hidden) {
        homeScroll = window.scrollY;
        opener = button;
      }
      currentModule = button.dataset.navModule;
      currentTab = 'overview';
      render();
      homeVideos.forEach(video => video.pause());
      home.hidden = true;
      detail.hidden = false;
      window.scrollTo({ top: 0, behavior: 'auto' });
      title.focus({ preventScroll: true });
      document.title = modules[currentModule].title + ' · ' + experimentName;
    });
  });
  document.querySelectorAll('[data-home]').forEach(button => button.addEventListener('click', showHome));
  tabs.addEventListener('click', event => {
    const button = event.target.closest('[data-tab]');
    if (!button) return;
    currentTab = button.dataset.tab;
    render();
  });
  tabs.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = Array.from(tabs.querySelectorAll('[data-tab]'));
    let i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    event.preventDefault();
    i = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    currentTab = buttons[i].dataset.tab;
    render();
    buttons[i].focus();
  });
})();
