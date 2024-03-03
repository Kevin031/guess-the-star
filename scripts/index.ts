import axios from "axios";
import fs from "fs-extra";
import path from "path";
import * as cheerio from "cheerio";
import https from "https";
import download from "download";

const snapshotPath = path.resolve(__dirname, "../snapshots/partners.html");
const jsonPath = path.resolve(__dirname, "../snapshots/partners.json");
const appJSONPath = path.resolve(__dirname, "../app/public/partners.json");

let existSet = new Set();
if (fs.existsSync(jsonPath)) {
  const existJSON = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  if (Array.isArray(existJSON)) {
    existJSON.forEach((item) => {
      existSet.add(item.id);
    });
  }
}

function promisePoll(arr: any, limit: number) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const n = arr.length;
    const res = new Array(n);
    let index = 0;
    function step(i: number) {
      if (count === n) {
        resolve(res);
        return;
      }
      if (arr[index]) {
        arr[index]().then((result: any) => {
          res[i] = result;
          count++;
          step(index);
        });
      }
      index++;
    }
    for (let i = 0; i < limit; i++) {
      step(i);
    }
  });
}

function downloadImage(imageUrl: string, cb: Function) {
  // 从URL中提取文件名
  const filename = path.basename(imageUrl);

  // 本地文件路径
  const localFilePath = path.join(__dirname, "../snapshots/images/");

  return new Promise((resolve, reject) => {
    cb();
    // 发送HTTPS请求获取图片数据
    if (
      fs.existsSync(path.resolve(__dirname, "../snapshots/images/" + filename))
    ) {
      // 文件已存在
      return resolve(true);
    }
    download(imageUrl, localFilePath)
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        console.error("下载图片时出错:", err.message);
        reject(err);
      });
    // https
    //   .get(imageUrl, (response) => {
    //     // 创建一个可写流
    //     const fileStream = fs.createWriteStream(localFilePath);

    //     // 将响应数据管道到本地文件流中
    //     response.pipe(fileStream);

    //     // 当所有数据写入完成时
    //     fileStream.on("finish", () => {
    //       fileStream.close();
    //       resolve(true);
    //     });
    //   })
    //   .on("error", (err) => {
    //     console.error("下载图片时出错:", err.message);
    //     reject(err);
    //   });
  });
}

function getPartnerInfoFromHtml(source: string) {
  const $ = cheerio.load(source);
  const list = $(".partners.item");
  let result: any[] = [];
  list
    .map((i, el) => {
      const cur = $(el);
      let id = cur.attr("id");
      if (existSet.has(id)) {
        console.log("跳过已存在的数据");
        return null;
      }
      let item: any = {
        name: cur.find(".info > h2 > a").text().split(" ")[0],
        job: cur.find(".info > ul > li:nth-child(1)").text(),
        picture: cur.find(".pic > a > img").attr("src"),
        id: cur.attr("id"),
      };
      existSet.add(item.id);
      item.pictureFileName = path.basename(item.picture);
      result.push(item);
    })
    .filter(Boolean);
  return result;
}

function downloadPicture(list: any[]) {
  return promisePoll(
    list.map((item, i) => {
      return () =>
        downloadImage(item.picture, () => {
          console.log(`正在下载第 ${Number(i) + 1}/${list.length} 张图片`);
        });
    }),
    3
  );
}

async function getInfoFromUrl(url: string) {
  try {
    const res = await axios.get(url);
    let result: any[] = [];
    const list = getPartnerInfoFromHtml(res.data);
    result = result.concat(list);
    console.log(`已录入信息:`, result.map((item) => item.name).join("、"));
    return result;
  } catch (err) {
    return [];
  }
}

let urls: string[] = [];
let starConfig = [
  ["1313023", 50], // 何炅
  ["1312940", 20], // 雷佳音
];
starConfig.forEach(([id, size]) => {
  for (let i = 0; i < (size as number); i++) {
    urls.push(
      `https://movie.douban.com/celebrity/${id}/partners?start=${10 * i}&q=`
    );
  }
});

async function main() {
  let result: any[] = [];
  for (let url of urls) {
    let part = await getInfoFromUrl(url);
    result = result.concat(part);
  }
  await downloadPicture(result);
  fs.writeFileSync(jsonPath, JSON.stringify(result, undefined, 2));
  fs.writeFileSync(appJSONPath, JSON.stringify(result, undefined, 2));
  fs.copy(
    path.resolve(__dirname, "../snapshots/images"),
    path.resolve(__dirname, "../app/public/images")
  );
}

main();
