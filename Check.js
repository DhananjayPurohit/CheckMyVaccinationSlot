const puppeteer = require("puppeteer");

const accountSid = "ACCOUNT_SID";
const authToken = "AUTH_TOKEN";
const client = require("twilio")(accountSid, authToken);

async function checkSlot() {
  try {
    const URL = "https://www.cowin.gov.in/home";
    const browser = await puppeteer.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();
    // +13133950918
    await page.tracing.start({
      path: "trace.json",
      categories: ["devtools.timeline"],
    });

    await page.goto(URL);
    await page.focus('[appinputchar="pincode"]');
    await page.keyboard.type('458001', { delay: 10 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    let selector = 'input[id="flexRadioDefault2"]';

    await page.evaluate((selector) => document.querySelector(selector).click(), selector); 

    const anchortext = await page.$$eval("a", (anchors) => {
      return anchors.map((anchor) => anchor.textContent).slice(0,-20);
    });
    console.log(anchortext.length);
    for (var i=0;i<anchortext.length;i++){
      console.log(anchortext[i]);
      if (!isNaN(anchortext[i])){
        console.log(anchortext[i]+" "+i);
        client.calls
        .create({
          url: "http://demo.twilio.com/docs/voice.xml",
          to: "+916265771055",
          from: "+13133950918",
        })
        .then((call) => console.log(call.sid));
        break;
      }
      i++;
    }
    await page.tracing.stop();

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

checkSlot();
