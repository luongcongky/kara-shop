import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/server/prisma';
import payOS from '@/utils/payos';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const webhookData = await payOS.webhooks.verify(req.body);

    if (webhookData.code === '00') {
      const orderCode = webhookData.orderCode;

       if (orderCode) {
         // Find order by payOSOrderCode
         try {
             const order = await prisma.order.findFirst({
                 where: { payOSOrderCode: orderCode }
             });

             if (order) {
                 await prisma.order.update({
                    where: { id: order.id },
                    data: { 
                        status: 'PAID',
                    },
                 });
             } else {
                 console.warn("Webhook: Order not found for code", orderCode);
             }
         } catch (err) {
             console.error("Webhook: DB Error", err);
         }
       }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('PayOS Webhook Error:', error);
    res.status(400).json({ success: false, message: 'Webhook verification failed' });
  }
}
