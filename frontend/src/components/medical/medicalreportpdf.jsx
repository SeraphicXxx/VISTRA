import React, { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { CLINIC_NAME, loadLogo } from "/@/components/legal/termsandconditionpdf";
import { formatDate } from "/@/utils/FormatDate";

const COLORS = {
  primary: [13, 148, 136],
  primaryDark: [15, 118, 110],
  ink: [15, 23, 42],
  body: [71, 85, 105],
  muted: [120, 130, 145],
  line: [226, 232, 240],
  tint: [240, 253, 250],
};

export async function buildMedicalReportPdf({ visit, patientId }) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const indent = margin + 30;
  const contentWidth = pageWidth - margin * 2;
  const innerWidth = contentWidth - 30;
  const bottomLimit = pageHeight - 72;
  const footerY = pageHeight - 36;
  let y = 0;

  const setText = (rgb) => doc.setTextColor(...rgb);
  const setFill = (rgb) => doc.setFillColor(...rgb);
  const setDraw = (rgb) => doc.setDrawColor(...rgb);

  const drawStripe = () => {
    setFill(COLORS.primary);
    doc.rect(0, 0, pageWidth, 6, "F");
  };

  const newPage = () => {
    doc.addPage();
    drawStripe();
    y = 56;
  };

  const ensureSpace = (needed) => {
    if (y + needed > bottomLimit) newPage();
  };

  // Wraps text to a width, breaking long unbroken words by character.
  const wrap = (text, width) => {
    const lines = [];
    for (const raw of String(text || "—").split("\n")) {
      for (const wrapped of doc.splitTextToSize(raw, width)) {
        let line = wrapped;
        while (doc.getTextWidth(line) > width) {
          let cut = line.length;
          while (cut > 1 && doc.getTextWidth(line.slice(0, cut)) > width) cut--;
          lines.push(line.slice(0, cut));
          line = line.slice(cut);
        }
        lines.push(line);
      }
    }
    return lines;
  };

  const sectionTitle = (number, title) => {
    ensureSpace(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setText(COLORS.primary);
    doc.text(number, margin, y);
    doc.setFontSize(13);
    setText(COLORS.ink);
    doc.text(title, indent, y);
    y += 22;
  };

  const fieldGrid = (fields) => {
    const colWidth = innerWidth / 2;
    for (let i = 0; i < fields.length; i += 2) {
      const pair = fields.slice(i, i + 2);
      const lines = pair.map(([, value]) => wrap(value, colWidth - 12));
      const rowHeight = Math.max(...lines.map((l) => l.length)) * 12 + 26;
      ensureSpace(rowHeight);

      pair.forEach(([label], col) => {
        const x = indent + col * colWidth;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setText(COLORS.muted);
        doc.text(label.toUpperCase(), x, y);
        doc.setFontSize(10);
        setText(COLORS.ink);
        lines[col].forEach((line, index) => {
          doc.text(line, x, y + 14 + index * 12);
        });
      });

      y += rowHeight;
    }
    y += 6;
  };

  const paragraphBlock = (label, text) => {
    const lines = wrap(text, innerWidth);
    ensureSpace(24 + lines.length * 15);
    if (label) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setText(COLORS.muted);
      doc.text(label.toUpperCase(), indent, y);
      y += 14;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setText(COLORS.ink);
    for (const line of lines) {
      ensureSpace(15);
      doc.text(line, indent, y);
      y += 15;
    }
    y += 10;
  };

  drawStripe();

  const logo = await loadLogo("/vistra-logo.png");
  if (logo) {
    doc.addImage(logo.dataUrl, "PNG", margin, 36, 36 * logo.ratio, 36);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    setText(COLORS.primaryDark);
    doc.text("VISTRA", margin, 62);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setText(COLORS.ink);
  doc.text(CLINIC_NAME, pageWidth - margin, 50, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(COLORS.muted);
  doc.text("Medical Records", pageWidth - margin, 64, { align: "right" });

  y = 112;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  setText(COLORS.ink);
  doc.text("Medical Visit Report", margin, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setText(COLORS.body);
  doc.text(
    `Record MED-${visit.medical_visit_id} · ${visit.status ?? "—"}`,
    margin,
    y,
  );
  y += 16;

  const generatedOn = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(9);
  setText(COLORS.muted);
  doc.text(`Generated on ${generatedOn}`, margin, y);
  y += 16;

  setDraw(COLORS.line);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 30;

  sectionTitle("01", "Patient Information");
  fieldGrid([
    ["Patient name", visit.patient_name],
    ["Patient ID", patientId ?? visit.patient_id],
    ["Course", visit.course],
    ["Year and section", visit.year_section],
    ["Age", visit.age],
    ["Sex", visit.sex],
    ["Civil status", visit.civil_status],
    ["Birthday", visit.birthday ? formatDate(visit.birthday) : ""],
    ["Mobile number", visit.mobileNumber],
    ["Barangay", visit.barangay],
    ["Address", visit.address],
  ]);
  y += 14;

  sectionTitle("02", "Consultation");
  fieldGrid([
    ["Visit date", visit.visit_date ? formatDate(visit.visit_date) : ""],
    ["Attending staff", visit.staff_name],
    ["Treatment type", visit.treatment_type],
    ["Record status", visit.status],
  ]);
  paragraphBlock("Complaint / findings", visit.complaint);
  paragraphBlock("Treatment", visit.treatment);
  y += 14;

  sectionTitle("03", "Notified Professor");
  const professor = visit.notified_professor;
  if (professor) {
    fieldGrid([
      ["Name", professor.name],
      ["Role", professor.role],
      ["Course", professor.course],
      ["Email", professor.email],
      ["Date sent", professor.sent_at ? formatDate(professor.sent_at) : ""],
    ]);
  } else {
    paragraphBlock("", "No professor was notified for this record.");
  }
  y += 14;

  const boxHeight = 100;
  ensureSpace(boxHeight + 40);
  setFill(COLORS.tint);
  doc.rect(margin, y, contentWidth, boxHeight, "F");
  setFill(COLORS.primary);
  doc.rect(margin, y, 4, boxHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(COLORS.ink);
  doc.text("Attending staff certification", indent, y + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setText(COLORS.body);
  doc.text(
    "I certify that the information in this record is accurate and complete.",
    indent,
    y + 40,
  );

  setDraw(COLORS.muted);
  doc.setLineWidth(0.6);
  doc.line(indent, y + 72, indent + 200, y + 72);
  doc.line(indent + 230, y + 72, pageWidth - margin - 16, y + 72);
  doc.setFontSize(8);
  setText(COLORS.muted);
  doc.text("Attending staff signature", indent, y + 84);
  doc.text("Date", indent + 230, y + 84);
  y += boxHeight + 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setText(COLORS.muted);
  wrap(
    "Confidential. This report contains sensitive personal information protected under the Data Privacy Act of 2012 (RA 10173). Disclose it only as permitted by law.",
    contentWidth,
  ).forEach((line) => {
    ensureSpace(12);
    doc.text(line, margin, y);
    y += 12;
  });

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    setDraw(COLORS.line);
    doc.setLineWidth(0.6);
    doc.line(margin, footerY - 14, pageWidth - margin, footerY - 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(COLORS.muted);
    doc.text(`${CLINIC_NAME} · Confidential`, margin, footerY);
    doc.text(`Page ${page} of ${totalPages}`, pageWidth - margin, footerY, {
      align: "right",
    });
  }

  return doc;
}

export async function generateMedicalReportPdf(options) {
  const tab = window.open("", "_blank");
  try {
    const doc = await buildMedicalReportPdf(options);
    const url = doc.output("bloburl");
    if (tab) {
      tab.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  } catch (err) {
    if (tab) tab.close();
    throw err;
  }
}

export default function MedicalReportPdfButton({
  visit,
  patientId,
  className = "",
  label = "Generate report",
}) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setIsBusy(true);
    setError(null);
    try {
      await generateMedicalReportPdf({ visit, patientId });
    } catch (err) {
      console.error(err);
      setError("Could not open the report. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isBusy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-textSecondary hover:bg-surfaceMuted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isBusy ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        {isBusy ? "Preparing..." : label}
      </button>

      {error ? (
        <p role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}