// charts.js — small canvas charts, drawn by hand, no library.
// One job: turn a list of category totals into a donut and a set of bars
// that still read clearly when the screenshot is shrunk.

export function drawDonut(canvas, slices) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const outer = Math.min(width, height) / 2 - 6;
  const inner = outer * 0.58;
  ctx.clearRect(0, 0, width, height);
  const total = slices.reduce((sum, s) => sum + s.amount, 0);
  if (total <= 0) {
    ctx.fillStyle = '#8a8d91';
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    return;
  }
  let angle = -Math.PI / 2;
  for (const slice of slices) {
    const sweep = (slice.amount / total) * Math.PI * 2;
    ctx.fillStyle = slice.color || '#8a8d91';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.closePath();
    ctx.fill();
    angle += sweep;
  }
  ctx.fillStyle = '#fffdf8';
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22301f';
  ctx.font = '700 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Spent', cx, cy - 10);
  ctx.font = '700 17px system-ui, sans-serif';
  ctx.fillText('$' + Math.round(total).toLocaleString('en-US'), cx, cy + 11);
}

export function drawBars(canvas, bars) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const max = Math.max(...bars.map((b) => b.value), 1);
  const rowH = height / Math.max(bars.length, 1);
  const labelW = 92;
  const valueW = 58;
  const barX = labelW;
  const barW = width - labelW - valueW - 8;
  ctx.font = '13px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  bars.forEach((bar, i) => {
    const y = i * rowH;
    const midY = y + rowH / 2;
    ctx.fillStyle = '#22301f';
    ctx.textAlign = 'right';
    ctx.fillText(bar.label, labelW - 8, midY);
    const w = Math.max(2, (bar.value / max) * barW);
    ctx.fillStyle = bar.color || '#2f6f4f';
    const bh = Math.min(18, rowH - 12);
    ctx.beginPath();
    ctx.roundRect(barX, midY - bh / 2, w, bh, 5);
    ctx.fill();
    ctx.fillStyle = '#5a6058';
    ctx.textAlign = 'left';
    ctx.fillText('$' + Math.round(bar.value), barX + w + 6, midY);
  });
}
