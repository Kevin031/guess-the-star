import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export type PartnerModel = {
  id: number;
  name: string;
  picture: string;
  pictureSource: string;
  job: string;
  pictureFileName?: string;
  status?: string;
  input?: string;
};

export const usePartnersStore = defineStore("partnersStore", () => {
  const list = ref<PartnerModel[]>([]);
  const dict = ref<Record<number, PartnerModel>>({});
  const resultList = ref<PartnerModel[]>([]);

  axios.get("/partners.json").then((res) => {
    list.value = res.data.map((item: PartnerModel) => {
      item.pictureSource = item.picture;
      // item.picture = "/images/" + item.pictureFileName;
      item.picture =
        "https://peanut-1256322637.cos.ap-guangzhou.myqcloud.com/stars%2Fimages%2F" +
        item.pictureFileName;
      dict.value[item.id] = item;
      return item;
    });
    randomList();
  });

  const setResultList = (data: any[]) => {
    resultList.value = data;
  };

  const getRandomQuestions = (length: number) => {
    let numbers: number[] = [];
    while (numbers.length < length) {
      let randomNumber = Math.floor(Math.random() * list.value.length) + 1; // 生成 1 到 size 之间的随机整数
      if (!numbers.includes(randomNumber) && randomNumber > 0) {
        numbers.push((list.value[randomNumber] as any).id);
      }
    }
    return numbers;
  };

  const randomList = () => {
    // 打乱list 的顺序
    let randomList = list.value;
    randomList.sort(() => Math.random() - 0.5);
  };

  return {
    list,
    dict,
    resultList,
    randomList,
    setResultList,
    getRandomQuestions,
  };
});
