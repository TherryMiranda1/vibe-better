import { stripe } from "@/lib/services/server/stripe/stripeAdmin.service";
import { dbAdminService } from "@/lib/services/server/db/dbProducts.service";

import { getURL } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export default async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const customer = await dbAdminService.createOrRetrieveCustomer({
      uuid: user.id || "",
      email: user.email || "",
    });

    if (!customer) {
      return new Response(
        JSON.stringify({ error: "Could not create or retrieve customer" }),
        { status: 400 }
      );
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: getURL("/account"),
    });

    if (!url) {
      return new Response(
        JSON.stringify({ error: "Could not create billing portal" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ url }));
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error creating portal session" }),
      { status: 500 }
    );
  }
}
