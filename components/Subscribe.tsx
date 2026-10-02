"use client";

import { useState } from "react";
import { CONTACT_EMAIL, KIT_FORM_ID, SUBSCRIBE_ENABLED } from "@/lib/site";

type State = "idle" | "sending" | "done" | "error";

/** Email sign-up. Posts straight to Kit, which sends the confirmation email and handles unsubscribes. */
export default function Subscribe({ variant = "band" }: { variant?: "band" | "inline" | "page" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setError("Enter a full email address, like name@example.com.");
      return;
    }
    if (!SUBSCRIBE_ENABLED) {
      // Until Kit is connected, hand the request to the editor by email.
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Subscribe me to DesignersDream")}&body=${encodeURIComponent(
        `Please add ${email} to the DesignersDream weekly email.`,
      )}`;
      setState("done");
      return;
    }
    setState("sending");
    try {
      const body = new FormData();
      body.append("email_address", email);
      const res = await fetch(`https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });
      // Kit answers 200 even when it rejects an address, so read its status field.
      const data = (await res.json().catch(() => ({}))) as { status?: string; errors?: { messages?: string[] } };
      if (!res.ok || data.status !== "success") {
        const msg = data.errors?.messages?.find((m) => /email/i.test(m));
        setState("error");
        setError(msg ? `${msg}. Check the address and try again.` : "That didn't go through. Try again in a moment.");
        return;
      }
      setState("done");
    } catch {
      setState("error");
      setError("That didn't go through. Check your connection and try again.");
    }
  };

  return (
    <section className={`subscribe subscribe-${variant}`} aria-labelledby={`subscribe-title-${variant}`}>
      <div className="subscribe-copy">
        <h2 id={`subscribe-title-${variant}`} className="subscribe-title">
          {variant === "inline" ? "Get stories like this every Monday" : "The Monday email"}
        </h2>
        <p className="subscribe-sub">
          One short email a week with the new stories, tips, tools and AI models. Free, no spam, unsubscribe in one click.
        </p>
      </div>
      {state === "done" ? (
        <p className="subscribe-done" role="status">
          {SUBSCRIBE_ENABLED
            ? "Almost there. Check your inbox and confirm your email to start getting the Monday email."
            : "Thanks! Send the email that just opened and we'll add you to the list."}
        </p>
      ) : (
        <form className="subscribe-form" onSubmit={submit} noValidate>
          <label htmlFor={`subscribe-email-${variant}`} className="sr-only">
            Email address
          </label>
          <input
            id={`subscribe-email-${variant}`}
            type="email"
            name="email_address"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "error") setState("idle");
            }}
            aria-invalid={state === "error"}
            aria-describedby={state === "error" ? `subscribe-error-${variant}` : undefined}
            required
          />
          <button type="submit" className="btn btn-solid" disabled={state === "sending"} data-magnetic>
            {state === "sending" ? "Subscribing…" : "Subscribe"}
          </button>
          {state === "error" && (
            <p id={`subscribe-error-${variant}`} className="subscribe-error" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
