import { stripe } from "@/lib/services/server/stripe/stripeAdmin.service";
import { dbAdminService } from "@/lib/services/server/db/dbProducts.service";
import { getURL } from "@/lib/utils";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { price } = await req.json();

    const user = await getCurrentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Crear o recuperar el cliente de Stripe
    const customer = await dbAdminService.createOrRetrieveCustomer({
      uuid: user.id || "",
      email: user.email || "",
    });

    // Comprobar si el usuario ya ha comprado este producto
    // Para productos de pago único (one-time), verificamos si existe una compra previa
    if (price.type === "one_time") {
      // Consultar la tabla de compras para verificar si el usuario ya ha comprado este producto
      const existingPurchase = await dbAdminService.checkExistingPurchase(
        price.product_id
      );

      if (existingPurchase) {
        return new Response(
          JSON.stringify({
            error: "Producto ya comprado",
            message:
              "Ya has adquirido este producto anteriormente, si no puedes verlo en tu perfil, contacta con nosotros",
          }),
          { status: 400 }
        );
      }
    }

    // Obtener detalles del producto para mostrar el nombre en la URL de confirmación
    let productName = "";
    try {
      const product = await stripe.products.retrieve(price.product_id);
      productName = product.name || "";
    } catch (error) {
      console.error("Error al obtener el producto:", error);
    }

    // Determinar si es un producto de suscripción o de pago único
    const mode = price.type === "recurring" ? "subscription" : "payment";

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: mode,
      allow_promotion_codes: true,
      ...(mode === "subscription" && {
        subscription_data: {
          metadata: {},
        },
      }),
      // Agregar metadatos para productos de pago único
      ...(mode === "payment" && {
        payment_intent_data: {
          metadata: {
            user_id: user.id,
            price_id: price.id,
            product_id: price.product_id,
          },
        },
      }),
      success_url: `${getURL()}/?session_id={CHECKOUT_SESSION_ID}&status=success&product_id=${price.product_id}&product_name=${encodeURIComponent(
        productName
      )}&order_total=${
        price.unit_amount ? (price.unit_amount / 100).toFixed(2) : "0.00"
      }`,
      cancel_url: `${getURL()}/pricing?error=Pago%20cancelado%20o%20interrumpido`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }));
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Error creating checkout session",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
