const puppeteer = require('puppeteer-extra');
console.time('test');
const blockResourcesPlugin = require('puppeteer-extra-plugin-block-resources')()
puppeteer.use(blockResourcesPlugin)

const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
  ];

const url = 'https://vcloudz.link/ahfhx9wpbpkkhh4';

async function configureBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        args: minimal_args
      });
    const page = await browser.newPage();
    //await page.setCacheEnabled(false);
    blockResourcesPlugin.blockedTypes.add('media')
    blockResourcesPlugin.blockedTypes.add('script')
    blockResourcesPlugin.blockedTypes.add('stylesheet')

    await page.goto(url);
    //await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36');

    await Promise.all([
        page.click('button[type=submit]'),
        page.waitForNavigation({waitUntil: 'networkidle2'})
    ]);
    
    dlpage = await page.evaluate(() => {
        
        return document.querySelector('*').outerHTML;
    });

    const regex = /((?:(?:https?%3A%2F%2F)(?:www\.)?(?:\S+)%2F|(?:https?:\/\/)(?:www\.)?(?:\S+)\/)(?:.*)?\.(mp4|mkv|wmv|m4v|mov|avi|flv|webm|flac|mka|m4a|aac|ogg)(?=[^.]*$))/igm;
    const found = dlpage.toString().match(regex);
    console.log(found.toString());

    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    await browser.close();
    await console.timeEnd('test');
}

configureBrowser();