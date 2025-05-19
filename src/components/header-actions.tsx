import {
  SignedIn,
  SignedOut,
  SignUpButton,
  UserButton,
  useUser,
  useOrganization,
} from "@clerk/nextjs";
import { UserCredits } from "./user-credits";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Zap, Calendar, Package, ChevronDown, CreditCard } from "lucide-react";
import { getUserCredits } from "@/lib/services/client/userCredits.service";
import useUserStore from "@/context/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import useCreditsOnce from "@/hooks/use-credits";

// Definición de tipos para las suscripciones
interface Subscription {
  id: string;
  status: string;
  plan: {
    id: string;
    name: string;
    features?: Array<{
      name: string;
      slug: string;
    }>;
  };
  periodStart: number;
  periodEnd: number;
}

function SubscriptionMenu() {
  const { userCredits, isLoading } = useCreditsOnce();
  const { organization } = useOrganization();
  const { isLoaded } = useUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!organization) {
        setLoading(false);
        return;
      }

      try {
        const subs = await organization.getSubscriptions();
        setSubscriptions(subs.data as Subscription[]);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (organization) {
      fetchSubscriptions();
    } else {
      setLoading(false);
    }
  }, [organization]);

  if (loading || !isLoaded) {
    return (
      <div className="w-12 h-6 rounded-md border animate-pulse bg-primary/5" />
    );
  }

  // Only show for active subscriptions
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active"
  );

  if (!activeSubscription) {
    return <UserCredits userCredits={userCredits} isLoading={isLoading} />; // Si no hay suscripción activa, solo mostrar créditos
  }

  // Formatear fechas de la suscripción
  const periodStart = new Date(activeSubscription.periodStart);
  const periodEnd = new Date(activeSubscription.periodEnd);

  // Calcular días restantes
  const today = new Date();
  const daysRemaining = Math.ceil(
    (periodEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determinar si la suscripción está a punto de expirar (menos de 30 días)
  const isExpiringSoon = daysRemaining <= 30;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 bg-primary/10 text-xs p-2 font-medium rounded-xl hover:bg-primary/20 transition-colors">
          <Zap className="h-4 w-4 text-primary" />
          <span>{activeSubscription.plan.name}</span>
          <ChevronDown className="h-3 w-3 text-primary opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Suscripción Activa</h4>
            <div className="flex items-center gap-2 bg-primary/5 p-2 rounded-md">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {activeSubscription.plan.name}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Periodo de Suscripción</h4>
            <div className="flex flex-col gap-2 bg-muted/30 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-xs">
                  <div>Desde: {format(periodStart, "dd/MM/yyyy")}</div>
                  <div>Hasta: {format(periodEnd, "dd/MM/yyyy")}</div>
                </div>
              </div>

              {isExpiringSoon && (
                <div className="text-xs text-amber-500 font-medium flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Tu suscripción expira en {daysRemaining} días
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Créditos Disponibles</h4>
            <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                {isLoading ? (
                  <span className="text-sm font-medium animate-pulse">...</span>
                ) : (
                  <span className="text-sm font-medium">{userCredits}</span>
                )}
              </div>

              {activeSubscription.plan.name === "Plan User" && (
                <div className="text-xs text-green-500 font-medium">
                  Análisis ilimitados
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => (window.location.href = "/pricing")}
            >
              Ver planes disponibles
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function HeaderActions() {
  return (
    <>
      <SignedIn>
        <div className="flex items-center gap-3">
          <SubscriptionMenu />
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <SignUpButton fallbackRedirectUrl="/">
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 hover:bg-primary/5 text-primary hover:text-[var(--color-primary-dark)] rounded-xl"
          >
            Sign In
          </Button>
        </SignUpButton>
      </SignedOut>
    </>
  );
}
