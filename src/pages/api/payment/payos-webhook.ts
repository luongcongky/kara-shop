import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/server/prisma'; // Use existing prisma import
import payOS from '@/utils/payos';
import { sendOrderConfirmationEmail } from '@/server/mailer';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Verify Webhook Signature
    // verifyPaymentWebhookData throws if invalid
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webhookData = await payOS.webhooks.verify(req.body as any);
    
    // 2. Process
    // '00' is success code
    if (webhookData.code === '00') {
      const orderCode = webhookData.orderCode;
      
      if (orderCode) {
         // Find order by payOSOrderCode
         // Include items and user to send email
         const order = await prisma.order.findUnique({
             where: { payOSOrderCode: orderCode },
             include: {
                 user: true,
                 items: {
                     include: { product: true }
                 }
             }
         });

         if (order) {
            if (order.status !== 'PAID') {
                 // Update status
                 await prisma.order.update({
                    where: { id: order.id },
                    data: { 
                        status: 'PAID',
                        updatedAt: new Date(),
                    },
                 });
                 
                 console.log(`Order ${order.id} marked as PAID via Webhook.`);

                 // Send Email
                 if (order.user.email) {
                    try {
                        await sendOrderConfirmationEmail(
                            order.user.email,
                            order.id,
                            order.shippingName || order.user.name || 'Customer',
                            order.totalAmount,
                            order.items.map(item => ({
                                name: item.product.name,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        );
                        console.log(`Email sent for order ${order.id}`);
                    } catch (emailErr) {
                        console.error("Failed to send email in webhook:", emailErr);
                        // Don't fail the webhook response
                    }
                 }
            } else {
                console.log(`Order ${order.id} is already PAID. Ignoring.`);
            }
         } else {
             console.warn(`Webhook: Order not found for payOSOrderCode ${orderCode}`);
             // We return 200 anyway to stop PayOS from retrying, as we can't do anything without the order
         }
      }
    }

    return res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('PayOS Webhook Error:', error);
    return res.status(200).json({ success: false, message: 'Webhook failed but handled' }); 
    // Return 200 to prevent retry loops if it's a logic error, or 400 if signature failure
  }
}
