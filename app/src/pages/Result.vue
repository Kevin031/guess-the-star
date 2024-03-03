<template>
  <div class="result-page">
    <div class="point">
      <span :class="{ num: true, full: result.point === 100 }">
        <van-rolling-text
          :start-num="0"
          :target-num="result.point"
        ></van-rolling-text>
      </span>
      <span class="text">分</span>
    </div>
    <div class="result-text">
      <p class="title">{{ result.title }}</p>
      <p class="description">{{ result.description }}</p>
    </div>
    <div class="button-group">
      <van-button class="button" round type="primary" @click="toQuestions"
        >再来一题</van-button
      >
      <van-button class="button" round @click="toDesigns">我来出题</van-button>
    </div>
    <!-- <a class="author-link" href="https://github.com/Kevin031" target="_blank"
      >关于作者</a
    > -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { usePartnersStore } from "@/stores/partners";
import { useRouter } from "vue-router";

const store = usePartnersStore();
const router = useRouter();

const list = computed(() => store.resultList);

const result = computed(() => {
  let rightNum = 0;
  list.value.forEach((item: any) => {
    if (item.right) {
      if (item.tips) {
        rightNum += 0.7;
      } else {
        rightNum += 1;
      }
    }
  });
  let point = Math.floor((rightNum / list.value.length) * 100) || 0;
  let evaluate: any = {};
  if (point >= 0 && point < 20) {
    evaluate.title = "娱乐白痴";
    evaluate.description =
      "这位朋友估计是住在了地球的后山，对娱乐圈的了解程度就跟鱼了解陆地一样，零零碎碎，估计连一些常见的名人都认不出来，听说这位仁兄的梦想是去火星避世呢。";
  } else if (point >= 20 && point < 60) {
    evaluate.title = "娱乐小白";
    evaluate.description =
      "这位朋友可能有时会看到一些娱乐新闻的标题，但真正了解的程度还不到家，可能只能听懂几个明星的名字，能勉强辨认出一两个热门电影或歌曲，说起八卦来也是稀里糊涂，得加把劲才能追上娱乐圈的大部队。";
  } else if (point >= 60 && point < 80) {
    evaluate.title = "娱乐达人";
    evaluate.description =
      "这位朋友对娱乐圈还算是有所了解了，可能会关注一些热门电影、电视剧或音乐，对于流行文化也有所耳闻，能够参与到一般的八卦话题中，不过要想当个达人还得再多研究研究，免得被别人当成“土鳖”。";
  } else if (point >= 80 && point < 99) {
    evaluate.title = "娱乐高手";
    evaluate.description =
      "这位朋友对娱乐圈可是相当有研究了，不但能轻松辨认出各路明星，还了解不少幕后的花絮，对于电影、音乐的评价也颇具见解，参与各类娱乐话题时也能游刃有余，是身边的娱乐顾问。";
  } else {
    evaluate.title = "娱乐王者";
    evaluate.description =
      "这位朋友简直就是娱乐圈的百科全书啊！不仅对各类明星、电影、音乐了如指掌，还能把整个娱乐圈的发展趋势给你分析个清清楚楚。参与任何娱乐话题都能给出高水平的见解，身边的人都觉得他（她）就是走在潮流前沿的风向标。";
  }
  return {
    point,
    ...evaluate,
  };
});

const toQuestions = () => {
  router.replace({
    path: "/question",
    query: {
      ids: store.getRandomQuestions(10).join("-"),
    },
  });
};

const toDesigns = () => {
  router.replace({
    path: "/designs",
  });
};

console.log("list", list);
</script>

<style lang="less">
.result-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .point {
    .num {
      width: 80px;
      font-size: 40px;
      margin-right: 6px;
      --van-rolling-text-color: var(--van-red);
      &.full {
        --van-rolling-text-color: var(--van-green);
      }
      --van-rolling-text-font-size: 40px;
      --van-rolling-text-item-width: 30px;
    }
  }
  .button-group {
    display: flex;
    margin-top: 36px;
  }
  .button {
    margin: 0 6px;
  }
  .result-text {
    padding: 24px;
    text-align: center;
    .title {
      font-size: 24px;
      margin-bottom: 12px;
    }
    .description {
      text-align: left;
      font-size: 14px;
    }
  }
  .author-link {
    margin-top: 108px;
    color: #999;
  }
}
</style>
