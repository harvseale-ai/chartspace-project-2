document.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("chartSvg");
  const SVG_NS = "http://www.w3.org/2000/svg";

  const menuToggle = document.getElementById("menuToggle");
  const userToggle = document.getElementById("userToggle");
  const floatingMenu = document.getElementById("floatingMenu");
  const floatingUserPanel = document.getElementById("floatingUserPanel");

  const chartInfoToggle = document.getElementById("chartInfoToggle");
  const chartZone = document.getElementById("chartZone");
  const openAllToggle = document.getElementById("openAllToggle");

  const navCharts = document.getElementById("navCharts");
  const navDataOptions = document.getElementById("navDataOptions");

  const sectionCharts = document.getElementById("sectionCharts");
  const sectionDataOptions = document.getElementById("sectionDataOptions");

  const chartTitle = document.querySelector(".card-title-block h2");
  const chartSubtitle = document.querySelector(".card-title-block p");

  const leftPanelContent = document.querySelector(".chart-side-panel-left .side-panel-content");
  const rightPanelContent = document.querySelector(".chart-side-panel-right .side-panel-content");

  const descriptionPanel = document.getElementById("descriptionPanel");
  const summaryPanel = document.getElementById("summaryPanel");
  const outcomePanel = document.getElementById("outcomePanel");
  const recommendedActionPanel = document.getElementById("recommendedActionPanel");

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");

  const tableDateRangeBtn = document.getElementById("tableDateRangeBtn");
  const tableDateFilterPanel = document.getElementById("tableDateFilterPanel");
  const tableDateFilterClose = document.getElementById("tableDateFilterClose");
  const tableApplyDateFilter = document.getElementById("tableApplyDateFilter");


  const userPageBtn = document.getElementById("userPageBtn");
  const exportBtn = document.getElementById("exportBtn");
  const exportCount = document.getElementById("exportCount");

  const tableTitle = document.getElementById("tableTitle");
  const tableRows = document.getElementById("tableRows");
  const datasetButtons = document.querySelectorAll(".dataset-btn");

  const yTicks = [50, 40, 30, 20, 10, 0];

  const plot = {
    left: 90,
    right: 700,
    top: 40,
    bottom: 320
  };

  const datasets = window.chartspaceDatasets || {};

  function createSvgEl(tag, attrs = {}) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
    return node;
  }

  function scaleX(index, labels) {
    const step = (plot.right - plot.left) / (labels.length - 1);
    return plot.left + step * index;
  }

  function scaleY(value) {
    const min = 0;
    const max = 50;
    return plot.bottom - ((value - min) / (max - min)) * (plot.bottom - plot.top);
  }

  function drawGrid() {
    if (!svg) return;

    yTicks.forEach((tick) => {
      const y = scaleY(tick);

      svg.appendChild(
        createSvgEl("line", {
          x1: plot.left,
          y1: y,
          x2: plot.right,
          y2: y,
          class: tick === 0 ? "axis-line" : "grid-line"
        })
      );

      const label = createSvgEl("text", {
        x: plot.left - 45,
        y: y + 6,
        class: "axis-label"
      });

      label.textContent = String(tick);
      svg.appendChild(label);
    });
  }

  function drawMonths(labels) {
    if (!svg) return;

    labels.forEach((labelText, index) => {
      const x = scaleX(index, labels);

      const label = createSvgEl("text", {
        x,
        y: 388,
        class: "month-label"
      });

      label.textContent = labelText;
      svg.appendChild(label);
    });
  }

  function drawFocusLine(labels, activeIndex) {
    if (!svg) return;

    const x = scaleX(activeIndex, labels);

    svg.appendChild(
      createSvgEl("line", {
        x1: x,
        y1: plot.top,
        x2: x,
        y2: plot.bottom,
        class: "focus-line"
      })
    );
  }

  function drawSeries(labels, seriesData, activeIndex, lineClass, pointClass, active = false) {
    if (!svg) return;

    const points = seriesData
      .map((value, index) => `${scaleX(index, labels)},${scaleY(value)}`)
      .join(" ");

    svg.appendChild(
      createSvgEl("polyline", {
        points,
        class: lineClass
      })
    );

    seriesData.forEach((value, index) => {
      svg.appendChild(
        createSvgEl("circle", {
          cx: scaleX(index, labels),
          cy: scaleY(value),
          r: active && index === activeIndex ? 10 : 7,
          class: active && index === activeIndex ? "point-active" : pointClass
        })
      );
    });
  }

  function renderChart(data) {
    if (!svg) return;

    svg.innerHTML = "";
    drawGrid();
    drawFocusLine(data.months, data.activeIndex);
    drawSeries(data.months, data.seriesLight, data.activeIndex, "line-light", "point-light", true);
    drawSeries(data.months, data.seriesDark, data.activeIndex, "line-dark", "point-dark");
    drawMonths(data.months);
  }

  function getStatusClass(action) {
  if (action === "Critical") return "critical";
  if (action === "Ignore") return "muted";
  return "";
  }

  function renderTableRows(rows) {
    if (!tableRows) return;

    tableRows.innerHTML = "";

    rows.forEach(([action, entity, changeType, detectedDate, confidence, source, checked]) => {
      const row = document.createElement("div");
      row.className = "table-row row";

      row.innerHTML = `
        <div class="action-cell">
          <button class="row-toggle ${checked ? "checked" : ""}" type="button" aria-label="Toggle row action">
            <span></span>
          </button>

            <div class="status-wrap">
              <button class="status-pill ${getStatusClass(action)}" type="button">
                ${action} <span>⌄</span>
              </button>

              <div class="status-menu">
                <button type="button" data-status="Review">Review</button>
                <button type="button" data-status="Critical">Critical</button>
                <button type="button" data-status="Ignore">Ignore</button>
              </div>
            </div>
        </div>

        <div class="truncate-cell" data-full="${entity}">
          <span class="truncate-text">${entity}</span>
        </div>

        <div>${changeType}</div>
        <div>${detectedDate}</div>
        <div>${confidence}</div>

        <div class="truncate-cell" data-full="${source}">
          <span class="truncate-text">${source}</span>
        </div>
      `;

      tableRows.appendChild(row);
    });

    updateExportCount();
  }

  function updateExportCount() {
    if (!exportCount) return;

    const checkedRows = document.querySelectorAll(".row-toggle.checked");
    const count = checkedRows.length;

    exportCount.textContent = count;
    exportCount.style.display = count > 0 ? "block" : "none";
  }

  function getCheckedRowData() {
    const checkedRows = document.querySelectorAll(".row-toggle.checked");

    return Array.from(checkedRows).map((toggle) => {
      const row = toggle.closest(".table-row");
      const cells = row.querySelectorAll(":scope > div");
      const statusPill = row.querySelector(".status-pill");

      return {
        action: statusPill.textContent.replace("⌄", "").trim(),
        entity: cells[1].textContent.trim(),
        changeType: cells[2].textContent.trim(),
        detectedDate: cells[3].textContent.trim(),
        confidence: cells[4].textContent.trim(),
        source: cells[5].textContent.trim()
      };
    });
  }

  function downloadCSV(rows) {
    if (rows.length === 0) return;

    const headers = ["Action", "Entity", "Change Type", "Detected Date", "Confidence", "Source"];

    const csvRows = [
      headers.join(","),
      ...rows.map((row) => [
        row.action,
        row.entity,
        row.changeType,
        row.detectedDate,
        row.confidence,
        row.source
      ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "chartspace-export.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  if (tableRows) {
    tableRows.addEventListener("click", (event) => {
      const statusPill = event.target.closest(".status-pill");
      const statusOption = event.target.closest(".status-menu button");
      const toggle = event.target.closest(".row-toggle");
      const clickedRow = event.target.closest(".table-row");

      if (clickedRow) {
        tableRows.querySelectorAll(".table-row").forEach((row) => {
          row.classList.remove("active");
        });

        clickedRow.classList.add("active");
      }

      if (toggle) {
        toggle.classList.toggle("checked");
        updateExportCount();
        return;
      }

      if (statusPill) {
        const statusWrap = statusPill.closest(".status-wrap");

        document.querySelectorAll(".status-wrap.open").forEach((wrap) => {
          if (wrap !== statusWrap) {
            wrap.classList.remove("open");
          }
        });

        statusWrap.classList.toggle("open");
        return;
      }

      if (statusOption) {
        const newStatus = statusOption.dataset.status;
        const statusWrap = statusOption.closest(".status-wrap");
        const pill = statusWrap.querySelector(".status-pill");

        pill.classList.remove("critical", "muted");

        if (newStatus === "Critical") {
          pill.classList.add("critical");
        }

        if (newStatus === "Ignore") {
          pill.classList.add("muted");
        }

        pill.innerHTML = `${newStatus} <span>⌄</span>`;
        statusWrap.classList.remove("open");
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".status-wrap")) {
      document.querySelectorAll(".status-wrap.open").forEach((wrap) => {
        wrap.classList.remove("open");
      });
    }
  });

  function renderDataset(datasetKey) {
    const data = datasets[datasetKey];
    if (!data) return;

    if (chartTitle) chartTitle.textContent = data.chartTitle;
    if (chartSubtitle) chartSubtitle.textContent = data.chartSubtitle;
    if (leftPanelContent) leftPanelContent.innerHTML = data.description;
    if (rightPanelContent) rightPanelContent.innerHTML = data.outcome;

    if (tableTitle) {
      tableTitle.innerHTML = `${data.tableTitle} <span>(${data.rows.length})</span>`;
    }

    renderChart(data);
    renderTableRows(data.rows);

    datasetButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.dataset === datasetKey);
    });
  }

  function closeFloatingPanels() {
  if (floatingMenu) floatingMenu.classList.remove("open");
  if (floatingUserPanel) floatingUserPanel.classList.remove("open");
  if (tableDateFilterPanel) tableDateFilterPanel.classList.remove("open");
  }

  if (menuToggle && floatingMenu) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      floatingMenu.classList.toggle("open");
    });
  }

  if (userToggle && floatingUserPanel) {
    userToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      floatingUserPanel.classList.toggle("open");
    });
  }

  if (floatingMenu) {
    floatingMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  if (floatingUserPanel) {
    floatingUserPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  document.addEventListener("click", () => {
    closeFloatingPanels();
  });

  if (chartInfoToggle && chartZone) {
    chartInfoToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      chartZone.classList.toggle("show-info");
    });
  }

  if (openAllToggle && chartZone && floatingMenu && floatingUserPanel) {
    openAllToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const everythingOpen =
        chartZone.classList.contains("show-info") &&
        floatingMenu.classList.contains("open") &&
        floatingUserPanel.classList.contains("open");

      if (everythingOpen) {
        chartZone.classList.remove("show-info");
        floatingMenu.classList.remove("open");
        floatingUserPanel.classList.remove("open");
      } else {
        chartZone.classList.add("show-info");
        floatingMenu.classList.add("open");
        floatingUserPanel.classList.add("open");
      }
    });
  }

  if (navCharts && sectionCharts && floatingMenu) {
    navCharts.addEventListener("click", (event) => {
      event.stopPropagation();

      sectionCharts.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      floatingMenu.classList.remove("open");
    });
  }

  if (navDataOptions && sectionDataOptions && floatingMenu && chartZone) {
    navDataOptions.addEventListener("click", (event) => {
      event.stopPropagation();

      sectionDataOptions.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      floatingMenu.classList.remove("open");
      chartZone.classList.remove("show-info");
    });
  }

  if (userPageBtn) {
    userPageBtn.addEventListener("click", () => {
      console.log("Go to user page");
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const rows = getCheckedRowData();
      downloadCSV(rows);
    });
  }

  if (descriptionPanel) {
  descriptionPanel.addEventListener("click", (event) => {
    event.stopPropagation();
    descriptionPanel.classList.toggle("expanded");
  });
}

