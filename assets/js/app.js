/* WHY: Waits until the HTML exists before selecting page elements and attaching events. */
document.addEventListener("DOMContentLoaded", () => {
  /* WHY: Stores the chart SVG so the app can draw and redraw the graph in one place. */
  const svg = document.getElementById("chartSvg");
  /* WHY: Keeps the SVG namespace in one constant so created chart elements render correctly. */
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* WHY: Finds the main menu controls so the navigation panel can open and close. */
  const menuToggle = document.getElementById("menuToggle");
  const userToggle = document.getElementById("userToggle");
  const floatingMenu = document.getElementById("floatingMenu");
  const floatingUserPanel = document.getElementById("floatingUserPanel");

  /* WHY: Finds chart panel controls so users can reveal extra chart information. */
  const chartInfoToggle = document.getElementById("chartInfoToggle");
  const chartZone = document.getElementById("chartZone");
  const openAllToggle = document.getElementById("openAllToggle");

  /* WHY: Finds menu navigation items so clicks can scroll to the correct page section. */
  const navCharts = document.getElementById("navCharts");
  const navDataOptions = document.getElementById("navDataOptions");

  /* WHY: Stores page sections as scroll targets for the floating navigation menu. */
  const sectionCharts = document.getElementById("sectionCharts");
  const sectionDataOptions = document.getElementById("sectionDataOptions");

  /* WHY: Stores the chart title text nodes so dataset changes can update the heading. */
  const chartTitle = document.querySelector(".card-title-block h2");
  const chartSubtitle = document.querySelector(".card-title-block p");

  /* WHY: Stores side panel content areas so each dataset can show matching context. */
  const leftPanelContent = document.querySelector(".chart-side-panel-left .side-panel-content");
  const rightPanelContent = document.querySelector(".chart-side-panel-right .side-panel-content");

  /* WHY: Finds all expandable panels so each one can be opened independently. */
  const descriptionPanel = document.getElementById("descriptionPanel");
  const summaryPanel = document.getElementById("summaryPanel");
  const outcomePanel = document.getElementById("outcomePanel");
  const recommendedActionPanel = document.getElementById("recommendedActionPanel");

  /* WHY: Keeps old feedback controls safe if they exist in the page in future versions. */
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");

  /* WHY: Finds the table date filter controls so the selected range can be shown to users. */
  const tableDateRangeBtn = document.getElementById("tableDateRangeBtn");
  const tableDateFilterPanel = document.getElementById("tableDateFilterPanel");
  const tableDateFilterClose = document.getElementById("tableDateFilterClose");
  const tableApplyDateFilter = document.getElementById("tableApplyDateFilter");


  /* WHY: Finds user, export, and table elements used by the dashboard interactions. */
  const userPageBtn = document.getElementById("userPageBtn");
  /* WHY: Finds the weather popup so the open-all control can show or hide it with the panels. */
  const weatherPopup = document.getElementById("weatherPopup");
  const exportBtn = document.getElementById("exportBtn");
  const exportCount = document.getElementById("exportCount");

  /* WHY: Stores table controls so rows and dataset buttons can be updated dynamically. */
  const tableTitle = document.getElementById("tableTitle");
  const tableRows = document.getElementById("tableRows");
  const datasetButtons = document.querySelectorAll(".dataset-btn");

  /* WHY: Defines the y-axis values shown on the chart grid. */
  const yTicks = [50, 40, 30, 20, 10, 0];

  /* WHY: Defines the chart drawing area so every chart element uses the same spacing. */
  const plot = {
    left: 90,
    right: 700,
    top: 40,
    bottom: 320
  };

  /* WHY: Reads the centralised dataset file while keeping the app safe if it fails to load. */
  const datasets = window.chartspaceDatasets || {};

  /* WHY: Creates SVG elements with attributes so chart drawing code stays reusable. */
  function createSvgEl(tag, attrs = {}) {
    /* WHY: SVG elements need the SVG namespace, unlike normal HTML elements. */
    const node = document.createElementNS(SVG_NS, tag);
    /* WHY: Loops through attributes so each chart element can be configured from one object. */
    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
    /* WHY: Gives the finished SVG element back to the drawing function that requested it. */
    return node;
  }

  /* WHY: Converts a month position into an x-coordinate inside the chart area. */
  function scaleX(index, labels) {
    /* WHY: Calculates equal spacing so each month is placed evenly across the chart. */
    const step = (plot.right - plot.left) / (labels.length - 1);
    return plot.left + step * index;
  }

  /* WHY: Converts a data value into a y-coordinate where higher values appear higher. */
  function scaleY(value) {
    /* WHY: Sets the chart value range so all datasets share the same vertical scale. */
    const min = 0;
    const max = 50;
    return plot.bottom - ((value - min) / (max - min)) * (plot.bottom - plot.top);
  }

  /* WHY: Draws the horizontal reference lines so users can judge chart values quickly. */
  function drawGrid() {
    /* WHY: Stops chart drawing safely if the SVG is missing from the page. */
    if (!svg) return;

    /* WHY: Adds one grid line and label for each y-axis tick value. */
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

      /* WHY: Creates the visible number for each y-axis line. */
      const label = createSvgEl("text", {
        x: plot.left - 45,
        y: y + 6,
        class: "axis-label"
      });

      label.textContent = String(tick);
      svg.appendChild(label);
    });
  }

  /* WHY: Draws month labels along the bottom of the chart. */
  function drawMonths(labels) {
    if (!svg) return;

    /* WHY: Places each month below the matching data point. */
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

  /* WHY: Draws a vertical marker to highlight the active month in the dataset. */
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

  /* WHY: Draws one chart line and its points so each dataset series can share the same code. */
  function drawSeries(labels, seriesData, activeIndex, lineClass, pointClass, active = false) {
    if (!svg) return;

    /* WHY: Converts data values into the coordinate string needed by an SVG polyline. */
    const points = seriesData
      .map((value, index) => `${scaleX(index, labels)},${scaleY(value)}`)
      .join(" ");

    /* WHY: Adds the line first so point circles appear on top of it. */
    svg.appendChild(
      createSvgEl("polyline", {
        points,
        class: lineClass
      })
    );

    /* WHY: Adds a visible circle for each data point so users can see exact positions. */
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

  /* WHY: Rebuilds the SVG chart whenever the selected dataset changes. */
  function renderChart(data) {
    if (!svg) return;

    /* WHY: Clears old chart elements so the new dataset does not overlap the previous one. */
    svg.innerHTML = "";
    /* WHY: Draws chart parts in a clear order from background to foreground. */
    drawGrid();
    drawFocusLine(data.months, data.activeIndex);
    drawSeries(data.months, data.seriesLight, data.activeIndex, "line-light", "point-light", true);
    drawSeries(data.months, data.seriesDark, data.activeIndex, "line-dark", "point-dark");
    drawMonths(data.months);
  }

  /* WHY: Converts a row action into the CSS class used for its visual state. */
  function getStatusClass(action) {
  /* WHY: Critical rows need a stronger visual style. */
  if (action === "Critical") return "critical";
  /* WHY: Ignored rows need a muted visual style. */
  if (action === "Ignore") return "muted";
  /* WHY: Review is the default state, so it does not need an extra class. */
  return "";
  }

  /* WHY: Builds the table from data so the page can change datasets without hard-coded rows. */
  function renderTableRows(rows) {
    if (!tableRows) return;

    /* WHY: Removes old rows before drawing the selected dataset. */
    tableRows.innerHTML = "";

    /* WHY: Creates one table row for each event in the selected dataset. */
    rows.forEach(([action, entity, changeType, detectedDate, confidence, source, checked]) => {
      const row = document.createElement("div");
      row.className = "table-row row";

      /* WHY: Uses a template so each generated row keeps the same structure and controls. */
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

      /* WHY: Adds the finished row to the table body. */
      tableRows.appendChild(row);
    });

    /* WHY: Keeps the export counter correct after new rows are rendered. */
    updateExportCount();
  }

  /* WHY: Shows how many rows are selected for export. */
  function updateExportCount() {
    if (!exportCount) return;

    /* WHY: Counts selected rows by looking for toggles with the checked class. */
    const checkedRows = document.querySelectorAll(".row-toggle.checked");
    const count = checkedRows.length;

    /* WHY: Updates both the number and visibility so zero selections stay quiet. */
    exportCount.textContent = count;
    exportCount.style.display = count > 0 ? "block" : "none";
  }

  /* WHY: Collects selected table rows into plain data before exporting them. */
  function getCheckedRowData() {
    const checkedRows = document.querySelectorAll(".row-toggle.checked");

    /* WHY: Converts selected DOM rows into objects with named fields for the CSV file. */
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

  /* WHY: Downloads selected rows as a CSV file so users can take data out of the dashboard. */
  function downloadCSV(rows) {
    /* WHY: Avoids creating an empty file when no rows are selected. */
    if (rows.length === 0) return;

    /* WHY: Keeps the exported column order clear and predictable. */
    const headers = ["Action", "Entity", "Change Type", "Detected Date", "Confidence", "Source"];

    /* WHY: Builds CSV rows and escapes quotes so spreadsheet apps can read the file safely. */
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

    /* WHY: Turns the CSV text into a temporary downloadable browser file. */
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    /* WHY: Uses a temporary link because browsers download files through link clicks. */
    const link = document.createElement("a");
    link.href = url;
    link.download = "chartspace-export.csv";
    link.click();

    /* WHY: Frees the temporary file URL after the download has started. */
    URL.revokeObjectURL(url);
  }

  /* WHY: Attaches one click listener to the table so generated rows work automatically. */
  if (tableRows) {
    tableRows.addEventListener("click", (event) => {
      /* WHY: Checks which interactive part of a row was clicked. */
      const statusPill = event.target.closest(".status-pill");
      const statusOption = event.target.closest(".status-menu button");
      const toggle = event.target.closest(".row-toggle");
      const clickedRow = event.target.closest(".table-row");

      /* WHY: Highlights the active row so users can see what they last selected. */
      if (clickedRow) {
        tableRows.querySelectorAll(".table-row").forEach((row) => {
          row.classList.remove("active");
        });

        clickedRow.classList.add("active");
      }

      /* WHY: Toggles export selection and refreshes the counter immediately. */
      if (toggle) {
        toggle.classList.toggle("checked");
        updateExportCount();
        return;
      }

      /* WHY: Opens the status menu while closing any other open status menu. */
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

      /* WHY: Applies the chosen status style and closes the menu after selection. */
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

  /* WHY: Closes open status menus when users click elsewhere on the page. */
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".status-wrap")) {
      document.querySelectorAll(".status-wrap.open").forEach((wrap) => {
        wrap.classList.remove("open");
      });
    }
  });

  /* WHY: Updates all chart and table content for the selected dataset key. */
  function renderDataset(datasetKey) {
    const data = datasets[datasetKey];
    /* WHY: Stops safely if a button points to a dataset that does not exist. */
    if (!data) return;

    /* WHY: Keeps the visible chart text and side panels in sync with the selected dataset. */
    if (chartTitle) chartTitle.textContent = data.chartTitle;
    if (chartSubtitle) chartSubtitle.textContent = data.chartSubtitle;
    if (leftPanelContent) leftPanelContent.innerHTML = data.description;
    if (rightPanelContent) rightPanelContent.innerHTML = data.outcome;

    /* WHY: Shows the dataset name and row count above the table. */
    if (tableTitle) {
      tableTitle.innerHTML = `${data.tableTitle} <span>(${data.rows.length})</span>`;
    }

    /* WHY: Redraws both main views so chart and table always match. */
    renderChart(data);
    renderTableRows(data.rows);

    /* WHY: Marks the selected dataset button as active for visual feedback. */
    datasetButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.dataset === datasetKey);
    });
  }

  /* WHY: Provides one helper to close temporary panels when users click away. */
  function closeFloatingPanels() {
  /* WHY: Each check keeps the helper safe if a panel is missing from the HTML. */
  if (floatingMenu) floatingMenu.classList.remove("open");
  if (floatingUserPanel) floatingUserPanel.classList.remove("open");
  if (tableDateFilterPanel) tableDateFilterPanel.classList.remove("open");
  }

  /* WHY: Keeps all side-panel controls using the same list of panels. */
  function getChartPanels() {
    return [
      descriptionPanel,
      summaryPanel,
      outcomePanel,
      recommendedActionPanel
    ].filter(Boolean);
  }

  /* WHY: Applies the same open or closed state to every chart side panel. */
  function setChartPanelsExpanded(isExpanded) {
    getChartPanels().forEach((panel) => {
      panel.classList.toggle("expanded", isExpanded);
    });
  }

  /* WHY: Checks the shared panel state so different buttons do not conflict. */
  function areChartPanelsExpanded() {
    const panels = getChartPanels();
    return panels.length > 0 && panels.every((panel) => panel.classList.contains("expanded"));
  }

  /* WHY: Shows or hides side panels without changing whether their content is expanded. */
  function setChartPanelsVisible(isVisible) {
    if (chartZone) {
      chartZone.classList.toggle("panels-hidden", !isVisible);
    }
  }

  /* WHY: Checks whether side panels are currently visible on the screen. */
  function areChartPanelsVisible() {
    return chartZone && !chartZone.classList.contains("panels-hidden");
  }

  /* WHY: Opens or closes the floating navigation menu from the header button. */
  if (menuToggle && floatingMenu) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      floatingMenu.classList.toggle("open");
    });
  }

  /* WHY: Keeps support for a user panel if that older control exists in the page. */
  if (userToggle && floatingUserPanel) {
    userToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      floatingUserPanel.classList.toggle("open");
    });
  }

  /* WHY: Prevents clicks inside the navigation panel from closing it immediately. */
  if (floatingMenu) {
    floatingMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  /* WHY: Prevents clicks inside the user panel from closing it immediately. */
  if (floatingUserPanel) {
    floatingUserPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  /* WHY: Closes floating panels when users click outside them. */
  document.addEventListener("click", () => {
    closeFloatingPanels();
  });

  /* WHY: Lets users show or hide chart information panels. */
  if (chartInfoToggle) {
    chartInfoToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setChartPanelsVisible(!areChartPanelsVisible());
    });
  }

  /* WHY: Opens or closes all chart side panels together from the menu control. */
  if (openAllToggle) {
    openAllToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      /* WHY: Uses the expanded state so this button stays focused on expand and collapse. */
      const shouldExpand = !areChartPanelsExpanded();

      /* WHY: Keeps panels visible while this control expands or collapses their content. */
      setChartPanelsVisible(true);
      setChartPanelsExpanded(shouldExpand);

      if (weatherPopup) {
        weatherPopup.style.display = shouldExpand ? "block" : "none";
      }
    });
  }

  /* WHY: Scrolls to the chart section when users choose Charts from the menu. */
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

  /* WHY: Scrolls to the table section and hides chart panels to focus on data options. */
  if (navDataOptions && sectionDataOptions && floatingMenu && chartZone) {
    navDataOptions.addEventListener("click", (event) => {
      event.stopPropagation();

      sectionDataOptions.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      floatingMenu.classList.remove("open");
      setChartPanelsVisible(false);
      setChartPanelsExpanded(false);
    });
  }

  /* WHY: Keeps a placeholder hook for a future user page without breaking the current app. */
  if (userPageBtn) {
    userPageBtn.addEventListener("click", () => {
      console.log("Go to user page");
    });
  }

  /* WHY: Exports only the rows users have selected. */
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const rows = getCheckedRowData();
      downloadCSV(rows);
    });
  }

  /* WHY: Allows the description panel to expand for easier reading. */
  if (descriptionPanel) {
  descriptionPanel.addEventListener("click", (event) => {
    event.stopPropagation();
    descriptionPanel.classList.toggle("expanded");
  });
}

