# Net Worth Dashboard - Design Document

## Project Overview

A personal net worth visualization dashboard that connects to Google Sheets API to display monthly financial data through interactive charts and metrics. The application will be built with Next.js, TypeScript, and Tailwind CSS, hosted on Vercel.

## Requirements Summary

- **Data Source**: Google Sheets API with monthly net worth data
- **Primary Visualization**: Line chart showing asset growth over time
- **Key Metrics**: Total net worth and growth rate
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS
- **Hosting**: Vercel
- **Features**: Mobile responsive, interactive charts, time period filtering
- **Data Policy**: Fresh data on each page load, no caching

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │  Google Sheets  │
│   (Next.js)     │◄──►│  (API Routes)   │◄──►│      API        │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - Data fetch    │    │ - Raw financial │
│ - Charts        │    │ - Data transform│    │   data          │
│ - Metrics       │    │ - Error handling│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2 or Recharts
- **API Integration**: Google Sheets API v4
- **Authentication**: Google Service Account (server-side)
- **Deployment**: Vercel
- **Package Manager**: npm/yarn

## Data Structure

### Actual Google Sheets Structure
Based on the provided CSV export, your sheet has the following structure:

**Date Format**: "Apr, 2025", "May, 2025", etc. (columns 4-27)
**Currency**: Indian Rupees (₹)
**Data Period**: Currently Apr 2025 to Sep 2025 (6 months)

**Main Categories:**

1. **Bank Accounts** (Subtotal row 18):
   - HDFC account
   - IDFC account  
   - Federal bank
   - Zerodha funds

2. **Investment Accounts** (Subtotal row 36):
   - Equity
   - Mutual funds
   - Gold
   - EPF (Employee Provident Fund)
   - NPS (National Pension System)
   - FD (Fixed Deposit)
   - BetterInvest
   - Walmart shares
   - **Edyar land** (Real estate - Own home construction)
   - **Bhive** (Commercial real estate - LLP partner, ~18% returns)
   - **Aston grey** (Commercial real estate - LLP partner, ~18% returns)

3. **Other Assets** (Subtotal row 51):
   - (Real estate assets moved to Investment Accounts)

4. **Debt** (Subtotal row 66):
   - Home loan
   - Personal loan

5. **Summary Calculations** (rows 68-72):
   - Total Assets
   - Total Debt
   - Net Worth
   - Month-over-month change
   - Year-over-year change

### API Data Model

```typescript
interface BankAccount {
  name: string;
  values: number[];
}

interface InvestmentAccount {
  name: string;
  values: number[];
}

interface Asset {
  name: string;
  values: number[];
}

interface Debt {
  name: string;
  values: number[];
}

interface NetWorthEntry {
  date: string;
  bankAccounts: {
    accounts: BankAccount[];
    subtotal: number;
  };
  investments: {
    accounts: InvestmentAccount[];
    subtotal: number;
  };
  otherAssets: {
    assets: Asset[];
    subtotal: number;
  };
  debt: {
    debts: Debt[];
    subtotal: number;
  };
  totalAssets: number;
  totalDebt: number;
  netWorth: number;
  monthOverMonthChange?: number;
  yearOverYearChange?: number;
}

interface DashboardData {
  entries: NetWorthEntry[];
  summary: {
    currentNetWorth: number;
    totalGrowth: number;
    growthRate: number;
    period: string;
    currency: string;
  };
}
```

## API Layer Design

### API Routes

#### `/api/sheets/networth`
- **Method**: GET
- **Purpose**: Fetch and transform Google Sheets data
- **Query Parameters**:
  - `period?`: string (`all` | `6months` | `3months` | `1month`)
- **Response**: `DashboardData`

#### `/api/health`
- **Method**: GET
- **Purpose**: Health check for Google Sheets API connectivity
- **Response**: Connection status and last update timestamp

### Google Sheets Integration