if (summaryPanel) {
  summaryPanel.addEventListener("click", (event) => {
    event.stopPropagation();
    summaryPanel.classList.toggle("expanded");
  });
}

if (outcomePanel) {
  outcomePanel.addEventListener("click", (event) => {
    event.stopPropagation();
    outcomePanel.classList.toggle("expanded");
  });
}

if (recommendedActionPanel) {
  recommendedActionPanel.addEventListener("click", (event) => {
    event.stopPropagation();
    recommendedActionPanel.classList.toggle("expanded");
  });
}

  if (yesBtn && noBtn) {
    yesBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      yesBtn.classList.toggle("active");
      noBtn.classList.remove("active");
    });

    noBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      noBtn.classList.toggle("active");
      yesBtn.classList.remove("active");
    });
  }

    if (tableDateRangeBtn && tableDateFilterPanel) {
    tableDateRangeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      tableDateFilterPanel.classList.toggle("open");
    });
  }

  if (tableDateFilterClose && tableDateFilterPanel) {
    tableDateFilterClose.addEventListener("click", (event) => {
      event.stopPropagation();
      tableDateFilterPanel.classList.remove("open");
    });
  }

  if (tableApplyDateFilter && tableDateFilterPanel && tableDateRangeBtn) {
    tableApplyDateFilter.addEventListener("click", (event) => {
      event.stopPropagation();

      const selectedRange = document.querySelector(
        'input[name="tableDateRange"]:checked'
      );

      if (selectedRange) {
        tableDateRangeBtn.textContent = `Last ${selectedRange.value}`;
      }

      tableDateFilterPanel.classList.remove("open");
    });
  }

  if (tableDateFilterPanel) {
    tableDateFilterPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  datasetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      renderDataset(btn.dataset.dataset);
    });
  });

  renderDataset("finance");
});

const actionColumnToggle = document.getElementById("actionColumnToggle");
const tablePanel = document.querySelector(".table-panel");    

if (actionColumnToggle && tablePanel) {
  actionColumnToggle.addEventListener("click", () => {
    tablePanel.classList.toggle("actions-collapsed");
    const isCollapsed = tablePanel.classList.contains("actions-collapsed");
    actionColumnToggle.textContent = isCollapsed ? "Actions" : "Edit mode";
  });

}
