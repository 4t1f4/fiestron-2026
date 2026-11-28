import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

type RegistrationData = {
  collegeName: string;
  collegeAddress: string;
  collegeEmail: string;
  collegeContact: string;

  clName: string;
  clContact: string;
  clEmail: string;
  clYear: string;
  clDivision: string;
  clId: File | null;
  clAuthorization: File | null;

  aclName: string;
  aclContact: string;
  aclEmail: string;
  aclYear: string;
  aclDivision: string;
  aclId: File | null;
  aclAuthorization: File | null;

  clMeetAttendance: string;
};

type FileField =
  | "clId"
  | "clAuthorization"
  | "aclId"
  | "aclAuthorization";

const initialData: RegistrationData = {
  collegeName: "",
  collegeAddress: "",
  collegeEmail: "",
  collegeContact: "",

  clName: "",
  clContact: "",
  clEmail: "",
  clYear: "",
  clDivision: "",
  clId: null,
  clAuthorization: null,

  aclName: "",
  aclContact: "",
  aclEmail: "",
  aclYear: "",
  aclDivision: "",
  aclId: null,
  aclAuthorization: null,

  clMeetAttendance: "",
};

const inputClass =
  "w-full rounded-xl border border-[#AF69FF]/25 bg-[#080510]/70 px-4 py-3 font-['Space_Grotesk',sans-serif] text-sm text-white outline-none transition-all placeholder:text-[#8A819B] focus:border-[#AF69FF] focus:ring-2 focus:ring-[#AF69FF]/15";

const labelClass =
  "mb-2 block font-['Space_Grotesk',sans-serif] text-sm font-medium text-[#E3CCFF]";

function convertFileToBase64(file: File | null) {
  return new Promise<{
    fileName: string;
    mimeType: string;
    base64: string;
  } | null>((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      resolve({
        fileName: file.name,
        mimeType: file.type,
        base64: result.split(",")[1],
      });
    };

    reader.onerror = () =>
      reject(new Error("Could not read uploaded file."));

    reader.readAsDataURL(file);
  });
}