```typescript
// Configuration
interface SheetsConfig {
  spreadsheetId: string;
  range: string; // 'Net Worth Tracker!A1:AA125' (to cover all data)
  apiKey: string;
  serviceAccountEmail?: string;
  privateKey?: string;
}

// API Service
class GoogleSheetsService {
  async fetchData(config: SheetsConfig): Promise<any[][]>
  async transformData(rawData: any[][]): Promise<NetWorthEntry[]>
  validateData(data: NetWorthEntry[]): boolean
}

// Data transformation logic specific to your sheet structure
const parseNetWorthData = (rawData: any[][]): NetWorthEntry[] => {
  // Extract date headers from row 3 (index 2)
  const dateHeaders = rawData[2].slice(3, 27); // Columns D-AA
  
  // Parse each month's data
  const entries: NetWorthEntry[] = [];
  
  dateHeaders.forEach((dateStr, colIndex) => {
    const colNum = colIndex + 3; // Adjust for 0-based indexing
    
    // Extract values for this month
    const bankSubtotal = parseValue(rawData[17][colNum]); // Row 18
    const investmentSubtotal = parseValue(rawData[35][colNum]); // Row 36  
    const assetsSubtotal = parseValue(rawData[50][colNum]); // Row 51
    const debtSubtotal = parseValue(rawData[65][colNum]); // Row 66
    const totalAssets = parseValue(rawData[67][colNum]); // Row 68
    const totalDebt = parseValue(rawData[68][colNum]); // Row 69
    const netWorth = parseValue(rawData[69][colNum]); // Row 70
    const monthOverMonthChange = parseValue(rawData[70][colNum]); // Row 71
    
    entries.push({
      date: dateStr,
      bankAccounts: { subtotal: bankSubtotal, accounts: [] },
      investments: { subtotal: investmentSubtotal, accounts: [] },
      otherAssets: { subtotal: assetsSubtotal, assets: [] },
      debt: { subtotal: Math.abs(debtSubtotal), debts: [] },
      totalAssets,
      totalDebt: Math.abs(totalDebt),
      netWorth,
      monthOverMonthChange
    });
  });
  
  return entries.filter(entry => entry.netWorth > 0); // Filter out empty months
};

// Helper to parse Indian currency format
const parseValue = (value: string): number => {
  if (!value || value === '₹0' || value === '₹0') return 0;
  
  // Remove currency symbol and commas, handle negative values
  const cleaned = value.replace(/[₹,]/g, '').replace(/"/g, '');
  return parseFloat(cleaned) || 0;
};
```

## Frontend Components

### Page Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Dashboard)
│   └── api/
│       ├── sheets/
│       │   └── networth/route.ts
│       └── health/route.ts
├── components/
│   ├── Dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── MetricsCards.tsx
│   │   ├── NetWorthChart.tsx
│   │   ├── PeriodSelector.tsx
│   │   └── LoadingSpinner.tsx
│   └── common/
│       ├── Header.tsx
│       └── ErrorBoundary.tsx
├── hooks/
│   ├── useNetWorthData.ts
│   └── useChartData.ts
├── lib/
│   ├── sheets.ts
│   ├── utils.ts
│   └── types.ts
└── styles/
    └── globals.css
```

### Component Specifications

#### DashboardLayout.tsx
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Main layout wrapper with responsive grid
// Header + Main content area
// Mobile-first design with breakpoints
```

#### MetricsCards.tsx
```typescript
interface MetricsCardsProps {
  currentNetWorth: number;
  totalGrowth: number;
  growthRate: number;
  isLoading: boolean;
}

// Display key financial metrics in card format
// Color-coded growth indicators (green/red)
// Responsive card grid layout
```

#### NetWorthChart.tsx
```typescript
interface NetWorthChartProps {
  data: NetWorthEntry[];
  selectedPeriod: string;
  isLoading: boolean;
}

// Interactive line chart using Chart.js/Recharts
// Hover tooltips showing exact values
// Responsive design for mobile
// Loading states and error handling
```

#### PeriodSelector.tsx
```typescript
interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  availablePeriods: string[];
}

// Dropdown/tabs for time period selection
// Options: All time, 6 months, 3 months, 1 month
```

## User Interface Design

### Layout & Responsive Design

#### Desktop Layout (1024px+)
```
┌─────────────────────────────────────────────────┐
│                    Header                        │
├─────────────┬───────────────┬───────────────────┤
│ Current Net │ Total Growth  │ Growth Rate       │
│ Worth Card  │ Card          │ Card              │
├─────────────┴───────────────┴───────────────────┤
│                                                 │
│              Net Worth Chart                    │
│                                                 │
│         [Period Selector: All|6M|3M|1M]         │
└─────────────────────────────────────────────────┘
```

