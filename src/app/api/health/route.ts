// API Route: /api/health
// Health check for Google Sheets API connectivity

import { NextResponse } from 'next/server';
import { createSheetsService } from '@/lib/sheets';
import { ApiResponse } from '@/lib/types';

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'mock';
  timestamp: string;
  sheetsConnection: boolean;
  lastUpdate?: string;
  message: string;
}

export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    
    // Check if we have proper API credentials
    const hasCredentials = 
      process.env.GOOGLE_SHEETS_API_KEY !== 'YOUR_API_KEY_HERE' &&
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE' &&
      process.env.GOOGLE_SHEETS_API_KEY &&
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!hasCredentials) {
      const mockResponse: ApiResponse<HealthCheckResponse> = {
        success: true,
        data: {
          status: 'mock',
          timestamp,
          sheetsConnection: false,
          message: 'Running in mock mode - Google Sheets credentials not configured',
        },
      };
      
      return NextResponse.json(mockResponse, { status: 200 });
    }

    // Test actual Google Sheets connection
    const sheetsService = createSheetsService();
    const isConnected = await sheetsService.validateConnection();

    if (isConnected) {
      const healthyResponse: ApiResponse<HealthCheckResponse> = {
        success: true,
        data: {
          status: 'healthy',
          timestamp,
          sheetsConnection: true,
          lastUpdate: timestamp,
          message: 'Google Sheets API connection is healthy',
        },
      };

      return NextResponse.json(healthyResponse, { status: 200 });
    } else {
      const unhealthyResponse: ApiResponse<HealthCheckResponse> = {
        success: false,
        data: {
          status: 'unhealthy',
          timestamp,
          sheetsConnection: false,
          message: 'Google Sheets API connection failed',
        },
      };

      return NextResponse.json(unhealthyResponse, { status: 503 });
    }

  } catch (error: unknown) {
    console.error('Health check error:', error);
    
    const errorResponse: ApiResponse<HealthCheckResponse> = {
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        sheetsConnection: false,
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
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
