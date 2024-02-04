const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { excecutablePath } = require("puppeteer");

let startPhase = true;

let initialBet = "Big";
// let initialBet = "Small";
// in this true means small and false means big

//Previous Ber
let previousBet;

let previousResult;

//previous Period Id
let previousId;

//ammound
let ammount = 1;

let reset = false;

let resultx;

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: true,
    excecutablePath: excecutablePath,
    defaultViewport: false,
    args : ["--no-sandbox"]
    // userDataDir: "./tmp",

  });

  const page = await browser.newPage();
  await page.goto("https://91clubin.in/#/login");

  const cookies = [
    { name: "test", value: "foo" },
    { name: "test2", value: "foo" },
  ]; // just as example, use real cookies here;
  await page.setCookie(...cookies);

  //Set screen size
  await page.setViewport({ width: 350, height: 700 });

  await page.waitForSelector(".phoneInput__container-input");

  // Select the input field by its name attribute
  const inputElement = await page.$('input[name="userNumber"]');

  const passwordInput = await page.$(
    'input[placeholder="Please enterPassword"]'
  );

  // Type your desired text into the input field
  // await inputElement.type("9209585026");
  // await passwordInput.type("saymyname123");

  await inputElement.type("8766509670");
  await passwordInput.type("MZju5LLFS9uKuR6"); 

  // Optionally, you can press Enter after typing to submit the form
  await inputElement.press("Enter");

  await page.waitForSelector(".van-button__text");

  const confirm = await page.waitForSelector("div > .van-button__text");

  setTimeout(async () => {
    await confirm.click();
  }, 3000);

  await page.waitForSelector(".van-dialog__header");
  const close = await page.waitForSelector("div > .close");
  await close.evaluate((b) => b.click());

  await page.waitForSelector(".lottery_container");

  // Select the first lottery slot item
  const firstLotterySlotItem = await page.$(
    ".lottery_container .lotterySlotItem"
  );

  setTimeout(async () => {
    await firstLotterySlotItem.click();
  }, 3000);

  await page.waitForSelector(".Betting__C-foot-s");

  await page.waitForSelector(".GameRecord__C-body");

  // Use the page.evaluate method to interact with the page
  const smallBetel = await page.waitForSelector(".Betting__C");

  setTimeout(() => {
    // loop for constant play
    
   
      setInterval(async () => {

        //balance checker function
        const innerText = await page.$eval(
          ".Wallet__C-balance-l1 div",
          (div) => div.innerText
        );
        console.log("Balance:", innerText);


        if (ammount < 32){
        const result = await page.evaluate(() => {
          const fourthDiv = document.querySelector(
            ".TimeLeft__C-time div:nth-child(4)"
          );
          const fifthDiv = document.querySelector(
            ".TimeLeft__C-time div:nth-child(5)"
          );

          return {
            fourthDivText: fourthDiv.innerText,
            fifthDivText: fifthDiv.innerText,
          };
        });

        // Log the results

        if (result.fourthDivText == "0" && result.fifthDivText == "2") {
          console.log("4th div text:", result.fourthDivText);
          console.log("5th div text:", result.fifthDivText);

          // function for get period data
          setTimeout(async () => {
            if (startPhase == false) {
              resultx = await page.evaluate(() => {
                const rows = document.querySelectorAll(
                  ".GameRecord__C-body .van-row"
                );
                const spanTexts = [];

                rows.forEach((row) => {
                  const spanElement = row.querySelector(".van-col--5 span");
                  const text = spanElement.innerText;
                  spanTexts.push(text);
                });

                return spanTexts;
              });

              // Log the results
              console.log("Lottery", resultx[0]);

              if (resultx[0] == previousBet) {
                reset = false;
                ammount = 1;
              } else {
                reset = true;
                ammount = ammount * 2;
              }
            }

            console.log(initialBet);
            if (initialBet == "Small") {
              previousBet = "Small";
              initialBet = "Big";

              setTimeout(async () => {
                const smallBet = await page.$(".Betting__C-foot-s");
                await smallBet.evaluate((b) => b.click());

                await page.waitForSelector("#van-field-1-input");
                await page.$eval(
                  "#van-field-1-input",
                  (input) => (input.value = "")
                );
                await page.type("#van-field-1-input", ammount.toString());

                setTimeout(async () => {
                  const finalsmallBet = await page.$(".Betting__Popup-foot-s");
                  await finalsmallBet.evaluate((b) => b.click());
                }, 2000);
              }, 3000);
            } else {
              previousBet = "Big";
              initialBet = "Small";

              setTimeout(async () => {
                const bigBet = await page.$(".Betting__C-foot-b");
                await bigBet.evaluate((b) => b.click());

                await page.waitForSelector("#van-field-1-input");
                await page.$eval(
                  "#van-field-1-input",
                  (input) => (input.value = "")
                );
                await page.type("#van-field-1-input", ammount.toString());

                setTimeout(async () => {
                  const finalsmallBet = await page.$(".Betting__Popup-foot-s");
                  await finalsmallBet.evaluate((b) => b.click());
                }, 2000);
              }, 3000);
            }

            startPhase = false;
            const getLeaderboarddata = await page.evaluate(() => {
              const rows = document.querySelectorAll(
                ".GameRecord__C-body .van-row"
              );
              const numbers = [];

              rows.forEach((row) => {
                const col8Element = row.querySelector(".van-col--8");
                const number = col8Element.innerText;
                numbers.push(number);
              });

              return numbers[0];
            });
            previousId = getLeaderboarddata;
            console.log(previousId);

            //function for get lottery results
            // Use the page.evaluate method to interact with the page
          }, 3000);
          
        }
      }else{
        ammount = 1;
      }
      }, 1000);
  }, 5000);
})();