#### Mobile Layout (768px and below)
```
┌─────────────────────────────┐
│           Header            │
├─────────────────────────────┤
│      Current Net Worth      │
├─────────────────────────────┤
│       Total Growth          │
├─────────────────────────────┤
│       Growth Rate           │
├─────────────────────────────┤
│                             │
│      Net Worth Chart        │
│                             │
│   [Period Selector]         │
└─────────────────────────────┘
```

### Color Scheme & Styling

- **Primary Colors**: 
  - Success Green: `#10B981` (positive growth)
  - Warning Red: `#EF4444` (negative growth)
  - Neutral Gray: `#6B7280` (labels, text)
- **Background**: `#F9FAFB` (light gray)
- **Cards**: White with subtle shadow
- **Chart**: Blue gradient line with hover effects

### Typography
- **Headers**: Inter font, font-semibold
- **Metrics**: Large numbers, font-bold
- **Labels**: text-sm, text-gray-600

## Features Implementation

### 1. Interactive Chart
- **Library**: Chart.js with react-chartjs-2
- **Features**:
  - Hover tooltips with date and value
  - Smooth animations on load
  - Responsive scaling
  - Grid lines and axis labels
  - Point markers on data points

### 2. Time Period Filtering
- **Implementation**: Client-side data filtering
- **Options**: 
  - All time (default)
  - Last 6 months
  - Last 3 months 
  - Last 1 month
- **Behavior**: Chart updates dynamically with animation

### 3. Metrics Calculation
```typescript
// Growth Rate Calculation
const calculateGrowthRate = (data: NetWorthEntry[]): number => {
  if (data.length < 2) return 0;
  
  const oldest = data[0].netWorth;
  const newest = data[data.length - 1].netWorth;
  const months = data.length - 1;
  
  return ((newest - oldest) / oldest) * 100;
};

// Total Growth (absolute change)
const calculateTotalGrowth = (data: NetWorthEntry[]): number => {
  if (data.length < 2) return 0;
  return data[data.length - 1].netWorth - data[0].netWorth;
};

// Asset Allocation Breakdown
const calculateAssetAllocation = (latestEntry: NetWorthEntry) => {
  const total = latestEntry.totalAssets;
  return {
    bankAccounts: (latestEntry.bankAccounts.subtotal / total) * 100,
    investments: (latestEntry.investments.subtotal / total) * 100,
    otherAssets: (latestEntry.otherAssets.subtotal / total) * 100,
  };
};

// Debt-to-Asset Ratio
const calculateDebtToAssetRatio = (entry: NetWorthEntry): number => {
  return (entry.totalDebt / entry.totalAssets) * 100;
};

// Monthly Growth Trend
const calculateMonthlyGrowthTrend = (data: NetWorthEntry[]): number[] => {
  return data.map(entry => entry.monthOverMonthChange || 0);
};

// Best and Worst Performing Months
const getPerformanceHighlights = (data: NetWorthEntry[]) => {
  const validChanges = data
    .map((entry, index) => ({ 
      month: entry.date, 
      change: entry.monthOverMonthChange || 0,
      index 
    }))
    .filter(item => item.change !== 0);
    
  const bestMonth = validChanges.reduce((max, curr) => 
    curr.change > max.change ? curr : max
  );
  
  const worstMonth = validChanges.reduce((min, curr) => 
    curr.change < min.change ? curr : min
  );
  
  return { bestMonth, worstMonth };
};

// Format currency for display
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
```

### 4. Loading States
- **Chart**: Skeleton loader with animated bars
- **Metrics**: Shimmer effect on cards
- **Error States**: Friendly error messages with retry button

## API Integration

### Environment Variables
```env
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_RANGE=Net Worth Tracker!A1:AA125
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your_private_key
```

### Specific Implementation Details for Your Data

Based on the actual CSV structure analyzed:

