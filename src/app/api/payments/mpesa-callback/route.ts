import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stkCallback } = body;

    if (!stkCallback) {
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 });
    }

    const { ResultCode, CallbackMetadata, CheckoutRequestID } = stkCallback;

    if (ResultCode === 0) {
      // Payment Successful
      const meta = CallbackMetadata.Item;
      const amountItem = meta.find((item: any) => item.Name === 'Amount');
      const receiptItem = meta.find((item: any) => item.Name === 'MpesaReceiptNumber');
      // const phoneItem = meta.find((item: any) => item.Name === 'PhoneNumber');

      const amount = amountItem?.Value;
      const mpesaReceipt = receiptItem?.Value;
      const transactionDate = new Date(); // Or parse TransactionDate from metadata if available

      if (amount && mpesaReceipt && CheckoutRequestID) {
        await prisma.$transaction(async (tx) => {
          // 1. Find Order
          
          const order = await tx.order.findUnique({
            where: { checkoutRequestID: CheckoutRequestID },
            include: { items: true },
          });

          if (!order) {
            throw new Error(`Order not found for CheckoutRequestID: ${CheckoutRequestID}`);
          }

          // 2. Create Transaction
          await tx.transaction.create({
            data: {
              orderId: order.id,
              mpesaReceipt: mpesaReceipt,
              amount: Number(amount),
              transactionDate: transactionDate,
            },
          });

          // 3. Update Order Status
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'PAID' },
          });

          // 4. Decrement Inventory
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: {
                  decrement: item.quantity,
                },
              },
            });
          }

          // 5. Create Notification for new order
          if (order.userId) {
            await tx.notification.create({
              data: {
                userId: order.userId,
                message: `New order #${order.id} has been paid for!`,
                read: false,
              },
            });
          }
        });
      }
    } else {
      // Payment Failed or Cancelled
      console.log(`Payment failed for CheckoutRequestID: ${CheckoutRequestID}, ResultCode: ${ResultCode}`);
      // Optional: Update order status to 'FAILED' or similar if you have that status
    }

    return NextResponse.json({ result: 'ok' });
  } catch (error) {
    console.error('Mpesa Callback Error:', error);
    // Always return 200 to Mpesa to stop retries, even if our processing failed
    return NextResponse.json({ result: 'error', message: 'Internal Server Error' });
  }
}
