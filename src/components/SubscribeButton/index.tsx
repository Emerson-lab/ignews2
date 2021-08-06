import { useSession, signIn } from "next-auth/client";
import { api } from "../../services/api";
import { getStripieJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripieJs();

      await stripe.redirectToCheckout({sessionId});
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      type="button"
      className={styles.subscribeButton}
    >
      Subscribe now
    </button>
  );
}
