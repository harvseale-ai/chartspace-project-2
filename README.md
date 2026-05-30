# ChartSpace

ChartSpace is a single-page JavaScript dashboard for monitoring sector activity across finance, healthcare, and education. It turns monthly event data into a visual chart, contextual side panels, and an interactive table so users can scan trends, review records, and export selected rows.

## User Value

The project is designed for users who need a quick overview of tracked events without moving between reports. It supports fast comparison between sectors, highlights summary metrics, and gives users simple controls for filtering, reviewing, and exporting information.

## Features

- Responsive single-page dashboard built with HTML, CSS, and JavaScript
- Dynamic SVG line chart rendered with JavaScript
- Dataset switching for finance, healthcare, and education
- Interactive event table with selectable rows and editable status labels
- CSV export for selected table rows
- Expandable chart information panels
- Dark and light theme toggle
- Weather popup using the Open-Meteo API
- About modal explaining the purpose of the dashboard
- Mobile, tablet, and desktop responsive layout using Flexbox, Grid, and media queries

## Technologies

- HTML5
- CSS3
- JavaScript
- SVG
- Open-Meteo API
- Lucide icons

## Project Structure

```text
chartspace-project-2/
├── assets/
│   ├── css/
│   │   ├── chart.css
│   │   └── style.css
│   ├── images/
│   │   └── chartspace-logo.png
│   └── js/
│       ├── app.js
│       └── data.js
├── index.html
└── README.md
```

## How to View Locally

Open `index.html` in a browser.

For a local server, run:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Deployment

Deployment URL: to be added after publishing.

Recommended deployment options:

- GitHub Pages
- Netlify
- Vercel

After deployment, check that the deployed version matches the local version and that the chart, table interactions, theme toggle, weather popup, about modal, and CSV export still work.

## Testing and Validation

Checks completed during development:

- JavaScript syntax checked with `node --check assets/js/app.js`
- Internal image references checked for the logo asset
- Unused `.DS_Store` files removed and ignored with `.gitignore`

Checks still to complete before final submission:

- Run JavaScript through a linter
- Validate HTML with the W3C Validator
- Validate CSS with the Jigsaw CSS Validator
- Test the deployed site on mobile, tablet, and desktop
- Confirm there are no console errors in the browser

## Screenshots

Screenshots should be added before final submission:

- Desktop dashboard view
- Mobile responsive view
- Dark mode view
- Weather popup view

## Credits

- Weather data: [Open-Meteo](https://open-meteo.com/)
- Icons: [Lucide](https://lucide.dev/)
- Project built for the WAES Full Stack Bootcamp JavaScript Project 2 submission

## AI Usage and Reflection

AI tools were used to support code review, debugging, project cleanup, documentation planning, and commit organisation.

AI helped identify missing checklist items such as README documentation, validation evidence, deployment notes, unused files, and JavaScript separation. It also helped organise the Git history into clearer commits so the project development path is easier to review.

The main benefit was faster feedback on project readiness and code quality. The main limitation was that AI suggestions still needed human review, especially for project-specific details such as deployment links, screenshots, and final validation results.