```typescript
// Row mapping constants for your specific sheet
const SHEET_ROWS = {
  DATE_HEADERS: 2, // Row 3 (0-indexed)
  BANK_SUBTOTAL: 17, // Row 18
  INVESTMENT_SUBTOTAL: 35, // Row 36
  ASSETS_SUBTOTAL: 50, // Row 51
  DEBT_SUBTOTAL: 65, // Row 66
  TOTAL_ASSETS: 67, // Row 68
  TOTAL_DEBT: 68, // Row 69
  NET_WORTH: 69, // Row 70
  MONTH_CHANGE: 70, // Row 71
} as const;

const SHEET_COLUMNS = {
  DATA_START: 3, // Column D (0-indexed)
  DATA_END: 26, // Column AA (0-indexed)
} as const;

// Data extraction function tailored to your sheet
const extractNetWorthData = (rawData: string[][]): NetWorthEntry[] => {
  const dateHeaders = rawData[SHEET_ROWS.DATE_HEADERS]
    .slice(SHEET_COLUMNS.DATA_START, SHEET_COLUMNS.DATA_END + 1);
  
  const entries: NetWorthEntry[] = [];
  
  dateHeaders.forEach((dateStr, colIndex) => {
    if (!dateStr) return; // Skip empty date columns
    
    const actualColIndex = SHEET_COLUMNS.DATA_START + colIndex;
    
    // Extract all values for this month
    const netWorth = parseIndianCurrency(rawData[SHEET_ROWS.NET_WORTH][actualColIndex]);
    
    // Only process months with actual data
    if (netWorth > 0) {
      entries.push({
        date: dateStr,
        bankAccounts: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.BANK_SUBTOTAL][actualColIndex]),
          accounts: [] // Can be populated with individual account details if needed
        },
        investments: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.INVESTMENT_SUBTOTAL][actualColIndex]),
          accounts: []
        },
        otherAssets: {
          subtotal: parseIndianCurrency(rawData[SHEET_ROWS.ASSETS_SUBTOTAL][actualColIndex]),
          assets: []
        },
        debt: {
          subtotal: Math.abs(parseIndianCurrency(rawData[SHEET_ROWS.DEBT_SUBTOTAL][actualColIndex])),
          debts: []
        },
        totalAssets: parseIndianCurrency(rawData[SHEET_ROWS.TOTAL_ASSETS][actualColIndex]),
        totalDebt: Math.abs(parseIndianCurrency(rawData[SHEET_ROWS.TOTAL_DEBT][actualColIndex])),
        netWorth,
        monthOverMonthChange: parseIndianCurrency(rawData[SHEET_ROWS.MONTH_CHANGE][actualColIndex])
      });
    }
  });
  
  return entries;
};

// Enhanced Indian currency parser
const parseIndianCurrency = (value: string | undefined): number => {
  if (!value || value === '' || value === '₹0') return 0;
  
  // Handle various formats: "₹33,940", "₹2,20,000", "-₹3,264,441"
  const cleaned = value
    .toString()
    .replace(/[₹,"]/g, '') // Remove currency symbol and commas
    .trim();
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};
```

### Authentication Options

#### Option 1: API Key (Simpler, requires public sheet)
```typescript
const response = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
);
```

#### Option 2: Service Account (More secure, private sheets)
```typescript
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
```

### Error Handling
- **Network Errors**: Retry logic with exponential backoff
- **API Errors**: User-friendly error messages
- **Data Validation**: Schema validation for incoming data
- **Rate Limiting**: Respect Google API quotas

## Performance Considerations

### Data Fetching
- **Fresh Data Policy**: Fetch on every page load as requested
- **Request Optimization**: Only fetch required range/columns
- **Client-side Caching**: Session-based caching for chart period switching

### Bundle Optimization
- **Code Splitting**: Dynamic imports for chart components
- **Tree Shaking**: Import only required chart.js components
- **Image Optimization**: Next.js Image component for any icons/graphics

### Mobile Performance
- **Touch Interactions**: Optimized chart interactions for mobile
- **Bundle Size**: Minimize JavaScript payload
- **Loading Priority**: Critical CSS inline, non-critical deferred

## Deployment Configuration

### Vercel Configuration (`vercel.json`)
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "GOOGLE_SHEETS_API_KEY": "@google_sheets_api_key",
    "GOOGLE_SHEETS_SPREADSHEET_ID": "@google_sheets_spreadsheet_id",
    "GOOGLE_SHEETS_RANGE": "@google_sheets_range"
  }
}
```

### Build Configuration
```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## Security Considerations

