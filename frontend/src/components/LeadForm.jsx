import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FIELDS = [
  { key: "name", label: "Name", placeholder: "e.g. Rahul Sharma" },
  { key: "location", label: "Location", placeholder: "e.g. Powai, Mumbai" },
  { key: "property_requirement", label: "Property requirement", placeholder: "e.g. 3BHK ready-to-move" },
  { key: "budget", label: "Budget", placeholder: "e.g. 1.8 - 2.2 Cr" },
  { key: "buying_timeline", label: "Buying timeline", placeholder: "e.g. within 2 months" },
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
      if (!values[f.key]?.trim()) e[f.key] = "Required";
    });
    if (!values.customer_message?.trim()) e.customer_message = "Required";
    else if (values.customer_message.trim().length < 10) e.customer_message = "Please add more detail (≥10 chars)";
    return e;
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

  return (
    <form onSubmit={submit} className="card p-5 space-y-4" noValidate>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">New lead</h2>
        <button type="button" className="btn-ghost" onClick={onLoadDemo}>
          Load demo leads
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="label" htmlFor={f.key}>{f.label}</label>
            <input
              id={f.key}
              className="input"
              value={values[f.key]}
              onChange={set(f.key)}
              onBlur={() => setErrors((er) => ({ ...er, ...validate() }))}
              placeholder={f.placeholder}
            />
            {errors[f.key] && <p className="text-xs text-red-400 mt-1">{errors[f.key]}</p>}
          </div>
        ))}
      </div>

      <div>
        <label className="label" htmlFor="customer_message">Customer message</label>
        <textarea
          id="customer_message"
          rows={5}
          className="input"
          value={values.customer_message}
          onChange={set("customer_message")}
          onBlur={() => setErrors((er) => ({ ...er, ...validate() }))}
          placeholder="Paste the customer's inquiry here..."
        />
        {errors.customer_message && <p className="text-xs text-red-400 mt-1">{errors.customer_message}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Analyzing lead…" : "Analyze & save lead"}
        </button>
        <span className="text-xs text-slate-500">
          Runs Gemini analysis. Failures are saved with a retry button.
        </span>
      </div>
    </form>
  );
}
