import React, { Suspense, useEffect, useRef, useState, lazy } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MapPin,
  Clock,
  Linkedin,
  Github,
  Send,
  Instagram,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LegoButton from "./LegoButton";
import FastTransparentCube from "@/components/FastTransparentCube";
import WorldClocks from "@/components/WorldClocks";
const MicroFalconViewer = lazy(() => import("@/components/MicroFalconViewer"));

const ViewerSkeleton = ({ height }: { height: number }) => (
  <div
    className="w-full rounded-3xl border border-muted/20 bg-muted/10 flex items-center justify-center animate-pulse"
    style={{ minHeight: height }}
  >
    <span className="text-sm text-muted-foreground/70">
      Loading 3D experience…
    </span>
  </div>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    // Honeypot field for spam protection
    _honeypot: "",
  });
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const falconContainerRef = useRef<HTMLDivElement | null>(null);
  const [showFalconViewer, setShowFalconViewer] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired") || "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired") || "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        t("validation.emailInvalid") || "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject =
        t("validation.subjectRequired") || "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message =
        t("validation.messageRequired") || "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        t("validation.messageTooShort") ||
        "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: t("validation.errorTitle") || "Validation Error",
        description:
          t("validation.errorMessage") ||
          "Please fix the errors and try again.",
        variant: "destructive",
      });
      return;
    }

    // Check for spam (honeypot field should be empty)
    if (formData._honeypot) {
      toast({
        title: t("send.errorTitle") || "Error",
        description: "Spam detected. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "access_key",
        "c40cf7dd-eb73-4c03-9a22-30647387e501"
      );
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("subject", formData.subject.trim());
      formDataToSend.append("message", formData.message.trim());

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t("send.successTitle") || "Message Sent!",
          description:
            t("send.successMessage") ||
            "Thank you for reaching out. I'll get back to you within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          _honeypot: "",
        });
        setErrors({});
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: t("send.errorTitle") || "Error",
        description:
          t("send.errorMessage") ||
          "Failed to send message. Please try again or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    if (showFalconViewer) return;
    const node = falconContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowFalconViewer(true);
            obs.disconnect();
          }
        });
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.2,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showFalconViewer]);

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hugoviegas3.1@gmail.com",
      link: "mailto:hugoviegas3.1@gmail.com",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Dublin, Ireland",
      link: null,
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 hours",
      link: null,
    },
  ];

  // Official SVG icon components (adapted from provided SVG markup)
  const TelegramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      fill="none"
      {...props}
    >
      <rect height="60" rx={10} width="60" />
      <path
        d="M49.281,11.425,9.305,26.417a2.01,2.01,0,0,0-.087,3.73l9.471,4.059,19.9-13.268a.5.5,0,0,1,.634.774l-14.5,14.5V46.268l6.031-6.031,9.6,8a2.01,2.01,0,0,0,3.237-1.057L51.938,13.8A2.011,2.011,0,0,0,49.281,11.425Z"
        fill="#f1f3f4"
      />
      <path
        d="M41.634,50.207a3.493,3.493,0,0,1-2.241-.816l-8.549-7.124-5.063,5.062a1.5,1.5,0,0,1-2.56-1.06V36.217a1.5,1.5,0,0,1,.439-1.061l7.382-7.382-11.521,7.68a1.5,1.5,0,0,1-1.422.131L8.628,31.526a3.51,3.51,0,0,1,.15-6.513L48.755,10.021a3.511,3.511,0,0,1,4.638,4.138L45.046,47.546a3.49,3.49,0,0,1-2.316,2.485A3.553,3.553,0,0,1,41.634,50.207ZM30.752,38.737a1.5,1.5,0,0,1,.96.348l9.6,8a.506.506,0,0,0,.486.094.5.5,0,0,0,.337-.362l8.346-33.386a.51.51,0,0,0-.673-.6h0L9.831,27.821a.511.511,0,0,0-.021.948l8.723,3.738L37.759,19.69a2,2,0,0,1,2.526,3.082L26.221,36.838v5.809l3.47-3.47A1.5,1.5,0,0,1,30.752,38.737ZM49.281,11.426h0Z"
        fill="#8d9cf4"
      />
      <path
        d="M9.305,27.917a1.5,1.5,0,0,1-.527-2.9L48.755,10.021a3.511,3.511,0,0,1,4.638,4.138,1.5,1.5,0,0,1-2.911-.726.511.511,0,0,0-.673-.6L9.831,27.821A1.476,1.476,0,0,1,9.305,27.917Z"
        fill="#7bcdd1"
      />
    </svg>
  );

  const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z"
        fill="currentColor"
      />
    </svg>
  );

  type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

  const socialLinks: {
    icon: IconComp | React.ComponentType<unknown>;
    label: string;
    url: string;
    color: string;
  }[] = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/hviegas/",
      color: "text-blue-400",
    },
    {
      icon: Github,
      label: "GitHub",
      url: "https://github.com/hugoviegas/",
      color: "text-primary",
    },
    {
      icon: Mail,
      label: "Email",
      url: "mailto:hugoviegas3.1@gmail.com",
      color: "text-secondary",
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: "https://www.instagram.com/_hviegas",
      color: "text-pink-400",
    },
    {
      icon: TelegramIcon,
      label: "Telegram",
      url: "https://t.me/Hviegas",
      color: "text-cyan-400",
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      url: "https://api.whatsapp.com/send?phone=3530830865984",
      color: "text-green-400",
    },
  ];

  return (
    <section id="contact" className="py-20 w-full">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="heading-section mb-6">{t("contactTitle")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("contactDescription")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="space-y-8 slide-up">
            <div>
              <h3 className="text-3xl font-bold text-gradient mb-4">
                {t("sendMessageTitle")}
              </h3>
              <p className="text-muted-foreground">{t("contactPrompt")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    name="name"
                    placeholder={t("placeholder.name")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`glass border-white/20 bg-card/50 focus:border-primary transition-all duration-300 ${
                      errors.name ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder={t("placeholder.email")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`glass border-white/20 bg-card/50 focus:border-primary transition-all duration-300 ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  name="subject"
                  placeholder={t("placeholder.subject")}
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`glass border-white/20 bg-card/50 focus:border-primary transition-all duration-300 ${
                    errors.subject ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <Textarea
                  name="message"
                  placeholder={t("placeholder.project")}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`glass border-white/20 bg-card/50 focus:border-primary transition-all duration-300 ${
                    errors.message ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {/* Honeypot field for spam protection */}
              <input
                type="text"
                name="_honeypot"
                value={formData._honeypot}
                onChange={handleChange}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <LegoButton
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  t("send.sending")
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {t("send.sendMessage")}
                  </>
                )}
              </LegoButton>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 slide-up delay-300">
            <div>
              <h3 className="text-3xl font-bold text-gradient mb-4">
                {t("getInTouch")}
              </h3>
              <p className="text-muted-foreground">{t("connectWithMe")}</p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="glass p-6 rounded-xl hover:glass-strong transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {info.label}
                      </div>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-lg font-semibold text-foreground">
                          {info.value}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="glass p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-gradient mb-4">
                {t("connectWithMe")}
              </h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 hover:scale-105 transition-all duration-300 group"
                  >
                    {React.createElement(
                      social.icon as React.ComponentType<
                        React.SVGProps<SVGSVGElement>
                      >,
                      {
                        className: `w-5 h-5 ${social.color} group-hover:scale-110 transition-transform`,
                      }
                    )}
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <div className="glass p-6 rounded-xl border border-accent/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                <Badge className="bg-accent/10 text-accent border-accent/30">
                  {t("availableForWork")}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("availabilityText")}
              </p>
            </div>

            {/* World Clocks (rendered directly so only inner card is shown) */}
            <WorldClocks />

            <div className="glass-strong p-6 rounded-3xl flex justify-center">
              <FastTransparentCube width={240} height={240} enableExpand />
            </div>

            <div
              ref={falconContainerRef}
              className="glass-strong p-6 rounded-3xl"
            >
              <Suspense fallback={<ViewerSkeleton height={360} />}>
                {showFalconViewer ? (
                  <MicroFalconViewer />
                ) : (
                  <ViewerSkeleton height={360} />
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
