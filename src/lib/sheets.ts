// Google Sheets API integration service

import { SheetsConfig, NetWorthEntry, DashboardData } from './types';
import { extractNetWorthData, calculateGrowthRate, calculateTotalGrowth, validateNetWorthData } from './utils';

export class GoogleSheetsService {
  private config: SheetsConfig;

  constructor(config: SheetsConfig) {
    this.config = config;
  }

  /**
   * Fetch raw data from Google Sheets API
   */
  async fetchData(): Promise<unknown[][]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${this.config.range}?key=${this.config.apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.values) {
        throw new Error('No data found in the spreadsheet');
      }

      return data.values;
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Transform raw sheet data into structured NetWorthEntry objects
   */
  async transformData(rawData: unknown[][]): Promise<NetWorthEntry[]> {
    try {
      const entries = extractNetWorthData(rawData as string[][]);
      
      if (!validateNetWorthData(entries)) {
        throw new Error('Invalid data structure received from Google Sheets');
      }

      return entries;
    } catch (error) {
      console.error('Error transforming sheet data:', error);
      throw error;
    }
  }

  /**
   * Fetch and process complete dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      const rawData = await this.fetchData();
      const entries = await this.transformData(rawData);

      if (entries.length === 0) {
        throw new Error('No valid net worth entries found');
      }

      const currentNetWorth = entries[entries.length - 1].netWorth;
      const totalGrowth = calculateTotalGrowth(entries);
      const growthRate = calculateGrowthRate(entries);

      return {
        entries,
        summary: {
          currentNetWorth,
          totalGrowth,
          growthRate,
          period: `${entries[0].date} - ${entries[entries.length - 1].date}`,
          currency: 'INR',
        },
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  /**
   * Validate API connection
   */
  async validateConnection(): Promise<boolean> {
    try {
      await this.fetchData();
      return true;
    } catch (error) {
      console.error('Google Sheets connection validation failed:', error);
      return false;
    }
  }
}

/**
 * Factory function to create Google Sheets service instance
 */
export const createSheetsService = (): GoogleSheetsService => {
  const config: SheetsConfig = {
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID_HERE',
    range: process.env.GOOGLE_SHEETS_RANGE || 'Net Worth Tracker!A1:AA125',
    apiKey: process.env.GOOGLE_SHEETS_API_KEY || 'YOUR_API_KEY_HERE',
  };

  return new GoogleSheetsService(config);
};

/**
 * Helper function to handle API errors
 */
export const handleSheetsError = (error: unknown): string => {
  const errorMessage = error instanceof Error ? error.message : '';
  
  if (errorMessage.includes('API key')) {
    return 'Invalid API key. Please check your Google Sheets API configuration.';
  }
  
  if (errorMessage.includes('spreadsheet')) {
    return 'Spreadsheet not found. Please check the spreadsheet ID.';
  }
  
  if (errorMessage.includes('range')) {
    return 'Invalid range specified. Please check the sheet name and range.';
  }
  
  if (errorMessage.includes('quota')) {
    return 'API quota exceeded. Please try again later.';
  }
  
  return errorMessage || 'An unknown error occurred while fetching data.';
};
