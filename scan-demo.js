/* The scan demo on the home page (#scanDemo): a looping animation of a bulk
 * scan. Each card slides into the scanner, the four recognition steps light
 * up, the match fills in, Enter is pressed and the card joins the inventory
 * list. Cards are drawn placeholders; names, finishes and Market Prices are
 * real cards from the shop's stock (October 2026).
 *
 * Runs only while the demo is on screen. With "reduce motion" set, it shows
 * the finished state instead of animating. */
(function () {
  var root = document.getElementById('scanDemo');
  if (!root) return;

  var CARDS = [
    { name: 'Snorlax', set: 'Crown Zenith', num: '#109', finish: 'Reverse Holo', fin: 'reverse',
      conf: '99.4% match', price: 13.26, a1: '#475569', a2: '#a5b4fc' },
    { name: 'Machamp GX', set: 'Burning Shadows', num: '#64', finish: 'Holo', fin: 'holo',
      conf: '98.7% match', price: 5.40, a1: '#9a3412', a2: '#fbbf24' },
    { name: "Cynthia's Garchomp ex", set: 'Destined Rivals', num: '#215', finish: 'Normal', fin: 'normal',
      conf: '97.9% match', price: 4.38, a1: '#115e59', a2: '#fde68a' }
  ];

  function $(id) { return document.getElementById(id); }
  var card = $('dmCard'), beam = $('dmBeam'), steps = $('dmSteps').children,
      nameEl = $('dmName'), setEl = $('dmSet'), numEl = $('dmNum'), finEl = $('dmFinish'),
      confEl = $('dmConf'), priceEl = $('dmPrice'), keyEl = $('dmKey'), list = $('dmList'),
      countEl = $('dmCount'), valueEl = $('dmValue');
  var count = 0, value = 0;
  var money = function (v) { return '$' + v.toFixed(2); };

  // Pause while scrolled out of view.
  var visible = false, resume = null;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && resume) { var r = resume; resume = null; r(); }
    }, { threshold: 0.2 }).observe(root);
  } else {
    visible = true;
  }
  function gate() { return visible ? Promise.resolve() : new Promise(function (r) { resume = r; }); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }).then(gate); }

  function clearMatch() {
    nameEl.innerHTML = '&nbsp;'; setEl.innerHTML = '&nbsp;'; numEl.textContent = '';
    finEl.className = 'dm-finish'; confEl.className = 'dm-conf';
    priceEl.textContent = '–';
    for (var i = 0; i < steps.length; i++) steps[i].className = '';
  }

  function paintCard(c) {
    card.className = 'demo-card' + (c.fin === 'normal' ? '' : ' ' + c.fin);
    card.style.setProperty('--a1', c.a1);
    card.style.setProperty('--a2', c.a2);
  }

  function addRow(c) {
    var li = document.createElement('li');
    li.innerHTML = '<span><b></b> · <span class="sub"></span></span><span></span>';
    li.querySelector('b').textContent = c.name;
    li.querySelector('.sub').textContent = c.set + ' ' + c.num + ' · ' + c.finish;
    li.lastChild.textContent = money(c.price);
    list.insertBefore(li, list.firstChild);
    while (list.children.length > 3) list.removeChild(list.lastChild);
    count++; value += c.price;
    countEl.textContent = count; valueEl.textContent = money(value);
  }

  function step(i, state) { steps[i].className = state; }

  async function scanOne(c) {
    clearMatch();
    paintCard(c);
    card.classList.remove('in', 'out');
    void card.offsetWidth;                // restart the slide-in
    card.classList.add('in');
    await wait(700);

    beam.classList.remove('sweep'); void beam.offsetWidth; beam.classList.add('sweep');
    await wait(900);

    step(0, 'on'); await wait(550);
    nameEl.textContent = c.name; setEl.textContent = c.set;
    step(0, 'done'); step(1, 'on'); await wait(500);
    numEl.textContent = c.num; numEl.classList.add('flash');
    await wait(350); numEl.classList.remove('flash');
    step(1, 'done'); step(2, 'on'); await wait(500);
    finEl.textContent = c.finish; finEl.classList.add('show');
    step(2, 'done'); step(3, 'on'); await wait(500);
    priceEl.textContent = money(c.price);
    confEl.textContent = c.conf; confEl.classList.add('show');
    step(3, 'done');
    await wait(900);

    keyEl.classList.add('press'); await wait(180); keyEl.classList.remove('press');
    addRow(c);
    card.classList.add('out');
    await wait(800);
  }

  function showFinished() {
    var last = CARDS[CARDS.length - 1];
    CARDS.forEach(addRow);
    paintCard(last); card.classList.add('in');
    nameEl.textContent = last.name; setEl.textContent = last.set; numEl.textContent = last.num;
    finEl.textContent = last.finish; finEl.classList.add('show');
    confEl.textContent = last.conf; confEl.classList.add('show');
    priceEl.textContent = money(last.price);
    for (var i = 0; i < steps.length; i++) steps[i].className = 'done';
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showFinished();
    return;
  }

  (async function loop() {
    await gate();
    for (;;) {
      for (var i = 0; i < CARDS.length; i++) await scanOne(CARDS[i]);
      await wait(1600);
      // Start the next round with an empty list.
      list.innerHTML = ''; count = 0; value = 0;
      countEl.textContent = '0'; valueEl.textContent = money(0);
    }
  })();
})();
