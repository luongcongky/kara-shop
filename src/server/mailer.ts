import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (
  to: string,
  orderId: string,
  customerName: string,
  totalAmount: number,
  items: Array<{ name: string; quantity: number; price: number }>,
  shopName: string = 'Shop'
) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping email send: Missing EMAIL_USER or EMAIL_PASS');
    return;
  }

  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
        </tr>`
    )
    .join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"${shopName}" <noreply@kara-shop.com>`,
    to,
    subject: `Xác nhận đơn hàng #${orderId} - ${shopName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6d28d9;">Cảm ơn bạn đã đặt hàng tại ${shopName}!</h2>
        <p>Xin chào <strong>${customerName}</strong>,</p>
        <p>Đơn hàng của bạn <strong>#${orderId}</strong> đã được đặt thành công.</p>
        
        <h3>Chi tiết đơn hàng:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Sản phẩm</th>
              <th style="padding: 10px; text-align: left;">Số lượng</th>
              <th style="padding: 10px; text-align: left;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Tổng cộng:</td>
              <td style="padding: 10px; font-weight: bold; color: #dc2626;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</td>
            </tr>
          </tfoot>
        </table>

        <p>Chúng tôi sẽ sớm liên hệ để giao hàng cho bạn.</p>
        <p>Mọi thắc mắc xin vui lòng liên hệ hotline: 0123.456.789</p>
        <br/>
        <p>Trân trọng,<br/>Đội ngũ ${shopName}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error to avoid breaking the checkout flow if email fails
    return null;
  }
};

export const sendAdminOrderNotification = async (
  toEmail: string,
  order: {
    id: string;
    totalAmount: number;
    shippingName: string;
    shippingPhone: string;
    items: Array<{ product: { name: string }; quantity: number; price: number }>;
  },
  shopName: string = 'Shop'
) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping admin notification: Missing EMAIL_USER or EMAIL_PASS');
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
        </tr>`
    )
    .join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"${shopName}" <noreply@kara-shop.com>`,
    to: toEmail,
    subject: `🔔 Đơn hàng mới #${order.id} - ${shopName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6d28d9;">Bạn có đơn hàng mới!</h2>
        <p>Mã đơn hàng: <strong>#${order.id}</strong></p>
        <p>Khách hàng: <strong>${order.shippingName}</strong></p>
        <p>Số điện thoại: <strong>${order.shippingPhone}</strong></p>
        <p>Tổng tiền: <strong style="color: #dc2626;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</strong></p>
        
        <h3>Chi tiết sản phẩm:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Sản phẩm</th>
              <th style="padding: 10px; text-align: left;">Số lượng</th>
              <th style="padding: 10px; text-align: left;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <br/>
        <p><a href="${process.env.NEXTAUTH_URL}/admin/orders" style="display: inline-block; padding: 10px 20px; background-color: #6d28d9; color: white; text-decoration: none; border-radius: 5px;">Xem trong trang Admin</a></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};

export const sendAdminOrderCancellationNotification = async (
  toEmail: string,
  order: {
    id: string;
    shippingName: string;
    totalAmount: number;
    reason?: string;
  },
  shopName: string = 'Shop'
) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping admin cancellation notification: Missing EMAIL_USER or EMAIL_PASS');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"${shopName}" <noreply@kara-shop.com>`,
    to: toEmail,
    subject: `⚠️ Đơn hàng #${order.id} đã bị hủy - ${shopName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Thông báo: Đơn hàng đã bị hủy</h2>
        <p>Đơn hàng <strong>#${order.id}</strong> của khách hàng <strong>${order.shippingName}</strong> đã bị hủy.</p>
        <p>Tổng giá trị: <strong>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</strong></p>
        ${order.reason ? `<p>Lý do: ${order.reason}</p>` : ''}
        <br/>
        <p><a href="${process.env.NEXTAUTH_URL}/admin/orders" style="display: inline-block; padding: 10px 20px; background-color: #6d28d9; color: white; text-decoration: none; border-radius: 5px;">Xem trong trang Admin</a></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending admin cancellation notification:', error);
  }
};
