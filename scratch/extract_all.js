
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function run() {
    const pdfPath = 'G:/antigravity/student result/scratch/latest_admit_card.pdf';
    if (!fs.existsSync(pdfPath)) {
        console.log('PDF not found');
        return;
    }
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();
    console.log(`Page Size: ${width}x${height}`);

    const xObjects = page.node.Resources()?.get(require('pdf-lib').PDFName.of('XObject'));
    if (!xObjects) return;

    const keys = xObjects.keys();
    for (const key of keys) {
        const name = key.decodeText();
        const obj = xObjects.get(key);
        if (obj instanceof require('pdf-lib').PDFRawStream) {
            const subtype = obj.dict.get(require('pdf-lib').PDFName.of('Subtype'));
            if (subtype === require('pdf-lib').PDFName.of('Image')) {
                const contents = Buffer.from(obj.contents);
                if (contents[0] === 0xFF && contents[1] === 0xD8) {
                    fs.writeFileSync(`G:/antigravity/student result/scratch/img_${name}.jpg`, contents);
                    console.log(`Saved img_${name}.jpg`);
                }
            }
        }
    }
}

run().catch(console.error);
