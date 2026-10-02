import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Github, Linkedin, Send } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import BrickLoader from "@/components/brand/BrickLoader";
import { SectionHeading, sectionContainer } from "@/components/sections/Section";
import { cn } from "@/lib/utils";

const FIELD_ORDER = ["name", "email", "subject", "message"] as const;
type Field = (typeof FIELD_ORDER)[number];
type Status = "idle" | "sending" | "success" | "failure";

const EMAIL = "hugoviegas3.1@gmail.com";
const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=3530830865984";

const inputClass = (hasError: boolean) =>
  cn(
    "min-h-12 w-full rounded-md border bg-card px-3.5 py-3 text-base text-foreground transition-[border-color,box-shadow] duration-fast placeholder:text-ink-3 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary-tint-2 disabled:border-border disabled:bg-surface-2 disabled:text-ink-3",
    hasError ? "border-destructive ring-1 ring-destructive" : "border-line-strong",
  );

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" />
  </svg>
);

const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", _honeypot: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!formData.name.trim()) next.name = t("validation.nameRequired");
    if (!formData.email.trim()) next.email = t("validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = t("validation.emailInvalid");
    if (!formData.subject.trim()) next.subject = t("validation.subjectRequired");
    if (!formData.message.trim()) next.message = t("validation.messageRequired");
    else if (formData.message.trim().length < 10) next.message = t("validation.messageTooShort");
    setErrors(next);
    return next;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    const found = validate();
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      setStatus("idle");
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    // Honeypot: bots fill the hidden field.
    if (formData._honeypot) {
      setStatus("failure");
      return;
    }
    setStatus("sending");
    try {
      const body = new FormData();
      body.append("access_key", "c40cf7dd-eb73-4c03-9a22-30647387e501");
      body.append("name", formData.name.trim());
      body.append("email", formData.email.trim());
      body.append("subject", formData.subject.trim());
      body.append("message", formData.message.trim());
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Failed to send message");
      setFormData({ name: "", email: "", subject: "", message: "", _honeypot: "" });
      setErrors({});
      setStatus("success");
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("failure");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as Field]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const sending = status === "sending";

  const field = (name: Field, label: string, input: React.ReactNode) => (
    <div className="grid gap-1.5">
      <label htmlFor={`contact-${name}`} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      {input}
      {errors[name] && (
        <p id={`contact-${name}-error`} className="flex items-center gap-1.5 text-[13px] font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const fieldProps = (name: Field) => ({
    id: `contact-${name}`,
    name,
    value: formData[name],
    onChange: handleChange,
    required: true,
    disabled: sending,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: inputClass(Boolean(errors[name])),
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative z-10 pt-12">
      <div className={sectionContainer}>
        <SectionHeading id="contact-title" index="05" title={t("contactHeading")} lead={t("contactLead")} />
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
          <div>
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">{t("contactEmailLabel")}</p>
            <a
              href={`mailto:${EMAIL}`}
              className="break-all rounded-sm text-[19px] font-bold text-foreground underline decoration-brand-decor decoration-[3px] underline-offset-[6px] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-[360px]:text-[22px] sm:text-[28px]"
            >
              {EMAIL}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="neutral" size="lg" className="max-sm:flex-[1_1_calc(50%-6px)] max-[359px]:basis-full">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="neutral" size="lg" className="max-sm:flex-[1_1_calc(50%-6px)] max-[359px]:basis-full">
                <a href="https://www.linkedin.com/in/hviegas/" target="_blank" rel="noopener noreferrer">
                  <Linkedin aria-hidden="true" />
                  LinkedIn
                </a>
              </Button>
              <Button asChild variant="neutral" size="lg" className="max-sm:flex-[1_1_calc(50%-6px)] max-[359px]:basis-full">
                <a href="https://github.com/hugoviegas/" target="_blank" rel="noopener noreferrer">
                  <Github aria-hidden="true" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="contact-status"
            className="grid gap-5 rounded-lg border border-border bg-card p-5 shadow-e2 sm:p-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {field("name", t("label.name"), <input {...fieldProps("name")} autoComplete="name" />)}
              {field("email", t("label.email"), <input {...fieldProps("email")} type="email" inputMode="email" autoComplete="email" />)}
            </div>
            {field("subject", t("label.subject"), <input {...fieldProps("subject")} autoComplete="off" />)}
            {field("message", t("label.message"), <textarea {...fieldProps("message")} rows={5} autoComplete="off" />)}
            <input
              type="text"
              name="_honeypot"
              value={formData._honeypot}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div id="contact-status" aria-live="polite">
              {status === "success" && (
                <p className="flex items-start gap-2.5 rounded-md bg-primary-tint px-3.5 py-3 text-sm text-foreground">
                  <CheckCircle2 className="mt-px h-[18px] w-[18px] shrink-0 text-primary" aria-hidden="true" />
                  {t("send.successMessage")}
                </p>
              )}
              {status === "failure" && (
                <p className="flex items-start gap-2.5 rounded-md bg-error-tint px-3.5 py-3 text-sm text-foreground">
                  <AlertCircle className="mt-px h-[18px] w-[18px] shrink-0 text-destructive" aria-hidden="true" />
                  <span>
                    {t("send.errorMessage")}{" "}
                    <a href={`mailto:${EMAIL}`} className="font-semibold text-primary underline">
                      {EMAIL}
                    </a>
                  </span>
                </p>
              )}
            </div>
            <div>
              <Button type="submit" variant="primary" size="lg" aria-busy={sending} aria-disabled={sending}>
                {sending ? <BrickLoader /> : <Send aria-hidden="true" />}
                {sending ? t("send.sending") : t("send.sendMessage")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
