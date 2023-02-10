<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <div class="swiper" style="flex: 1">
      <el-carousel
        height="100%"
        ref="carousel"
        :autoplay="false"
        :loop="false"
        arrow="never"
        indicator-position="none"
        :initial-index="currentPicIndex"
        @change="handleChangePicIndex"
      >
        <el-carousel-item v-for="(img, index) in data" :key="img.id">
          <!-- <img :src="img.id" alt="" /> -->
          <slot :row="img" :$index="index"></slot>
        </el-carousel-item>
      </el-carousel>
      <!-- 上一张 -->
      <div v-show="currentPicIndex !== 0" class="pre top" @click="handlePreTop">
        <i class="iconfont icon-left"></i>
      </div>
      <!-- 下一张 -->
      <div
        v-show="currentPicIndex !== data.length - 1"
        class="next top"
        @click="handleNextTop"
      >
        <i class="iconfont icon-right"></i>
      </div>
    </div>

    <div class="swiper-thumbs-wrap">
      <div class="swiper-thumbs-scroll">
        <ul class="swiper-thumbs">
          <li
            @click="handleSelectThumb(idx)"
            class="swiper-thumbs-item"
            :class="{ 'is-acitve': currentPicIndex == idx }"
            :style="{
              borderWidth: `${thumbBorderSize}px`,
            }"
            :ref="`thumbImg${idx}`"
            v-for="(img, idx) in data"
            :key="img.id"
          >
            <img class="thumb-img" :src="img.thumbUrl" alt="" />
          </li>
        </ul>
      </div>
      <!-- 上一张 -->
      <div
        v-show="currentPicIndex !== 0"
        class="pre bottom"
        @click="handlePreBottom"
      >
        <i class="iconfont icon-left"></i>
      </div>
      <!-- 下一张 -->
      <div
        v-show="currentPicIndex !== data.length - 1"
        class="next bottom"
        @click="handleNextBottom"
      >
        <i class="iconfont icon-right"></i>
      </div>
    </div>
  </div>
</template>
<script>
import scrollAnimation from "./mixin";
export default {
  name: "MySwiper",
  mixins: [scrollAnimation],
  model: {
    prop: "currentPicIndex",
    event: "update",
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    currentPicIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      thumbBorderSize: 5,
    };
  },
  watch: {
    currentPicIndex: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          let dom = document.querySelector(".swiper-thumbs-scroll");
          let activeDom = this.$refs[`thumbImg${val}`][0];
          let activeLeft = activeDom.offsetLeft;
          this.scrollAnimation(
            dom,
            activeLeft -
              (dom.clientWidth - activeDom.clientWidth) / 2 +
              2 * this.thumbBorderSize
          );
        });
      },
    },
  },
  methods: {
    handlePreTop() {
      this.$refs.carousel.prev();
      this.$emit("change");
    },
    handleNextTop() {
      this.$refs.carousel.next();
      this.$emit("change");
    },
    handleChangePicIndex(idx) {
      this.$emit("update", idx);
    },
    handleSelectThumb(idx) {
      if (this.currentPicIndex !== idx) {
        this.$refs.carousel.setActiveItem(idx);
        this.$emit("change");
      }
    },
    handlePreBottom() {
      this.handleScroll("left");
    },
    handleNextBottom() {
      this.handleScroll("right");
    },
  },
};
</script>
<style lang="scss" scoped>
.swiper {
  position: relative;
}
.pre,
.next {
  &.top {
    width: 80px;
    top: 0;
  }
  &.bottom {
    width: 44px;
    bottom: 0;
  }
  height: 100%;
  position: absolute;
  color: #fff;
  z-index: 2;
  cursor: pointer;
  transition: background-color 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #666c;
  }
  .icon {
    font-size: 40px;
    font-weight: bold;
  }
}
.pre {
  left: 0;
}
.next {
  right: 0;
}
.el-carousel {
  height: 100%;
}
.swiper-thumbs-wrap {
  position: relative;
  .swiper-thumbs-scroll {
    width: 100%;
    overflow: hidden;
    height: 140px;
    padding: 10px 0;
    .swiper-thumbs {
      white-space: nowrap;
      .swiper-thumbs-item {
        margin: 0 20px;
        display: inline-block;
        cursor: pointer;
        width: 200px;
        height: 120px;
        box-sizing: border-box;
        border-color: #0000;
        border-style: solid;
        transition: border 200ms;
        &:first-child {
          margin-left: 50px;
        }
        &:last-child {
          margin-right: 50px;
        }
        &:hover {
          border-color: #fff8;
        }
        &.is-acitve {
          border-color: #fff;
        }
        .thumb-img {
          -webkit-user-drag: none;
          object-fit: contain;
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>