<script setup lang="ts">
import { computed, ref } from "vue";
import { usePartnersStore } from "@/stores/partners";
let store = usePartnersStore();
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selected = reactive<Record<string, any>>({});
const showSearch = ref(false);

const searchValue = ref("");
let list = computed(() =>
  store.list.filter((item: any) => {
    if (searchValue.value && showSearch.value) {
      return item.name.indexOf(searchValue.value) > -1;
    } else {
      return true;
    }
  })
);

const toggleSelect = (item: any) => {
  if (selected[item.id]) {
    delete selected[item.id];
  } else {
    selected[item.id] = item;
  }
};

const handleRandomList = () => {
  store.randomList();
};

const selectedList = computed(() => Object.values(selected));

const confirmQuestions = () => {
  const ids = Object.keys(selected);
  router.push(`/question?ids=${ids.join("-")}`);
};

let errorUrls: string[] = [];
const handleError = (url: string) => {
  errorUrls.push(url);
  console.log("errorUrls", errorUrls);
};
</script>

<template>
  <div class="page-designs">
    <div class="partner-header">
      <span>题库已载入{{ list.length }}条数据</span>
    </div>
    <van-list class="partner-list">
      <van-cell
        v-for="item in list"
        :class="[`partner-item`, selected[item.id] ? 'active' : '']"
        @click="toggleSelect(item)"
        :key="item.id"
      >
        <div class="inner">
          <van-image
            width="40"
            height="60"
            :src="item.picture"
            lazy-load
            fit="cover"
            @error="() => handleError(item.pictureSource)"
          ></van-image>
          <!-- <img :src="item.picture" /> -->
          <div class="partner-info">
            <span class="name">{{ item.name }}</span>
            <span class="job" v-if="!item.job.startsWith('合作作品')">{{
              item.job
            }}</span>
          </div>
          <div class="selected-icon"><van-icon name="checked" /></div>
        </div>
      </van-cell>
    </van-list>
    <div class="partner-search-input" v-if="showSearch">
      <input v-model="searchValue" placeholder="输入关键词搜索" />
    </div>
    <div class="partner-footer">
      <div class="footer-sm-btn" @click="handleRandomList">
        <van-icon name="replay" />
        <span>乱序</span>
      </div>
      <div class="footer-sm-btn" @click="showSearch = !showSearch">
        <van-icon name="search" />
        <span>搜索</span>
      </div>
      <van-button
        round
        type="primary"
        :disabled="selectedList.length === 0"
        @click="confirmQuestions"
        >确认出题{{
          selectedList.length ? `（${selectedList.length}）` : ""
        }}</van-button
      >
    </div>
  </div>
</template>

<style lang="less">
.page-designs {
  height: 100vh;
  height: -webkit-fill-available;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
}
.partner-header {
  flex-shrink: 0;
  height: 24px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
}
.partner-list {
  // height: calc(100vh - 73px - 24px);
  flex: 1;
  overflow-y: scroll;
}
.partner-item {
  cursor: pointer;
  user-select: none;
  &.active {
    background-color: var(--van-slider-inactive-background);
    .selected-icon {
      opacity: 1;
    }
  }
  .van-cell__value {
    color: #333;
    justify-content: flex-start;
    text-align: left;
    align-items: stretch;
  }
  .inner {
    display: flex;
  }
  .partner-info {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;

    .job {
      color: #666;
    }
  }
}
.partner-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 12px;
  flex-shrink: 0;
  box-sizing: border-box;
  .van-button {
    flex: 1;
  }
  .footer-sm-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 16px;
    .van-icon {
      font-size: 20px;
      margin-bottom: 2px;
    }
    span {
      font-size: 12px;
    }
  }
}
.selected-icon {
  opacity: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  color: var(--van-blue);
}
.partner-search-input {
  width: 100%;
  bottom: 73px;
  left: 0;
  z-index: 10px;
  height: 56px;
  position: absolute;
  background-color: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border-top: solid 1px #eee;
  input {
    background-color: #f2f2f2;
    height: 42px;
    font-size: 16px;
    text-align: center;
    border: none;
    border-radius: 4px;
    width: 100%;
  }
}
</style>
