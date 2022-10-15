const puppeteer = require('puppeteer');

const url = 'https://direct-cloud.xyz/d/--ZYm8a';

async function configureBrowser() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //await page.waitForSelector("#generate_url");
    //await page.waitForTimeout(2000);
    dllink = await page.evaluate(() => {
      return document.querySelector(".leading-6").getAttribute('href');
    });
   // return page;
    console.log(dllink);
    await browser.close();
}

configureBrowser();