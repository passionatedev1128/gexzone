/**
 * Volatilidad page - interactive components
 * Integrates: gex_vix_spread, espejismo_vix, mano_invisible_dealer
 */

(function() {
  'use strict';

  // Wait for DOM
  function whenReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  whenReady(function() {
    initVixCharts();
    initEspejismoCurves();
    initManoInvisibleFlow();
  });

  // ══════════════════════════════════════════════
  // 1. VIX SPREAD CHARTS (Chart.js)
  // ══════════════════════════════════════════════
  function initVixCharts() {
    var tsEl = document.getElementById('termStructureChart');
    var rEl = document.getElementById('ratioChart');
    if (!tsEl || !rEl || typeof Chart === 'undefined') return;

    var months = ['M1','M2','M3','M4','M5','M6'];
    new Chart(tsEl.getContext('2d'), {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label: 'Contango (normal)', data: [15.2, 17.4, 19.1, 20.5, 21.8, 22.6],
            borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.07)', borderWidth: 2.5,
            pointRadius: 4, tension: 0.4, fill: true },
          { label: 'Backwardation (estrés)', data: [32.0, 29.5, 27.2, 25.8, 24.5, 23.4],
            borderColor: '#f87171', backgroundColor: 'rgba(248,113,113,0.06)', borderWidth: 2.5,
            borderDash: [6,3], pointRadius: 4, tension: 0.4, fill: true }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { size: 10 } } },
          tooltip: { backgroundColor: '#0d1530', titleColor: '#e2e8f0', bodyColor: '#94a3b8' }
        },
        scales: {
          x: { grid: { color: 'rgba(99,125,200,0.08)' }, ticks: { color: '#475569', font: { size: 10 } } },
          y: { grid: { color: 'rgba(99,125,200,0.08)' }, ticks: { color: '#475569', callback: function(v) { return v.toFixed(0); } } }
        }
      }
    });

    var weeks = ['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10','S11','S12'];
    var ratioVals = [0.84, 0.87, 0.92, 0.88, 0.91, 0.96, 1.08, 1.21, 1.15, 0.99, 0.93, 0.88];
    new Chart(rEl.getContext('2d'), {
      type: 'bar',
      data: {
        labels: weeks,
        datasets: [{
          label: 'Ratio VIX/VIX3M',
          data: ratioVals,
          backgroundColor: ratioVals.map(function(v) { return v >= 1 ? 'rgba(248,113,113,0.6)' : 'rgba(52,211,153,0.6)'; }),
          borderColor: ratioVals.map(function(v) { return v >= 1 ? '#f87171' : '#34d399'; }),
          borderWidth: 1, borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx) { return ' Ratio: ' + ctx.raw.toFixed(2) + ' — ' + (ctx.raw >= 1 ? 'Backwardation' : 'Contango'); }
            }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(99,125,200,0.06)' }, ticks: { color: '#475569', font: { size: 9 } } },
          y: { grid: { color: 'rgba(99,125,200,0.08)' }, ticks: { color: '#475569' }, min: 0.75, max: 1.35 }
        }
      }
    });
  }

  // ══════════════════════════════════════════════
  // 2. ESPEJISMO: Volatility Curve Engine
  // ══════════════════════════════════════════════
  function initEspejismoCurves() {
    var curveMain = document.getElementById('curve-main');
    if (!curveMain) return;

    var W = 800, H = 260, PAD = { l: 60, r: 20, t: 20, b: 30 };
    var chartW = W - PAD.l - PAD.r, chartH = H - PAD.t - PAD.b;
    var MAX_IV = 55, MIN_IV = 5;

    function ivToY(iv) { return PAD.t + chartH - ((iv - MIN_IV) / (MAX_IV - MIN_IV)) * chartH; }
    function xToSVG(x) { return PAD.l + x * chartW; }
    function getSmile(strikeX, shift) {
      shift = shift || 0;
      var center = 0.5, d = strikeX - center;
      return 22 + (-14 * d) + (20 * d * d) + shift;
    }
    function buildPath(points) {
      if (!points.length) return '';
      var d = 'M ' + points[0][0].toFixed(1) + ',' + points[0][1].toFixed(1);
      for (var i = 1; i < points.length; i++) {
        var prev = points[i-1], curr = points[i], cpx = (prev[0] + curr[0]) / 2;
        d += ' C ' + cpx.toFixed(1) + ',' + prev[1].toFixed(1) + ' ' + cpx.toFixed(1) + ',' + curr[1].toFixed(1) + ' ' + curr[0].toFixed(1) + ',' + curr[1].toFixed(1);
      }
      return d;
    }
    function buildArea(points, baseY) {
      if (!points.length) return '';
      var d = buildPath(points);
      d += ' L ' + points[points.length-1][0].toFixed(1) + ',' + baseY + ' L ' + points[0][0].toFixed(1) + ',' + baseY + ' Z';
      return d;
    }
    function renderPoints(shift, xOffset) {
      shift = shift || 0; xOffset = xOffset || 0;
      var pts = [];
      for (var i = 0; i <= 50; i++) {
        var t = i / 50, sv = Math.max(0, Math.min(1, t + xOffset * 0.3));
        var iv = Math.max(MIN_IV + 1, Math.min(MAX_IV - 1, getSmile(sv, shift)));
        pts.push([xToSVG(t), ivToY(iv)]);
      }
      return pts;
    }

    var mode = 'slide', shiftAmount = 0, shiftTarget = 0, pricePos = 0, priceTarget = 0;
    var lastTs = null, ANIM = 2800, slideTimer = null;

    function draw() {
      var mainPts = renderPoints(shiftAmount, pricePos);
      var refPts = renderPoints(0, 0);
      var shiftedPts = renderPoints(shiftAmount, 0);
      var baseY = ivToY(MIN_IV);

      document.getElementById('curve-main').setAttribute('d', buildPath(mainPts));
      document.getElementById('curve-ref').setAttribute('d', buildPath(refPts));
      document.getElementById('area-main').setAttribute('d', buildArea(mainPts, baseY));

      var priceX = xToSVG(0.5 + pricePos * 0.35);
      var pl = document.getElementById('price-line'), plb = document.getElementById('price-label');
      if (pl) { pl.setAttribute('x1', priceX); pl.setAttribute('x2', priceX); }
      if (plb) plb.setAttribute('x', priceX + 4);

      var svgShifted = document.getElementById('curve-shifted'), svgAreaS = document.getElementById('area-shifted');
      var legShifted = document.getElementById('legend-shifted');
      if (mode === 'shift') {
        var alpha = Math.min(1, shiftAmount / 18);
        svgShifted.setAttribute('d', buildPath(shiftedPts));
        svgShifted.setAttribute('stroke', 'rgba(251,146,60,' + (alpha * 0.9) + ')');
        svgAreaS.setAttribute('d', buildArea(shiftedPts, baseY));
        svgAreaS.setAttribute('fill', 'rgba(251,146,60,' + (alpha * 0.06) + ')');
        if (legShifted) legShifted.style.display = 'flex';
      } else {
        svgShifted.setAttribute('stroke', 'rgba(251,146,60,0)');
        svgAreaS.setAttribute('fill', 'rgba(251,146,60,0)');
        if (legShifted) legShifted.style.display = 'none';
      }
    }

    function animate(ts) {
      if (!lastTs) lastTs = ts;
      var dt = ts - lastTs; lastTs = ts;
      var speed = dt / ANIM;
      shiftAmount += (shiftTarget - shiftAmount) * Math.min(speed * 4, 0.06);
      pricePos += (priceTarget - pricePos) * Math.min(speed * 5, 0.08);
      draw();
      requestAnimationFrame(animate);
    }

    window.switchModeEspejismo = function(newMode) {
      mode = newMode;
      var btnSlide = document.getElementById('btn-slide'), btnShift = document.getElementById('btn-shift');
      var label = document.getElementById('chart-mode-label'), annot = document.getElementById('chart-annotation');
      if (newMode === 'slide') {
        if (btnSlide) btnSlide.className = 'vol-toggle-btn vol-toggle-teal';
        if (btnShift) btnShift.className = 'vol-toggle-btn';
        if (label) { label.textContent = 'CURVA SIN CAMBIO DE ESTRUCTURA'; label.className = 'vol-chart-label vol-label-teal'; }
        if (annot) annot.textContent = 'Deslizamiento: el precio se mueve a lo largo de la curva existente. La estructura de volatilidad no cambia.';
        shiftTarget = 0;
        if (slideTimer) clearInterval(slideTimer);
        var t = 0;
        slideTimer = setInterval(function() {
          if (mode !== 'slide') { clearInterval(slideTimer); return; }
          t += 0.02; priceTarget = Math.sin(t) * 0.35;
        }, 60);
      } else {
        if (btnSlide) btnSlide.className = 'vol-toggle-btn';
        if (btnShift) btnShift.className = 'vol-toggle-btn vol-toggle-orange';
        if (label) { label.textContent = 'CURVA CON ELEVACIÓN — DESPLAZAMIENTO REAL'; label.className = 'vol-chart-label vol-label-orange'; }
        if (annot) annot.textContent = 'Desplazamiento: toda la estructura de volatilidad se eleva. Opciones de cobertura se disparan en todos los niveles.';
        shiftTarget = 18; priceTarget = 0;
        if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
      }
    };

    requestAnimationFrame(animate);
    if (slideTimer) clearInterval(slideTimer);
    var t = 0;
    slideTimer = setInterval(function() {
      if (mode !== 'slide') return;
      t += 0.02; priceTarget = Math.sin(t) * 0.35;
    }, 60);

    // VVIX chart paths
    var vixData = [12,13,13,14,12,13,15,14,13,15,17,16,18,17,19,21,20,22,23,25,24,26,28,27,29,32,35,38,34,30,26,24,22,21,20,19,18,17,18,16];
    var vvixData = [18,19,18,19,18,19,20,19,18,20,21,20,22,21,22,22,23,22,23,24,25,26,27,28,29,34,38,40,37,33,29,27,25,24,23,22,20,19,20,18];
    var W2 = 800, H2 = 200, PL = 60, PR = 20, PT = 20, PB = 15;
    var cW = W2 - PL - PR, cH = H2 - PT - PB;
    function v2y(v) { return PT + cH - ((v - 0) / 45) * cH; }
    function i2x(i, n) { return PL + (i / (n-1)) * cW; }
    var n = vixData.length;
    var vixPts = vixData.map(function(v,i){ return [i2x(i,n), v2y(v)]; });
    var vvixPts = vvixData.map(function(v,i){ return [i2x(i,n), v2y(v)]; });
    var vixLine = document.getElementById('vix-line'), vvixLine = document.getElementById('vvix-line');
    if (vixLine) vixLine.setAttribute('d', buildPath(vixPts));
    if (vvixLine) vvixLine.setAttribute('d', buildPath(vvixPts));

    // Hover tooltip: show IV and zone label when mouse is over the main curve chart
    var wrap = document.querySelector('.vol-chart-wrap');
    var tip = document.getElementById('vol-chart-tooltip');
    var svgChart = document.getElementById('vol-chart');
    if (wrap && tip && svgChart) {
      svgChart.addEventListener('mousemove', function(e) {
        var r = svgChart.getBoundingClientRect();
        var scaleX = W / r.width;
        var mx = (e.clientX - r.left) * scaleX;
        var t = (mx - PAD.l) / chartW;
        if (t < 0 || t > 1) {
          tip.style.opacity = 0;
          return;
        }
        var strikeT = Math.max(0, Math.min(1, t + pricePos * 0.3));
        var iv = getSmile(strikeT, shiftAmount);
        var labels = ['Put Lejano', 'Put OTM', 'ATM', 'Call OTM', 'Call Lejano'];
        var label = labels[Math.round(t * 4)];
        tip.innerHTML = '<strong style="color:#2dd4bf">' + label + '</strong><br>IV: <strong>' + Math.round(iv) + '%</strong>';
        tip.style.left = (e.clientX - wrap.getBoundingClientRect().left + 10) + 'px';
        tip.style.top = (e.clientY - wrap.getBoundingClientRect().top - 10) + 'px';
        tip.style.opacity = 1;
      });
      svgChart.addEventListener('mouseleave', function() {
        tip.style.opacity = 0;
      });
    }
  }

  // ══════════════════════════════════════════════
  // 3. MANO INVISIBLE: Flow Cards
  // ══════════════════════════════════════════════
  function initManoInvisibleFlow() {
    var flowGrid = document.getElementById('flow-grid');
    if (!flowGrid) return;

    var scenarios = {
      up: [
        { type: 'Long Put ITM', action: 'sell', label: 'El Dealer VENDE', description: 'La vol sube → Delta más negativo → el dealer <strong>vende acciones</strong> para cubrir. Genera presión bajista adicional.', deltaPct: 80, deltaDir: 'neg', curve: [[0,60],[1,55],[2,48],[3,38],[4,25],[5,15],[6,10]], fill: 'left' },
        { type: 'Short Put OTM', action: 'buy', label: 'El Dealer COMPRA', description: 'La vol sube → Delta más negativo en posición corta → dealer <strong>compra acciones</strong> para neutralizar. Crea soporte mecánico.', deltaPct: 55, deltaDir: 'pos', curve: [[0,10],[1,12],[2,16],[3,22],[4,32],[5,45],[6,58]], fill: 'right' },
        { type: 'Long Call OTM', action: 'sell', label: 'El Dealer VENDE', description: 'La vol sube → Delta de Calls OTM crece → dealer debe <strong>vender acciones</strong>. Techo mecánico.', deltaPct: 40, deltaDir: 'neg', curve: [[0,10],[1,12],[2,15],[3,20],[4,28],[5,38],[6,50]], fill: 'right' },
        { type: 'Short Call ITM', action: 'buy', label: 'El Dealer COMPRA', description: 'La vol sube → Delta de Call ITM en corto → el dealer <strong>compra acciones</strong> para cubrir.', deltaPct: 70, deltaDir: 'pos', curve: [[0,55],[1,50],[2,42],[3,32],[4,22],[5,15],[6,10]], fill: 'left' }
      ],
      down: [
        { type: 'Long OTM Call', action: 'sell', label: 'El Dealer VENDE', description: 'Vol baja → Delta de Call OTM disminuye → el dealer <strong>vende acciones</strong> para cubrir.', deltaPct: 65, deltaDir: 'neg', curve: [[0,10],[1,12],[2,15],[3,20],[4,28],[5,38],[6,50]], fill: 'right' },
        { type: 'Short OTM Call', action: 'buy', label: 'El Dealer COMPRA', description: 'Vol baja → dealer <strong>compra acciones</strong>. Vol Crush genera impulso alcista mecánico.', deltaPct: 75, deltaDir: 'pos', curve: [[0,10],[1,12],[2,15],[3,20],[4,28],[5,38],[6,50]], fill: 'right' },
        { type: 'Long ITM Call', action: 'buy', label: 'El Dealer COMPRA', description: 'Vol baja → Delta incrementa en Call ITM largo → dealer <strong>compra acciones</strong> adicionales.', deltaPct: 85, deltaDir: 'pos', curve: [[0,60],[1,55],[2,48],[3,38],[4,25],[5,15],[6,10]], fill: 'left' },
        { type: 'Short ITM Call', action: 'sell', label: 'El Dealer VENDE', description: 'Vol baja → Delta aumenta en Call ITM corto → el dealer <strong>vende acciones</strong>. Resistencia mecánica.', deltaPct: 60, deltaDir: 'neg', curve: [[0,55],[1,50],[2,42],[3,32],[4,22],[5,15],[6,10]], fill: 'left' }
      ]
    };

    function makeMiniChart(pts, fill, action) {
      var W = 200, H = 60;
      var xs = pts.map(function(p){ return p[0]; }), ys = pts.map(function(p){ return p[1]; });
      var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
      var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
      var pad = 6;
      function tx(x){ return pad + (x-minX)/(maxX-minX)*(W-2*pad); }
      function ty(y){ return H-pad - (y-minY)/(maxY-minY)*(H-2*pad); }
      var color = action === 'sell' ? '#f87171' : '#4ade80';
      var pathD = pts.map(function(p,i){ return (i===0?'M':'L')+tx(p[0]).toFixed(1)+','+ty(p[1]).toFixed(1); }).join(' ');
      var lastPt = pts[pts.length-1], firstPt = pts[0], baseY = H - pad;
      var areaClose = fill === 'right' ? ' L'+tx(lastPt[0]).toFixed(1)+','+baseY+' L'+tx(firstPt[0]).toFixed(1)+','+baseY+' Z' : ' L'+tx(lastPt[0]).toFixed(1)+','+baseY+' L'+tx(firstPt[0]).toFixed(1)+','+baseY+' Z';
      return '<svg viewBox="0 0 '+W+' '+H+'" class="flow-mini-chart"><path d="'+pathD+areaClose+'" fill="'+color+'" fill-opacity="0.12"/><path d="'+pathD+'" stroke="'+color+'" stroke-width="2" fill="none"/></svg>';
    }

    window.setScenarioDealer = function(mode) {
      var tabUp = document.getElementById('tab-up'), tabDown = document.getElementById('tab-down');
      if (mode === 'up') {
        if (tabUp) tabUp.className = 'vol-tab-btn vol-tab-up';
        if (tabDown) tabDown.className = 'vol-tab-btn';
      } else {
        if (tabUp) tabUp.className = 'vol-tab-btn';
        if (tabDown) tabDown.className = 'vol-tab-btn vol-tab-down';
      }
      var cards = scenarios[mode];
      flowGrid.innerHTML = '';
      cards.forEach(function(card, i) {
        var isSell = card.action === 'sell';
        var el = document.createElement('div');
        el.className = 'vol-flow-card';
        el.innerHTML = '<div class="vol-flow-header"><span class="vol-flow-badge '+(isSell?'vol-badge-sell':'vol-badge-buy')+'">'+card.label+'</span><span class="vol-flow-type">'+card.type+'</span></div>'+
          '<div class="vol-flow-body">'+makeMiniChart(card.curve, card.fill, card.action)+
          '<p class="vol-flow-desc">'+card.description+'</p>'+
          '<div class="vol-delta-meter"><span>Delta '+(card.deltaDir==='neg'?'−':'+')+'</span><div class="vol-delta-track"><div class="vol-delta-fill '+(card.deltaDir==='neg'?'neg':'pos')+'" style="width:'+card.deltaPct+'%"></div></div></div></div>';
        flowGrid.appendChild(el);
      });
    };

    window.setScenarioDealer('up');
  }
})();
