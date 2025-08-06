import puppeteer from "puppeteer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function crawlKboPitchers() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    "https://www.koreabaseball.com/Record/Player/PitcherBasic/Basic1.aspx",
    { waitUntil: "networkidle2", timeout: 0 }
  );

  await page.waitForSelector(".tData01.tt tbody tr");

  const pitchers = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".tData01.tt tbody tr"));
    return rows.map((row) => {
      const cols = row.querySelectorAll("td");
      return {
        rank: cols[0]?.textContent?.trim(),
        name: cols[1]?.textContent?.trim(),
        team: cols[2]?.textContent?.trim(),
        era: cols[3]?.textContent?.trim(), // 평균자책점 (ERA)
        games: cols[4]?.textContent?.trim(), // 경기수
        wins: cols[5]?.textContent?.trim(), // 승리
        losses: cols[6]?.textContent?.trim(), // 패전
        saves: cols[7]?.textContent?.trim(), // 세이브
        hold: cols[8]?.textContent?.trim(), // 홀드
        wpct: cols[9]?.textContent?.trim(), // 승률
        ip: cols[10]?.textContent?.trim(), // 이닝
        h: cols[11]?.textContent?.trim(), // 피안타
        hr: cols[12]?.textContent?.trim(), // 피홈런
        bb: cols[13]?.textContent?.trim(), // 볼넷
        hbp: cols[14]?.textContent?.trim(), // 사구
        so: cols[15]?.textContent?.trim(), // 탈삼진
        r: cols[16]?.textContent?.trim(), // 실점
        er: cols[17]?.textContent?.trim(), // 자책점
        whip: cols[18]?.textContent?.trim(), // WHIP
      };
    });
  });

  await browser.close();

  const outputPath = join(__dirname, "../../public/kbo-pitcher-stats.json");
  fs.writeFileSync(outputPath, JSON.stringify(pitchers, null, 2));
  console.log("✅ kbo-pitcher-stats.json 저장 완료!");
}

crawlKboPitchers().catch((err) => {
  console.error("❌ 크롤링 중 오류 발생:", err);
});
