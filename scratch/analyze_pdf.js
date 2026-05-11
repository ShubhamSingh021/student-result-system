const PDFParser = require('pdf2json');
const fs = require('fs');
const path = require('path');

async function analyzePdf(filePath) {
    const pdfParser = new PDFParser();

    return new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataReady", pdfData => {
            resolve(pdfData);
        });

        pdfParser.on("pdfParser_dataError", errData => {
            reject(errData.parserError);
        });

        pdfParser.loadPDF(filePath);
    });
}

const pdfPath = path.join(__dirname, '..', 'scratch', 'latest_admit_card.pdf');
if (fs.existsSync(pdfPath)) {
    analyzePdf(pdfPath).then(data => {
        console.log(JSON.stringify(data, null, 2));
    }).catch(err => {
        console.error(err);
    });
} else {
    console.error("PDF not found at " + pdfPath);
}
