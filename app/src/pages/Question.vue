<template>
  <div class="question-page">
    <h1 class="title">TA是谁？</h1>
    <div class="question-card" v-if="current">
      <div class="question-tips">
        <div
          v-for="(item, index) in questionList"
          :class="{
            'question-tips-item': true,
            active: index === currentIndex,
            right: questionList[index].right === true,
            wrong: questionList[index].right === false,
          }"
        >
          <span>{{ index + 1 }}</span>
        </div>
      </div>
      <van-image
        width="200px"
        height="300px"
        :src="current.picture"
        fit="cover"
      ></van-image>
      <div class="answer-title">
        输入你的答案
        <a @click="handleTip">提示</a>
        <span v-if="current.tips">：{{ current.tips }}</span>
        <span v-else>?</span>
      </div>
      <div class="answer">
        <input
          class="input"
          v-model="current.input"
          @keyup.enter="handleEnter"
        />
        <van-button
          type="primary"
          round
          :disabled="!current.input"
          @click="confirmCurrent"
        >
          <van-icon name="success" />
        </van-button>
      </div>
      <a class="jump" @click="handleJump">跳过</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { usePartnersStore } from "@/stores/partners";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";

const route = useRoute();
const router = useRouter();

const store = usePartnersStore();

const ready = ref(false);
const questionList = ref<any>([]);

const currentIndex = ref(0);

const current = computed(() => {
  return questionList.value[currentIndex.value];
});

let isFirstTip = true;
const handleTip = () => {
  if (isFirstTip) {
    showToast("注意：提示会扣除 30% 本题分数");
    isFirstTip = false;
  }
  current.value.tips = current.value.name[0];
};

const confirmCurrent = () => {
  if (current.value.input === current.value.name) {
    current.value.right = true;
  } else {
    current.value.right = false;
  }
  if (currentIndex.value === questionList.value.length - 1) {
    store.setResultList(questionList.value);
    router.replace({
      path: "/result",
    });
  } else {
    currentIndex.value++;
  }
};

const handleEnter = () => {
  if (current.value.input) {
    confirmCurrent();
  }
};

const handleJump = () => {
  confirmCurrent();
};

const initQuestionList = () => {
  console.log("route", route.query.ids);
  const ids = (route.query.ids as string).split("-").map((id) => Number(id));
  const list = ids.map((id) => store.dict[id]);
  questionList.value = list.map((item) => {
    item.input = "";
    item.status = "pending";
    return {
      ...item,
    };
  });
};

watch(
  () => store.list,
  () => {
    if (store.list.length > 0) {
      ready.value = true;
    }
  }
);

watch(
  () => ready.value,
  () => {
    if (ready.value === true) {
      initQuestionList();
    }
  }
);

if (store.list.length > 0) {
  ready.value = true;
}
</script>

<style lang="less">
.question-page {
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  flex-direction: column;
  padding: 24px;
  .title {
    margin-bottom: 12px;
    color: var(--van-red);
  }
}
.question-card {
  padding: 24px;
  background-color: #fff;
  width: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  .question-tips {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    justify-content: center;
    .question-tips-item {
      width: 20px;
      height: 20px;
      font-size: 12px;
      background-color: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-right: 4px;
      margin-bottom: 4px;
      &.active {
        background-color: var(--van-blue);
        color: #fff;
      }
      &.wrong {
        background-color: rgb(255, 225, 225);
        color: var(--van-red);
      }
      &.right {
        background-color: rgba(7, 193, 96, 0.23);
        color: var(--van-green);
      }
    }
  }
  .answer-title {
    margin-top: 12px;
  }
  .answer {
    margin-top: 12px;
    display: flex;
    align-items: stretch;
    position: relative;
  }
  .jump {
    font-size: 12px;
    margin-top: 24px;
    color: var(--van-text-color-2);
  }
  input {
    background-color: #f2f2f2;
    height: 42px;
    flex: 1;
    padding: 0 12px;
    border-color: transparent;
    text-align: center;
    margin-right: 12px;
    width: 200px;
  }
  .van-button {
    font-size: 16px;
    width: 42px;
    height: 42px;
    position: absolute;
    right: -42px;
  }
}
</style>
