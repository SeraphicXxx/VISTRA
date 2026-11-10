import React, { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { Logo } from "/@/components/Logo.jsx";

export const CLINIC_NAME = "University of Caloocan City Clinic";
const DPO_EMAIL = "[dpo email address]";

export const LEGAL_SECTIONS = [
  {
    title: "Terms and Conditions",
    paragraphs: [
      `These Terms and Conditions govern your use of the VISTRA patient portal operated by the ${CLINIC_NAME} (the "Clinic"). By signing in, you agree to them.`,
      "Access is limited to registered students, faculty, and staff. You must keep your login credentials confidential and must not share your account with anyone else.",
      "You are responsible for the accuracy of the personal, medical, and dental information you provide. Notify the Clinic if any of your information is incorrect.",
      "The health risk predictions and vital sign summaries shown in the portal are estimates for information only. They are not a diagnosis. Consult a licensed doctor or dentist for medical advice.",
      "The Clinic may suspend or end access to the portal if these terms are violated or if your enrollment or employment status changes.",
    ],
  },
  {
    title: "Privacy Policy",
    paragraphs: [
      "This Privacy Policy is issued in compliance with Republic Act No. 10173, the Data Privacy Act of 2012 (the \"Act\"), its Implementing Rules and Regulations, and the issuances of the National Privacy Commission (NPC).",
      `The ${CLINIC_NAME} is the personal information controller. We collect personal details (such as name, ID, birthday, sex, civil status, contact number, and address), medical and dental records, vital sign readings, and appointment information.`,
      "Health, dental, and vital sign data are sensitive personal information under the Act. They are processed only as permitted under Section 13 of the Act, for purposes such as providing clinic services, keeping accurate health records, and meeting school health and reporting requirements.",
      "Only authorized clinic staff and the professionals treating you can access your records. Information is not sold to third parties. It is shared only when required by law or with your consent.",
      "We apply organizational, physical, and technical security measures to protect your information. In the event of a personal data breach likely to give rise to a real risk of serious harm, the Clinic will notify the NPC and affected data subjects within the period required by the Act and NPC issuances.",
      "Records are retained according to the Clinic's record-keeping policy and applicable laws, then disposed of securely when no longer needed.",
    ],
  },
  {
    title: "Your Rights as a Data Subject",
    paragraphs: [
      "Under Section 16 of the Act, you have the right to be informed, to object to processing, to access your personal data, to rectify inaccurate data, to erasure or blocking, to damages for inaccurate or unlawfully obtained data, and to data portability.",
      "You may withdraw your consent at any time, subject to the Clinic's legal and medical record-keeping obligations.",
      `To exercise your rights, or to ask questions or raise concerns, contact the Clinic's Data Protection Officer at ${DPO_EMAIL}. You may also file a complaint with the National Privacy Commission at privacy.gov.ph.`,
    ],
  },
  {
    title: "Consent",
    paragraphs: [
      "By agreeing, you confirm that you have read these Terms and Conditions and this Privacy Policy, and that you consent to the collection and processing of your personal information as described above.",
    ],
  },
];

const COLORS = {
  primary: [13, 148, 136],
  primaryDark: [15, 118, 110],
  ink: [15, 23, 42],
  body: [71, 85, 105],
  muted: [120, 130, 145],
  line: [226, 232, 240],
  tint: [240, 253, 250],
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function imageToPng(src, width = 800) {
  const img = await loadImage(src);
  const ratio = img.naturalWidth / img.naturalHeight || 1;
  const height = Math.round(width / ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(img, 0, 0, width, height);
  return { dataUrl: canvas.toDataURL("image/png"), ratio };
}

async function svgMarkupToPng(markup) {
  const match = markup.match(/<svg([^>]*)>/);
  if (!match) throw new Error("No inline SVG found");

  const viewBox = (match[1].match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 240 64")
    .split(/[\s,]+/)
    .map(Number);
  const ratio = viewBox[2] / viewBox[3];
  const width = 800;
  const height = Math.round(width / ratio);

  const attrs = match[1].replace(/\s(width|height|xmlns|color)="[^"]*"/g, "");
  const svg = markup.replace(
    match[0],
    `<svg${attrs} xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" color="#0f766e">`,
  );

  const url = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    return await imageToPng(url, width);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function loadLogo(logoUrl) {
  try {
    const markup = renderToStaticMarkup(<Logo />);
    const imgSrc = markup.match(/<img[^>]*\ssrc="([^"]+)"/)?.[1];
    if (imgSrc) return await imageToPng(new URL(imgSrc, window.location.href).href);
    if (markup.includes("<svg")) return await svgMarkupToPng(markup);
  } catch (err) {
    console.warn("Logo component could not be used in the PDF.", err);
  }

  try {
    return await imageToPng(logoUrl);
  } catch (err) {
    console.warn(`Logo file not found at ${logoUrl}. Using text instead.`, err);
    return null;
  }
}

async function buildTermsPdf({
  sections = LEGAL_SECTIONS,
  heading = "Terms and Conditions and Privacy Policy",
  organization = CLINIC_NAME,
  logoUrl = "/vistra-logo.png",
} = {}) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const contentWidth = pageWidth - margin * 2;
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

  drawStripe();

  const logo = await loadLogo(logoUrl);
  if (logo) {
    const logoHeight = 36;
    doc.addImage(logo.dataUrl, "PNG", margin, 36, logoHeight * logo.ratio, logoHeight);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    setText(COLORS.primaryDark);
    doc.text("VISTRA", margin, 62);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setText(COLORS.ink);
  doc.text(organization, pageWidth - margin, 50, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(COLORS.muted);
  doc.text("VISTRA Patient Portal", pageWidth - margin, 64, { align: "right" });

  y = 112;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  setText(COLORS.ink);
  doc.splitTextToSize(heading, contentWidth).forEach((line) => {
    doc.text(line, margin, y);
    y += 30;
  });

  const generatedOn = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(COLORS.muted);
  doc.text(`Generated on ${generatedOn}`, margin, y);
  y += 16;

  setDraw(COLORS.line);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 30;

  sections.forEach((section, index) => {
    ensureSpace(60);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setText(COLORS.primary);
    doc.text(String(index + 1).padStart(2, "0"), margin, y);

    doc.setFontSize(13);
    setText(COLORS.ink);
    doc.text(section.title, margin + 30, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setText(COLORS.body);

    for (const paragraph of section.paragraphs) {
      for (const line of doc.splitTextToSize(paragraph, contentWidth - 30)) {
        ensureSpace(15);
        doc.text(line, margin + 30, y);
        y += 15;
      }
      y += 7;
    }

    y += 16;
  });

  const boxHeight = 74;
  ensureSpace(boxHeight + 16);
  setFill(COLORS.tint);
  doc.rect(margin, y, contentWidth, boxHeight, "F");
  setFill(COLORS.primary);
  doc.rect(margin, y, 4, boxHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(COLORS.ink);
  doc.text("Acknowledgment", margin + 30, y + 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setText(COLORS.body);
  doc.text(
    doc.splitTextToSize(
      "By signing in to the VISTRA patient portal, you confirm that you have read, understood, and agree to these Terms and Conditions and Privacy Policy.",
      contentWidth - 60,
    ),
    margin + 30,
    y + 44,
  );

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    setDraw(COLORS.line);
    doc.setLineWidth(0.6);
    doc.line(margin, footerY - 14, pageWidth - margin, footerY - 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(COLORS.muted);
    doc.text(`${organization} · Confidential`, margin, footerY);
    doc.text(`Page ${page} of ${totalPages}`, pageWidth - margin, footerY, {
      align: "right",
    });
  }

  return doc;
}

export async function generateTermsPdf(options = {}) {
  const tab = window.open("", "_blank");
  try {
    const doc = await buildTermsPdf(options);
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

export default function TermsPdfDownloadButton({
  className = "",
  label = "View PDF",
}) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setIsBusy(true);
    setError(null);
    try {
      await generateTermsPdf();
    } catch (err) {
      // PDF generation error handled by caller
      setError("Could not open the PDF. Please try again.");
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
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {isBusy ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" strokeWidth={2} />
        )}
        {isBusy ? "Opening PDF..." : label}
      </button>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}