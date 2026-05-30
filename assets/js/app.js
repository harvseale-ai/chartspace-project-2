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

  const datasets = {
    finance: {
      chartTitle: "Finance Chart",
      chartSubtitle: "Monthly policy activity by sector",
      tableTitle: "Finance events",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      seriesLight: [12, 18, 15, 26, 23, 12],
      seriesDark: [8, 11, 5, 9, 6, 3],
      activeIndex: 3,
      description: `
        <div class="panel-section">
          <strong>Data Overview</strong>
          <p>
            Source: Skills Monitor<br />
            Data Type: Monthly aggregated records<br />
            Last Updated: 12 Sep 2025
          </p>
        </div>

        <div class="panel-section">
          <strong>Transformation</strong>
          <p>
            Raw data is grouped by month and normalised<br />
            Duplicate entries are removed<br />
            Values are averaged across reporting periods
          </p>
        </div>

        <div class="panel-section">
          <strong>Chart Details</strong>
          <p>
            Type: Line chart (dual series)<br />
            Focus: Trend of key performance metric<br />
            Highlight: Peak activity in April
          </p>
        </div>

        <div class="panel-section">
          <strong>Insights</strong>
          <p>
            Steady growth observed from Jan → Apr<br />
            Slight decline in May<br />
            Recovery begins in June
          </p>
        </div>
      `,
      outcome: `
        <div class="panel-section">
          <strong>Table Mapping</strong>
          <p>
            User actions are logged and fed back into the system
          </p>
        </div>

        <div class="panel-section">
          <strong>Notes</strong>
          <p>
            Data is refreshed weekly<br />
            Minor delays may occur during ingestion<br />
            Outliers are not removed in this view
          </p>
        </div>
      `,
      rows: [
        [
          "Review",
          "Skills and Post-16 Education Reform",
          "Mention",
          "12 Sep 2025",
          "High",
          "Skills Monitor",
          true
        ],
        [
          "Ignore",
          "NHS Workforce Planning Update",
          "Updated",
          "10 Sep 2025",
          "Medium",
          "Health Monitor",
          false
        ],
        [
          "Ignore",
          "Regional Investment Programme",
          "New",
          "09 Sep 2025",
          "Low",
          "Policy Tracker",
          false
        ],
        [
          "Review",
          "Department Funding Allocation Review",
          "Updated",
          "08 Sep 2025",
          "Medium",
          "Finance Monitor",
          false
        ],
        [
          "Ignore",
          "Education Standards Consultation",
          "New",
          "07 Sep 2025",
          "Low",
          "Skills Monitor",
          false
        ],
        [
          "Review",
          "Public Sector Hiring Freeze Proposal",
          "Mention",
          "06 Sep 2025",
          "High",
          "Policy Tracker",
          false
        ],
        [
          "Ignore",
          "Transport Infrastructure Bill Update",
          "Updated",
          "05 Sep 2025",
          "Medium",
          "Bill Monitor",
          false
        ]
      ]
    },

    healthcare: {
      chartTitle: "Healthcare Chart",
      chartSubtitle: "Monthly healthcare status overview",
      tableTitle: "Healthcare events",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      seriesLight: [10, 14, 19, 22, 18, 13],
      seriesDark: [7, 8, 6, 11, 9, 5],
      activeIndex: 3,
      description: `
        <div class="panel-section">
          <strong>Data Overview</strong>
          <p>
            Healthcare monitoring activity by month<br />
            Monthly status grouping across tracked records
          </p>
        </div>

        <div class="panel-section">
          <strong>Focus</strong>
          <p>
            Tracks healthcare activity trends<br />
            Highlights system pressure and service updates
          </p>
        </div>
      `,
      outcome: `
        <div class="panel-section">
          <strong>Outcome</strong>
          <p>
            Critical healthcare changes are escalated for action
          </p>
        </div>
      `,
      rows: [
        [
          "Review",
          "Healthcare Capacity Expansion",
          "New",
          "25 Aug 2025",
          "High",
          "Health Monitor",
          true
        ],
        [
          "Ignore",
          "NHS Staffing Pipeline",
          "Mention",
          "23 Aug 2025",
          "Medium",
          "Health Monitor",
          false
        ],
        [
          "Review",
          "Mental Health Access Review",
          "Updated",
          "21 Aug 2025",
          "High",
          "Policy Tracker",
          false
        ],
        [
          "Ignore",
          "Primary Care Funding Note",
          "New",
          "20 Aug 2025",
          "Low",
          "Finance Monitor",
          false
        ],
        [
          "Review",
          "Emergency Services Performance",
          "Updated",
          "18 Aug 2025",
          "Medium",
          "Health Monitor",
          false
        ]
      ]
    },

    education: {
      chartTitle: "Education Chart",
      chartSubtitle: "Education activity and policy monitoring",
      tableTitle: "Education events",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      seriesLight: [14, 16, 20, 24, 21, 17],
      seriesDark: [6, 9, 7, 10, 8, 5],
      activeIndex: 3,
      description: `
        <div class="panel-section">
          <strong>Data Overview</strong>
          <p>
            Education policy and reform tracking<br />
            Monthly grouped activity view
          </p>
        </div>
      `,
      outcome: `
        <div class="panel-section">
          <strong>Outcome</strong>
          <p>
            Key education changes are sent for triage and follow-up
          </p>
        </div>
      `,
      rows: [
        [
          "Review",
          "Higher Education Funding Reform",
          "Updated",
          "04 Sep 2025",
          "High",
          "Skills Monitor",
          true
        ],
        [
          "Ignore",
          "Apprenticeship Standards Review",
          "Mention",
          "03 Sep 2025",
          "Medium",
          "Skills Monitor",
          false
        ],
        [
          "Review",
          "School Funding Allocation",
          "New",
          "02 Sep 2025",
          "High",
          "Finance Monitor",
          false
        ],
        [
          "Ignore",
          "Teacher Workforce Strategy",
          "Updated",
          "01 Sep 2025",
          "Medium",
          "Policy Tracker",
          false
        ],
        [
          "Review",
          "Curriculum Reform Proposal",
          "New",
          "31 Aug 2025",
          "Low",
          "Skills Monitor",
          false
        ]
      ]
    }
  };

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
