/* 1. Application Startup */
/* WHY: Waits until the HTML exists before selecting page elements and attaching events. */
document.addEventListener("DOMContentLoaded", () => {
  /* WHY: Stores the chart SVG so the app can draw and redraw the graph in one place. */
  const svg = document.getElementById("chartSvg");
  /* WHY: Keeps the SVG namespace in one constant so created chart elements render correctly. */
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* WHY: Finds the main menu controls so the navigation panel can open and close. */
  const menuToggle = document.getElementById("menuToggle");
  const floatingMenu = document.getElementById("floatingMenu");

  /* WHY: Finds chart panel controls so users can reveal extra chart information. */
  const chartInfoToggle = document.getElementById("chartInfoToggle");
  const chartZone = document.getElementById("chartZone");
  const openAllToggle = document.getElementById("openAllToggle");
  const themeToggle = document.getElementById("themeToggle");

  /* WHY: Finds menu navigation items so clicks can scroll to the correct page section. */
  const navCharts = document.getElementById("navCharts");
  const navDataOptions = document.getElementById("navDataOptions");
  const aboutBtn = document.getElementById("aboutBtn");
  const aboutOverlay = document.getElementById("aboutOverlay");
  const closeAbout = document.getElementById("closeAbout");

  /* WHY: Stores page sections as scroll targets for the floating navigation menu. */
  const sectionCharts = document.getElementById("sectionCharts");
  const sectionDataOptions = document.getElementById("sectionDataOptions");

  /* WHY: Stores the chart title text nodes so dataset changes can update the heading. */
  const chartTitle = document.querySelector(".card-title-block h2");
  const chartSubtitle = document.querySelector(".card-title-block p");
  /* WHY: Stores the headline metric cards so each company can show its own revenue totals. */
  const summaryValues = document.querySelectorAll(".summary-value");
  const summaryLabels = document.querySelectorAll(".summary-label");

  /* WHY: Finds all dynamic side panels so each dataset can refresh the full chart context. */
  const descriptionPanel = document.getElementById("descriptionPanel");
  const summaryPanel = document.getElementById("summaryPanel");
  const outcomePanel = document.getElementById("outcomePanel");
  const recommendedActionPanel = document.getElementById("recommendedActionPanel");

  /* WHY: Finds the table date filter controls so the selected range can be shown to users. */
  const tableDateRangeBtn = document.getElementById("tableDateRangeBtn");
  const tableDateFilterPanel = document.getElementById("tableDateFilterPanel");
  const tableDateFilterClose = document.getElementById("tableDateFilterClose");
  const tableApplyDateFilter = document.getElementById("tableApplyDateFilter");

  /* WHY: Finds export and table elements used by the dashboard interactions. */
  /* WHY: Finds the weather popup so the open-all control can show or hide it with the panels. */
  const weatherBtn = document.getElementById("weatherBtn");
  const weatherPopup = document.getElementById("weatherPopup");
  const weatherText = document.getElementById("weatherText");
  const exportBtn = document.getElementById("exportBtn");
  const exportCount = document.getElementById("exportCount");

  /* WHY: Stores table controls so rows and dataset buttons can be updated dynamically. */
  const tableTitle = document.getElementById("tableTitle");
  const tableRows = document.getElementById("tableRows");
  const tablePanel = document.querySelector(".table-panel");
  const actionColumnToggle = document.getElementById("actionColumnToggle");
  const datasetButtons = document.querySelectorAll(".dataset-btn");

  /* WHY: Defines the y-axis values shown on the chart grid. */
  const yTicks = [50, 40, 30, 20, 10, 0];

  /* 2. Central Dataset System */
  /* WHY: Reads the centralised dataset file while keeping the app safe if it fails to load. */
  const datasets = window.chartspaceDatasets || {};

  /* 6. Date Filtering */
  /* WHY: Starts with no date filter so the table shows all demo rows until the user chooses a range. */
  let selectedDateRangeDays = null;
  /* WHY: Converts the visible filter labels into day counts the table can compare. */
  const dateRangeOptions = {
    "24 hours": 1,
    "7 days": 7,
    "14 days": 14,
    "30 days": 30,
    "90 days": 90,
    "180 days": 180,
    "365 days": 365
  };

  /* WHY: Refreshes Lucide icons after dynamic HTML changes replace icon markup. */
  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* 9. Accessibility Features */
  /* WHY: Lets keyboard users activate custom button-like elements with Enter or Space. */
  function handleKeyboardActivation(event, callback) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  }

  /* WHY: Announces whether the date filter panel is open for assistive technology. */
  function setDateFilterOpen(isOpen) {
    if (tableDateFilterPanel) {
      tableDateFilterPanel.classList.toggle("open", isOpen);
    }

    if (tableDateRangeBtn) {
      tableDateRangeBtn.setAttribute("aria-expanded", String(isOpen));
    }
  }

  /* 11. Responsive Behaviour */
  /* WHY: Keeps desktop spacing unchanged while giving mobile charts more usable plot width. */
  function getChartPlotBounds() {
    const isMobileChart = window.matchMedia("(max-width: 700px)").matches;

    if (isMobileChart) {
      return {
        left: 62,
        right: 720,
        top: 40,
        bottom: 320
      };
    }

    return {
      left: 90,
      right: 700,
      top: 40,
      bottom: 320
    };
  }

  /* 3. Chart Rendering System */
  /* WHY: Creates SVG elements with attributes so chart drawing code stays reusable. (small helper for building SVG chart parts) */
  function createSvgEl(tag, attrs = {}) {
    /* WHY: SVG elements need the SVG namespace, unlike normal HTML elements. (createSvgEl() is a reusable SVG builder. It creates chart elements like lines, labels, and points, applies their attributes, and returns the finished element so the chart can draw itself dynamically.) */
    const node = document.createElementNS(SVG_NS, tag);
    /* WHY: Loops through attributes so each chart element can be configured from one object. */
    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
    /* WHY: Gives the finished SVG element back to the drawing function that requested it. */
    return node;
  }

  /* WHY: Converts a month position into an x-coordinate inside the chart area. */
  function scaleX(index, labels, plot) {
    /* WHY: Calculates equal spacing so each month is placed evenly across the chart. */
    const step = (plot.right - plot.left) / (labels.length - 1);
    return plot.left + step * index;
  }

  /* WHY: Converts a data value into a y-coordinate where higher values appear higher. */
  function scaleY(value, plot) {
    /* WHY: Sets the chart value range so all datasets share the same vertical scale. */
    const min = 0;
    const max = 50;
    return plot.bottom - ((value - min) / (max - min)) * (plot.bottom - plot.top);
  }

  /* WHY: Draws the horizontal reference lines so users can judge chart values quickly. */
  function drawGrid(plot) {
    /* WHY: Stops chart drawing safely if the SVG is missing from the page. */
    if (!svg) return;

    /* WHY: Adds one grid line and label for each y-axis tick value. */
    yTicks.forEach((tick) => {
      const y = scaleY(tick, plot);

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
  function drawMonths(labels, plot) {
    if (!svg) return;

    /* WHY: Places each month below the matching data point. */
    labels.forEach((labelText, index) => {
      const x = scaleX(index, labels, plot);

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
  function drawFocusLine(labels, activeIndex, plot) {
    if (!svg) return;

    const x = scaleX(activeIndex, labels, plot);

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
  function drawSeries(labels, seriesData, activeIndex, lineClass, pointClass, plot, active = false) {
    if (!svg) return;

    /* WHY: Converts data values into the coordinate string needed by an SVG polyline. */
    const points = seriesData
      .map((value, index) => `${scaleX(index, labels, plot)},${scaleY(value, plot)}`)
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
          cx: scaleX(index, labels, plot),
          cy: scaleY(value, plot),
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
    /* WHY: Uses the current viewport so mobile charts get wider plot spacing without changing desktop. */
    const plot = getChartPlotBounds();
    /* WHY: Draws chart parts in a clear order from background to foreground. */
    drawGrid(plot);
    drawFocusLine(data.months, data.activeIndex, plot);
    drawSeries(data.months, data.seriesLight, data.activeIndex, "line-light", "point-light", plot, true);
    drawSeries(data.months, data.seriesDark, data.activeIndex, "line-dark", "point-dark", plot);
    drawMonths(data.months, plot);
  }

    /* ===============================
      4. Dynamic Table Rendering 
    =============================== */

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
      row.setAttribute("role", "row");

      /* WHY: Uses a template so each generated row keeps the same structure and controls. */
      row.innerHTML = `
        <div class="action-cell" role="cell">
          <button
            class="row-toggle ${checked ? "checked" : ""}"
            type="button"
            aria-label="Toggle export selection for ${entity}"
          >
            <span></span>
          </button>

            <div class="status-wrap">
              <button
                class="status-pill ${getStatusClass(action)}"
                type="button"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                ${action} <span>⌄</span>
              </button>

              <div class="status-menu" role="menu">
                <button type="button" data-status="Review" role="menuitem">Review</button>
                <button type="button" data-status="Critical" role="menuitem">Critical</button>
                <button type="button" data-status="Ignore" role="menuitem">Ignore</button>
              </div>
            </div>
        </div>

        <div class="truncate-cell" data-full="${entity}" role="cell">
          <span class="truncate-text">${entity}</span>
        </div>

        <div role="cell">${changeType}</div>
        <div role="cell">${detectedDate}</div>
        <div role="cell">${confidence}</div>

        <div class="truncate-cell" data-full="${source}" role="cell">
          <span class="truncate-text">${source}</span>
        </div>
      `;

      /* WHY: Adds the finished row to the table body. */
      tableRows.appendChild(row);
    });

    /* WHY: Keeps the export counter correct after new rows are rendered. */
    updateExportCount();
  }

  /* WHY: Converts table date text into a real Date so rows can be filtered by age. */
  function parseDetectedDate(dateText) {
    const parsedDate = new Date(dateText);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  /* WHY: Keeps only rows detected within the selected number of days from today. */
  function filterRowsByDateRange(rows, days) {
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - days);

    return rows.filter((row) => {
      const detectedDate = parseDetectedDate(row[3]);

      if (!detectedDate) return false;

      return detectedDate >= cutoffDate && detectedDate <= now;
    });
  }

  /* WHY: Keeps all rows visible when no date range has been applied. */
  function getVisibleRows(rows) {
    if (!selectedDateRangeDays) return rows;

    return filterRowsByDateRange(rows, selectedDateRangeDays);
  }

  /* ===============================
      7. CSV Export 
    =============================== */

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
    /* WHY: Handles an empty export gracefully instead of creating a blank file. */
    if (rows.length === 0) {
      window.alert("Select at least one row before exporting.");
      return;
    }

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

  /* ===============================

       8. Event Listeners and User Interaction  

       This block uses one event listener on the table to manage all row interactions. 
       It detects whether the user clicked an export toggle, a status dropdown, or a status option. 
       It highlights the active row, updates export selections, opens and closes status menus, changes row status styles, and keeps ARIA attributes updated for accessibility.

    =============================== */

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
            const openButton = wrap.querySelector(".status-pill");
            if (openButton) openButton.setAttribute("aria-expanded", "false");
          }
        });

        statusWrap.classList.toggle("open");
        /* WHY: Announces whether the row status menu is open for assistive technology. */
        statusPill.setAttribute("aria-expanded", String(statusWrap.classList.contains("open")));
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
        pill.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* WHY: Closes open status menus when users click elsewhere on the page. */
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".status-wrap")) {
      document.querySelectorAll(".status-wrap.open").forEach((wrap) => {
        wrap.classList.remove("open");
        const openButton = wrap.querySelector(".status-pill");
        if (openButton) openButton.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ===============================
      5. Dataset Switching // Side Panel Management
    =============================== */

  /* WHY: Pulls one named panel section out of a trusted dataset HTML string. */
  function getPanelHtml(panelHtml, panelName) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = panelHtml || "";

    const panel = wrapper.querySelector(`[data-panel="${panelName}"]`);
    return panel ? panel.innerHTML.trim() : "";
  }

  /* WHY: Keeps every side panel in sync with the currently selected dataset. */
  function updateTextPanels(data) {
    if (descriptionPanel) descriptionPanel.innerHTML = getPanelHtml(data.description, "description");
    if (summaryPanel) summaryPanel.innerHTML = getPanelHtml(data.description, "summary");
    if (outcomePanel) outcomePanel.innerHTML = getPanelHtml(data.outcome, "outcome");
    if (recommendedActionPanel) {
      recommendedActionPanel.innerHTML = getPanelHtml(data.outcome, "recommendedAction");
    }
  }

  /* WHY: Updates all chart and table content for the selected dataset key. */
  function renderDataset(datasetKey) {
    const data = datasets[datasetKey];
    /* WHY: Stops safely if a button points to a dataset that does not exist. */
    if (!data) return;
    /* WHY: Applies the selected date range only after the user has chosen one. */
    const visibleRows = getVisibleRows(data.rows);

    /* WHY: Keeps the visible chart text in sync with the selected dataset. */
    if (chartTitle) chartTitle.textContent = data.chartTitle;
    if (chartSubtitle) chartSubtitle.textContent = data.chartSubtitle;

    /* WHY: Updates the headline revenue metrics so they match the selected company dataset. */
    if (data.metrics && summaryValues.length >= 3 && summaryLabels.length >= 3) {
      summaryValues[0].textContent = data.metrics.peakRevenue;
      summaryValues[1].textContent = data.metrics.yearOnYearChange;
      summaryValues[2].textContent = data.metrics.totalRevenue;

      summaryLabels[0].textContent = "Peak revenue";
      summaryLabels[1].textContent = "YoY change";
      summaryLabels[2].textContent = "Total revenue";
    }

    /* WHY: Refreshes all four context panels whenever the dataset changes. */
    updateTextPanels(data);

    /* WHY: Shows the dataset name and row count above the table. */
    if (tableTitle) {
      tableTitle.innerHTML = `${data.tableTitle} <span>(${visibleRows.length})</span>`;
    }

    /* WHY: Redraws both main views so chart and table always match. */
    renderChart(data);
    renderTableRows(visibleRows);

    /* WHY: Marks the selected dataset button as active for visual feedback. */
    datasetButtons.forEach((btn) => {
      const isActive = btn.dataset.dataset === datasetKey;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  /* WHY: Reuses the active button so table filters can refresh the selected dataset. */
  function getActiveDatasetKey() {
    const activeButton = Array.from(datasetButtons).find((btn) => btn.classList.contains("active"));
    return activeButton ? activeButton.dataset.dataset : "finance";
  }

  /* WHY: Provides one helper to close temporary panels when users click away. */
  function closeFloatingPanels() {
    /* WHY: Each check keeps the helper safe if a panel is missing from the HTML. */
    if (floatingMenu) floatingMenu.classList.remove("open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");

    setDateFilterOpen(false);
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
      panel.setAttribute("aria-expanded", String(isExpanded));
    });
  }

  /* WHY: Keeps mouse and keyboard expansion using the same side-panel state logic. */
  function toggleChartPanel(panel) {
    const isExpanded = !panel.classList.contains("expanded");
    panel.classList.toggle("expanded", isExpanded);
    panel.setAttribute("aria-expanded", String(isExpanded));
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

    if (chartInfoToggle) {
      chartInfoToggle.setAttribute("aria-expanded", String(isVisible));
    }
  }

  /* WHY: Checks whether side panels are currently visible on the screen. */
  function areChartPanelsVisible() {
    return chartZone && !chartZone.classList.contains("panels-hidden");
  }

  /* ===============================
      10. External Weather API 
    =============================== */

  /* WHY: Loads weather in one place so both weather controls show the same API result. */
  async function loadWeather() {
    if (!weatherText) return;

    weatherText.textContent = "Loading weather...";

    try {
      const londonWeather = { latitude: 51.5072, longitude: -0.1276, label: "London Weather" };
      const weatherLocation = await new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(londonWeather);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            label: "Your Location Weather"
          }),
          () => resolve(londonWeather)
        );
      });
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${weatherLocation.latitude}&longitude=${weatherLocation.longitude}&current_weather=true`;
      const response = await fetch(url);
      const data = await response.json();
      const temp = data.current_weather.temperature;
      const wind = data.current_weather.windspeed;

      weatherText.innerHTML = `
        <strong>${weatherLocation.label}</strong><br>
        Temperature: ${temp}°C<br>
        Wind: ${wind} km/h
      `;
    } catch {
      weatherText.textContent = "Weather unavailable.";
    }
  }

  /*  ===============================
      Floating navigation
     =============================== */

  /* WHY: Opens or closes the floating navigation menu from the header button. */
  if (menuToggle && floatingMenu) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      floatingMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(floatingMenu.classList.contains("open")));
    });
  }

  /* WHY: Prevents clicks inside the navigation panel from closing it immediately. */
  if (floatingMenu) {
    floatingMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  /* WHY: Lets users switch between light and dark viewing modes. */
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDarkMode = document.body.classList.toggle("dark-mode");
      themeToggle.innerHTML = '<span class="menu-icon"> <i data-lucide="eclipse"></i></span>';
      /* WHY: Lets assistive technology announce whether dark mode is currently active. */
      themeToggle.setAttribute("aria-pressed", String(isDarkMode));
      refreshIcons();
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
    openAllToggle.addEventListener("click", async (event) => {
      event.stopPropagation();

      /* WHY: Uses the expanded state so this button stays focused on expand and collapse. */
      const shouldExpand = !areChartPanelsExpanded();

      /* WHY: Keeps panels visible while this control expands or collapses their content. */
      setChartPanelsVisible(true);
      setChartPanelsExpanded(shouldExpand);
      openAllToggle.setAttribute("aria-expanded", String(shouldExpand));

      if (weatherPopup) {
        weatherPopup.style.display = shouldExpand ? "block" : "none";
        if (weatherBtn) weatherBtn.setAttribute("aria-expanded", String(shouldExpand));
      }

      if (shouldExpand) {
        await loadWeather();
      }
    });
  }

  /* WHY: Lets the weather button open the popup and refresh the same weather API data. */
  if (weatherBtn && weatherPopup) {
    weatherBtn.addEventListener("click", async () => {
      const shouldShowWeather = weatherPopup.style.display !== "block";

      weatherPopup.style.display = shouldShowWeather ? "block" : "none";
      weatherBtn.setAttribute("aria-expanded", String(shouldShowWeather));

      if (shouldShowWeather) {
        await loadWeather();
      }
    });
  }

  /* WHY: Opens the about overlay so users can read the project purpose without leaving the page. */
  if (aboutBtn && aboutOverlay) {
    aboutBtn.addEventListener("click", () => {
      aboutOverlay.classList.add("show");
      refreshIcons();
    });
  }

  /* WHY: Gives users a direct way to close the about overlay. */
  if (closeAbout && aboutOverlay) {
    closeAbout.addEventListener("click", () => {
      aboutOverlay.classList.remove("show");
    });
  }

  /* WHY: Closes the about overlay when users click outside the modal card. */
  if (aboutOverlay) {
    aboutOverlay.addEventListener("click", (event) => {
      if (event.target === aboutOverlay) {
        aboutOverlay.classList.remove("show");
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
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
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
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      setChartPanelsVisible(false);
      setChartPanelsExpanded(false);
    });

  }

  /* WHY: Exports only the rows users have selected. */
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const rows = getCheckedRowData();
      downloadCSV(rows);
    });
  }

  /* WHY: Lets users collapse action controls to make the table easier to scan. */
  if (actionColumnToggle && tablePanel) {
    actionColumnToggle.addEventListener("click", () => {
      tablePanel.classList.toggle("actions-collapsed");
      /* WHY: Updates the button label so users understand the current table mode. */
      const isCollapsed = tablePanel.classList.contains("actions-collapsed");
      actionColumnToggle.textContent = isCollapsed ? "Actions" : "Edit mode";
      /* WHY: Announces whether the table action controls are currently visible. */
      actionColumnToggle.setAttribute("aria-pressed", String(!isCollapsed));
    });
  }

  /* WHY: Allows the description panel to expand for easier reading. */
  if (descriptionPanel) {
    descriptionPanel.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleChartPanel(descriptionPanel);
    });

    descriptionPanel.addEventListener("keydown", (event) => {
      handleKeyboardActivation(event, () => toggleChartPanel(descriptionPanel));
    });
  }

  /* WHY: Allows the summary panel to expand for easier reading. */
  if (summaryPanel) {
    summaryPanel.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleChartPanel(summaryPanel);
    });

    summaryPanel.addEventListener("keydown", (event) => {
      handleKeyboardActivation(event, () => toggleChartPanel(summaryPanel));
    });
  }

  /* WHY: Allows the outcome panel to expand for easier reading. */
  if (outcomePanel) {
    outcomePanel.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleChartPanel(outcomePanel);
    });

    outcomePanel.addEventListener("keydown", (event) => {
      handleKeyboardActivation(event, () => toggleChartPanel(outcomePanel));
    });
  }

  /* WHY: Allows the recommended action panel to expand for easier reading. */
  if (recommendedActionPanel) {
    recommendedActionPanel.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleChartPanel(recommendedActionPanel);
    });

    recommendedActionPanel.addEventListener("keydown", (event) => {
      handleKeyboardActivation(event, () => toggleChartPanel(recommendedActionPanel));
    });
  }

  /* WHY: Opens or closes the table date filter panel. */
  if (tableDateRangeBtn && tableDateFilterPanel) {
    tableDateRangeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      setDateFilterOpen(!tableDateFilterPanel.classList.contains("open"));
    });
  }

  /* WHY: Gives users a direct way to close the date filter panel. */
  if (tableDateFilterClose && tableDateFilterPanel) {
    tableDateFilterClose.addEventListener("click", (event) => {
      event.stopPropagation();
      setDateFilterOpen(false);
    });
  }

  /* WHY: Applies the selected date range to the table rows for the active dataset. */
  if (tableApplyDateFilter && tableDateFilterPanel && tableDateRangeBtn) {
    tableApplyDateFilter.addEventListener("click", (event) => {
      event.stopPropagation();

      /* WHY: Reads whichever radio option the user selected. */
      const selectedRange = document.querySelector(
        'input[name="tableDateRange"]:checked'
      );

      /* WHY: Updates the button text so the chosen range remains visible. */
      if (selectedRange) {
        selectedDateRangeDays = dateRangeOptions[selectedRange.value] || null;
        tableDateRangeBtn.textContent = `Last ${selectedRange.value}`;
      } else {
        selectedDateRangeDays = null;
        tableDateRangeBtn.textContent = "All dates";
      }

      renderDataset(getActiveDatasetKey());
      setDateFilterOpen(false);
    });
  }

  /* WHY: Prevents clicks inside the date filter from closing parent floating panels. */
  if (tableDateFilterPanel) {
    tableDateFilterPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  /* WHY: Clears the HTML default so the table filter is off on first page load. */
  document.querySelectorAll('input[name="tableDateRange"]').forEach((input) => {
    input.checked = false;
  });

  if (tableDateRangeBtn) {
    tableDateRangeBtn.textContent = "All dates";
  }

  /* WHY: Lets each dataset button redraw the dashboard with its own data. */
  datasetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      renderDataset(btn.dataset.dataset);
    });
  });

  /* WHY: Redraws the active chart after viewport changes so responsive plot spacing stays correct. */
  window.addEventListener("resize", () => {
    renderDataset(getActiveDatasetKey());
  });

  /* WHY: Loads the default dataset so the dashboard is populated on first page load. */
  /* Conclusion */
  renderDataset("finance");
  refreshIcons();
});
