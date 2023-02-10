<template>
  <div
    :style="position"
    v-click-outside="handleCloseMenu"
    class="context-menu"
    v-show="visible"
  >
    <slot></slot>
  </div>
</template>

<script>
// 右击菜单
import ClickOutside from "vue-click-outside";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Object,
      default: () => {
        return {
          left: 0,
          top: 0,
        };
      },
    },
  },
  directives: {
    ClickOutside,
  },
  computed: {},
  methods: {
    handleCloseMenu() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped lang="scss">
.context-menu {
  background-color: #0008;
  position: fixed;
  z-index: 99;
  .context-menu-item {
    padding: 4px 20px;
    cursor: pointer;
    &:hover {
      color: rgb(255, 0, 0);
    }
  }
}
</style>
