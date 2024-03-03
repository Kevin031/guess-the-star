import Koa from "koa";
import fs from "fs";
import path from "path";
import Router from "koa-router";

const app = new Koa();
const router = new Router();

router.get("/api/partners", async (ctx: any) => {
  const dataStr = fs.readFileSync(
    path.resolve(__dirname, "../snapshots/partners.json"),
    "utf8"
  );
  const data = JSON.parse(dataStr);
  ctx.body = {
    code: 0,
    msg: "success",
    data,
  };
});

app.use(router.routes());

app.listen(3000, () => {
  console.log("server is running at port: 3000");
});
