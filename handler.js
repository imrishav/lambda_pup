const chromium = require('chrome-aws-lambda');
// const puppeteer = require('puppeteer-core');

module.exports.handler = async (event, context) => {
  let browser = null;

  try {
    // Launch Puppeteer with headless Chrome
   const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Example</title>
</head>
<body>
    <h1>Hello, PDF!</h1>
    <p>This is a simple HTML page that can be converted to a PDF.</p>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
</body>
</html>
`; // Assuming the HTML is passed in the request body
    console.log(html,'===>>><<<')
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html);

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();
    console.log(pdfBuffer,'222222===>>><<<')

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/pdf' },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error taking screenshot' }),
    };
  } finally {
    // Close the browser
    if (browser !== null) {
      await browser.close();
    }
  }
};
