const photos = {
  img1: [
   ' https://www.tripsavvy.com/thmb/8hSyNm0dUTXbzbhgqZD0vS2NO2Y=/2121x1414/filters:fill(auto,1)/LakeLouise_GettyImages-6b1e83ecabbb423c9cc66ea024c0e6bf.jpg'
  ],
  
  img2: [
   ' https://tse4.mm.bing.net/th/id/OIP.ohe0AonHVUTPJbgzIedkfAHaEK?pid=Api&h=220&P=0'
  ],
  
  img3: [
    'https://wallup.net/wp-content/uploads/2016/01/291451-landscape-Yellowstone_National_Park-river.jpg'
    
  ],
};
 
function loadPhoto(imgId, srcList) {
  const img       = document.getElementById(imgId);
  const container = img.closest('.card-photo');
  let idx = 0;
 
  function tryNext() {
    if (idx >= srcList.length) {
      
      const fallbacks = {
        img1: 'linear-gradient(160deg,#0d2535,#1a4a60,#2a6a80)',
        img2: 'linear-gradient(160deg,#050d18,#0a2a18,#1a4a30)',
        img3: 'linear-gradient(160deg,#1a0e06,#3a1a08,#5a2a10)',
      };
      container.style.background = fallbacks[imgId] || 'linear-gradient(160deg,#0d2030,#1a3a50)';
      container.classList.add('loaded');
      return;
    }
    img.onerror = () => { idx++; tryNext(); };
    img.onload  = () => {
      img.classList.add('visible');
      container.classList.add('loaded');
    };
    img.src = srcList[idx];
  }
  tryNext();
}
 

loadPhoto('img1', photos.img1);
loadPhoto('img2', photos.img2);
loadPhoto('img3', photos.img3);
 
const cards = [
  { wid:'w1', cid:'c1', tlid:'tl1', psid:'ps1', grid:'gr1', r:80,  g:175, b:215 }, // blue
  { wid:'w2', cid:'c2', tlid:'tl2', psid:'ps2', grid:'gr2', r:40,  g:220, b:130 }, // green
  { wid:'w3', cid:'c3', tlid:'tl3', psid:'ps3', grid:'gr3', r:225, g:125, b:40  }, // amber
];
 
cards.forEach(cfg => {
  const wrap = document.getElementById(cfg.wid);
  const card = document.getElementById(cfg.cid);
  const tl   = document.getElementById(cfg.tlid);
  const ps   = document.getElementById(cfg.psid);
  const gr   = document.getElementById(cfg.grid);
  const {r, g, b} = cfg;
 
  let raf      = null;
  let hovering = false;
  let curRX = 0, curRY = 0;
  let tgtRX = 0, tgtRY = 0;
 
  const lerp = (a, b, t) => a + (b - a) * t;
 
  function tick() {
    const spd = hovering ? 0.14 : 0.07;
    curRX = lerp(curRX, tgtRX, spd);
    curRY = lerp(curRY, tgtRY, spd);
 
   
    const sc = hovering ? 1.038 : 1.0;
    card.style.transform =
      `perspective(1000px) rotateX(${curRX}deg) rotateY(${curRY}deg) scale3d(${sc},${sc},${sc})`;
 
    
    const lx = 50 - curRY * 2.6;
    const ly = 50 + curRX * 2.6;
    tl.style.background = `
      radial-gradient(
        ellipse 68% 58% at ${lx}% ${ly}%,
        rgba(255,255,255,.20) 0%,
        rgba(255,255,255,.07) 42%,
        transparent 68%
      )
    `;
 
   
    const mag = Math.sqrt(curRX * curRX + curRY * curRY);
    const t   = Math.min(mag / 18, 1);
 
    if (t > 0.015) {
      
      const ang = Math.atan2(curRX, curRY);
      const ox  = Math.sin(ang) * t * 24;
      const oy  = -Math.cos(ang) * t * 24;
 
      
      wrap.style.boxShadow = `
        ${ox}px       ${oy + 12}px     ${28 + t*44}px  ${2 + t*16}px  rgba(${r},${g},${b},${.32 + t*.5}),
        ${ox*.55}px   ${oy*.55 + 6}px  ${12 + t*20}px  0px            rgba(${r},${g},${b},${.48 + t*.38}),
        ${ox*.25}px   ${oy*.25 + 3}px  ${5  + t*10}px  -1px           rgba(${r},${g},${b},${.6  + t*.3}),
        0px           30px             65px             0px            rgba(${r},${g},${b},${t   * .16})
      `;
 
      
      const eR = Math.max(0,  curRY / 18);
      const eL = Math.max(0, -curRY / 18);
      const eB = Math.max(0,  curRX / 18);
      const eT = Math.max(0, -curRX / 18);
 
      gr.style.boxShadow = [
        `inset  1.5px 0      ${4 + eL*20}px rgba(${r},${g},${b},${eL*.9})`,
        `inset -1.5px 0      ${4 + eR*20}px rgba(${r},${g},${b},${eR*.9})`,
        `inset 0       1.5px ${4 + eT*20}px rgba(${r},${g},${b},${eT*.9})`,
        `inset 0      -1.5px ${4 + eB*20}px rgba(${r},${g},${b},${eB*.9})`,
      ].join(', ');
 
      gr.style.opacity       = '1';
      card.style.borderColor = `rgba(${r},${g},${b},${.08 + t*.28})`;
 
    } else {
      wrap.style.boxShadow   = '';
      gr.style.boxShadow     = '';
      gr.style.opacity       = '0';
      card.style.borderColor = '';
    }
 
    
    const settled =
      Math.abs(curRX - tgtRX) < 0.012 &&
      Math.abs(curRY - tgtRY) < 0.012;
 
    if (!settled) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      if (!hovering) {
        card.style.transform   = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.borderColor = '';
        wrap.style.boxShadow   = '';
        gr.style.opacity       = '0';
      }
    }
  }
 
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
 
  wrap.addEventListener('mousemove', e => {
    hovering = true;
    const rect = card.getBoundingClientRect();
    tgtRY =  ((e.clientX - rect.left - rect.width/2)  / (rect.width/2))  * 18;
    tgtRX = -((e.clientY - rect.top  - rect.height/2) / (rect.height/2)) * 18;
 
    
    const px = ((e.clientX - rect.left) / rect.width)  * 100;
    const py = ((e.clientY - rect.top)  / rect.height) * 100;
    ps.style.setProperty('--sx', `${px}%`);
    ps.style.setProperty('--sy', `${py}%`);
 
    kick();
  });
 
  wrap.addEventListener('mouseenter', () => { hovering = true;  kick(); });
  wrap.addEventListener('mouseleave', () => {
    hovering = false;
    tgtRX = 0;
    tgtRY = 0;
    kick();
  });
});
