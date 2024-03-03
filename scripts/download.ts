import https from "https";
import path from "path";
import fs from "fs";
import download from "download";

function downloadImage(imageUrl: string, cb: Function) {
  // 从URL中提取文件名
  const filename = path.basename(imageUrl);

  // 本地文件路径
  const localFilePath = path.join(__dirname, "../snapshots/images-new");

  return new Promise((resolve, reject) => {
    cb();

    return download(imageUrl, localFilePath).then(() => {
      resolve(true);
    });
    // 发送HTTPS请求获取图片数据
    // if (
    //   fs.existsSync(
    //     path.resolve(__dirname, "../snapshots/images-new/" + filename)
    //   )
    // ) {
    //   // 文件已存在
    //   return resolve(true);
    // }
    https
      .get(imageUrl, (response) => {
        // 创建一个可写流
        const fileStream = fs.createWriteStream(localFilePath);

        // 将响应数据管道到本地文件流中
        response.pipe(fileStream);

        // 当所有数据写入完成时
        fileStream.on("finish", () => {
          console.log("下载完成");
          fileStream.close();
          resolve(true);
        });
      })
      .on("error", (err) => {
        console.error("下载图片时出错:", err.message);
        reject(err);
      });
  });
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

function downloadPicture(list: any[]) {
  return promisePoll(
    list.map((url, i) => {
      return () =>
        downloadImage(url, () => {
          console.log(`正在下载第 ${Number(i) + 1}/${list.length} 张图片`);
        });
    }),
    10
  );
}

const urls = [
  "https://img2.doubanio.com/view/personage/m/public/6b166eb32e1525abbd8d45bc891f9661.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/pyXmd6j00Ba0cel_avatar_uploaded1619768932.51.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/prTYkFRVcFIcel_avatar_uploaded1430556522.51.jpg",
  "https://img2.doubanio.com/view/personage/m/public/7786e7a4b49e9daa83fc031eb82c53fe.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1566735551.71.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p59051.jpg",
  "https://img2.doubanio.com/view/personage/m/public/4c544d82a53d5eb2939de7daf5480b1e.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1356114710.31.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1513504182.91.jpg",
  "https://img2.doubanio.com/view/personage/m/public/9fbf6cce5343f47721e6e4d9bc62f08e.jpg",
  "https://img2.doubanio.com/view/personage/m/public/8cdb24b31c450227dafe8c8f9eb4c061.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p40191.jpg",
  "https://img2.doubanio.com/view/personage/m/public/92c2c18acf3eafdaad9db560d81821fe.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1613792134.11.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p49991.jpg",
  "https://img2.doubanio.com/img/musician/medium/9781.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1494994943.1.jpg",
  "https://img2.doubanio.com/view/personage/m/public/e7d1dd21f6a8c66d74ad71b8c84af071.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1620820118.41.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1508145845.01.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1466577908.51.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1575093918.51.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1389402133.21.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p39011.jpg",
  "https://img2.doubanio.com/view/personage/m/public/015f7724aa022c137163b0f77fb3929e.jpg",
  "https://img2.doubanio.com/view/personage/m/public/1f95685057fcb0c5423bd8fe86923101.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1444306911.1.jpg",
  "https://img2.doubanio.com/view/personage/m/public/9ae882844a0d77848ef7367f72e0fde1.jpg",
  "https://img2.doubanio.com/view/personage/m/public/927e5d00ceae6e84c5fa5312c506f28e.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1416371499.71.jpg",
  "https://img2.doubanio.com/view/personage/m/public/10ae75970ef37ed6944a5468259a6a01.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1443582361.31.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1501888294.11.jpg",
  "https://img2.doubanio.com/view/personage/m/public/747351f1c1ed466b2b223c3e4472b5e1.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1362377889.41.jpg",
  "https://img2.doubanio.com/view/personage/m/public/fd992fba207b7822e9090e5d6d93e88e.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1550473014.71.jpg",
  "https://img2.doubanio.com/view/personage/m/public/5112f1870b9f6954a2718d755bdd35fe.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1691.jpg",
  "https://img2.doubanio.com/view/personage/m/public/4c4953e3be5210a875dfd74d013d851e.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1519976356.71.jpg",
  "https://img2.doubanio.com/view/personage/m/public/dae5b89670aedfe2db718e382a67b721.jpg",
  "https://img2.doubanio.com/view/celebrity/m/public/p1487343499.51.jpg",
  "https://img2.doubanio.com/view/personage/m/public/ce5ed155278147c095f68c5fafb587b1.jpg",
];

downloadPicture(urls);
