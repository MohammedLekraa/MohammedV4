document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  let lang = store.get('lang') === 'es' ? 'es' : 'en', theme = store.get('theme') === 'dark' ? 'dark' : 'light';
  const T = (a) => a[lang === 'es' ? 1 : 0];
  const UI = { title: ['Robotic Arm Control Using a Sensor Glove | ML Portfolio', 'Control de un brazo robótico mediante un guante sensorizado | ML Portfolio'], night: ['Night view', 'Vista nocturna'], day: ['Day view', 'Vista diurna'], search: ['Search a component by name', 'Busca un componente por nombre'], all: ['All', 'Todos'], none: ['No component matches the search.', 'Ningún componente coincide con la búsqueda.'] };

  $$('img').forEach(i => { const m = () => i.setAttribute('data-missing', ''); i.addEventListener('error', m); if (i.complete && !i.naturalWidth && i.getAttribute('src')) m(); });
  const vs = $('.vwrap source'); if (vs) vs.addEventListener('error', () => { $('.vmiss').hidden = false; });

  const bar = $('#progress'), hint = $('.scrollhint');
  const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%'; hint.classList.toggle('gone', scrollY > 80); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const links = $$('.side-in a');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-20% 0px -50% 0px' });
  $$('section[id]').forEach(s => io.observe(s));

  $$('section > *').forEach(el => el.classList.add('rv'));
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; rv.unobserve(e.target); e.target.classList.add('in');
    [...e.target.children].forEach((c, i) => { c.style.transitionDelay = Math.min(i, 8) * 70 + 'ms'; c.classList.add('in'); });
  }), { threshold: .04 });
  $$('section').forEach(s => rv.observe(s));

  $$('.acc-h').forEach(b => b.addEventListener('click', () => b.parentElement.classList.toggle('open')));
  const tabs = root => {
    const bs = $$(':scope > .tabs .tab', root), ps = $$(':scope > .tp', root);
    const go = k => { bs.forEach(b => b.classList.toggle('on', b.dataset.k === k)); ps.forEach(p => p.classList.toggle('on', p.dataset.p === k)); };
    bs.forEach(b => b.addEventListener('click', () => go(b.dataset.k))); return go;
  };
  const tabGo = $$('[data-tabs]').map(tabs);
  const stepper = root => {
    const nav = $$('.st-nav button', root), ps = $$('.st-p', root), fill = $('.st-bar i', root), prev = $('.st-prev', root), next = $('.st-next', root); let i = 0;
    const go = k => {
      i = Math.max(0, Math.min(ps.length - 1, k));
      nav.forEach((b, j) => { b.classList.toggle('on', j === i); b.classList.toggle('done', j < i); });
      ps.forEach((p, j) => p.classList.toggle('on', j === i));
      fill.style.width = (i + 1) / ps.length * 100 + '%'; prev.disabled = i === 0; next.disabled = i === ps.length - 1;
    };
    nav.forEach((b, j) => b.addEventListener('click', () => go(j))); prev.addEventListener('click', () => go(i - 1)); next.addEventListener('click', () => go(i + 1)); go(0);
  };
  stepper($('#imu-st'));

  const PCB = {
    g: [
      [['Connection diagram', 'Esquema de conexiones'], ['First the circuit was assembled on a breadboard and drawn in Fritzing: the five flex sensors, each with its 47 kΩ resistor, and the IMU wired to the Wemos.', 'Primero se montó el circuito en una protoboard y se dibujó en Fritzing: los cinco sensores de flexión, cada uno con su resistencia de 47 kΩ, y la IMU conectada a la Wemos.'], 'img/fritzing-guante.png'],
      [['Schematic in KiCad', 'Esquema eléctrico en KiCad'], ['The diagram was moved to KiCad. It shows the five voltage dividers, the sensor connectors and the nine-pin connector to the Wemos.', 'El esquema se pasó a KiCad. Muestra los cinco divisores de tensión, los conectores de los sensores y el conector de nueve pines hacia la Wemos.'], 'img/kicad-esq-guante.png'],
      [['Track routing', 'Enrutado de pistas'], ['Footprints are assigned and the tracks between connectors and resistors are routed, looking for the simplest connections. In the second version the tracks are wider.', 'Se asignan los footprints y se trazan las pistas entre conectores y resistencias, buscando las conexiones más simples. En la segunda versión las pistas son más anchas.'], 'img/kicad-guante.png'],
      [['Fabricated and soldered board', 'Placa fabricada y soldada'], ['The board was fabricated and the resistors and connectors were hand-soldered. This is the final board with the wires attached.', 'Se fabricó la placa y se soldaron a mano las resistencias y los conectores. Es la placa definitiva, con los cables conectados.'], 'img/pcb-guante.png']
    ],
    b: [
      [['Connection diagram', 'Esquema de conexiones'], ['In Fritzing, each servo goes to a PWM pin of the Wemos, the servo power is common and all grounds are joined. A breadboard distributes power and signals.', 'En Fritzing, cada servo va a un pin PWM de la Wemos, la alimentación de los servos es común y todas las masas están unidas. Una protoboard distribuye la alimentación y las señales.'], 'img/fritzing-brazo.png'],
      [['Schematic in KiCad', 'Esquema eléctrico en KiCad'], ['The six servos share power and ground, and each PWM signal goes to a Wemos output. A decoupling capacitor is added.', 'Los seis servos comparten alimentación y masa, y la señal PWM de cada uno va a una salida de la Wemos. Se añade un condensador de desacoplo.'], 'img/kicad-esq-brazo.png'],
      [['Track routing', 'Enrutado de pistas'], ['Power and ground tracks are common to the six servos, and the control lines leave from the Wemos connector.', 'Las pistas de alimentación y masa son comunes a los seis servos, y las líneas de control salen del conector de la Wemos.'], 'img/kicad-brazo.png'],
      [['Fabricated and soldered board', 'Placa fabricada y soldada'], ['Final board with the six servo connectors, the capacitor and the power terminal, connected to the Wemos.', 'Placa final con los conectores de los seis servos, el condensador y la borna de alimentación, conectada a la Wemos.'], 'img/pcb-brazo-2.png']
    ]
  };
  const renderPCB = () => Object.entries(PCB).forEach(([k, st]) => {
    const r = $('#pcb-' + k), pre = lang === 'es' ? 'Paso' : 'Step';
    r.innerHTML = `<div class="st-nav">${st.map((s, i) => `<button>${i + 1}${T(s[0])}</button>`).join('')}</div><div class="st-bar"><i></i></div>` +
      st.map((s, i) => `<div class="st-p"><div class="pcbs"><figure class="fig" style="margin:0"><img class="zoom" src="${s[2]}" alt="${T(s[0])}"></figure><div><h4>${pre} ${i + 1}: ${T(s[0])}</h4><p>${T(s[1])}</p></div></div></div>`).join('') +
      `<div class="st-ctl"><button class="btn st-prev">&larr; ${lang === 'es' ? 'Anterior' : 'Previous'}</button><button class="btn st-next">${lang === 'es' ? 'Siguiente' : 'Next'} &rarr;</button></div>`;
    $$('img', r).forEach(i => i.addEventListener('error', () => i.setAttribute('data-missing', ''))); stepper(r);
  });

  const MD = [
    { t: ['InMoov Forearm Structure', 'Estructura del antebrazo InMoov'],
      h: ['The open InMoov models were chosen for their robust forearm structure and internal tendon channels. While the forearm proved exceptional, the original hand design was discarded due to excessive mechanical complexity and wear over time.',
          'Se partió de los modelos abiertos de InMoov por la solidez y los canales internos diseñados para los hilos. Aunque la estructura del antebrazo demostró ser sobresaliente, se descartó su diseño de mano original debido a su excesiva complejidad mecánica y fragilidad ante el uso continuado.'],
      specs: [[['Origin','Origen'],['Thingiverse / Open Source','Thingiverse / Open Source']],[['Base material','Material base'],['Structural PLA','PLA Estructural']],[['Key advantage','Ventaja'],['Integrated internal channels','Canales internos integrados']]] },
    { t: ['FlexyHand Alternative Integration', 'Integración alternativa FlexyHand'],
      h: ['As an alternative, a hand inspired by FlexyHand was selected, optimized to reduce part count and ease assembly using TPU living hinges. The main initial hurdle was its lack of direct compatibility with the forearm cylindrical base.',
          'Como alternativa se seleccionó una mano inspirada en FlexyHand, optimizada para reducir el número de piezas y facilitar el ensamblaje mediante bisagras flexibles (living hinges) de TPU. El principal reto técnico inicial era su incompatibilidad directa con la base cilíndrica del antebrazo.'],
      specs: [[['Architecture','Arquitectura'],['Living hinges','Bisagras flexibles (Living hinges)']],[['Hinges material','Material bisagras'],['Low-infill TPU','TPU de bajo relleno']],[['Key advantage','Ventaja'],['Simplified assembly','Montaje simplificado']]] },
    { t: ['Custom CAD Redesign in Fusion 360', 'Rediseño CAD a medida en Fusion 360'],
      h: ['To merge both worlds, a custom hybrid coupling part was modelled in Fusion 360. Analyzing InMoov axis dimensions and the flat hand base, a robust anchor was designed to preserve wrist rotation without compromising ergonomics.',
          'Para fusionar ambos mundos, se modeló en Fusion 360 una pieza de acoplamiento híbrida. Analizando las cotas del eje InMoov y la base plana de la mano, se diseñó un anclaje robusto que preserva intacta la rotación de la muñeca sin comprometer la ergonomía.'],
      specs: [[['Software','Software'],['Autodesk Fusion 360','Autodesk Fusion 360']],[['Key part','Pieza clave'],['Hybrid wrist adapter','Adaptador de muñeca híbrido']],[['Result','Resultado'],['Firm joint without play','Unión firme sin holguras']]] },
    { t: ['Final Assembly & Servos Integration', 'Ensamblaje final e integración de servos'],
      h: ['The final assembly combines PLA and TPU printed parts, actuated by six digital DM996 servos (15 kg·cm) controlled via high-strength nylon thread tendons. The result is a robust, precise arm ready for real-time gesture mirroring.',
          'El sistema final combina componentes impresos en PLA y TPU, accionados por seis servos digitales DM996 de 15 kg·cm controlados mediante tendones de hilo de nailon de alta resistencia. El resultado es un brazo robusto, preciso y preparado para replicar los gestos en tiempo real.'],
      specs: [[['Actuators','Actuadores'],['6 × DM996 Servos (15 kg·cm)','6 × Servos DM996 (15 kg·cm)']],[['Tendons','Tendones'],['High-strength nylon thread','Hilo de nailon de alta resistencia']],[['Structure','Estructura'],['Hybridized PLA / TPU','PLA / TPU hibridado']]] }
  ];

  let mi = 0;
  const mdet = $('#mdet');
  const showMech = i => {
    mi = i;
    $$('.mc').forEach((c, j) => c.classList.toggle('on', j === i));
    const d = MD[i];
    mdet.innerHTML = `
      <div class="mdet-text">
        <span class="mono" style="color:var(--mute); text-transform:uppercase; letter-spacing:.1em; font-size:.65rem;">${lang==='es'?'Hito':'Milestone'} 0${i+1} // Mechanical Milestone</span>
        <h3>${T(d.t)}</h3>
        <p>${T(d.h)}</p>
      </div>
      <div class="mdet-specs">
        <div class="specs-title">${lang === 'es' ? 'Especificaciones clave' : 'Key Specifications'}</div>
        ${d.specs.map(spec => `
          <div class="spec-row">
            <span class="spec-k">${T(spec[0])}</span>
            <span class="spec-v">${T(spec[1])}</span>
          </div>
        `).join('')}
      </div>
    `;
    mdet.classList.remove('sw');
    void mdet.offsetWidth;
    mdet.classList.add('sw');
  };
  $$('.mc').forEach((c, i) => c.addEventListener('click', () => showMech(i)));
  showMech(0);

  const CO = [
    { k: 'flex',  b: ['Flex sensors', 'Sensores de flexión'], t: ['Measure how much each finger bends.', 'Miden el grado de flexión de los dedos.'], x: 2,  y: 2,  w: 33, tx: 33, ty: 63 },
    { k: 'imu',   b: ['MPU6050 IMU', 'IMU MPU6050'], t: ['Measures the wrist rotation.', 'Mide la rotación de la muñeca.'], x: 38, y: 83, w: 28, tx: 46, ty: 54 },
    { k: 'caixa', b: ['Electronics box', 'Caja de electrónica'], t: ['Microcontroller, battery and PCB.', 'Microcontrolador, pila y PCB.'], x: 68, y: 83, w: 30, tx: 72, ty: 60 }
  ];
  const g = $('#glove');
  g.insertAdjacentHTML('beforeend', '<svg aria-hidden="true"><defs><marker id="ah" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" fill="#a8a49a"/></marker></defs></svg>');
  const svg = $('svg', g);
  CO.forEach(c => {
    svg.insertAdjacentHTML('beforeend', `<path data-k="${c.k}" marker-end="url(#ah)"/>`);
    g.insertAdjacentHTML('beforeend', `<button class="cb" data-k="${c.k}"></button><i class="tg" data-k="${c.k}"></i>`);
  });
  g.insertAdjacentHTML('afterend', '<pre id="co-out" class="eq" hidden></pre>');
  const out = $('#co-out');
  const drawCO = () => {
    const W = g.clientWidth, H = g.clientHeight; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    CO.forEach(c => {
      const b = $(`.cb[data-k=${c.k}]`, g), t = $(`.tg[data-k=${c.k}]`, g), p = $(`path[data-k=${c.k}]`, svg);
      b.style.left = c.x + '%'; b.style.top = c.y + '%'; b.style.width = c.w + '%'; t.style.left = c.tx + '%'; t.style.top = c.ty + '%';
      const bx = b.offsetLeft, by = b.offsetTop, bw = b.offsetWidth, bh = b.offsetHeight, tx = c.tx / 100 * W, ty = c.ty / 100 * H;
      const sx = Math.min(Math.max(tx, bx + 18), bx + bw - 18);
      const [x0, y0] = ty < by ? [sx, by] : ty > by + bh ? [sx, by + bh] : [tx < bx ? bx : bx + bw, ty];
      const vert = y0 === by || y0 === by + bh;
      const cx = vert ? x0 : (x0 + tx) / 2, cy = vert ? y0 + (ty - y0) * .6 : y0;
      p.setAttribute('d', `M${x0} ${y0} Q${cx} ${cy} ${tx} ${ty}`);
      p.style.setProperty('--l', Math.ceil(p.getTotalLength()) + 2);
    });
    out.textContent = CO.map(c => `${c.k}:  x: ${c.x}, y: ${c.y}, w: ${c.w}, tx: ${c.tx}, ty: ${c.ty}`).join('\n');
  };
  const labelCO = () => { $$('.cb', g).forEach((b, i) => b.innerHTML = `<b>${T(CO[i].b)}</b>${T(CO[i].t)}`); drawCO(); };
  addEventListener('resize', drawCO);
  const hl = (k, on) => $$('[data-k]', g).forEach(e => e.classList.toggle('hl', on && e.dataset.k === k));
  $$('.cb', g).forEach(b => {
    b.addEventListener('mouseenter', () => hl(b.dataset.k, true)); b.addEventListener('mouseleave', () => hl(b.dataset.k, false));
    b.addEventListener('focus', () => hl(b.dataset.k, true)); b.addEventListener('blur', () => hl(b.dataset.k, false));
    b.addEventListener('click', () => { if (!g.classList.contains('edit')) tabGo[0](b.dataset.k); });
  });
  const setEdit = on => { g.classList.toggle('edit', on); out.hidden = !on; };
  addEventListener('keydown', e => { if (e.key.toLowerCase() === 'e' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) setEdit(!g.classList.contains('edit')); });
  if (location.hash === '#edit') setEdit(true);
  let ed = null;
  g.addEventListener('pointerdown', e => {
    if (!g.classList.contains('edit')) return; const el = e.target.closest('.cb,.tg'); if (!el) return;
    const c = CO.find(c => c.k === el.dataset.k);
    ed = { c, tg: el.classList.contains('tg'), ox: e.clientX, oy: e.clientY, x: c.x, y: c.y, tx: c.tx, ty: c.ty, r: g.getBoundingClientRect() }; g.setPointerCapture(e.pointerId); e.preventDefault();
  });
  g.addEventListener('pointermove', e => {
    if (!ed) return; const dx = (e.clientX - ed.ox) / ed.r.width * 100, dy = (e.clientY - ed.oy) / ed.r.height * 100, r1 = v => Math.round(v * 10) / 10;
    if (ed.tg) { ed.c.tx = r1(ed.tx + dx); ed.c.ty = r1(ed.ty + dy); } else { ed.c.x = r1(ed.x + dx); ed.c.y = r1(ed.y + dy); }
    drawCO();
  });
  g.addEventListener('pointerup', () => ed = null);
  const gio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { g.classList.add('in'); gio.disconnect(); } }), { threshold: .3 }); gio.observe(g);

  let charts = [];
  const buildCharts = () => {
    if (!window.Chart) return; charts.forEach(c => c.destroy()); charts = [];
    const css = getComputedStyle(document.documentElement), v = k => css.getPropertyValue(k).trim();
    const c1 = v('--chart'), c2 = v('--chart2'), ink = v('--ink'), line = v('--line'), mute = v('--mute');
    Chart.defaults.font.family = "'JetBrains Mono',monospace"; Chart.defaults.font.size = 11; Chart.defaults.color = mute; Chart.defaults.borderColor = line; Chart.defaults.animation.duration = 800;
    const cross = { id: 'cross', afterDatasetsDraw(c) { const a = c.tooltip && c.tooltip.getActiveElements(); if (!a || !a.length || c.config.type !== 'line') return; const x = a[0].element.x, ar = c.chartArea, cx = c.ctx; cx.save(); cx.strokeStyle = mute; cx.setLineDash([4, 4]); cx.beginPath(); cx.moveTo(x, ar.top); cx.lineTo(x, ar.bottom); cx.stroke(); cx.restore(); } };
    const tip = cb => ({ backgroundColor: v('--card'), titleColor: ink, bodyColor: v('--body'), borderColor: line, borderWidth: 1, padding: 10, cornerRadius: 8, displayColors: false, callbacks: cb });
    const ang = [0, 45, 90, 135, 180], ADC = [2317, 2143, 1993, 1824, 1633], V = [1.87, 1.73, 1.61, 1.47, 1.32], R = [36066, 42811, 49570, 58518, 70860];
    const X = T(['Finger angle (°)', 'Ángulo del dedo (°)']);
    const ttl = i => T(['Angle', 'Ángulo']) + ': ' + i[0].label + '°';
    const extra = i => [`ADC: ${ADC[i[0].dataIndex]}`, `Vout: ${V[i[0].dataIndex]} V`, `Rflex: ${(R[i[0].dataIndex] / 1000).toFixed(1)} kΩ`];
    const lineCfg = (data, y, label) => ({ type: 'line', plugins: [cross], data: { labels: ang, datasets: [{ data, borderColor: c1, backgroundColor: c1 + '22', fill: true, tension: .25, pointRadius: 5, pointHoverRadius: 9, pointBackgroundColor: c1, pointHoverBackgroundColor: ink, pointBorderColor: v('--card'), pointBorderWidth: 2 }] },
      options: { interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: false }, tooltip: tip({ title: ttl, label: i => label(i), afterBody: extra }) }, scales: { x: { title: { display: true, text: X } }, y: { title: { display: true, text: y } } } } });
    const add = (el, cfg) => { const n = $(el); if (n) charts.push(new Chart(n, cfg)); };
    add('#chart', lineCfg(ADC, T(['ADC reading', 'Lectura ADC']), i => `ADC: ${i.raw}`));
    const actBtn = $('#ctabs .tab.on'); const act = actBtn ? actBtn.dataset.k : null;
    if (act !== null) add('#c-multi', lineCfg(act === 'r' ? R : V, act === 'r' ? 'Rflex (Ω)' : 'Vout (V)', i => act === 'r' ? `Rflex: ${i.raw} Ω` : `Vout: ${i.raw} V`));
    add('#c-rf', { type: 'bar', data: { labels: ['10 kΩ', '47 kΩ'], datasets: [{ data: [310, 700], backgroundColor: [c2, c1], hoverBackgroundColor: [mute, ink], borderRadius: 6 }] },
      options: { plugins: { legend: { display: false }, tooltip: tip({ title: i => T(['Fixed resistor ', 'Resistencia fija ']) + i[0].label, label: i => T(['Variation: ', 'Variación: ']) + i.raw + T([' ADC units', ' unidades ADC']), afterBody: i => [T(['Range: ', 'Rango: ']) + ['150 – 460', '1600 – 2300'][i[0].dataIndex]] }) },
        scales: { x: { title: { display: true, text: T(['Fixed resistor', 'Resistencia fija']) } }, y: { title: { display: true, text: T(['ADC reading variation', 'Variación de la lectura ADC']) } } } } });
    add('#c-cal', { type: 'bar', data: { labels: T([['Thumb', 'Index', 'Middle', 'Ring', 'Little'], ['Pulgar', 'Índice', 'Corazón', 'Anular', 'Meñique']]), datasets: [{ data: [[1530, 2100], [1530, 2100], [1700, 2300], [1650, 2100], [1730, 2000]], backgroundColor: c1, hoverBackgroundColor: ink, borderRadius: 6, borderSkipped: false }] },
      options: { indexAxis: 'y', plugins: { legend: { display: false }, tooltip: tip({ title: i => i[0].label, label: i => `minFlex ${i.raw[0]} · maxFlex ${i.raw[1]}`, afterBody: i => [T(['Span: ', 'Recorrido: ']) + (i[0].raw[1] - i[0].raw[0]) + ' ADC'] }) }, scales: { x: { min: 1400, max: 2400, title: { display: true, text: T(['ADC reading (minFlex to maxFlex)', 'Lectura ADC (de minFlex a maxFlex)']) } } } } });
  };
  $$('#ctabs .tab').forEach(b => b.addEventListener('click', () => { $$('#ctabs .tab').forEach(x => x.classList.toggle('on', x === b)); buildCharts(); }));

  const adc = $('#adc'), adcV = $('#adc-v'), adcA = $('#adc-a');
  if (adc && adcV && adcA) {
    const calc = () => { const x = Number(adc.value); adcV.textContent = x; adcA.textContent = Math.trunc((x - 1530) * (0 - 180) / (2100 - 1530)) + 180; };
    adc.addEventListener('input', calc); calc();
  }

  const CAT = { el: ['Electronics', 'Electrónica'], ac: ['Actuation', 'Actuación'], pw: ['Power', 'Alimentación'], fa: ['Fabrication', 'Fabricación'] };
  const parts = [
    [['Wemos D1 R32 (ESP32)'], 'el', 2, 10.5], [['MPU6050 (GY-521)'], 'el', 1, 3.5], [['Flex sensor FS-L-0055-253-ST', 'Sensor de flexión FS-L-0055-253-ST'], 'el', 5, 14],
    [['47 kΩ resistor', 'Resistencia 47 kΩ'], 'el', 5, .05], [['Decoupling capacitor', 'Condensador de desacoplo'], 'el', 1, .3], [['Copper board for PCBs', 'Placa de cobre para PCB'], 'el', 2, 3],
    [['DM996 digital servo 15 kg·cm', 'Servo digital DM996 15 kg·cm'], 'ac', 6, 9], [['Nylon thread for tendons', 'Hilo de nailon para los tendones'], 'ac', 1, 4],
    [['18650 Li-ion battery', 'Batería Li-ion 18650'], 'pw', 2, 5], [['2 × 18650 battery holder', 'Portapilas 2 × 18650'], 'pw', 1, 1.5], [['5500 mAh Li-ion battery (glove)', 'Batería Li-ion 5500 mAh (guante)'], 'pw', 1, 15],
    [['Promax FAC-363B lab power supply', 'Fuente de laboratorio Promax FAC-363B'], 'pw', 1, 0], [['PLA filament (1 kg)', 'Filamento PLA (1 kg)'], 'fa', 1, 20], [['TPU filament (1 kg)', 'Filamento TPU (1 kg)'], 'fa', 1, 25], [['Glove', 'Guante'], 'fa', 1, 5]
  ];
  const nm = p => p[0][lang === 'es' && p[0][1] ? 1 : 0];
  let prices = null; try { prices = JSON.parse(store.get('prices')); } catch {}
  if (!Array.isArray(prices) || prices.length !== parts.length) prices = parts.map(p => p[3]);
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const eur = v => v.toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB', { style: 'currency', currency: 'EUR' });
  let cat = 'all';
  const tb = $('#mt tbody');
  const renderParts = () => {
    $('#chips').innerHTML = [['all', T(UI.all)], ...Object.entries(CAT).map(([k, v]) => [k, T(v)])].map(([k, l]) => `<button class="chip${k === cat ? ' on' : ''}" data-c="${k}">${l}</button>`).join('');
    tb.innerHTML = parts.map((p, i) => `<tr data-i="${i}"><td>${nm(p)}</td><td><span class="pill">${T(CAT[p[1]])}</span></td><td>${p[2]}</td><td><input type="number" min="0" step="0.01" value="${prices[i]}" aria-label="${nm(p)}"></td><td class="sb"></td></tr>`).join('') + `<tr id="none" hidden><td colspan="5">${T(UI.none)}</td></tr>`;
    upd();
  };
  function upd() {
    const q = norm($('#q').value); let tot = 0, n = 0, all = 0;
    $$('tr[data-i]', tb).forEach(r => {
      const i = +r.dataset.i, p = parts[i], sub = p[2] * (+prices[i] || 0); all += sub; $('.sb', r).textContent = eur(sub);
      const show = (cat === 'all' || p[1] === cat) && norm(parts[i][0].join(' ') + ' ' + T(CAT[p[1]])).includes(q);
      r.hidden = !show; if (show) { tot += sub; n++; }
    });
    $('#none').hidden = n > 0; $('#tot').textContent = eur(tot); $('#grand').textContent = eur(all);
  }
  $('#q').addEventListener('input', upd);
  $('#chips').addEventListener('click', e => { const c = e.target.closest('.chip'); if (!c) return; cat = c.dataset.c; $$('.chip').forEach(x => x.classList.toggle('on', x === c)); upd(); });
  tb.addEventListener('input', e => { const r = e.target.closest('tr[data-i]'); if (!r) return; prices[+r.dataset.i] = e.target.value; store.set('prices', JSON.stringify(prices)); upd(); });
  addEventListener('keydown', e => { if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); } });

  const setTL = t => { const s = T(t === 'dark' ? UI.day : UI.night); $('#theme .tl').textContent = s; $('#theme').setAttribute('aria-label', s); };
  const applyLang = l => {
    lang = l; store.set('lang', l); document.documentElement.lang = l; document.title = T(UI.title);
    $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.l === l)); $('.seg').dataset.l = l;
    $$('[data-es]').forEach(e => { if (e.dataset.en === undefined) e.dataset.en = e.innerHTML; e.innerHTML = l === 'es' ? e.dataset.es : e.dataset.en; });
    $('#q').placeholder = T(UI.search); setTL(theme);
    renderPCB(); showMech(mi); labelCO(); renderParts(); buildCharts();
  };
  const applyTheme = t => { theme = t; store.set('theme', t); document.documentElement.dataset.theme = t; setTL(t); buildCharts(); };
  $$('.seg button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.l)));
  $('#theme').addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
  $('.scrollhint').addEventListener('click', e => { e.preventDefault(); $('#start').scrollIntoView({ behavior: 'smooth' }); });
  document.documentElement.dataset.theme = theme;
  applyLang(lang);

  const lb = $('#lb'), li = $('#lb-img'); let s = 1, x = 0, y = 0, drag = false, sx = 0, sy = 0;
  const draw = () => li.style.transform = `translate(${x}px,${y}px) scale(${s})`, close = () => lb.hidden = true;
  document.addEventListener('click', e => { const i = e.target.closest('img.zoom'); if (!i || i.hasAttribute('data-missing')) return; li.src = i.src; li.alt = i.alt; s = 1; x = y = 0; draw(); lb.hidden = false; });
  $('#lb-x').addEventListener('click', close); lb.addEventListener('click', e => { if (e.target === lb) close(); }); addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  lb.addEventListener('wheel', e => { e.preventDefault(); s = Math.min(4, Math.max(1, s + (e.deltaY < 0 ? .2 : -.2))); if (s === 1) x = y = 0; draw(); }, { passive: false });
  li.addEventListener('pointerdown', e => { drag = true; sx = e.clientX - x; sy = e.clientY - y; li.setPointerCapture(e.pointerId); });
  li.addEventListener('pointermove', e => { if (drag) { x = e.clientX - sx; y = e.clientY - sy; draw(); } });
  li.addEventListener('pointerup', () => drag = false);
});
