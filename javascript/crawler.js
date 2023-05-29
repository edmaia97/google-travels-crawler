const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require('fs/promises');

puppeteer.use(StealthPlugin());

const from = "Fortaleza";
const to = "Manaus";
const leaveDate = "15-6-2023";
const returnDate = "10-7-2023";

const URL = `https://www.google.com/travel/flights?hl=pt-BR&curr=BRL`;

async function getFlightsFromPage(page) {
  return await page.evaluate(() =>
    Array.from(document.querySelectorAll(".pIav2d")).map((el) => {
      const layover = el.querySelector(".BbR8Ec .sSHqwe")?.getAttribute("aria-label");
      return {
        compania: el.querySelector(".Ir0Voe .sSHqwe > span")?.textContent.trim(),
        descricao: el.querySelector(".mv1WYe")?.getAttribute("aria-label"),
        duracao: el.querySelector(".gvkrdb")?.textContent.trim(),
        horaPartida: el.querySelectorAll(".mv1WYe > span > span > span")[0]?.getAttribute("aria-label"),
        horaChegada: el.querySelectorAll(".mv1WYe > span > span > span")[1]?.getAttribute("aria-label"),
        aeroportoPatida: el.querySelectorAll(".Ak5kof .sSHqwe .eoY5cb")[0]?.textContent.trim(),
        aeroportoChegada: el.querySelectorAll(".Ak5kof .sSHqwe .eoY5cb")[1]?.textContent.trim(),
        layover: layover || "Nonstop",
        emissoes: el.querySelector(".V1iAHe > div")?.getAttribute("aria-label").replace(". Learn more about this emissions estimate", " "),
        preco: el.querySelector(".U3gSDe .YMlIz > span")?.textContent.trim(),
      };
    })
  );
}

async function getFlightsResults() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(60000);
  await page.goto(URL);

  await page.waitForSelector(".e5F5td");
  const inputs = await page.$$(".e5F5td");

  // partida
  await inputs[0].click();
  await page.waitForTimeout(2000);
  await page.keyboard.type(from);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);

  // destino
  await inputs[1].click();
  await page.waitForTimeout(2000);
  await page.keyboard.type(to);
  await page.waitForTimeout(1000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);

  // await page.waitForSelector('input[aria-labelledby="i22"]');
  // await page.$eval('input[aria-labelledby="i22"]', el => el.value = to);

  // data saida
  // await page.click(".TP4Lpb .eoY5cb .j0Ppje");
  await page.click('input[aria-label="Partida"]');
  await page.waitForTimeout(2000);
  await page.keyboard.type(leaveDate);
  await page.waitForTimeout(1000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);

  // data retorno
  await page.keyboard.press("Tab");
  await page.waitForTimeout(2000);
  await page.keyboard.type(returnDate);
  await page.waitForTimeout(1000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);

  // clicar concluido
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);

  // press "Search"
  await page.waitForSelector('button[aria-label="Pesquisar"]');
  await page.waitForTimeout(1000);
  await page.click('button[aria-label="Pesquisar"]');
  await page.waitForTimeout(2000);

  await page.waitForSelector(".pIav2d");

  const moreButton = await page.$(".XsapA");
  if (moreButton) {
    await moreButton.click();
    await page.waitForTimeout(5000);
  }

  const flights = await getFlightsFromPage(page);

  await browser.close();

  return flights;
}

async function main() {
  var flights = await getFlightsResults();
  var jsonFlights = JSON.stringify(flights);

  fs.writeFile('flights.json', jsonFlights, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
  });
}

// getFlightsResults().then(console.log);
main();
