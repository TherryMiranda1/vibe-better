import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/services/user.service";
import { userCreditsService } from "@/lib/services/server/db/userCredits.service";
import { logger } from "@/lib/logger/Logger";

export async function POST(req: Request) {
  logger.info(`Recibida solicitud webhook [${req.method}]`);
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } =
          evt.data;

        const userData = {
          clerkId: id,
          email: email_addresses[0].email_address,
          firstName: first_name || undefined,
          lastName: last_name || undefined,
          imageUrl: image_url || undefined,
        };

        // Crear el usuario en la base de datos
        const newUser = await createUser(userData);

        // Inicializar los créditos del usuario (10 créditos por defecto)
        await userCreditsService.initializeUserCredits(newUser.id);

        logger.info(
          `Usuario creado con ID ${newUser.id} y asignados 10 créditos iniciales`
        );
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } =
          evt.data;

        const userData = {
          email: email_addresses[0].email_address,
          firstName: first_name || undefined,
          lastName: last_name || undefined,
          imageUrl: image_url || undefined,
        };

        await updateUser(id, userData);
        break;
      }

      case "user.deleted": {
        if (!id) {
          console.error("User ID is missing");
          return new Response("User ID is missing", { status: 400 });
        }

        await deleteUser(id);
        break;
      }

      default:
        break;
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
