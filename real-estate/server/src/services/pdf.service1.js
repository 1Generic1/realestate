const PDFDocument = require("pdfkit");
const https = require("https");
const http = require("http");

// Helper function to download image from URL
const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks)));
        response.on("error", reject);
      })
      .on("error", reject);
  });
};

const generateReferenceLetter = async (
  userData,
  companyData,
  referenceNumber,
) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on("error", reject);

    // Header
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("TAYE'S PROPERTY & REALTY SOLUTIONS", { align: "center" });
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("123 Business District, Lagos, Nigeria", { align: "center" });
    doc.text("Tel: +234 801 234 5678 | Email: info@tayesproperty.com", {
      align: "center",
    });

    doc.moveDown();
    doc
      .fontSize(12)
      .text("═══════════════════════════════════════════════", {
        align: "center",
      });
    doc.moveDown();

    // Reference Info
    doc
      .fontSize(10)
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: "left" });
    doc.text(`Reference: ${referenceNumber}`, { align: "right" });
    doc.moveDown();

    // Subject
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("TO THE EMBASSY/VISA OFFICER", { align: "left" });
    doc.moveDown();
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(
        `SUBJECT: LETTER OF REFERENCE FOR ${userData.fullName.toUpperCase()}`,
        { align: "left" },
      );
    doc.moveDown();

    // Body
    doc.fontSize(11).font("Helvetica");
    doc.text(`Dear Visa Officer,`, { align: "left" });
    doc.moveDown();
    doc.text(
      `This letter is to confirm that ${userData.fullName} has been a valued client of TAYE'S PROPERTY & REALTY SOLUTIONS.`,
      { align: "left" },
    );
    doc.moveDown();

    // Client Information
    doc.font("Helvetica-Bold").text("CLIENT INFORMATION:", { align: "left" });
    doc.font("Helvetica");
    doc.text(`Full Name: ${userData.fullName}`);
    doc.text(`Email: ${userData.email}`);
    doc.text(`Phone: ${userData.phone}`);
    doc.moveDown();

    // Relationship
    doc
      .font("Helvetica-Bold")
      .text("RELATIONSHIP WITH OUR COMPANY:", { align: "left" });
    doc.font("Helvetica");
    doc.text(
      `${userData.fullName} has engaged with our company for professional real estate advisory and property consultation services.`,
    );
    doc.moveDown();

    // Confirmation
    doc.text(
      "We confirm that to the best of our knowledge, the client is a legitimate business partner and there are no negative records associated with their dealings with our company.",
    );
    doc.moveDown();
    doc.moveDown();

    // Signature Section
    doc.text("Sincerely,", { align: "left" });
    doc.moveDown();
    doc.moveDown();

    // Add signature image if exists
    if (companyData.signature) {
      try {
        const signatureBuffer = await downloadImage(companyData.signature);
        doc.image(signatureBuffer, 50, doc.y, { width: 150 });
        doc.moveDown(2);
      } catch (err) {
        console.error("Failed to load signature:", err);
        doc.text("_________________________", { align: "left" });
        doc.moveDown();
      }
    } else {
      doc.text("_________________________", { align: "left" });
      doc.moveDown();
    }

    doc.text(companyData.signatoryName, { align: "left" });
    doc.text(companyData.signatoryTitle, { align: "left" });
    doc.text("TAYE'S PROPERTY & REALTY SOLUTIONS", { align: "left" });
    doc.moveDown();

    // Footer
    doc
      .fontSize(8)
      .text(
        "This is an official company document. Verification can be made by contacting our office.",
        { align: "center", color: "gray" },
      );

    doc.end();
  });
};

module.exports = { generateReferenceLetter };