export default function CLRegistration() {
  const [formData, setFormData] =
    useState<RegistrationData>(initialData);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFileChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FileField
  ) {
    const file = e.target.files?.[0] ?? null;

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, JPG, PNG and WEBP files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert("File size must not exceed 4 MB.");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  }

  function renderFileUpload(label: string, field: FileField) {
    return (
      <div>
        <label className={labelClass}>{label}</label>

        <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#AF69FF]/30 bg-[#080510]/60 p-4 transition-all hover:border-[#AF69FF] hover:bg-[#AF69FF]/5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#AF69FF]/20 bg-[#AF69FF]/10">
            <Upload
              size={18}
              className="text-[#D9B8FF] transition group-hover:text-white"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate font-['Space_Grotesk',sans-serif] text-sm text-white">
              {formData[field]?.name || "Choose a file"}
            </p>

            <p className="mt-1 font-['Space_Grotesk',sans-serif] text-xs text-white/40">
              PDF, JPG, PNG or WEBP · Max 4 MB
            </p>
          </div>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => handleFileChange(e, field)}
          />
        </label>
      </div>
    );
  }

  function renderTextField({
    label,
    name,
    type = "text",
    placeholder,
    required = true,
  }: {
    label: string;
    name: keyof RegistrationData;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) {
    return (
      <div>
        <label className={labelClass}>
          {label}
          {required && (
            <span className="ml-1 text-[#AF69FF]">*</span>
          )}
        </label>

        <input
          type={type}
          name={name}
          value={(formData[name] as string) ?? ""}
          onChange={handleChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={inputClass}
          required={required}
        />
      </div>
    );
  }

  function renderYearField({
    name,
    label,
  }: {
    name: "clYear" | "aclYear";
    label: string;
  }) {
    return (
      <div>
        <label className={labelClass}>
          {label}
          <span className="ml-1 text-[#AF69FF]">*</span>
        </label>

        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={inputClass}
          required
        >
          <option value="">Select year</option>
          <option value="FY">First Year (FY)</option>
          <option value="SY">Second Year (SY)</option>
          <option value="TY">Third Year (TY)</option>
        </select>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const API_URL = import.meta.env.VITE_CL_REGISTRATION_API_URL;

    if (!API_URL) {
      alert("Registration service is currently unavailable.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        clId: await convertFileToBase64(formData.clId),
        clAuthorization: await convertFileToBase64(
          formData.clAuthorization
        ),
        aclId: await convertFileToBase64(formData.aclId),
        aclAuthorization: await convertFileToBase64(
          formData.aclAuthorization
        ),
      };

      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      setFormData(initialData);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to submit your registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // SUCCESS SCREEN
  if (submitted) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080510] px-6 font-['Space_Grotesk',sans-serif] text-white">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9147FF]/15 blur-[130px]" />

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#D9B8FF]/20 bg-gradient-to-br from-[#2A1350]/80 to-[#0F0818]/90 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12">

          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[#AF69FF]/30 bg-[#AF69FF]/10">
            <CheckCircle2
              size={38}
              className="text-[#D9B8FF]"
            />
          </div>

          <p className="mb-3 font-['IBM_Plex_Mono',monospace] text-xs font-semibold tracking-[0.28em] text-[#C9A6FF]">
            FIESTRON 2026
          </p>

          <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold sm:text-3xl">
            Form Submitted!
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#BCB3CB]">
            Your CL Registration has been submitted successfully.
            Thank you for registering for FIESTRON 2026!
          </p>

          <Link
            to="/home"
            className="mt-9 inline-flex items-center gap-2 rounded-xl border border-[#D9B8FF]/30 bg-gradient-to-r from-[#7A2FD6] to-[#AF69FF] px-7 py-3 font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-white transition hover:brightness-110 hover:shadow-[0_0_25px_rgba(175,105,255,0.25)]"
          >
            BACK TO HOME
            <ArrowRight size={16} />
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080510] px-4 pb-24 pt-24 font-['Space_Grotesk',sans-serif] text-white sm:px-8 sm:pt-28">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[550px] w-[800px] -translate-x-1/2 rounded-full bg-[#9147FF]/10 blur-[150px]" />

      {/* BACK LINK (same top-left position as Message page) */}
      <Link
        to="/home"
        className="group absolute left-6 top-8 z-20 inline-flex items-center gap-2.5 text-[0.9rem] font-medium text-[#CDBBE8] no-underline transition-all duration-200 hover:-translate-x-[3px] hover:text-white sm:left-12"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <div className="relative z-10 mx-auto max-w-4xl">

        {/* CENTERED & STYLED HEADER */}
        <div className="mx-auto mb-11 max-w-2xl text-center">

          <span className="mb-4 inline-flex items-center justify-center gap-3 font-['IBM_Plex_Mono',monospace] text-[0.7rem] font-semibold tracking-[0.28em] text-[#C9A6FF]">
            <span className="h-px w-[26px] bg-gradient-to-r from-transparent to-[#AF69FF]" />
            K.C. COLLEGE · TECH CLUB
            <span className="h-px w-[26px] bg-gradient-to-l from-transparent to-[#AF69FF]" />
          </span>

          <h1 className="font-['Orbitron',sans-serif] text-[clamp(2rem,5vw,3.1rem)] font-black leading-[1.2] tracking-[0.015em] text-white">
            CL
            <span className="text-[#AF69FF] [text-shadow:0_0_25px_rgba(175,105,255,0.35)]">
              {" "}REGISTRATION
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-[1.7] text-[#BCB3CB]">
            Register your college contingent for FIESTRON 2026.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#AF69FF]/30 bg-[#AF69FF]/10 px-4 py-2 font-['IBM_Plex_Mono',monospace] text-xs font-medium tracking-[0.08em] text-[#D9B8FF] shadow-[0_0_20px_rgba(175,105,255,0.12)]">
            <CalendarDays size={15} className="text-[#AF69FF]" />
            CL MEET · 5 DECEMBER 2026
          </div>

        </div>

        {/* SINGLE GLASS FORM */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-[20px] border border-[#D9B8FF]/25 bg-gradient-to-br from-[#2A1350]/78 via-[#180D2B]/82 to-[#0F0818]/88 shadow-[0_24px_70px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[22px]"
        >

          {/* COLLEGE INFORMATION */}
          <section className="p-6 sm:p-9">

            <h2 className="mb-6 font-['Orbitron',sans-serif] text-[1.05rem] font-bold text-white">
              College Information
            </h2>

            <div className="space-y-5">

              {renderTextField({
                label: "College Name",
                name: "collegeName",
              })}

              <div>
                <label className={labelClass}>
                  College Address
                  <span className="ml-1 text-[#AF69FF]">*</span>
                </label>

                <textarea
                  name="collegeAddress"
                  value={formData.collegeAddress}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter complete college address"
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {renderTextField({
                  label: "College Official Email Address",
                  name: "collegeEmail",
                  type: "email",
                })}

                {renderTextField({
                  label: "College Contact Number",
                  name: "collegeContact",
                  type: "tel",
                })}
              </div>

            </div>
          </section>

          {/* DIVIDER */}
          <div className="mx-6 border-t border-[#D9B8FF]/15 sm:mx-9" />

          {/* CONTINGENT LEADER */}
          <section className="p-6 sm:p-9">

            <h2 className="mb-6 font-['Orbitron',sans-serif] text-[1.05rem] font-bold text-white">
              Contingent Leader Details
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">

              {renderTextField({
                label: "Full Name",
                name: "clName",
              })}

              {renderTextField({
                label: "Contact Number",
                name: "clContact",
                type: "tel",
              })}

              {renderTextField({
                label: "Email Address",
                name: "clEmail",
                type: "email",
              })}

              {renderYearField({
                name: "clYear",
                label: "Year of Study",
              })}

              {renderTextField({
                label: "Class / Division",
                name: "clDivision",
              })}

            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {renderFileUpload(
                "Upload College ID Card",
                "clId"
              )}

              {renderFileUpload(
                "Upload College Authorisation Letter",
                "clAuthorization"
              )}

            </div>
          </section>

          {/* DIVIDER */}
          <div className="mx-6 border-t border-[#D9B8FF]/15 sm:mx-9" />

          {/* ASSISTANT CONTINGENT LEADER */}
          <section className="p-6 sm:p-9">

            <h2 className="mb-6 font-['Orbitron',sans-serif] text-[1.05rem] font-bold text-white">
              Assistant Contingent Leader Details
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">

              {renderTextField({
                label: "Full Name",
                name: "aclName",
              })}

              {renderTextField({
                label: "Contact Number",
                name: "aclContact",
                type: "tel",
              })}

              {renderTextField({
                label: "Email Address",
                name: "aclEmail",
                type: "email",
              })}

              {renderYearField({
                name: "aclYear",
                label: "Year of Study",
              })}

              {renderTextField({
                label: "Class / Division",
                name: "aclDivision",
              })}

            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {renderFileUpload(
                "Upload College ID Card",
                "aclId"
              )}

              {renderFileUpload(
                "Upload College Authorisation Letter",
                "aclAuthorization"
              )}

            </div>
          </section>

          {/* DIVIDER */}
          <div className="mx-6 border-t border-[#D9B8FF]/15 sm:mx-9" />

          {/* CL MEET */}
          <section className="p-6 sm:p-9">

            <h2 className="mb-5 font-['Orbitron',sans-serif] text-[1.05rem] font-bold text-white">
              CL Meet Confirmation
            </h2>

            <p className="mb-5 text-sm leading-7 text-[#BCB3CB]">
              Will the Contingent Leader attend the CL Meet on
              <span className="text-[#D9B8FF]">
                {" "}5th December 2026
              </span>
              ?<span className="ml-1 text-[#AF69FF]">*</span>
            </p>

            <div className="space-y-3">

              {[
                "Yes, I will attend.",
                "No, I will not be able to attend.",
              ].map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#AF69FF]/20 bg-[#080510]/50 p-4 transition-all hover:border-[#AF69FF]/50 hover:bg-[#AF69FF]/5"
                >
                  <input
                    type="radio"
                    name="clMeetAttendance"
                    value={option}
                    checked={formData.clMeetAttendance === option}
                    onChange={handleChange}
                    required
                    className="accent-[#AF69FF]"
                  />

                  <span className="text-sm text-[#E3CCFF]">
                    {option}
                  </span>
                </label>
              ))}

            </div>
          </section>

          {/* DIVIDER */}
          <div className="border-t border-[#D9B8FF]/15" />

          {/* SUBMIT */}
          <div className="p-6 text-center sm:p-9">

            <p className="mb-5 text-xs text-white/40">
              Please review your details before submitting.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-3 rounded-[10px] border border-[#D9B8FF]/32 bg-gradient-to-r from-[#7A2FD6] to-[#AF69FF] px-8 py-4 font-['Orbitron',sans-serif] text-[0.85rem] font-bold tracking-[0.06em] text-white shadow-[0_8px_30px_rgba(145,71,255,0.2)] transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_10px_28px_rgba(145,71,255,0.38)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {submitting
                ? "SUBMITTING..."
                : "SUBMIT REGISTRATION"}

              <ArrowRight size={17} />
            </button>

            <p className="mt-4 text-xs text-white/35">
              <span className="text-[#AF69FF]">*</span> Required fields
            </p>

          </div>

        </form>

        {/* BOTTOM TEXT */}
        <p className="mt-7 text-center font-['IBM_Plex_Mono',monospace] text-[0.65rem] font-semibold tracking-[0.18em] text-[#766A86]">
          FIESTRON 2026 <span className="px-1.5 text-[#AF69FF]">•</span>{" "}
          K.C. COLLEGE, MUMBAI
        </p>

      </div>
    </main>
  );
}