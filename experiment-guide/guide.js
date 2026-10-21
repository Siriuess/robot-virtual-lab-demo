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
  const experimentName = '面向消防救援的智能辅助与沉浸式人机协同虚拟仿真实验';
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
    "采用搭载昇腾 Ascend 310B1 的香橙派 Orange Pi AI Pro 20T，承担视觉感知、模型推理与控制转发。课程围绕模型转换、边缘部署和推理测试，比较识别效果、处理耗时与反馈实时性。"
  ],
  [
    "实体机器人与摄像头",
    "TonyPi 承担实体运动、模拟任务动作和现场图像采集，其树莓派控制板负责动作与摄像头服务。学生结合机器人相机画面完成观察、移动和目标接近，验证感知与控制功能。"
  ],
  [
    "PICO 沉浸式交互设备",
    "PICO 头显与双手柄提供沉浸观察和遥操作输入。学生结合机器人第一视角画面调整位置与朝向，理解控制输入、机器人动作和视觉反馈之间的关系。"
  ],
  [
    "实验电脑与 Unity 平台",
    "实验电脑运行 Unity 虚拟仿真平台，连接 PICO、香橙派与实体机器人，呈现厂房场景、现场视频和任务反馈。浏览器场景用于键鼠预习，实验室平台用于沉浸式操控与设备验证。"
  ],
  [
    "CAVE 大空间与实体模型",
    "课程结合 CAVE 大空间展示开展场景观察、交互实践与教学讨论；实体模型用于对照通道、障碍和目标布局。现有红球作为模拟着火点标识，受困目标搜寻按课程提供的拓展场景与目标资源组织。"
  ]
];
  const intro = {
    overview: `<h3>${experimentName}</h3><p>本实验面向《感知与人机交互》《虚拟现实与数据可视化》课程，以危化厂房消防救援中的机器人前出侦察为任务背景，将智能辅助感知、机器人第一视角遥操作和人机协同判断贯穿于同一实验。学生结合现场画面选择路线、接近目标并开展模拟处置，通过参数调整和重复操作分析感知与交互效果。</p><p>实验采用“实验电脑—边缘开发板—实体机器人”协同架构，依托 Unity、PICO、香橙派与 TonyPi 组织线上预习和线下验证，并结合 CAVE 大空间展示开展交互实践与教学讨论。现有工程提供红球感知、现场视频、人工遥操作和虚拟火情联动；课程围绕视觉模型核查、昇腾边缘部署及任务对照分析安排实践，受困目标搜寻、定位上报和异常条件实验按教师提供的拓展资源开展。</p><h3>实验平台与设备</h3>${points(hardware)}`,
    operation: `<h3>实验室平台操作</h3><p>在实验电脑上运行课程提供的 Unity/PICO 工程，按现场配置连接头显、开发板、机器人及显示设备。通过机器人相机画面观察前方环境，结合虚拟场景判断方位；具体手柄按键以当前工程绑定为准。</p>${points([
      ['观察与姿态校准', '在划定区域内佩戴 PICO，校准观察方向并核对头部和双手跟踪。检查机器人第一视角画面与现场变化的对应关系，再开始移动操作。'],
      ['移动、转向与停止', '分别测试前进、后退、转向和停止。采用分步输入接近通道或目标，松开输入后确认机器人停止，并结合画面修正位置与朝向。'],
      ['目标核查与模拟处置', '结合现场视频和感知信息确认任务目标，再判断距离与朝向是否满足模拟处置条件。分别观察实体动作、喷射效果与虚拟火焰变化，说明操作依据。'],
      ['现场异常处理', '画面停滞、控制异常或状态不明确时立即暂停，由现场人员确认机器人停止。在教师指导下核查设备与连接，确认恢复条件后再继续操作。']
    ])}<h3>网页预习操作</h3><p>“进入实验”打开现有浏览器三维场景，用于厂房观察、视角切换和模拟灭火。模型部署、PICO 遥操作与实体设备验证在实验室组织；课程拓展任务按教师提供的场景资源完成。</p><div class="operation-grid">${operationRows.map(([keys, text]) => `<div class="operation-row"><div class="key-group">${keys.map(key => `<kbd>${key}</kbd>`).join('')}</div><span>${text}</span></div>`).join('')}</div>`,
    interface: `<h3>现场观察与任务反馈</h3>${points([
      ['机器人第一视角与厂房布局', '以机器人前方画面观察目标与障碍，结合厂房布局判断方位和通行空间。通过转向与移动补充盲区信息，比较第一视角与跟随视角的观察差异。'],
      ['现场视频与控制反馈', '摄像头图像传至实验电脑，呈现机器人前方的实际变化。将输入、实体动作与画面反馈对应起来，留意更新停滞和停车偏差。'],
      ['目标信息与人工核查', '现有感知信息用于判断目标是否出现及其图像位置；模型实验在课程推理程序中核查目标框、类别和置信度。对照原始画面判断误检、漏检，必要时重新观察。'],
      ['虚拟火情与模拟处置', '模拟着火点通过任务标识与虚拟场景关联呈现。操作时比较喷射方向、距离和持续时间对虚拟火情的影响，并分别确认实体动作与场景反馈。'],
      ['PICO 与 CAVE 课堂展示', 'PICO 用于操作者沉浸观察和交互输入，CAVE 大空间用于场景展示与课堂讨论。结合截图和实验记录交流识别核查、路线选择及异常处置的依据。']
    ])}`
  };
  const workflowPhases = [
  {
    "title": "一、环境认知与功能配置",
    "start": 1,
    "steps": [
      [
        "观察厂房与救援任务区域",
        "观察危化厂房中的通道、障碍、模拟火点和出口，在布局示意中标出起点、任务目标及安全返回位置，明确侦察、目标接近和模拟处置的任务范围。"
      ],
      [
        "辨认机器人功能与设备分工",
        "对照香橙派、PICO、实验电脑与 TonyPi，辨认感知、运动和任务模块。分别查看现场视频与虚拟反馈，说明各设备如何支持远程观察和机器人操作。"
      ],
      [
        "核对通行范围与目标布局",
        "对照虚拟厂房和实体模型，标记可通行区域、狭窄通道及目标位置。比较机器人所需通行空间，确定不能进入或不宜接近的区域。"
      ],
      [
        "校准观察视角与交互输入",
        "在划定区域内校准 PICO 观察方向与手柄输入，或通过网页切换视角。以小幅转头、转向和移动核对画面响应，确认停止输入后的反馈。"
      ]
    ]
  },
  {
    "title": "二、第一视角遥操作与路线执行",
    "start": 5,
    "steps": [
      [
        "切换机器人第一视角",
        "查看机器人前方画面，比较第一视角与跟随视角下的目标方位、遮挡和距离判断。网页按 V 切换视角，实验室结合 PICO 与现场视频开展观察。"
      ],
      [
        "验证移动与停止响应",
        "依次输入前进、后退和停止，观察机器人动作及画面变化。实体操作由现场人员协助，松开输入后确认机器人停止，再进行下一项操作。"
      ],
      [
        "转向并补充盲区观察",
        "在通道转角处先停止，再分步转向查看两侧区域。比较转向前后可见信息，利用新的观察位置判断是否具备通行条件。"
      ],
      [
        "调整接近节奏与停车位置",
        "通过短时输入和分步移动接近目标，比较不同操作节奏下的停车偏差。结合相机画面修正距离与朝向，避免在反馈不足时连续移动。"
      ],
      [
        "选择并执行指定路线",
        "结合布局示意与第一视角画面，选择经过指定区域的路线并人工操控机器人执行。在转角、障碍附近及目标位置停车核查，说明路线选择依据。"
      ]
    ]
  },
  {
    "title": "三、视觉感知与边缘模型部署",
    "start": 10,
    "steps": [
      [
        "接入现场图像并运行基础感知",
        "将机器人摄像头图像接入香橙派感知程序，在实验电脑核对画面是否持续更新。运行现有红球感知，改变目标位置并观察识别状态。"
      ],
      [
        "运行视觉模型并核查目标",
        "在课程提供的推理程序中运行模型，对照测试图像核查目标框、类别与置信度。按模型实际支持的类别开展实验，将检测结果与人工观察对应。"
      ],
      [
        "调整识别阈值",
        "在模型测试程序中调整置信度阈值，对同一组图像重复推理，比较保留的目标框和误检、漏检情况。结合图像说明参数变化的影响。"
      ],
      [
        "改变观察位置与遮挡条件",
        "保持目标不变，改变机器人观察位置、朝向或目标遮挡程度，对比识别结果。对可疑结果补充观察，说明何时采纳模型输出、何时需要人工核查。"
      ],
      [
        "完成模型转换与部署",
        "使用课程提供且已完成测试的模型，核对输入设置，导出 ONNX，并通过昇腾模型转换工具生成适配开发板的模型文件。将模型部署到香橙派，保留转换与配置记录。"
      ],
      [
        "比较边缘推理效果与耗时",
        "在香橙派上使用相同图像核对转换前后的识别结果，再在模型支持的输入设置下比较推理耗时和识别效果。通过测试后接入感知回传，运动保持人工控制。"
      ]
    ]
  },
  {
    "title": "四、目标核查与模拟救援",
    "start": 16,
    "steps": [
      [
        "核查目标信息与虚拟火情",
        "对照现场视频、红球识别状态和虚拟火情，核查实体任务标识与场景反馈是否对应。发现识别不稳定时，先调整观察位置再确认目标。"
      ],
      [
        "判断模拟处置条件",
        "操控机器人接近目标，停止后检查距离、朝向和通行空间是否满足模拟处置要求。条件不足时重新调整位置，或停止并说明原因。"
      ],
      [
        "执行模拟灭火并观察反馈",
        "按当前工程的手柄绑定或网页按键开展模拟灭火。网页按 F 触发火点，对准后按住 G 喷射；实验室分别观察实体动作和虚拟火焰变化，分析距离、方向及持续时间的影响。"
      ],
      [
        "搜寻拓展目标并整理侦察信息",
        "课程拓展任务：使用教师提供的受困目标资源和已支持模型类别，结合人工观察开展搜寻。依据布局标记目标位置，保存图像证据并说明可达路线，整理为侦察信息报告。"
      ]
    ]
  },
  {
    "title": "五、路线选择与异常处理",
    "start": 20,
    "steps": [
      [
        "比较候选通行路线",
        "在布局示意中选取两条到达目标的可通行路线，比较路程、障碍间距与转向位置。选择其中一条人工执行，根据实际通行情况修正判断。"
      ],
      [
        "应对通道受阻",
        "在教师提供的障碍变化任务中，观察原路线能否继续通行。先停止并核查障碍范围，再选择绕行或返回，不具备通行条件时报告原因。"
      ],
      [
        "分析反馈延迟与中断",
        "课程拓展任务：在教师提供的仿真配置中比较正常反馈、模拟延迟和反馈中断时的操作表现。缺少相应配置时，使用任务录像开展判断练习；实体机器人不主动制造控制失联。"
      ],
      [
        "确认恢复条件并安全返回",
        "异常任务中先停止、核查并请求现场协助，在教师确认连接和控制正常后恢复人工操作。结合通道与目标信息选择返回路线，将机器人停在安全位置。"
      ]
    ]
  },
  {
    "title": "六、对照实验与结果分析",
    "start": 24,
    "steps": [
      [
        "设定单一对照条件",
        "在同一任务与起始条件下，选择识别阈值、遮挡程度或操作节奏中的一项进行调整。开展延迟对照时使用教师提供的仿真配置，明确其余条件保持一致。"
      ],
      [
        "重复任务并比较结果",
        "重复关键任务，对比识别质量、推理耗时、任务时间、停车偏差及异常处置情况。结合截图、人工记录或已有程序输出，解释结果差异与操作依据。"
      ],
      [
        "整理报告并展示实验结论",
        "汇总侦察信息、边缘部署测试和对照结果，说明方案适用条件、存在的问题与交互改进建议。通过课堂展示或 CAVE 大空间交流操作过程，以实验记录支持结论。"
      ]
    ]
  }
];
  const modules = {
    intro: { title: '实验介绍' },
    principles: { title: '实验原理', html: `<p class="module-lead">实验将机器人第一视角遥操作、人工智能辅助感知与救援任务判断联系起来，通过改变观察条件、识别参数和控制方式，分析感知结果如何影响操作与任务成效。</p><div class="principle-sequence" aria-label="现场观察、智能辅助、人工核查、操作反馈"><span>现场观察</span><i aria-hidden="true">→</i><span>智能辅助</span><i aria-hidden="true">→</i><span>人工核查</span><i aria-hidden="true">→</i><span>操作反馈</span></div><h3>机器人第一视角遥操作</h3><p>机器人相机画面提供现场观察依据，PICO 手柄或网页键鼠输入用于改变机器人位置和朝向。操作者通过移动、转向与停车获取所需信息，结合厂房布局选择通行路线，理解控制输入、机器人动作和视觉反馈之间的关系。</p><h3>人工智能辅助感知与人工核查</h3><p>目标检测模型对图像中的已支持类别输出目标框、类别和置信度，为目标搜寻提供辅助。学生对照原始画面核查结果，通过调整识别阈值、观察位置与遮挡条件比较误检和漏检。模型输出与现场画面共同构成判断依据，是否接近目标及继续操作由操作者确认。</p><h3>国产边缘设备与模型部署</h3><p>香橙派 AI Pro 20T 搭载的昇腾处理器提供边缘推理算力，模型经格式转换和运行配置后在开发板执行。课程通过相同图像的转换前后对比、板端推理与耗时分析，研究识别质量、计算开销和反馈实时性之间的关系。</p><h3>目标感知与虚实映射</h3><p>实验采用实体目标标识模拟着火点，通过视觉感知获取目标信息，并结合实体模型与虚拟场景的空间对应关系，在虚拟环境中呈现相应火情。操作者结合现场视频与虚拟反馈判断目标状态，完成模拟救援操作。</p><h3>任务处置与人机协同</h3><p>模拟处置需要结合机器人功能、目标距离和朝向判断操作条件。虚拟喷射的方向、范围及有效持续时间影响火焰变化；条件不足或反馈异常时，应先停止并核查。课程拓展的受困目标搜寻以所提供的场景资源和模型类别为准，通过人工核查形成包含目标位置、图像证据及可达路线的侦察信息。</p><h3>对照实验与结果分析</h3><p>在相同任务与起始条件下，每次改变一个识别或操作条件，重复关键任务并比较结果。结合识别质量、推理耗时、任务时间、停车偏差和异常处置情况，解释感知误差、控制方式与反馈条件对任务结果的影响，提出有依据的改进建议。</p>` },
    workflow: { title: '实验流程', html: `<p class="module-lead">实验共 26 步，按环境认知、第一视角遥操作、视觉感知与边缘部署、综合救援及对照分析组织。网页场景用于预习与键鼠操作，设备部署与沉浸式遥操作在实验室完成；受困目标搜寻及异常条件实验按教师提供的拓展场景组织。</p>${workflowPhases.map(phase => `<section class="workflow-phase" aria-label="${phase.title}"><h3>${phase.title}<span class="phase-range">步骤 ${String(phase.start).padStart(2, '0')}—${String(phase.start + phase.steps.length - 1).padStart(2, '0')}</span></h3>${points(phase.steps, phase.start)}</section>`).join('')}` },
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
