import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // 1) Páginas y estáticos (igual que antes)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // 2) APIs EXCLUYENDO /api/webhooks/stripe
    "/api/:path((?!webhooks/stripe).*)",
    // 3) trpc
    "/trpc/:path*",
  ],
};
