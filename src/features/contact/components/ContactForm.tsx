"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

/**
 * Public contact form. Presentational for now — a contact-intake endpoint on the
 * platform API can be wired in later without changing this component's surface.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-[var(--radius)] border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">
          Thank you, {name.split(" ")[0] || "friend"}.
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Your message has been received. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-5">
      <Input label="Name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-[var(--color-text-muted)]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/40"
        />
      </div>
      <div>
        <Button type="submit" size="lg">
          Send message
        </Button>
      </div>
    </form>
  );
}
