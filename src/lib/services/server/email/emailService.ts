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
    html: `Hemos recibido tu pago y estamos procesando tu pedido.
    
    <p>Nombre: ${data.name}</p>
    <p>Producto: ${data.productName}</p>
    <p>Número de pedido: ${data.orderNumber}</p>
    <p>Fecha de compra: ${data.purchaseDate}</p>
    <p>Total: ${data.total}</p>
    <p>URL de acceso: ${data.accessUrl}</p>
    <p>URL base: ${data.baseUrl}</p>
    <p>Es una suscripción: ${data.isSubscription}</p>`,
  });
};

export const emailService = {
  resend,

  sendCheckoutConfirmationEmail,
};
