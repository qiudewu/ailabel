// 模拟贝塞尔曲线
const cubic = (value) => Math.pow(value, 3);
const easeInOutCubic = (value) =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

export default {
  data() {
    return {
      scrollLeft: 0,
      time: 400,
      lastTime: 0
    };
  },
  computed: {},
  methods: {
    // 动画部分
    decideScroll() {
      if (!document.querySelector(".active")) return;
      this.$nextTick(() => {
        let tagLeft = document.querySelector(".active").offsetLeft;
        let tagWidth = document.querySelector(".active").offsetWidth;
        let width = this.$refs.tagBox.offsetWidth;
        let left = this.$refs.tagBox.scrollLeft;
        if (tagLeft < left) {
          this.scrollLeft = tagLeft;
        } else if (tagLeft + tagWidth > left + width) {
          this.scrollLeft = tagLeft + tagWidth - width;
        } else {
          return false;
        }

        this.scrollAnimation(
          document.querySelector(".swiper-thumbs-scroll"),
          this.scrollLeft,
          this.time
        );
      });
    },
    handleScroll(direction) {
      // 防抖处理
      let newTime = new Date().getTime();
      if (newTime - this.lastTime > this.time) {
        let scrollWidth = document.querySelector(".swiper-thumbs-scroll")
          .scrollWidth;
        let width = document.querySelector(".swiper-thumbs-scroll").offsetWidth;
        let left = (this.scrollLeft = document.querySelector(
          ".swiper-thumbs-scroll"
        ).scrollLeft);
        if (direction == "left") {
          if (0 < left) {
            this.scrollLeft -= width;
            if (this.scrollLeft < 0) this.scrollLeft = 0;
          }
        } else if (direction == "right") {
          if (left + width < scrollWidth) {
            this.scrollLeft += width;
            if (this.scrollLeft > scrollWidth - width)
              this.scrollLeft = scrollWidth - width;
          }
        }

        this.scrollAnimation(
          document.querySelector(".swiper-thumbs-scroll"),
          this.scrollLeft,
          this.time
        );
        this.lastTime = newTime;
      }
    },
    scrollAnimation(dom, directionVal, time = 400) {
      const beginTime = Date.now();
      const beginValue = dom.scrollLeft;
      // this.scrollLeft = beginValue
      const rAF =
        window.requestAnimationFrame || ((func) => setTimeout(func, 16));
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / time;
        if (progress < 1) {
          if (dom.scrollLeft < directionVal) {
            dom.scrollLeft =
              beginValue +
              (directionVal - beginValue) * easeInOutCubic(progress);
          } else {
            dom.scrollLeft =
              beginValue -
              (beginValue - directionVal) * easeInOutCubic(progress);
          }
          rAF(frameFunc);
        } else {
          dom.scrollLeft = directionVal;
        }
      };
      rAF(frameFunc);
    }
  }
};
