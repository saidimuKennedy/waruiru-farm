import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getAccessToken, generatePassword, getTimestamp } from '@/lib/mpesa';
import axios from 'axios';

const XXXXXXXXX1 = process.env.MPESA_SHORTCODE!;
const XXXXXXXXX2 = process.env.MPESA_CALLBACK_URL!;
const XXXXXXXXX3 = process.env.MPESA_STK_PUSH_URL!; // Use sandbox for dev

export async function POST(req: Request) {
  try {
    const { orderId, amount, phoneNumber } = await req.json();

    if (!orderId || !amount || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword(timestamp);

    const data = {
      BusinessShortCode: XXXXXXXXX1,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount), 
      PartyA: phoneNumber,
      PartyB: XXXXXXXXX1,
      PhoneNumber: phoneNumber,
      CallBackURL: XXXXXXXXX2,
      AccountReference: `Order ${orderId}`,
      TransactionDesc: 'Payment for Order',
    };

    const response = await axios.post(XXXXXXXXX3, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { CheckoutRequestID, ResponseCode, ResponseDescription } = response.data;

    if (ResponseCode === '0') {
      // Update order with CheckoutRequestID
      await prisma.order.update({
        where: { id: orderId },
        data: {
          checkoutRequestID: CheckoutRequestID,
          status: 'PENDING_PAYMENT',
        },
      });

      return NextResponse.json({ CheckoutRequestID, message: ResponseDescription });
    } else {
      return NextResponse.json({ error: ResponseDescription }, { status: 500 });
    }
  } catch (error: any) {
    console.error('STK Push Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to initiate STK Push' }, { status: 500 });
  }
}
