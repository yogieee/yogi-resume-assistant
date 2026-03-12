"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Download, X, Loader2 } from "lucide-react";

interface ResumeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeDialog({ open, onClose }: ResumeDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      nameRef.current?.focus();
      setStatus("idle");
      setErrors({});
    }
  }, [open]);

  const validate = useCallback(() => {
    const errs: { name?: string; email?: string } = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [name, email]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setStatus("loading");
      try {
        const res = await fetch("/api/resume-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim() }),
        });

        if (!res.ok) {
          setErrors({ email: "Something went wrong. Please try again." });
          setStatus("idle");
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Yoganand_Govind_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setStatus("success");
        setTimeout(() => {
          onClose();
          setName("");
          setEmail("");
          setStatus("idle");
        }, 1500);
      } catch {
        setErrors({ email: "Network error. Please try again." });
        setStatus("idle");
      }
    },
    [name, email, validate, onClose]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm mx-3 sm:mx-4 border border-console-border bg-console-surface rounded-xl shadow-glow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-console-border">
          <div className="flex items-center gap-2 text-glow-green text-sm font-medium">
            <Download className="size-4" />
            Download Resume
          </div>
          <button
            onClick={onClose}
            className="text-console-text-dim hover:text-console-text transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <p className="text-console-text-dim text-xs leading-relaxed">
            Enter your details to access the resume. You&apos;ll get the PDF
            instantly.
          </p>

          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="resume-name"
              className="text-xs text-console-text-dim"
            >
              Name
            </label>
            <input
              ref={nameRef}
              id="resume-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 text-sm bg-console-bg border border-console-border rounded-lg text-console-text placeholder:text-console-text-dim/50 focus:outline-none focus:border-glow-green/50 focus:shadow-glow-sm transition-all"
            />
            {errors.name && (
              <p className="text-xs text-glow-red">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="resume-email"
              className="text-xs text-console-text-dim"
            >
              Email
            </label>
            <input
              id="resume-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-sm bg-console-bg border border-console-border rounded-lg text-console-text placeholder:text-console-text-dim/50 focus:outline-none focus:border-glow-green/50 focus:shadow-glow-sm transition-all"
            />
            {errors.email && (
              <p className="text-xs text-glow-red">{errors.email}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status !== "idle"}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-glow-green/10 text-glow-green border border-glow-green/30 hover:bg-glow-green/20 hover:shadow-glow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Downloading...
              </>
            ) : status === "success" ? (
              "Downloaded!"
            ) : (
              <>
                <Download className="size-4" />
                Download Resume
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
