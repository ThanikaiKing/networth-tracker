# Net Worth Dashboard

A modern, responsive web dashboard for visualizing personal net worth data from Google Sheets. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📊 **Interactive Charts** - Beautiful line charts showing net worth trends over time
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🔄 **Real-time Data** - Fetches fresh data from Google Sheets on every page load
- 📈 **Key Metrics** - Current net worth, total growth, and growth rate calculations
- ⏰ **Time Filtering** - View data for different time periods (1 month, 3 months, 6 months, all time)
- 🎨 **Modern UI** - Clean, professional design with loading states and error handling
- 💰 **Indian Currency Support** - Proper formatting for ₹ (Indian Rupees)

## Technology Stack

- **Frontend**: Next.js 15+ with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Data Source**: Google Sheets API v4
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

1. Node.js 18+ installed on your system
2. A Google Cloud Project with Sheets API enabled
3. Google Sheets API key
4. A Google Sheet with your net worth data

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd networth-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`:
   ```env
   GOOGLE_SHEETS_API_KEY=your_api_key_here
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
   GOOGLE_SHEETS_RANGE=Net Worth Tracker!A1:AA125
   ```

### Google Sheets Setup

Your Google Sheet should have the following structure:

- **Row 3**: Date headers (e.g., "Apr, 2025", "May, 2025")
- **Row 18**: Bank accounts subtotal
- **Row 36**: Investment accounts subtotal
- **Row 51**: Other assets subtotal
- **Row 66**: Debt subtotal
- **Row 70**: Net worth values
- **Row 71**: Month-over-month changes

#### Sample Data Structure:
```
| Institution | Name/Type     | Apr, 2025 | May, 2025 | ... |
|-------------|---------------|-----------|-----------|-----|
| Bank Accounts |             |           |           |     |
|             | HDFC account  | ₹33,940   | ₹11,854   |     |
|             | IDFC account  | ₹2,20,000 | ₹4,42,845 |     |
| Subtotal - bank accounts   | | ₹4,88,699 | ₹7,01,422 |     |
```

### Getting Google Sheets API Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
5. Make your Google Sheet publicly readable:
   - Open your Google Sheet
   - Click "Share" > "Change to anyone with the link"
   - Set permissions to "Viewer"
6. Get your Spreadsheet ID:
   - Copy the ID from your Google Sheet URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployment

#### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel:
   - Go to Project Settings > Environment Variables
   - Add `GOOGLE_SHEETS_API_KEY`
   - Add `GOOGLE_SHEETS_SPREADSHEET_ID`
   - Add `GOOGLE_SHEETS_RANGE` (optional, defaults to "Net Worth Tracker!A1:AA125")
4. Deploy!

The app will automatically deploy on every push to your main branch.

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_SHEETS_API_KEY` | Your Google Sheets API key | Yes |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | ID of your Google Sheet | Yes |
| `GOOGLE_SHEETS_RANGE` | Sheet name and cell range | No (defaults to "Net Worth Tracker!A1:AA125") |

### Customization

The dashboard is built with modularity in mind. You can easily customize:

- **Colors**: Modify the Tailwind CSS classes in components
- **Metrics**: Add new calculation functions in `src/lib/utils.ts`
- **Chart Options**: Customize chart appearance in `src/hooks/useChartData.ts`
- **Time Periods**: Add new filter options in `src/components/Dashboard/PeriodSelector.tsx`

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   │   ├── health/     # Health check endpoint
│   │   └── sheets/     # Google Sheets integration
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/         # React components
│   ├── Dashboard/      # Dashboard-specific components
│   └── common/         # Reusable components
├── hooks/              # Custom React hooks
└── lib/                # Utilities and types
    ├── types.ts        # TypeScript interfaces
    ├── utils.ts        # Helper functions
    └── sheets.ts       # Google Sheets service
```

## API Endpoints

- `GET /api/sheets/networth?period=all` - Fetch net worth data
- `GET /api/health` - Health check for Google Sheets connectivity

## Features in Detail

### Dashboard Components

1. **Metrics Cards**: Display current net worth, total growth, and growth rate
2. **Interactive Chart**: Line chart with hover tooltips and smooth animations
3. **Period Selector**: Filter data by time periods (responsive design)
4. **Error Handling**: Graceful error states with retry functionality
5. **Loading States**: Skeleton loaders and spinners for better UX

### Data Processing

- Automatic parsing of Indian currency format (₹1,23,456)
- Data validation and error handling
- Time period filtering
- Growth rate calculations
- Asset allocation breakdowns

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**:
   - Verify your API key in `.env.local`
   - Check that the Google Sheets API is enabled in Google Cloud Console

2. **"Spreadsheet not found" error**:
   - Verify the spreadsheet ID in `.env.local`
   - Ensure the sheet is publicly readable or use service account authentication

3. **"No data found" error**:
   - Check that your sheet has data in the expected rows
   - Verify the range in `GOOGLE_SHEETS_RANGE` matches your sheet structure

4. **Charts not loading**:
   - Check browser console for JavaScript errors
   - Verify Chart.js dependencies are properly installed

### Mock Data Mode

If you haven't configured Google Sheets credentials yet, the app will automatically use mock data for development and testing purposes.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
1. Check the troubleshooting section above
2. Review the Google Sheets API documentation
3. Open an issue on GitHub

---

Built with ❤️ for personal finance tracking and visualization.