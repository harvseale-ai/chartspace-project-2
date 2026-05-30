/* WHY: Stores all dashboard datasets globally so app.js can focus on behaviour instead of raw data. */
window.chartspaceDatasets = {
  /* WHY: Provides the default finance dataset shown when the dashboard first loads. */
  finance: {
    chartTitle: "Finance Chart",
    chartSubtitle: "Monthly policy activity by sector",
    tableTitle: "Finance events",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    seriesLight: [12, 18, 15, 26, 23, 12],
    seriesDark: [8, 11, 5, 9, 6, 3],
    activeIndex: 3,
    /* WHY: Supplies the HTML shown in the left chart information panel for finance. */
    description: `
      <div class="panel-section">
        <strong>Data Overview</strong>
        <p>
          Source: Skills Monitor<br />
          Data Type: Monthly aggregated records<br />
          Last Updated: 12 Sep 2026
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
    /* WHY: Supplies the HTML shown in the right chart information panel for finance. */
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
    /* WHY: Provides finance table rows in the same column order expected by app.js. */
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

  /* WHY: Provides a second dataset so users can compare healthcare activity with finance. */
  healthcare: {
    chartTitle: "Healthcare Chart",
    chartSubtitle: "Monthly healthcare status overview",
    tableTitle: "Healthcare events",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    seriesLight: [10, 14, 19, 22, 18, 13],
    seriesDark: [7, 8, 6, 11, 9, 5],
    activeIndex: 3,
    /* WHY: Supplies the HTML shown in the left chart information panel for healthcare. */
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
    /* WHY: Supplies the HTML shown in the right chart information panel for healthcare. */
    outcome: `
      <div class="panel-section">
        <strong>Outcome</strong>
        <p>
          Critical healthcare changes are escalated for action
        </p>
      </div>
    `,
    /* WHY: Provides healthcare table rows in the same column order expected by app.js. */
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
      ],
      [
        "Review",
        "Care Performance",
        "Updated",
        "18 Aug 2025",
        "Low",
        "Health Monitor",
        false
      ]
    ]
  },

  /* WHY: Provides a third dataset so users can compare education activity with other sectors. */
  education: {
    chartTitle: "Education Chart",
    chartSubtitle: "Education activity and policy monitoring",
    tableTitle: "Education events",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    seriesLight: [14, 16, 20, 24, 21, 17],
    seriesDark: [6, 9, 7, 10, 8, 5],
    activeIndex: 3,
    /* WHY: Supplies the HTML shown in the left chart information panel for education. */
    description: `
      <div class="panel-section">
        <strong>Data Overview</strong>
        <p>
          Education policy and reform tracking<br />
          Monthly grouped activity view
        </p>
      </div>
    `,
    /* WHY: Supplies the HTML shown in the right chart information panel for education. */
    outcome: `
      <div class="panel-section">
        <strong>Outcome</strong>
        <p>
          Key education changes are sent for triage and follow-up
        </p>
      </div>
    `,
    /* WHY: Provides education table rows in the same column order expected by app.js. */
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
