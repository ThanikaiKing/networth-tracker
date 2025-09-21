# Quick Setup Instructions

## 1. Environment Setup

Create a `.env.local` file in the root directory with your Google Sheets credentials:

```bash
# Copy the example file and edit it
cp env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
GOOGLE_SHEETS_API_KEY=your_actual_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_actual_spreadsheet_id_here
GOOGLE_SHEETS_RANGE=Net Worth Tracker!A1:AA125
```

## 2. Google Sheets API Key Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API" 
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated key

## 3. Google Sheet Configuration

1. Make your Google Sheet publicly readable:
   - Open your Google Sheet
   - Click "Share" button
   - Change to "Anyone with the link can view"
   
2. Get Spreadsheet ID:
   - From URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the SPREADSHEET_ID part

## 4. Run the Application

```bash
# Install dependencies
npm install

# Start development server  
npm run dev
```

Open http://localhost:3000 to view the dashboard.

## 5. Mock Data Mode

If you don't configure the API credentials, the app will automatically use mock data so you can test the interface immediately.

## Need Help?

- Check the main README.md for detailed instructions
- Review the troubleshooting section
- Ensure your Google Sheet follows the expected structure
