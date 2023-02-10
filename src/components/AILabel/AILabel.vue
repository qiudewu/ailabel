<template>
  <div class="wrapper">
    <div
      @contextmenu="handleOpenMenu($event)"
      :id="img.id"
      class="ai-label"
    ></div>

    <contextMenu :position="menuPosition" :visible.sync="isExpandMenu">
      <div @click="handleDel" class="context-menu-item">删除</div>
    </contextMenu>
  </div>
</template>

<script>
import contextMenu from "./components/contextMenu";
import AILabelApi from "./mixin";
import _ from "lodash";
export default {
  name: "MyAILabel",
  mixins: [AILabelApi],
  components: { contextMenu },
  props: {
    // 图片
    img: {
      type: Object,
      default: () => {
        return {
          url: "", //图片路径，
          width: 0,
          height: 0,
        };
      },
    },
  },
  data() {
    return {
      menuPosition: {
        left: 0,
        top: 0,
      },
      isExpandMenu: false,
      delRect: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initGMap();
      this.addLayerFeature();
      this.addLayerText();
      this.addLayerImage();
    });
  },
  methods: {
    handleOpenMenu(e) {
      if (this.currentFeature) {
        this.isExpandMenu = true;
        this.delRect = _.cloneDeep(this.currentFeature);
        this.menuPosition = {
          left: e.offsetX + 4 + "px",
          top: e.offsetY + 4 + "px",
        };
      } else {
        this.onCancel();
        // 在选区外右击，关闭展开菜单
        this.isExpandMenu = false;
      }
      this.handleSetMode("pan");
    },
    handleDel() {
      this.handleDelete(this.delRect);
      this.isExpandMenu = false;
      this.$emit("delete", this.delRect);
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100%;
}
.ai-label {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
}
button {
  user-select: none;
  background: #0000;
  border: 1px solid #ccc;
  padding: 2px 20px;
  margin: 20px;
  cursor: pointer;
  outline: none;
  border-radius: 2px;
  &:hover {
    background: #0003;
  }
}
</style>