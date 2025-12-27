import axios from 'axios';

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE!;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY!;
const MPESA_AUTH_URL = process.env.MPESA_AUTH_URL!; // Use sandbox for dev, change for prod

// Simple in-memory cache for the access token
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export function getTimestamp(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hour}${minute}${second}`;
}

export function generatePassword(timestamp: string): string {
  const str = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`;
  return Buffer.from(str).toString('base64');
}

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');

  try {
    const response = await axios.get(MPESA_AUTH_URL, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const { access_token, expires_in } = response.data;
    cachedToken = access_token;
    // Set expiry to slightly less than the actual expiry (e.g., 3500 seconds instead of 3599) to be safe
    tokenExpiry = now + (parseInt(expires_in) - 100) * 1000; 

    return access_token;
  } catch (error) {
    console.error('Error fetching Mpesa access token:', error);
    throw new Error('Failed to get Mpesa access token');
  }
}
