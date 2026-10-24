'use strict';
(() => {
  const config = window.LAB_CONFIG;
  const $ = selector => document.querySelector(selector);
  const paths = {
    home:'m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9',
    flask:'M9 3h6M10 3v7L4 19a1.3 1.3 0 0 0 1 2h14a1.3 1.3 0 0 0 1-2l-6-9V3M8 14h8',
    book:'M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15M5 8h4m-4 4h4m6-4h4m-4 4h4',
    shield:'m12 2 8 4v6c0 5-4 8-8 10-4-2-8-5-8-10V6l8-4Zm-4 10 3 3 5-6',
    layers:'m12 3 10 5-10 5L2 8l10-5Zm-9 9 9 5 9-5M3 17l9 5 9-5',
    user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
    gamepad:'M7 7h10c3 0 4 3 5 10 0 2-2 3-3 1l-3-3H8l-3 3c-1 2-3 1-3-1 1-7 2-10 5-10ZM7 9v5M4.5 11.5h5M16 10h.01M19 13h.01',
    arrow:'M4 12h16m-6-6 6 6-6 6',
    like:'M7 10 11 3c1-1 3 0 3 2v5h5c2 0 2 2 1 4l-2 6H7V10ZM3 10h4v10H3Z',
    heart:'M20.8 5.6c-2.4-2.5-6.3-1.8-8.8 1.2-2.5-3-6.4-3.7-8.8-1.2C.6 8.3 2 12 5 15l7 6 7-6c3-3 4.4-6.7 1.8-9.4Z',
    share:'m14 3 7 7-7 7v-5C6 12 3 14 2 19c0-10 5-12 12-12V3Z',
    monitor:'M3 3h18v13H3Zm9 13v5m-5 0h10',
    eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    people:'M10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1 21v-3a6 6 0 0 1 12 0v3m3-17a3 3 0 0 1 0 6m0 3c4 0 6 2 6 5v3',
    clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 3',
    check:'M21 11v2a9 9 0 1 1-5-9M8 11l4 4L22 5',
    mail:'M3 5h18v14H3Zm0 1 9 7 9-7',
    info:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 11v6m0-10h.01',
    up:'m6 14 6-6 6 6',close:'m6 6 12 12M6 18 18 6',menu:'M3 6h18M3 12h18M3 18h18',
    chip:'M6 6h12v12H6Zm3 3h6v6H9ZM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4',
    orbit:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM16 12c0 6-2 10-4 10s-4-4-4-10 2-10 4-10 4 4 4 10ZM3 8h18M3 16h18',
    cube:'m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5m-9 5L3 7m9 5v10',
    file:'M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 12h8m-8 4h6'
  };
  function icon(name){ const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]||paths.flask);svg.append(path);return svg; }
  function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
  function put(id,text){$(id).textContent=text;}
  function safeUrl(value){if(typeof value!=='string'||!value.trim())return null;try{const url=new URL(value,location.href);return ['https:','http:'].includes(url.protocol)?url.href:null;}catch{return null;}}
  function read(key){try{return localStorage.getItem('lab-portal:'+key);}catch{return null;}}
  function save(key,value){try{localStorage.setItem('lab-portal:'+key,value);return true;}catch{return false;}}
  function toast(message){put('#toast',message);$('#toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('visible'),3000);}
  document.querySelectorAll('[data-icon]').forEach(node=>node.append(icon(node.dataset.icon)));
  put('#brand-name',config.siteName);put('#footer-name',config.siteName);put('#project-title',config.project.title);put('#project-description',config.project.description);put('.project-badge',config.project.badge||'人工智能+');
  const byline=$('#project-byline');byline.append(icon('layers'));[config.project.author?'项目负责人：'+config.project.author:'',config.project.institution,config.project.year].filter(Boolean).forEach((text,index)=>{if(index)byline.append(el('b','','/'));byline.append(el('span','',text));});
  document.title=config.project.title+' · '+config.siteName;
  const poster=safeUrl(config.project.poster);if(poster)$('#project-poster').src=poster;
  config.project.metadata.forEach(([label,value])=>{const item=el('div');item.append(el('dt','',label+'：'),el('dd','',value));$('#metadata').append(item);});
  put('#support-contact',config.support);put('#team-lead',config.team.lead);put('#team-institution',config.team.institution);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.support)) $('#support-contact').href='mailto:'+config.support;
  put('#team-title',config.team.title||'');put('#team-appointment',config.team.appointment||'');
  config.team.members.forEach(([name,role])=>{const item=el('li');item.append(icon('user'),el('span','',name),el('small','',role));$('#member-list').append(item);});

  const modal=$('#modal');let returnFocus=null;
  function closeModal(){modal.close();}
  function openModal(title,...nodes){returnFocus=document.activeElement;put('#modal-title',title);$('#modal-body').replaceChildren(...nodes);if(!modal.open)modal.showModal();document.body.classList.add('modal-open');}
  $('#close-modal').addEventListener('click',closeModal);
  modal.addEventListener('close',()=>{modal.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});document.body.classList.remove('modal-open');if(returnFocus?.isConnected)returnFocus.focus();});
  modal.addEventListener('click',event=>{if(event.target===modal){const box=modal.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closeModal();}});
  function missing(title,description){openModal(title,el('p','',description),el('div','modal-hint','内容准备中，发布后可在此查看。'));}
  const guide=()=>{const list=el('ol');['阅读项目简介与教学目标，了解消防救援情境和实验任务。','熟悉厂房布局、通道与安全区域，认识机器人功能。','点击“我要做实验”，按实验内提示练习视角切换、移动与转向。','根据实际开放功能开展侦察、搜寻、上报和撤离训练。','整理操作记录与状态反馈，总结判断依据并完成实验报告。'].forEach(text=>list.append(el('li','',text)));openModal('消防救援机器人学习指南',el('p','','线上核心任务使用键盘和鼠标完成，按以下顺序开展学习。'),list,el('div','modal-hint','VR 与 CAVE 保留为线下沉浸式实践。目标识别、路线选择、障碍处理和模拟处置以实际实验版本为准。'));};
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>button.dataset.open==='guide'?guide():openModal('关于消防救援机器人实验',el('p','','本项目拟申报“人工智能+”虚拟仿真实验教学项目，面向“未来信息”领域中的“人机交互与智能机器人”方向。'),el('p','','依托现有 VR、CAVE 大空间和机器人实验教学基础，以厂房消防救援为场景，开展环境认知、功能识别、视角切换与遥操作训练，并分阶段拓展搜寻、判断、上报、模拟处置和安全撤离任务。'),el('div','modal-hint','线上核心训练采用键鼠交互，线下结合 VR / CAVE 开展沉浸式实践；具体功能以实际实验版本为准。'))));
  $('#start-experiment').addEventListener('click',()=>{const url=safeUrl(config.project.experimentUrl);if(url)location.assign(url);else missing('实验入口待配置','网站框架已预留实验系统入口，可连接独立实验页面或 Unity WebGL 应用。','project.experimentUrl');});
  let activeVideo='intro';
  function selectVideo(kind){activeVideo=kind;document.querySelectorAll('[data-video]').forEach(button=>{const selected=button.dataset.video===kind;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});const text=kind==='intro'?'实验简介':'教学引导';put('#video-label',text);$('#video-poster').setAttribute('aria-label','查看'+text+'视频');$('#video-panel').setAttribute('aria-labelledby',kind+'-video-tab');}
  document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>selectVideo(button.dataset.video)));
  $('#video-poster').addEventListener('click',()=>{const key=activeVideo==='intro'?'introVideo':'guideVideo';const url=safeUrl(config.project[key]);if(!url){missing(activeVideo==='intro'?'实验简介视频':'教学引导视频',activeVideo==='intro'?'实验简介视频将介绍消防救援背景、虚拟仿真必要性、已有教学基础、核心任务与预期学习成果。':'教学引导视频将以实际线上界面为主，展示键鼠输入、系统反馈，以及操作或参数变化带来的结果。');return;}const video=el('video');video.controls=true;video.playsInline=true;video.src=url;openModal(activeVideo==='intro'?'实验简介视频':'教学引导视频',video);});

  function setToggle(button,key,active){button.setAttribute('aria-pressed',String(active));button.querySelector('span:last-child').textContent=active?(key==='like'?'已点赞':'已收藏'):(key==='like'?'点赞':'收藏');}
  [['#like-button','like'],['#favorite-button','favorite']].forEach(([selector,key])=>{const button=$(selector);setToggle(button,key,read(key)==='true');button.addEventListener('click',()=>{const active=button.getAttribute('aria-pressed')!=='true';setToggle(button,key,active);const stored=save(key,String(active));toast((active?(key==='like'?'已点赞':'已收藏'):'已取消')+(stored?'，仅保存在本机浏览器':'，本次会话有效'));});});
  $('#share-button').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);toast('页面链接已复制');}catch{const input=el('input','share-input');input.value=location.href;input.readOnly=true;input.setAttribute('aria-label','当前页面链接');openModal('分享项目',el('p','','复制下方链接。局域网或公网访问需先部署到对应服务器。'),input);input.focus();input.select();}});
  function updateRating(){const value=Number(read('rating'));if(value>=1&&value<=5){put('#rate-button','已评价 · '+value+'星');$('#rate-button').setAttribute('aria-label','本机评分 '+value+' 星，点击修改');}}
  updateRating();
  $('#rate-button').addEventListener('click',()=>{let selected=Number(read('rating'))||0;const stars=el('div','rating-input');stars.setAttribute('role','group');stars.setAttribute('aria-label','选择一到五星评分');const buttons=[];function refresh(){buttons.forEach((b,i)=>{b.classList.toggle('selected',i<selected);b.setAttribute('aria-pressed',String(i+1===selected));});}
    for(let i=1;i<=5;i++){const button=el('button','','★');button.setAttribute('aria-label',i+' 星');button.addEventListener('click',()=>{selected=i;refresh();});buttons.push(button);stars.append(button);}refresh();const actions=el('div','modal-actions');const submit=el('button','button button-primary','保存本机评价');submit.addEventListener('click',()=>{if(!selected){toast('请先选择评分');return;}if(save('rating',String(selected))){updateRating();closeModal();toast('评分已保存在本机浏览器');}else toast('浏览器未允许本地存储，评分未保存');});actions.append(submit);openModal('实验体验评价',el('p','','评价功能演示：评分仅保存在当前浏览器，不计入平台统计。'),stars,actions);
  });

  let sectionId=config.sections[0].id;
  let activeTab='introduction';
  function renderSection(id){
    const section=config.sections.find(s=>s.id===id)||config.sections[0];sectionId=section.id;
    const article=$('#article-content');
    article.replaceChildren(el('div','article-eyebrow',section.eyebrow),el('h2','',section.title),el('p','lead',section.lead));
    const list=el('div',section.id==='steps'?'workflow-list':'objective-list');
    section.points.forEach(([title,text],index)=>{
      if(section.id==='steps'){
        const stage=el('details','workflow-stage');stage.open=index===0;
        const summary=el('summary');summary.append(el('span','stage-number',String(index+1).padStart(2,'0')),el('h3','',title),el('span','stage-toggle','＋'));
        const steps=el('ol','workflow-steps');
        text.split('\n').filter(Boolean).forEach(line=>{
          const match=line.match(/^(\d+)\.\s*([^：]+)：(.*)$/);
          const step=el('li');
          if(match){const copy=el('div');copy.append(el('strong','',match[2]),el('p','',match[3]));step.append(el('span','step-number',match[1].padStart(2,'0')),copy);}
          else step.textContent=line;
          steps.append(step);
        });
        stage.append(summary,steps);list.append(stage);
      }else{
        const item=el('div','objective');const copy=el('div');copy.append(el('strong','',title),el('p','',text));
        item.append(el('span','point-number',String(index+1).padStart(2,'0')),copy);list.append(item);
      }
    });
    article.append(list);article.setAttribute('aria-labelledby','section-'+section.id);
    document.querySelectorAll('[data-section]').forEach(button=>{const selected=button.dataset.section===section.id;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});
  }
  config.sections.forEach(section=>{const button=el('button','',section.label);button.id='section-'+section.id;button.dataset.section=section.id;button.setAttribute('role','tab');button.setAttribute('aria-controls','article-content');button.addEventListener('click',()=>renderSection(section.id));$('#section-tabs').append(button);});
  function selectTab(name){activeTab=name;document.querySelectorAll('[data-tab]').forEach(button=>{const selected=button.dataset.tab===name;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});$('#information-panel').setAttribute('aria-labelledby','tab-'+name);$('#section-tabs').hidden=name!=='introduction';const article=$('#article-content');article.setAttribute('aria-labelledby','tab-'+name);
    if(name==='introduction'){renderSection(sectionId);return;}
    if(name==='requirements'){article.replaceChildren(el('div','article-eyebrow','BEFORE YOU BEGIN'),el('h2','','开始实验前，请先了解这些事项'));const list=el('ol','requirements-list');config.requirements.forEach((text,i)=>{const item=el('li');item.append(el('span','',String(i+1).padStart(2,'0')),document.createTextNode(text));list.append(item);});article.append(list);return;}
    article.replaceChildren(el('div','article-eyebrow','TEACHING RESOURCES'),el('h2','','消防救援机器人实验学习资料'),el('p','empty-description','配套资料包括实验指导、教学课件和实验报告模板，正式文件上传后可在此查阅。'));const list=el('div','resource-list');config.resources.forEach(resource=>{const row=el('div','resource-item');const symbol=el('span','file-icon');symbol.append(icon('file'));const copy=el('div');copy.append(el('strong','',resource.title),el('small','',resource.description+' · '+resource.type));const url=safeUrl(resource.url);let action;if(url){action=el('a','','查看资料');action.href=url;action.target='_blank';action.rel='noopener noreferrer';}else{action=el('button','','待上传');action.addEventListener('click',()=>missing(resource.title,'本资料将用于'+resource.description+'。'));}row.append(symbol,copy,action);list.append(row);});article.append(list);
  }
  document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>selectTab(button.dataset.tab)));
  selectTab('introduction');
  $('#resources-nav').addEventListener('click',()=>selectTab('resources'));
  document.querySelectorAll('[role=tablist]').forEach(list=>list.addEventListener('keydown',event=>{const buttons=[...list.querySelectorAll('[role=tab]')];const current=buttons.indexOf(document.activeElement);if(current===-1)return;let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(current+1)%buttons.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(current+buttons.length-1)%buttons.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;event.preventDefault();buttons[next].click();buttons[next].focus();}));
  put('#related-heading',config.relatedHeading||'相关实验');put('#related-caption',config.relatedCaption||'探索更多实践课程');
  config.related.forEach((project,i)=>{const card=el('button','experiment-card');const art=el('div','card-art '+project.theme);art.append(el('span','category',project.category),icon(['chip','orbit','cube'][i%3]),el('span','art-code','MODULE / '+String(i+1).padStart(2,'0')));card.append(art,el('strong','',project.title),el('small','',project.description));card.addEventListener('click',()=>{const url=safeUrl(project.url);if(url)location.assign(url);else if(project.details){const list=el('ul');project.details.forEach(text=>list.append(el('li','',text)));openModal(project.title,el('p','',project.description),list);}else missing(project.title,'项目资料正在整理中。');});$('#related-grid').append(card);});
  $('.mobile-menu').addEventListener('click',()=>{const open=$('.main-nav').classList.toggle('open');$('.mobile-menu').setAttribute('aria-expanded',String(open));$('.mobile-menu').setAttribute('aria-label',open?'收起导航':'展开导航');});
  $('.main-nav').addEventListener('click',event=>{if(event.target.closest('a,button')){$('.main-nav').classList.remove('open');$('.mobile-menu').setAttribute('aria-expanded','false');$('.mobile-menu').setAttribute('aria-label','展开导航');}});
  $('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
})();