/* WHY: Allows the summary panel to expand for easier reading. */
if (summaryPanel) {
  summaryPanel.addEventListener("click", (event) => {
    event.stopPropagation();
    summaryPanel.classList.toggle("expanded");
  });
}

/* WHY: Allows the outcome panel to expand for easier reading. */
if (outcomePanel) {
  outcomePanel.addEventListener("click", (event) => {
    event.stopPropagation();
    outcomePanel.classList.toggle("expanded");
  });
}

/* WHY: Allows the recommended action panel to expand for easier reading. */
if (recommendedActionPanel) {
  recommendedActionPanel.addEventListener("click", (event) => {
    event.stopPropagation();
    recommendedActionPanel.classList.toggle("expanded");
  });
}

  /* WHY: Keeps older yes/no feedback buttons mutually exclusive if they are present. */
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

  /* WHY: Opens or closes the table date filter panel. */
    if (tableDateRangeBtn && tableDateFilterPanel) {
    tableDateRangeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      tableDateFilterPanel.classList.toggle("open");
    });
  }

  /* WHY: Gives users a direct way to close the date filter panel. */
  if (tableDateFilterClose && tableDateFilterPanel) {
    tableDateFilterClose.addEventListener("click", (event) => {
      event.stopPropagation();
      tableDateFilterPanel.classList.remove("open");
    });
  }

  /* WHY: Applies the selected date range label to the table filter button. */
  if (tableApplyDateFilter && tableDateFilterPanel && tableDateRangeBtn) {
    tableApplyDateFilter.addEventListener("click", (event) => {
      event.stopPropagation();

      /* WHY: Reads whichever radio option the user selected. */
      const selectedRange = document.querySelector(
        'input[name="tableDateRange"]:checked'
      );

      /* WHY: Updates the button text so the chosen range remains visible. */
      if (selectedRange) {
        tableDateRangeBtn.textContent = `Last ${selectedRange.value}`;
      }

      tableDateFilterPanel.classList.remove("open");
    });
  }

  /* WHY: Prevents clicks inside the date filter from closing parent floating panels. */
  if (tableDateFilterPanel) {
    tableDateFilterPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  /* WHY: Lets each dataset button redraw the dashboard with its own data. */
  datasetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      renderDataset(btn.dataset.dataset);
    });
  });

  /* WHY: Loads the default dataset so the dashboard is populated on first page load. */
  renderDataset("finance");
});

/* WHY: Finds the action column control after the DOM handler because this feature sits outside the main setup block. */
const actionColumnToggle = document.getElementById("actionColumnToggle");
const tablePanel = document.querySelector(".table-panel");    

/* WHY: Lets users collapse action controls to make the table easier to scan. */
if (actionColumnToggle && tablePanel) {
  actionColumnToggle.addEventListener("click", () => {
    tablePanel.classList.toggle("actions-collapsed");
    /* WHY: Updates the button label so users understand the current table mode. */
    const isCollapsed = tablePanel.classList.contains("actions-collapsed");
    actionColumnToggle.textContent = isCollapsed ? "Actions" : "Edit mode";
  });

}
