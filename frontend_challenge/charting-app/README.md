# Ad Metrics Charting Tool

A modern front-end application for visualizing and analyzing Meta and TikTok ad metrics data. Built with Next.js, Tailwind CSS, shadcn/ui, and Recharts.

## Features

- Query metrics data from Meta and TikTok API endpoints
- Visualize metrics in bar or line charts
- Select custom date ranges or use presets
- Interactive UI with responsive design
- Support for various metrics, dimensions, and breakdowns
- Real-time data validation and error handling

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v15)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Language**: TypeScript

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd charting-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

The application connects to the following API endpoints:

- Meta: `https://bizdev.newform.ai/sample-data/meta`
- TikTok: `https://bizdev.newform.ai/sample-data/tiktok`

No authentication token is currently required for these endpoints.

## Usage

1. Select the platform (Meta or TikTok) using the tabs at the top.
2. Configure your query parameters:
   - Select metrics to analyze
   - Choose breakdowns (Meta) or dimensions (TikTok)
   - Select the data level (account, campaign, etc.)
   - Choose a preset date range or set a custom range
   - Configure additional options based on the platform
3. Click "Fetch Data" to query the API
4. View the visualization in the chart area
5. Toggle between bar and line charts using the chart options
6. View a preview of the raw data below the chart

## Architecture

The application follows a component-based architecture:

- `app/page.tsx`: Main component integrating all elements
- `app/components/`: UI components for the application
- `app/lib/api.ts`: API client for data fetching
- `app/components/ui/`: shadcn/ui components

## AI-Assisted Development

This project was developed with the assistance of Claude 3.7 Sonnet in Cursor, which helped with:

- Scaffolding the project structure
- Implementing shadcn/ui components
- Creating the API client with proper typing
- Building responsive UI layouts
- Debugging and refinement

## License

MIT

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Anthropic's Claude](https://www.anthropic.com/)
