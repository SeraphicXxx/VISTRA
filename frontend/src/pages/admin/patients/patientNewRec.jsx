import React, { useState } from "react";
import { ArrowLeft, Save, UserPlus, Info, Eye, EyeOff } from "lucide-react";
import { FieldLabel } from "/@/utils/FieldLabel.jsx";
import { TextField } from "/@/utils/TextField.jsx";
import { SelectField, ClassificationToggle, COURSE_OPTIONS, YEAR_OPTIONS, SECTION_OPTIONS, SEX_OPTIONS, CIVIL_STATUS_OPTIONS, POSITION_OPTIONS, DEPARTMENT_OPTIONS } from "/@/utils/NewPatientUtils.jsx";
import { STUDENT_ID_PATTERN, FACULTY_ID_PATTERN, ADMIN_ID_PATTERN, validateStudentId, validateFacultyId, validateAdminId } from "/@/utils/NewPatientValidation.jsx";

export default function NewPatientRecordForm({ onBack, onSave, errors }) {
  const [classification, setClassification] = useState("student");
  const [studentIdError, setStudentIdError] = useState("");
  const [facultyIdError, setFacultyIdError] = useState("");
  const [adminIdError, setAdminIdError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  console.log(errors);
  const handleBack = () => {
    if (onBack) onBack();
    else if (typeof window !== "undefined") window.history.back();
  };

  const handleStudentIdBlur = (e) => setStudentIdError(validateStudentId(e.target.value));
  const handleFacultyIdBlur = (e) => setFacultyIdError(validateFacultyId(e.target.value));
  const handleAdminIdBlur = (e) => setAdminIdError(validateAdminId(e.target.value));

  const handleSubmit = (e) => {
    e.preventDefault();
    const record = Object.fromEntries(new FormData(e.target).entries());
    if (onSave) onSave(record);
  };

  const isStudent = classification === "student";
  const isFaculty = classification === "faculty";
  const isAdmin = classification === "admin";

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-surface p-8 shadow-lg">
      <div className="mb-8 flex items-center gap-3 border-b border-border pb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <UserPlus className="h-5 w-5 text-primary" strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-heading text-xl font-semibold text-primaryDark">New patient record</h1>
          <p className="mt-0.5 text-xs text-textMuted">Enter the patient's personal and enrollment details.</p>
        </div>
      </div>

      <div className="mb-6">
        <ClassificationToggle value={classification} onChange={setClassification} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <TextField id="name" name="name" label="Name" placeholder="Last name, First name, Middle name" required />
        </div>

        {isStudent && (
          <div>
            <div className="flex items-baseline gap-1">
              <FieldLabel htmlFor="studentId">Student ID</FieldLabel>
              <div className="group relative flex items-center">
                <span className="cursor-help text-[11px] leading-none text-textMuted">ⓘ</span>
                <div className="pointer-events-none absolute left-5 top-1/2 z-20 w-max -translate-y-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">Format: 8 digits, dash, then a letter — e.g. 20230786-S</div>
              </div>
            </div>
            <input id="studentId" name="patient_id" type="text" required placeholder="20230786-S" pattern={STUDENT_ID_PATTERN} onBlur={handleStudentIdBlur} onChange={() => studentIdError && setStudentIdError("")} className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-200 focus:outline-none focus:ring-2 ${studentIdError ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-border focus:border-primary/50 focus:ring-primary/20"}`} />
            {studentIdError && <p className="mt-1 text-xs text-red-500">{studentIdError}</p>}
          </div>
        )}

        {isFaculty && (
          <div>
            <div className="flex items-baseline gap-1">
              <FieldLabel htmlFor="facultyId">Faculty ID</FieldLabel>
              <div className="group relative flex items-center">
                <span className="cursor-help text-[11px] leading-none text-textMuted">ⓘ</span>
                <div className="pointer-events-none absolute left-5 top-1/2 z-20 w-max -translate-y-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">Format: F, dash, year, dash, 3-digit no. — e.g. F-2023-045</div>
              </div>
            </div>
            <input id="facultyId" name="patient_id" type="text" required placeholder="F-2023-045" pattern={FACULTY_ID_PATTERN} onBlur={handleFacultyIdBlur} onChange={() => facultyIdError && setFacultyIdError("")} className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-200 focus:outline-none focus:ring-2 ${facultyIdError ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-border focus:border-primary/50 focus:ring-primary/20"}`} />
            {facultyIdError && <p className="mt-1 text-xs text-red-500">{facultyIdError}</p>}
          </div>
        )}

        {isAdmin && (
          <div>
            <div className="flex items-baseline gap-1">
              <FieldLabel htmlFor="adminId">Admin ID</FieldLabel>
              <div className="group relative flex items-center">
                <span className="cursor-help text-[11px] leading-none text-textMuted">ⓘ</span>
                <div className="pointer-events-none absolute left-5 top-1/2 z-20 w-max -translate-y-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">Format: A, dash, year, dash, 3-digit no. — e.g. A-2023-045</div>
              </div>
            </div>
            <input id="adminId" name="patient_id" type="text" required placeholder="A-2023-045" pattern={ADMIN_ID_PATTERN} onBlur={handleAdminIdBlur} onChange={() => adminIdError && setAdminIdError("")} className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-200 focus:outline-none focus:ring-2 ${adminIdError ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-border focus:border-primary/50 focus:ring-primary/20"}`} />
            {adminIdError && <p className="mt-1 text-xs text-red-500">{adminIdError}</p>}
          </div>
        )}

        <TextField id="birthday" name="birthday" label="Birthday" type="date" required />
        <TextField id="mobileNumber" name="mobile_number" label="Mobile number" type="tel" placeholder="09XXXXXXXXX" required />
        <div>
          <div className="relative">
            <TextField
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
              minLength={8}
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted transition-colors hover:text-textPrimary"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                  <EyeOff className="h-4 w-4" />
              ) : (
                  <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <p className="mt-1 text-xs text-textMuted">
            Must be at least 8 characters.
          </p>
        </div>
        <TextField id="age" name="age" label="Age" type="number" placeholder="e.g. 20" required />
        <SelectField id="sex" name="sex" label="Sex" options={SEX_OPTIONS} />
        <SelectField id="civil_status" name="civil_status" label="Civil status" options={CIVIL_STATUS_OPTIONS} />
      </div>

      {isStudent && (
        <div className="mt-8 border-t border-border pt-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">Enrollment Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SelectField id="course" name="course" label="Course" options={COURSE_OPTIONS} />
            <SelectField id="year" name="year" label="Year" options={YEAR_OPTIONS} />
            <SelectField id="section" name="section" label="Section" options={SECTION_OPTIONS} />
          </div>
        </div>
      )}

      {isFaculty && (
        <div className="mt-8 border-t border-border pt-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">Employment Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SelectField id="department" name="department" label="Department" options={DEPARTMENT_OPTIONS} />
            <SelectField id="position" name="position" label="Position" options={POSITION_OPTIONS} />
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">RESIDENTIAL ADDRESS</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <TextField id="address" name="address" label="Address" placeholder="House no., Street" required />
          </div>
          <TextField id="barangay" name="barangay" label="Barangay" placeholder="e.g. Brgy. 176" required />
        </div>
      </div>

      <div className="mt-6 flex items-start justify-center gap-1.5 text-center text-xs text-info">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        <span>Please ensure all information is accurate before saving. This record will be stored in the system for future reference.</span>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-textSecondary transition-colors duration-200 hover:bg-background hover:text-textPrimary">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back
        </button>

        <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primaryDark">
          <Save className="h-4 w-4" strokeWidth={2} />
          Save Record
        </button>
      </div>
    </form>
  );
}
