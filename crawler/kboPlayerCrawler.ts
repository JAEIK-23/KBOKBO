import puppeteer from "puppeteer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function crawlKboPlayers() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    "https://www.koreabaseball.com/Record/Player/HitterBasic/Basic1.aspx",
    { waitUntil: "networkidle2", timeout: 0 }
  );

  await page.waitForSelector(".tData01.tt tbody tr");

  const players = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".tData01.tt tbody tr"));
    return rows.map((row) => {
      const cols = row.querySelectorAll("td");
      return {
        rank: cols[0]?.textContent?.trim(),
        name: cols[1]?.textContent?.trim(),
        team: cols[2]?.textContent?.trim(),
        avg: cols[3]?.textContent?.trim(),
        games: cols[4]?.textContent?.trim(),
        pa: cols[5]?.textContent?.trim(),
        ab: cols[6]?.textContent?.trim(),
        r: cols[7]?.textContent?.trim(),
        h: cols[8]?.textContent?.trim(),
        hr: cols[11]?.textContent?.trim(),
        rbi: cols[13]?.textContent?.trim(),
      };
    });
  });

  await browser.close();

  const outputPath = join(__dirname, "../public/kbo-player-stats.json");
  fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));
  console.log("✅ kbo-player-stats.json 저장 완료!");
}

crawlKboPlayers().catch((err) => {
  console.error("❌ 크롤링 중 오류 발생:", err);
});
