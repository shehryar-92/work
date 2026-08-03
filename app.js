const form = document.getElementById("calc-form");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const summaryEl = document.getElementById("summary");
const themeCheckbox = document.getElementById("theme-checkbox");

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function readInputs() {
  return {
    principal: Number(document.getElementById("principal").value) || 0,
    monthlyContribution: Number(document.getElementById("contribution").value) || 0,
    annualRate: Number(document.getElementById("rate").value) || 0,
    years: Math.max(1, Number(document.getElementById("years").value) || 1),
  };
}

function drawChart(data) {
  const styles = getComputedStyle(document.documentElement);
  const colorAccent = styles.getPropertyValue("--accent").trim();
  const colorContributed = styles.getPropertyValue("--contributed").trim();
  const colorBorder = styles.getPropertyValue("--border").trim();
  const colorMuted = styles.getPropertyValue("--text-muted").trim();

  const { width, height } = canvas;
  const padding = { top: 20, right: 20, bottom: 30, left: 65 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);

  const maxBalance = Math.max(...data.map((d) => d.balance));
  const maxYear = data[data.length - 1].year;

  const x = (year) => padding.left + (year / maxYear) * plotW;
  const y = (value) => padding.top + plotH - (value / maxBalance) * plotH;

  // gridlines + y-axis labels
  ctx.strokeStyle = colorBorder;
  ctx.fillStyle = colorMuted;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  const gridLines = 4;
  for (let i = 0; i <= gridLines; i++) {
    const value = (maxBalance / gridLines) * i;
    const yy = y(value);
    ctx.beginPath();
    ctx.moveTo(padding.left, yy);
    ctx.lineTo(width - padding.right, yy);
    ctx.stroke();
    ctx.fillText(currency(value), padding.left - 10, yy + 4);
  }

  // x-axis year labels
  ctx.textAlign = "center";
  const yearStep = Math.ceil(maxYear / 6) || 1;
  for (let year = 0; year <= maxYear; year += yearStep) {
    ctx.fillText(`Y${year}`, x(year), height - padding.bottom + 18);
  }

  const drawLine = (key, color, dashed) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash(dashed ? [5, 4] : []);
    data.forEach((d, i) => {
      const px = x(d.year);
      const py = y(d[key]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };

  drawLine("contributed", colorContributed, true);
  drawLine("balance", colorAccent, false);
}

function renderSummary(data) {
  const last = data[data.length - 1];
  summaryEl.innerHTML = `
    <div class="stat">
      <div class="label">Final balance</div>
      <div class="value">${currency(last.balance)}</div>
    </div>
    <div class="stat">
      <div class="label">Total contributed</div>
      <div class="value">${currency(last.contributed)}</div>
    </div>
    <div class="stat">
      <div class="label">Interest earned</div>
      <div class="value">${currency(last.interest)}</div>
    </div>
  `;
}

function update() {
  const data = compoundGrowth(readInputs());
  drawChart(data);
  renderSummary(data);
}

form.addEventListener("input", update);

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeCheckbox.checked = true;
}

themeCheckbox.addEventListener("change", () => {
  const isDark = themeCheckbox.checked;
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  update();
});

update();

