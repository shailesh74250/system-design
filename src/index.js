// Import dependencies
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

// Endpoint to add a digital signature to PDF
app.post("/sign-pdf", upload.fields([{ name: 'pdf' }, { name: 'signature' }]), async (req, res) => {
  try {
    const pdfPath = req.files['pdf'][0].path;
    const signaturePath = req.files['signature'][0].path;
    console.log('pdfPath', signaturePath)
    // Load the PDF and signature image
    const pdfBytes = fs.readFileSync(pdfPath);
    const signatureBytes = fs.readFileSync(signaturePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const signatureImage = await pdfDoc.embedPng(signatureBytes); // Use embedJpg for JPG images
    
    // Add the signature to the last page of the PDF
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    
    const { width, height } = lastPage.getSize();
    const signatureWidth = 150; // Customize width
    const signatureHeight = 50; // Customize height

    lastPage.drawImage(signatureImage, {
      x: width - signatureWidth - 50,
      y: 50,
      width: signatureWidth,
      height: signatureHeight,
    });

    // Save the modified PDF
    const signedPdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, "signed.pdf");
    fs.writeFileSync(outputPath, signedPdfBytes);

    // Send the signed PDF back to the user
    res.download(outputPath, "signed.pdf", (err) => {
      if (err) throw err;

      // Clean up temporary files
      fs.unlinkSync(pdfPath);
      fs.unlinkSync(signaturePath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
