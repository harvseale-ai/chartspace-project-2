const svg = document.getElementById("chartSvg");
const SVG_NS = "http://www.w3.org/2000/svg";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const yTicks = [50, 40, 30, 20, 10, 0];

const seriesLight = [12, 18, 15, 26, 23, 12];
const seriesDark = [8, 11, 5, 9, 6, 3];
const activeIndex = 3;

// full svg size
const W = 760;
const H = 420;

// plot area
const plot = {
  left: 90,
  right: 700,
  top: 40,
  bottom: 320
};

function el(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

function scaleX(index) {
  const step = (plot.right - plot.left) / (months.length - 1);
  return plot.left + step * index;
}

function scaleY(value) {
  const min = 0;
  const max = 50;
  return plot.bottom - ((value - min) / (max - min)) * (plot.bottom - plot.top);
}

function drawGrid() {
  yTicks.forEach((tick) => {
    const y = scaleY(tick);

    svg.appendChild(
      el("line", {
        x1: plot.left,
        y1: y,
        x2: plot.right,
        y2: y,
        class: tick === 0 ? "axis-line" : "grid-line"
      })
    );

    svg.appendChild(
      el("text", {
        x: plot.left - 45,
        y: y + 6,
        class: "axis-label"
      })
    ).appendChild(document.createTextNode(String(tick)));
  });
}

function drawMonths() {
  months.forEach((month, index) => {
    const x = scaleX(index);

    svg.appendChild(
      el("text", {
        x,
        y: 388,
        class: "month-label"
      })
    ).appendChild(document.createTextNode(month));
  });
}

function drawFocusLine() {
  const x = scaleX(activeIndex);

  svg.appendChild(
    el("line", {
      x1: x,
      y1: plot.top,
      x2: x,
      y2: plot.bottom,
      class: "focus-line"
    })
  );
}

function drawSeries(data, lineClass, pointClass, active = false) {
  const points = data
    .map((value, index) => `${scaleX(index)},${scaleY(value)}`)
    .join(" ");

  svg.appendChild(
    el("polyline", {
      points,
      class: lineClass
    })
  );

  data.forEach((value, index) => {
    svg.appendChild(
      el("circle", {
        cx: scaleX(index),
        cy: scaleY(value),
        r: active && index === activeIndex ? 10 : 7,
        class: active && index === activeIndex ? "point-active" : pointClass
      })
    );
  });
}

function renderChart() {
  svg.innerHTML = "";
  drawGrid();
  drawFocusLine();
  drawSeries(seriesLight, "line-light", "point-light", true);
  drawSeries(seriesDark, "line-dark", "point-dark");
  drawMonths();
}

renderChart();


const menuToggle = document.getElementById("menuToggle");
const userToggle = document.getElementById("userToggle");
const floatingMenu = document.getElementById("floatingMenu");
const floatingUserPanel = document.getElementById("floatingUserPanel");

menuToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  floatingMenu.classList.toggle("open");
});

userToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  floatingUserPanel.classList.toggle("open");
});

floatingMenu.addEventListener("click", (event) => {
  event.stopPropagation();
});

floatingUserPanel.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", () => {
  floatingMenu.classList.remove("open");
  floatingUserPanel.classList.remove("open");
});