const puppeteer = require('puppeteer');

async function checkOptions() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://rtu.sumsraj.com/Exam/Report/DownloadGradesheet.aspx', { waitUntil: 'networkidle2' });
    
    const sessions = await page.evaluate(() => {
      const select = document.querySelector('#ddlSession');
      return Array.from(select.options).map(o => o.text);
    });
    
    const categories = await page.evaluate(() => {
      const select = document.querySelector('#ddlExamCategory');
      return Array.from(select.options).map(o => o.text);
    });
    
    // We might need to select a session/category to see semesters, but usually they are all there
    const semesters = await page.evaluate(() => {
      const select = document.querySelector('#ddlSemester');
      return Array.from(select.options).map(o => o.text);
    });
    
    console.log('SESSIONS:', sessions);
    console.log('CATEGORIES:', categories);
    console.log('SEMESTERS:', semesters);
    
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

checkOptions();
