const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const path = require("path");

// Compile Handlebars template
let compiledTemplate = null;

const getTemplate = async () => {
  if (!compiledTemplate) {
    const templatePath = path.join(
      __dirname,
      "../templates/reference-letter.hbs",
    );
    const html = await fs.readFile(templatePath, "utf-8");
    compiledTemplate = handlebars.compile(html);
  }
  return compiledTemplate;
};

const generateReferenceLetterPDF = async (data) => {
  let browser = null;

  try {
    const template = await getTemplate();

    const htmlContent = template({
      referenceNumber: data.referenceNumber,
      date: data.date,
      recipientTitle: data.recipientTitle,
      letterTitle: data.letterTitle,
      salutation: data.salutation,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      signatoryName: data.signatoryName,
      signatoryTitle: data.signatoryTitle,
      signature: data.signature,
      address: data.address || {},
      phone: data.phone || {},
      email: data.email || {},
    });

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set content
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    // Calculate optimal scale to fit content on one page
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15px",
        bottom: "15px",
        left: "20px",
        right: "20px",
      },
      // Let the content determine the layout
      preferCSSPageSize: true,
      // Scale content down if needed
      scale: 0.95,
    });

    return pdfBuffer;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const generateReferenceLetterHTML = async (data) => {
  try {
    const template = await getTemplate();

    // Prepare data for template
    const htmlContent = template({
      referenceNumber: data.referenceNumber,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone || "Not provided",
      signatoryName: data.signatoryName,
      signatoryTitle: data.signatoryTitle,
      signature: data.signature,
      address: data.address || {},
      phone: data.phone || {},
      email: data.email || {},
    });

    return htmlContent;
  } catch (error) {
    console.error("HTML generation error:", error);
    throw error;
  }
};

module.exports = { generateReferenceLetterPDF, generateReferenceLetterHTML };
