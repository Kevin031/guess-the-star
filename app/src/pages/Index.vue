<template>
  <div class="home-page">
    <h1>一起认明星</h1>
    <div class="links">
      <a @click="toQuestions">随机 10 题</a>
      <router-link to="/designs">我来出题</router-link>
    </div>
    <a class="author-link" href="https://github.com/Kevin031" target="_blank"
      >关于作者</a
    >
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { usePartnersStore } from "@/stores/partners";

const store = usePartnersStore();

const router = useRouter();

const toQuestions = () => {
  router.replace({
    path: "/question",
    query: {
      ids: store.getRandomQuestions(10).join("-"),
    },
  });
};
</script>

<style lang="less">
.home-page {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    margin-bottom: 42px;
  }
  .links {
    display: flex;
    flex-direction: column;
    align-items: center;
    a {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }
  .author-link {
    margin-top: 108px;
    color: #999;
  }
}
</style>
