// API Route: /api/sheets/networth
// Fetches and transforms Google Sheets data for the dashboard

import { NextRequest, NextResponse } from 'next/server';
import { createSheetsService, handleSheetsError } from '@/lib/sheets';
import { filterDataByPeriod, generateMockData } from '@/lib/utils';
import { TimePeriod, ApiResponse, DashboardData } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get('period') || 'all') as TimePeriod;
    
    // Check if we have proper API credentials
    const hasCredentials = 
      process.env.GOOGLE_SHEETS_API_KEY !== 'YOUR_API_KEY_HERE' &&
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE' &&
      process.env.GOOGLE_SHEETS_API_KEY &&
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!hasCredentials) {
      console.log('Using mock data - Google Sheets credentials not configured');
      
      // Return mock data for development
      const mockEntries = generateMockData();
      const filteredEntries = filterDataByPeriod(mockEntries, period);
      
      const mockResponse: ApiResponse<DashboardData> = {
        success: true,
        data: {
          entries: filteredEntries,
          summary: {
            currentNetWorth: filteredEntries[filteredEntries.length - 1].netWorth,
            totalGrowth: filteredEntries[filteredEntries.length - 1].netWorth - filteredEntries[0].netWorth,
            growthRate: 12.5, // Mock growth rate
            period: `${filteredEntries[0].date} - ${filteredEntries[filteredEntries.length - 1].date}`,
            currency: 'INR',
          },
        },
      };
      
      return NextResponse.json(mockResponse, { status: 200 });
    }

    // Use real Google Sheets API
    const sheetsService = createSheetsService();
    const dashboardData = await sheetsService.getDashboardData();
    
    // Filter data based on period parameter
    const filteredEntries = filterDataByPeriod(dashboardData.entries, period);
    
    // Recalculate summary for filtered data
    const filteredData: DashboardData = {
      entries: filteredEntries,
      summary: {
        ...dashboardData.summary,
        period: period === 'all' 
          ? dashboardData.summary.period 
          : `${filteredEntries[0]?.date || ''} - ${filteredEntries[filteredEntries.length - 1]?.date || ''}`,
      },
    };

    const response: ApiResponse<DashboardData> = {
      success: true,
      data: filteredData,
    };

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error: unknown) {
    console.error('API Error in /api/sheets/networth:', error);
    
    const errorResponse: ApiResponse<DashboardData> = {
      success: false,
      error: handleSheetsError(error),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
