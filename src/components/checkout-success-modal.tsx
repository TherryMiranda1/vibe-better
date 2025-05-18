"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessModal() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");
  const productName = searchParams.get("product_name");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Solo mostrar la modal si hay un status=success en la URL
    if (status === "success" && sessionId) {
      setOpen(true);
    }
  }, [status, sessionId]);

  // Formatear el nombre del producto (reemplazar '+' por espacios)
  const formattedProductName = productName
    ? decodeURIComponent(productName).replace(/\+/g, " ")
    : "tu compra";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            ¡Compra Exitosa!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Gracias por adquirir{" "}
            <strong className="text-primary">{formattedProductName}</strong>. Tu
            cuenta ha sido actualizada con los créditos correspondientes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center sm:justify-center">
          <Button
            className="text-background"
            onClick={() => {
              setOpen(false);
              router.replace("/");
            }}
          >
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
