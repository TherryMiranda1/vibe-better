import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);
const emailDomain = "customers.10xdev.vip";

export const sendCheckoutConfirmationEmail = async (
  email: string,
  data: {
    name: string;
    productName: string;
    orderNumber: string;
    purchaseDate: string;
    total: string;
    accessUrl: string;
    baseUrl: string;
    isSubscription: boolean;
  }
): Promise<void> => {
  await resend.emails.send({
    from: `Vibe Better - Pagos <pagos@${emailDomain}>`,
    to: email,
    subject: "¡Tu compra ha sido confirmada!",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de Pedido - VibeBetter</title>
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }

    /* Container */
    body { margin: 0; padding: 0; width: 100%; background-color: hsl(240, 10%, 4%); }
    .email-wrapper { width: 100%; max-width: 600px; margin: auto; background-color: hsl(240, 10%, 4%); }

    /* Typography */
    .font-base { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: hsl(240, 15%, 85%); line-height: 1.5; }
    h1 { font-size: 24px; margin: 0 0 16px 0; color: hsl(180, 100%, 50%); }
    p { margin: 0 0 12px 0; }

    /* Button */
    .btn-primary {
      padding: 12px 24px;
      background-color: hsl(180, 100%, 50%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }

    /* Responsive */
    @media screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; }
      h1 { font-size: 20px !important; }
      .btn-primary { width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body>
  <center class="email-wrapper">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <!-- Header -->
      <tr>
        <td style="padding: 24px 16px; text-align: center;">
          <a href="https://vibebetter.xyz" target="_blank">
            <img src="https://res.cloudinary.com/dtlaxm8gi/image/upload/v1747421226/vibeBetter-16-9_xd9dwe.png"
                 alt="VibeBetter Logo"
                 width="100"
                 style="border: 0; display: block; margin: auto; max-width: 100%; height: auto;" />
          </a>
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td class="font-base" style="padding: 0 16px 24px;">
          <h1>Gracias por tu compra, ${data.name}!</h1>
          <p>Hemos recibido tu pago y estamos procesando tu pedido.</p>

          <p><strong>Producto:</strong> ${data.productName}</p>
          <p><strong>Número de pedido:</strong> ${data.orderNumber}</p>
          <p><strong>Fecha de compra:</strong> ${data.purchaseDate}</p>
          <p><strong>Total:</strong> ${data.total}</p>

          <p style="margin-top: 24px;"><strong>Accede a tu contenido:</strong></p>
          <p style="margin-bottom: 24px;"><a class="btn-primary" href="${data.accessUrl}" target="_blank">Optimizar prompts</a></p>

          <p>Si tienes alguna duda, visita nuestra página o contáctanos.</p>
          <p><a href="https://vibebetter.xyz" style="color: hsl(180, 100%, 50%); text-decoration: none;">vibebetter.xyz</a></p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td class="font-base" style="padding: 16px; text-align: center; font-size: 12px; color: hsl(240, 15%, 75%);">
          <p>© 2025 VibeBetter. Todos los derechos reservados.</p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`,
  });
};

export const emailService = {
  resend,

  sendCheckoutConfirmationEmail,
};
