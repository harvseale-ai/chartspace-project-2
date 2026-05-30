/* WHY: Stores all dashboard datasets globally so app.js can focus on behaviour instead of raw data. */
window.chartspaceDatasets = {
  /* WHY: Provides the default finance dataset shown when the dashboard first loads. */
  finance: {
    chartTitle: "Finance Revenue Chart",
    chartSubtitle: "Northbridge Capital Group monthly revenue vs last year",
    tableTitle: "Finance revenue records",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    seriesLight: [12.4, 18.1, 15.6, 26.2, 23.5, 13.1, 17.8, 21.4, 24.9, 34.5, 31.2, 28.6],
    seriesDark: [8.7, 11.4, 5.2, 9.3, 6.5, 3.4, 10.8, 14.2, 17.6, 19.1, 22.4, 25.8],
    activeIndex: 9,
    /* WHY: Supplies the HTML shown in the left chart information panels for finance. */
    description: `
      <div data-panel="description">
        <h2>Description</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Data Overview</strong>
            <p>
              Company: Northbridge Capital Group<br />
              Sector: Finance<br />
              Data Type: Monthly revenue in millions<br />
              Period: Jan to Dec 2025
            </p>
          </div>

          <div class="panel-section">
            <strong>Transformation</strong>
            <p>
              Revenue is grouped by calendar month<br />
              Current-year values are compared with last year<br />
              Values are rounded to one decimal place
            </p>
          </div>

          <div class="panel-section">
            <strong>Chart Details</strong>
            <p>
              Type: Line chart (dual series)<br />
              Focus: Full-year revenue performance<br />
              Highlight: October full-year revenue peak
            </p>
          </div>

          <div class="panel-section">
            <strong>Insights</strong>
            <p>
              Revenue strengthens through Q3 and Q4<br />
              Current year stays ahead of last year<br />
              October shows the strongest finance performance
            </p>
          </div>
        </div>
      </div>

      <div data-panel="summary">
        <h2>Summary</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Status Overview</strong>
            <p>
              Revenue Type: Monthly reported revenue<br />
              Comparison: Current year vs previous year
            </p>
          </div>

          <div class="panel-section">
            <strong>Transformation</strong>
            <p>
              Monthly values align with the 12 table rows<br />
              Previous-year values provide the baseline<br />
              Each row records one monthly revenue signal
            </p>
          </div>

          <div class="panel-section">
            <strong>Chart Details</strong>
            <p>
              Type: Line chart (dual series)<br />
              Focus: Revenue growth trend<br />
              Highlight: October is the strongest month
            </p>
          </div>

          <div class="panel-section">
            <strong>Insights</strong>
            <p>
              Lending and acquisition activity improve late year<br />
              October and November show strong momentum<br />
              Margin pressure should still be monitored
            </p>
          </div>
        </div>
      </div>
    `,
    /* WHY: Supplies the HTML shown in the right chart information panels for finance. */
    outcome: `
      <div data-panel="outcome">
        <h2>Outcome</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Revenue Mapping</strong>
            <p>
              Each table row maps to one month of revenue<br />
              User actions are logged against monthly signals
            </p>
          </div>

          <div class="panel-section">
            <strong>Notes</strong>
            <p>
              Data is reviewed across the full year<br />
              Outliers remain visible for finance review<br />
              Revenue signals support planning decisions
            </p>
          </div>
        </div>
      </div>

      <div data-panel="recommendedAction">
        <h2>Recommended Action</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Plan of Action</strong>
            <p>
              Review Q4 acquisition and lending channels<br />
              Repeat tactics linked to October performance
            </p>
          </div>

          <div class="panel-section">
            <strong>Notes</strong>
            <p>
              Compare each month against last year<br />
              Check whether late-year growth is seasonal<br />
              Keep finance team review notes attached
            </p>
          </div>
        </div>
      </div>
    `,
    /* WHY: Provides finance table rows in the same column order expected by app.js. */
    rows: [
      [
        "Review",
        "Northbridge January revenue baseline",
        "Forecast update",
        "31 Jan 2025",
        "Medium",
        "Revenue Monitor",
        false
      ],
      [
        "Ignore",
        "Northbridge February lending revenue lift",
        "Revenue growth",
        "28 Feb 2025",
        "High",
        "Finance Report",
        false
      ],
      [
        "Review",
        "Northbridge March card services slowdown",
        "Revenue drop",
        "31 Mar 2025",
        "Medium",
        "Market Filing",
        false
      ],
      [
        "Review",
        "Northbridge April acquisition campaign peak",
        "Revenue growth",
        "30 Apr 2025",
        "High",
        "CRM Pipeline",
        false
      ],
      [
        "Ignore",
        "Northbridge May wealth management uplift",
        "Revenue growth",
        "31 May 2025",
        "High",
        "Board Pack",
        false
      ],
      [
        "Review",
        "Northbridge June margin pressure review",
        "Margin pressure",
        "30 Jun 2025",
        "Medium",
        "Forecast Model",
        false
      ],
      [
        "Ignore",
        "Northbridge July account growth update",
        "Pipeline increase",
        "31 Jul 2025",
        "Medium",
        "Revenue Operations",
        false
      ],
      [
        "Review",
        "Northbridge August regional revenue improvement",
        "Revenue growth",
        "31 Aug 2025",
        "High",
        "Revenue Monitor",
        false
      ],
      [
        "Review",
        "Northbridge September commercial banking uplift",
        "Revenue growth",
        "30 Sep 2025",
        "High",
        "Finance Report",
        false
      ],
      [
        "Ignore",
        "Northbridge October full-year revenue peak",
        "Revenue growth",
        "31 Oct 2025",
        "High",
        "Forecast Model",
        true
      ],
      [
        "Review",
        "Northbridge November portfolio revenue increase",
        "Revenue growth",
        "30 Nov 2025",
        "High",
        "Board Pack",
        false
      ],
      [
        "Review",
        "Northbridge December year-end forecast revision",
        "Forecast update",
        "31 Dec 2025",
        "Medium",
        "Revenue Monitor",
        false
      ]
    ]
  },

  /* WHY: Provides a second dataset so users can compare healthcare revenue with finance. */
  healthcare: {
    chartTitle: "Healthcare Revenue Chart",
    chartSubtitle: "Medivanta Health Systems monthly revenue vs last year",
    tableTitle: "Healthcare revenue records",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    seriesLight: [9.8, 13.6, 16.2, 19.4, 21.1, 18.7, 20.5, 22.9, 24.1, 26.8, 28.4, 30.2],
    seriesDark: [7.9, 10.2, 12.4, 14.8, 16.5, 15.9, 17.1, 18.6, 20.2, 22.3, 23.7, 25.4],
    activeIndex: 11,
    /* WHY: Supplies the HTML shown in the left chart information panels for healthcare. */
    description: `
      <div data-panel="description">
        <h2>Description</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Data Overview</strong>
            <p>
              Company: Medivanta Health Systems<br />
              Sector: Healthcare<br />
              Data Type: Monthly service revenue in millions<br />
              Period: Jan to Dec 2025
            </p>
          </div>

          <div class="panel-section">
            <strong>Transformation</strong>
            <p>
              Revenue is grouped by service month<br />
              Current-year service revenue is compared with last year<br />
              Values are rounded to one decimal place
            </p>
          </div>

          <div class="panel-section">
            <strong>Chart Details</strong>
            <p>
              Type: Line chart (dual series)<br />
              Focus: Full-year healthcare revenue<br />
              Highlight: December service revenue peak
            </p>
          </div>

          <div class="panel-section">
            <strong>Insights</strong>
            <p>
              Demand builds through the second half<br />
              Outpatient and diagnostics activity support growth<br />
              December closes as the strongest service month
            </p>
          </div>
        </div>
      </div>

      <div data-panel="summary">
        <h2>Summary</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Status Overview</strong>
            <p>
              Revenue Type: Monthly service revenue<br />
              Comparison: Current year vs previous year
            </p>
          </div>

          <div class="panel-section">
            <strong>Transformation</strong>
            <p>
              Monthly values align with the 12 table rows<br />
              Service demand is compared against last year<br />
              Each row records one monthly revenue signal
            </p>
          </div>

          <div class="panel-section">
            <strong>Chart Details</strong>
            <p>
              Type: Line chart (dual series)<br />
              Focus: Healthcare service revenue trend<br />
              Highlight: December is the strongest month
            </p>
          </div>

          <div class="panel-section">
            <strong>Insights</strong>
            <p>
              Clinic utilisation improves after mid-year<br />
              Insurer settlements add late-year uplift<br />
              Retention risk should still be reviewed
            </p>
          </div>
        </div>
      </div>
    `,
    /* WHY: Supplies the HTML shown in the right chart information panels for healthcare. */
    outcome: `
      <div data-panel="outcome">
        <h2>Outcome</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Outcome</strong>
            <p>
              Each table row maps to one month of service revenue<br />
              High-confidence changes are escalated for review
            </p>
          </div>

          <div class="panel-section">
            <strong>Notes</strong>
            <p>
              Data is reviewed across the full year<br />
              Billing and utilisation signals remain visible<br />
              Revenue signals support service planning
            </p>
          </div>
        </div>
      </div>

      <div data-panel="recommendedAction">
        <h2>Recommended Action</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Plan of Action</strong>
            <p>
              Review patient acquisition costs<br />
              Improve recurring service retention<br />
              Repeat channels linked to December demand
            </p>
          </div>

          <div class="panel-section">
            <strong>Notes</strong>
            <p>
              Compare each month against last year<br />
              Check outpatient and diagnostics demand<br />
              Keep service-line review notes attached
            </p>
          </div>
        </div>
      </div>
    `,
    /* WHY: Provides healthcare table rows in the same column order expected by app.js. */
    rows: [
      [
        "Review",
        "Medivanta January patient service baseline",
        "Forecast update",
        "31 Jan 2025",
        "Medium",
        "Revenue Monitor",
        false
      ],
      [
        "Ignore",
        "Medivanta February outpatient revenue lift",
        "Revenue growth",
        "28 Feb 2025",
        "High",
        "Healthcare Report",
        false
      ],
      [
        "Review",
        "Medivanta March diagnostics demand",
        "Service demand",
        "31 Mar 2025",
        "High",
        "Billing System",
        false
      ],
      [
        "Ignore",
        "Medivanta April elective care growth",
        "Revenue growth",
        "30 Apr 2025",
        "Medium",
        "Healthcare Report",
        false
      ],
      [
        "Review",
        "Medivanta May service revenue peak",
        "Revenue growth",
        "31 May 2025",
        "High",
        "Revenue Monitor",
        false
      ],
      [
        "Review",
        "Medivanta June retention risk",
        "Retention risk",
        "30 Jun 2025",
        "Medium",
        "CRM Pipeline",
        false
      ],
      [
        "Ignore",
        "Medivanta July clinic utilisation",
        "Service demand",
        "31 Jul 2025",
        "Medium",
        "Revenue Operations",
        false
      ],
      [
        "Review",
        "Medivanta August billing improvement",
        "Forecast update",
        "31 Aug 2025",
        "Low",
        "Billing System",
        false
      ],
      [
        "Review",
        "Medivanta September care programme growth",
        "Revenue growth",
        "30 Sep 2025",
        "High",
        "Board Pack",
        false
      ],
      [
        "Ignore",
        "Medivanta October seasonal service demand",
        "Seasonal uplift",
        "31 Oct 2025",
        "Medium",
        "Forecast Model",
        false
      ],
      [
        "Review",
        "Medivanta November insurer settlement uplift",
        "Revenue growth",
        "30 Nov 2025",
        "High",
        "Healthcare Report",
        false
      ],
      [
        "Review",
        "Medivanta December full-year service revenue peak",
        "Revenue growth",
        "31 Dec 2025",
        "High",
        "Revenue Monitor",
        true
      ]
    ]
  },

  /* WHY: Provides a third dataset so users can compare education revenue with other sectors. */
  education: {
    chartTitle: "Education Revenue Chart",
    chartSubtitle: "LearnSphere Academy Group monthly revenue vs last year",
    tableTitle: "Education revenue records",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    seriesLight: [6.2, 8.5, 14.8, 17.6, 13.9, 10.4, 9.8, 12.6, 21.7, 24.3, 19.5, 15.2],
    seriesDark: [5.1, 6.9, 10.7, 12.3, 11.5, 8.8, 8.1, 10.4, 16.8, 18.9, 15.7, 12.6],
    activeIndex: 9,
    /* WHY: Supplies the HTML shown in the left chart information panels for education. */
    description: `
      <div data-panel="description">
        <h2>Description</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Data Overview</strong>
            <p>
              Company: LearnSphere Academy Group<br />
              Sector: Education<br />
              Data Type: Monthly subscription and course revenue<br />
              Period: Jan to Dec 2025
            </p>
          </div>

          <div class="panel-section">
            <strong>Transformation</strong>
            <p>
              Revenue is grouped by calendar month<br />
              Current-year values are compared with last year<br />
              Values are rounded to one decimal place
            </p>
          </div>

          <div class="panel-section">
            <strong>Chart Details</strong>
            <p>
              Type: Line chart (dual series)<br />
              Focus: Full-year education revenue<br />
              Highlight: October term revenue peak
            </p>
          </div>

          <div class="panel-section">
            <strong>Insights</strong>
            <p>
              Revenue lifts around enrolment windows<br />
              September and October show term-time strength<br />
              Subscription revenue softens after peak intake
            </p>
          </div>
        </div>
      </div>

      <div data-panel="summary">
        <h2>Summary</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Status Overview</strong>
            <p>
              Revenue Type: Subscription and course revenue<br />
              Comparison: Current year vs previous year
            </p>
          </div>

          <div class="panel-section">
            <strong>Transformation</strong>
            <p>
              Monthly values align with the 12 table rows<br />
              Previous-year revenue provides the baseline<br />
              Each row records one monthly revenue signal
            </p>
          </div>

          <div class="panel-section">
            <strong>Chart Details</strong>
            <p>
              Type: Line chart (dual series)<br />
              Focus: Education revenue movement<br />
              Highlight: October is the strongest month
            </p>
          </div>

          <div class="panel-section">
            <strong>Insights</strong>
            <p>
              Enrolment campaigns lift Q3 and Q4 revenue<br />
              October shows the clearest term-time peak<br />
              Renewal planning should start before December
            </p>
          </div>
        </div>
      </div>
    `,
    /* WHY: Supplies the HTML shown in the right chart information panels for education. */
    outcome: `
      <div data-panel="outcome">
        <h2>Outcome</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Outcome</strong>
            <p>
              Each table row maps to one month of education revenue<br />
              Key revenue changes are sent for review
            </p>
          </div>

          <div class="panel-section">
            <strong>Notes</strong>
            <p>
              Data is reviewed across the full year<br />
              Enrolment and renewal signals remain visible<br />
              Revenue signals support intake planning
            </p>
          </div>
        </div>
      </div>

      <div data-panel="recommendedAction">
        <h2>Recommended Action</h2>
        <div class="side-divider"></div>
        <div class="side-panel-content">
          <div class="panel-section">
            <strong>Plan of Action</strong>
            <p>
              Expand successful enrolment campaigns<br />
              Review renewal planning after October<br />
              Prepare offers before the next intake window
            </p>
          </div>

          <div class="panel-section">
            <strong>Notes</strong>
            <p>
              Compare each month against last year<br />
              Check term-time uplift and subscription churn<br />
              Keep enrolment campaign notes attached
            </p>
          </div>
        </div>
      </div>
    `,
    /* WHY: Provides education table rows in the same column order expected by app.js. */
    rows: [
      [
        "Review",
        "LearnSphere January subscription baseline",
        "Forecast update",
        "31 Jan 2025",
        "Medium",
        "Revenue Monitor",
        false
      ],
      [
        "Ignore",
        "LearnSphere February subscription lift",
        "Subscription lift",
        "28 Feb 2025",
        "Medium",
        "Education Report",
        false
      ],
      [
        "Review",
        "LearnSphere March enrolment campaign impact",
        "Revenue growth",
        "31 Mar 2025",
        "High",
        "CRM Pipeline",
        false
      ],
      [
        "Review",
        "LearnSphere April course revenue peak",
        "Revenue growth",
        "30 Apr 2025",
        "High",
        "Revenue Monitor",
        false
      ],
      [
        "Ignore",
        "LearnSphere May post-intake slowdown",
        "Revenue drop",
        "31 May 2025",
        "Medium",
        "Education Report",
        false
      ],
      [
        "Review",
        "LearnSphere June retention review",
        "Retention risk",
        "30 Jun 2025",
        "Low",
        "Revenue Operations",
        false
      ],
      [
        "Ignore",
        "LearnSphere July summer course dip",
        "Revenue drop",
        "31 Jul 2025",
        "Low",
        "Forecast Model",
        false
      ],
      [
        "Review",
        "LearnSphere August pre-intake pipeline",
        "Pipeline increase",
        "31 Aug 2025",
        "Medium",
        "CRM Pipeline",
        false
      ],
      [
        "Review",
        "LearnSphere September enrolment uplift",
        "Seasonal uplift",
        "30 Sep 2025",
        "High",
        "Education Report",
        false
      ],
      [
        "Review",
        "LearnSphere October term revenue peak",
        "Revenue growth",
        "31 Oct 2025",
        "High",
        "Revenue Monitor",
        true
      ],
      [
        "Ignore",
        "LearnSphere November renewal review",
        "Retention risk",
        "30 Nov 2025",
        "Medium",
        "Billing System",
        false
      ],
      [
        "Review",
        "LearnSphere December course bundle revenue",
        "Seasonal uplift",
        "31 Dec 2025",
        "Medium",
        "Board Pack",
        false
      ]
    ]
  }
};