### API Security
- **Environment Variables**: All sensitive data in env vars
- **API Routes**: Server-side only Google API calls
- **CORS**: Restrict API access to your domain
- **Rate Limiting**: Implement request throttling if needed

### Data Privacy
- **Personal Data**: No user authentication or data storage
- **API Keys**: Never expose credentials in client-side code
- **HTTPS**: Ensure all connections are encrypted

## Testing Strategy

### Unit Testing
- **API Routes**: Test data fetching and transformation
- **Utility Functions**: Test growth calculations
- **Component Logic**: Test period filtering logic

### Integration Testing
- **Google Sheets**: Mock API responses for testing
- **Chart Rendering**: Test chart with various data sets
- **Responsive Design**: Test across device sizes

### Manual Testing Checklist
- [ ] Chart loads with real data
- [ ] Period filtering works correctly
- [ ] Mobile responsive design
- [ ] Error states display properly
- [ ] Loading states are smooth

## Future Enhancements

### Phase 2 Features
- **Asset Breakdown Chart**: Pie chart showing asset allocation
- **Month-over-Month Comparison**: Bar chart comparing monthly changes
- **Goals Tracking**: Target net worth goals with progress indicators
- **Export Functionality**: PDF/PNG export of charts

### Phase 3 Features
- **Multiple Sheet Support**: Track different portfolios/accounts
- **Automated Notifications**: Email alerts for significant changes
- **Historical Snapshots**: Compare current vs. previous time periods
- **Data Backup**: Export historical data as JSON/CSV

## Implementation Timeline

### Week 1: Project Setup & API Integration
- [ ] Next.js project initialization
- [ ] Google Sheets API integration
- [ ] Basic data fetching and transformation
- [ ] API route implementation

### Week 2: Core Dashboard Development
- [ ] Layout components
- [ ] Chart implementation
- [ ] Metrics cards
- [ ] Period selector

### Week 3: Polish & Testing
- [ ] Mobile responsiveness
- [ ] Loading states and error handling
- [ ] Performance optimization
- [ ] Testing and debugging

### Week 4: Deployment & Documentation
- [ ] Vercel deployment setup
- [ ] Environment configuration
- [ ] Final testing
- [ ] Documentation completion

## Enhanced Visualization Opportunities

Based on your rich data structure, here are additional visualizations that could be implemented in future phases:

### Phase 1.5 (Near-term enhancements)
- **Asset Allocation Pie Chart**: Show breakdown of Bank Accounts, Investments, and Other Assets
- **Debt Tracking**: Separate visualization showing debt reduction over time
- **Monthly Change Bar Chart**: Visualize month-over-month changes as bars

### Phase 2 (Future Features)
- **Investment Performance**: Line chart specifically for investment accounts growth
- **Debt-to-Asset Ratio Trend**: Track how your debt ratio changes over time  
- **Asset Category Breakdown**: Stacked area chart showing how each category contributes to total assets
- **Goal Tracking**: Set target net worth goals with progress indicators

### Phase 3 (Advanced Analytics)
- **Savings Rate Calculation**: If income data is added, calculate and track savings rate
- **Asset Velocity**: Track which asset categories are growing fastest
- **Scenario Analysis**: What-if calculations for different investment scenarios

## Google Sheets API Integration Notes

Based on your data structure:
- **Sheet Name**: "Net Worth Tracker" (or as configured)
- **Range**: A1:AA125 to capture all current data plus future expansion
- **Key Rows**: 
  - Row 3: Date headers
  - Row 18: Bank subtotal  
  - Row 36: Investment subtotal
  - Row 51: Assets subtotal
  - Row 66: Debt subtotal
  - Row 70: Net Worth
  - Row 71: Month-over-month change

## Remaining Configuration Items

Since I now have your data structure, here are the remaining items to clarify for implementation:

1. **Google Sheets API Key**: You mentioned you have this ready - we'll need it for the environment variables
2. **Spreadsheet ID**: The unique ID from your Google Sheets URL
3. **Sheet Access Method**: Do you prefer API key access (requires sheet to be publicly readable) or service account authentication (more secure for private sheets)?
4. **Domain/Deployment URL**: For CORS configuration if needed

This design document now provides a comprehensive foundation tailored specifically to your net worth tracking data structure and can proceed with implementation.
