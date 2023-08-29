const puppeteer = require('puppeteer');
const { delay } = require('./utils');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      userDataDir:
        '/Users/lancygoyal/Library/Application Support/Google/Chrome/Default',
    });

    const context = await browser.defaultBrowserContext();

    const page = await browser.newPage();

    await page.goto('https://dev.to/');

    await context.overridePermissions('https://dev.to/', ['clipboard-read']);

    const createPost = await page.$x("//a[contains(text(), 'Create Post')]");

    if (createPost.length > 0) {
      await createPost[0].click();
    } else {
      throw new Error('createPost not found');
    }

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await delay(500);

    await page.waitForSelector('#article-form-title', {
      visible: true,
    });

    await page.type('#article-form-title', 'Hello World', { delay: 20 });

    await delay(500);

    await page.waitForSelector('#tag-input', {
      visible: true,
    });

    await page.type('#tag-input', 'hello,world', { delay: 20 });

    await delay(500);

    await page.waitForSelector('#article_body_markdown', {
      visible: true,
    });

    const copiedText = await page.evaluate(
      `(async () => await navigator.clipboard.readText())()`,
    );

    console.log({ copiedText });

    await page.type('#article_body_markdown', copiedText, {
      delay: 20,
    });

    const publishPost = await page.$x("//button[contains(text(), 'Publish')]");

    if (publishPost.length > 0) {
      // Uncomment this line to publish
      // await publishPost[0].click();
    } else {
      throw new Error('publishPost not found');
    }

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await delay(5000);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();
