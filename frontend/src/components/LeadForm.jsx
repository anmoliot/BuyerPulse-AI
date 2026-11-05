import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const FIELDS = [
  { key: "name", label: "Buyer Name", placeholder: "e.g. Rahul Sharma" },
  { key: "location", label: "Preferred Location", placeholder: "e.g. Powai, Mumbai" },
  { key: "property_requirement", label: "Property Requirement", placeholder: "e.g. 3BHK ready-to-move apartment" },
  { key: "budget", label: "Budget Range", placeholder: "e.g. 1.8 - 2.2 Cr" },
  { key: "buying_timeline", label: "Buying Timeline", placeholder: "e.g. within 2 months" },
];

const EMPTY = Object.fromEntries(FIELDS.map((f) => [f.key, ""]));
EMPTY.customer_message = "";

export default function LeadForm({ onSubmit, onLoadDemo }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const e = {};
    FIELDS.forEach((f) => {
      if (!values[f.key]?.trim()) e[f.key] = `${f.label} is required`;
    });
    if (!values.customer_message?.trim()) e.customer_message = "Customer message is required";
    else if (values.customer_message.trim().length < 10)
      e.customer_message = "Please provide more context (at least 10 characters)";
    return e;
  }

  function handleBlur(key, label) {
    const v = values[key]?.trim();
    let err = undefined;
    if (key === "customer_message") {
      if (!v) err = "Customer message is required";
      else if (v.length < 10) err = "Please provide more context (at least 10 characters)";
    } else {
      if (!v) err = `${label} is required`;
    }
    setErrors((prev) => ({ ...prev, [key]: err }));
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    const result = await onSubmit(values);
    setBusy(false);
    if (result?.id) navigate(`/leads/${result.id}`);
  }

  const set = (k) => (e) => setValues({ ...values, [k]: e.target.value });
  const msgLength = values.customer_message?.length || 0;

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {/* Header */}
      <div className="botanical-card rounded-[34px] p-6 md:p-8 bg-[#fbf8f0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="botanical-eyebrow">Intake Form</span>
            <h1 className="font-serif text-3xl font-normal text-[#1e382c] tracking-tight mt-1">
              Add a new buyer inquiry
            </h1>
            <p className="font-sans text-sm text-[#4a6353] mt-1">
              Submit raw inquiry text for instant AI lead scoring, objection detection, and call preparation.
            </p>
          </div>
          <button
            type="button"
            className="botanical-button-secondary text-sm self-start sm:self-auto"
            onClick={onLoadDemo}
          >
            <Sparkles className="w-4 h-4 text-[#895440]" />
            <span>Load Demo Leads</span>
          </button>
        </div>
      </div>

      {/* Structured Fields Card */}
      <div className="botanical-card rounded-[34px] p-6 md:p-8 bg-[#fbf8f0] space-y-6">
        <div>
          <span className="botanical-eyebrow">Buyer Particulars</span>
          <h2 className="font-serif text-xl text-[#1e382c] mt-0.5">Contact &amp; Requirements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.key === "property_requirement" ? "md:col-span-2" : ""}>
              <label className="botanical-label" htmlFor={f.key}>
                {f.label}
              </label>
              <input
                id={f.key}
                className="botanical-input"
                value={values[f.key]}
                onChange={set(f.key)}
                onBlur={() => handleBlur(f.key, f.label)}
                placeholder={f.placeholder}
              />
              {errors[f.key] && (
                <p className="font-sans text-xs text-[#895440] mt-1.5 font-medium">
                  {errors[f.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Message Card */}
      <div className="botanical-card rounded-[34px] p-6 md:p-8 bg-[#fbf8f0] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="botanical-eyebrow">Inquiry Verbatim</span>
            <h2 className="font-serif text-xl text-[#1e382c] mt-0.5">Customer Message</h2>
          </div>
          <span className="font-sans text-xs text-[#697961]">
            {msgLength} {msgLength === 1 ? "char" : "chars"}
          </span>
        </div>

        <div>
          <label className="botanical-label sr-only" htmlFor="customer_message">
            Customer Message
          </label>
          <textarea
            id="customer_message"
            rows={5}
            className="botanical-input resize-y"
            value={values.customer_message}
            onChange={set("customer_message")}
            onBlur={() => handleBlur("customer_message", "Customer Message")}
            placeholder="Paste buyer's original WhatsApp message, email, or phone inquiry notes here…"
          />
          {errors.customer_message && (
            <p className="font-sans text-xs text-[#895440] mt-1.5 font-medium">
              {errors.customer_message}
            </p>
          )}
        </div>
      </div>

      {/* Form Submission Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="botanical-button-primary text-sm !px-6 !py-3"
            disabled={busy}
          >
            {busy ? (
              <>
                <span className="w-4 h-4 border-2 border-[#f5efdf] border-t-transparent rounded-full animate-spin" />
                <span>Analyzing inquiry…</span>
              </>
            ) : (
              <>
                <span>Analyze &amp; Save Lead</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <span className="font-sans text-xs text-[#697961] max-w-sm">
          Uses Google Gemini to score intent, detect objections, and compute decay risks.
        </span>
      </div>
    </form>
  );
}
