<template>
  <div id="app">
    <Swiper @change="handleChange" :data="imgList" v-model="imgActiveIndex">
      <template slot-scope="scope">
        <AILabel
          @delete="handleDelete"
          @confirm="handleConfirm"
          :ref="`aiLabel${scope.$index}`"
          :img="scope.row"
        >
        </AILabel>
      </template>
    </Swiper>

    <div class="tools">
      <button @click="handleOperationTools('handleSetRealImgSize')">
        <i class="iconfont icon-real-size"></i>
        实际尺寸
      </button>
      <button @click="handleOperationTools('handleSetFitScreen')">
        <i class="iconfont icon-fit-screen"></i>
        适应屏幕
      </button>
      <button
        id="drawRect"
        @click="handleOperationTools('handleSetMode', 'drawRect')"
      >
        <i class="iconfont icon-mark"></i>
        矩形标注
      </button>
      <button id="clearMask" @click="handleClear('clear')">
        <i class="iconfont icon-clear-all-mark"></i>
        清除缺陷
      </button>
      <!-- <button
        id="clearMask"
        type="info"
        @click="handleOperationTools('handleSetMode', 'pan')"
      >
        移动
      </button> -->
    </div>
  </div>
</template>

<script>
import AILabel from "./components/AILabel/AILabel";
import Swiper from "./components/Swiper/Swiper";

export default {
  name: "App",
  components: {
    AILabel,
    Swiper,
  },
  computed: {
    currentImg() {
      return this.$refs[`aiLabel${this.imgActiveIndex}`];
    },
  },
  data() {
    return {
      imgActiveIndex: 3,
      imgList: [
        {
          id: "img0",
          url: require("./assets/img/0.jpg"),
          thumbUrl: require("./assets/img/0.jpg"),
          width: 1080,
          height: 680,
          text: "img1",
          defectList: [
            {
              label: "山顶",
              type: "personal",
              position: {
                x: 420,
                y: 50,
                width: 40,
                height: 40,
              },
            },
            {
              label: "杆塔",
              type: "intelligent",
              position: {
                x: -90,
                y: -30,
                width: 80,
                height: 140,
              },
            },
          ],
        },
        {
          id: "img1",
          url: require("./assets/img/1.jpg"),
          thumbUrl: require("./assets/img/1.jpg"),
          width: 1920,
          height: 1080,
          text: "img1",
          defectList: [
            {
              label: "路飞",
              type: "personal",
              position: {
                x: -80,
                y: -220,
                width: 140,
                height: 400,
              },
            },
          ],
        },
        {
          id: "img2",
          url: require("./assets/img/2.jpg"),
          thumbUrl: require("./assets/img/2.jpg"),
          width: 1920,
          height: 1080,
          text: "img2",
          defectList: [
            {
              label: "太阳",
              type: "intelligent",
              position: {
                x: -120,
                y: -40,
                width: 220,
                height: 220,
              },
            },
          ],
        },
        {
          id: "img3",
          url: require("./assets/img/3.jpg"),
          thumbUrl: require("./assets/img/3.jpg"),
          width: 1900,
          height: 1220,
          text: "img2",
          defectList: [
            {
              label: "彩虹",
              position: {
                x: -360,
                y: -60,
                width: 460,
                height: 460,
              },
            },
            {
              label: "倒影",
              type: "intelligent",
              position: {
                x: -360,
                y: -410,
                width: 260,
                height: 260,
              },
            },
          ],
        },
        {
          id: "img4",
          url: require("./assets/img/4.jpg"),
          thumbUrl: require("./assets/img/4.jpg"),
          width: 400,
          height: 220,
          text: "img2",
          defectList: [
            {
              label: "大桥",
              type: "intelligent",
              position: {
                x: -140,
                y: -40,
                width: 100,
                height: 40,
              },
            },
          ],
        },
        {
          id: "img5",
          url: require("./assets/img/5.jpg"),
          thumbUrl: require("./assets/img/5.jpg"),
          width: 1900,
          height: 1220,
          text: "img2",
          defectList: [
            {
              label: "未知",
              position: {
                x: 100,
                y: 40,
                width: 400,
                height: 400,
              },
            },
          ],
        },
        {
          id: "img6",
          url: require("./assets/img/6.jpg"),
          thumbUrl: require("./assets/img/6.jpg"),
          width: 1900,
          height: 1220,
          text: "img2",
          defectList: [
            {
              label: "太阳",
              position: {
                x: -60,
                y: 0,
                width: 100,
                height: 100,
              },
            },
          ],
        },
        {
          id: "img7",
          url: require("./assets/img/7.jpg"),
          thumbUrl: require("./assets/img/7.jpg"),
          width: 1900,
          height: 1220,
          text: "img2",
          defectList: [
            {
              label: "the hand of noxus",
              position: {
                x: 20,
                y: -200,
                width: 400,
                height: 300,
              },
            },
          ],
        },
        {
          id: "img8",
          url: require("./assets/img/8.jpg"),
          thumbUrl: require("./assets/img/8.jpg"),
          width: 1900,
          height: 1220,
          text: "img2",
          defectList: [
            {
              label: "雪",
              position: {
                x: -160,
                y: 80,
                width: 100,
                height: 100,
              },
            },
          ],
        },
        {
          id: "img9",
          url: require("./assets/img/9.jpg"),
          thumbUrl: require("./assets/img/9.jpg"),
          width: 1900,
          height: 1220,
          text: "img2",
          defectList: [
            {
              label: "未知",
              position: {
                x: 100,
                y: 40,
                width: 400,
                height: 400,
              },
            },
          ],
        },
      ],
    };
  },
  mounted() {
    console.log(this.$refs);
  },
  methods: {
    handleChange() {
      this.currentImg.reset();
    },
    handleOperationTools(fn, param) {
      this.currentImg[fn](param);
    },
    handleConfirm(params) {
      this.$prompt("请输入", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        inputPattern: /\S/,
        inputErrorMessage: "不能为空",
      })
        .then(({ value }) => {
          params.callback.call(this.currentImg, value);
          console.log(params, value);
        })
        .catch(() => {
          this.currentImg.onCancel();
        });
    },
    handleDelete(rect) {
      console.log(rect);
    },
    handleClear() {
      console.log(
        this.currentImg.featureList.filter((f) => f.data.state == "drawDone")
      );

      this.$confirm("确认清除所有标注吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.currentImg.clear();
        })
        .catch(() => {
          console.log("cancel");
        });
    },
  },
};
</script>
<style >
html,
body {
  height: 100%;
}
* {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
<style lang="scss" scoped>
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background: #000;
}
.tools {
  position: absolute;
  bottom: 160px;
  z-index: 2;
  width: 100%;
  line-height: 40px;
  background: #0008;
  button {
    color: #ccc;
    user-select: none;
    background: #0000;
    border: none;
    padding: 2px 20px;
    margin: 0 20px;
    cursor: pointer;
    outline: none;
    border-radius: 2px;
    &:hover {
      color: #fff;
    }
  }
}
</style>
