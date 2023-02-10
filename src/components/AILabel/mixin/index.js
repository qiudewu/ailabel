import AILabel from "ailabel";
import layerApi from "./layerApi";
import { modeStyle } from "../config";
export default {
  mixins: [layerApi],
  data() {
    return {
      Mode: "pan",
      timestamp: 0,
      isDrawing: false,
      zoomRate: 1,

      confirmMarker: null,
      cancelMarker: null,
      // 当前矩形框四个点
      rectBounds: [],

      // 当前选框
      currentFeature: null
    };
  },
  computed: {
    featureList() {
      return this.gFeatureLayer && this.gFeatureLayer.getAllFeatures();
    },
    textList() {
      return this.gTextLayer && this.gTextLayer.getAllTexts();
    }
  },
  methods: {
    // =========================
    //          删除
    // =========================
    // del-所有标记
    clear() {
      this.gFeatureLayer.removeAllFeatures();
      this.gTextLayer.removeAllTexts();
      this.removeAllMarker();
    },
    handleDelete(rect) {
      rect && this.removeFeatureById(rect.id);
      this.removeAllMarker();
    },
    // del-指定标记
    removeFeatureById(id) {
      let timestamp = id.split("-")[1];
      this.gFeatureLayer.removeFeatureById(id);
      this.removeTextById(timestamp);
    },
    removeTextById(timestamp) {
      let textId;
      let textMarker = this.textList.find(
        (t) => t.id.split("-")[1] == timestamp
      );
      if (textMarker) {
        textId = this.textList.find((t) => t.id.split("-")[1] == timestamp).id;
        this.gTextLayer.removeTextById(textId);
      }
    },
    // del-Marker
    removeAllMarker() {
      this.gMap.mLayer.removeAllMarkers();
      this.isDrawing = false;
    },
    // =========================
    //          添加图层
    // =========================
    setStyle(style) {
      return new AILabel.Style(style);
    },
    addButtonMarker(points) {
      this.isDrawing = true;
      this.confirmMarker = new AILabel.Marker(
        `marker-confirm-${this.timestamp}`,
        {
          src: require("../assets/img/confirm.png"),
          x: points[2].x,
          y: points[2].y,
          offset: {
            x: -150,
            y: 10
          },
          featureId: 1
        }
      );
      this.cancelMarker = new AILabel.Marker(
        `marker-cancel-${this.timestamp}`,
        {
          src: require("../assets/img/cancel.png"),
          x: points[2].x,
          y: points[2].y,
          offset: {
            x: -70,
            y: 10
          },
          featureId: 1
        }
      );
      this.gMap.mLayer.addMarker(this.confirmMarker);
      this.gMap.mLayer.addMarker(this.cancelMarker);

      this.confirmMarker.regEvent("click", () => {
        this.onConfirm();
      });
      this.cancelMarker.regEvent("click", () => {
        this.onCancel();
      });
    },
    reset() {
      let time = setTimeout(() => {
        // 归位
        this.handleSetFitScreen();
        if (this.isDrawing) {
          // 清楚
          this.removeFeatureById(`feature-${this.timestamp}`);
          this.removeAllMarker();
        }
        clearTimeout(time);
      }, 300);
    },
    // =========================
    //            事件
    // =========================

    // 判断画线是否超出图片
    isOverImg(currentPoint) {
      let isOver = currentPoint.some((p) => {
        return (
          Math.abs(p.x) > this.img.width / 2 ||
          Math.abs(p.y) > this.img.height / 2
        );
      });
      if (isOver) {
        this.$message.warning("标注不允许超出图片外");
      }
      return isOver;
    },
    // draw
    handleDrawDone() {
      this.gMap.events.on("geometryDrawDone", (type, points) => {
        if (!this.isDrawing && !this.isOverImg(points)) {
          this.timestamp = new Date().getTime();
          this.addRect(points);
          this.addButtonMarker(this.rectBounds, this.timestamp);
          this.handleSetMode("pan");
        }
      });
    },
    // edit
    handleEditDone() {
      this.gMap.events.on("geometryEditDone", (type, activeFeature, points) => {
        activeFeature.update({ points });
        activeFeature.show();
        this.rectBounds = activeFeature.getBounds();
        this.updateDraw(this.rectBounds);
      });
    },
    updateDraw(points) {
      this.confirmMarker &&
        this.confirmMarker.update({ x: points[2].x, y: points[2].y });
      this.cancelMarker &&
        this.cancelMarker.update({ x: points[2].x, y: points[2].y });
    },
    // setMode
    handleSetMode(mode) {
      if (mode == "drawRect" && this.isDrawing) return;
      this.gMap.setMode(mode, this.setStyle(modeStyle.drawRect["personal"])); // 设置当前模式（模式名，样式）
    },
    // fitScreen
    handleSetFitScreen() {
      this.gMap.centerAndZoom({ x: 0, y: 0 }, this.img.width * this.zoomRate);
    },
    // real
    handleSetRealImgSize() {
      this.gMap.centerAndZoom(
        { x: 0, y: 0 },
        document.querySelector(`#${this.img.id}`).clientWidth
      );
    },
    // hover
    handleHoverFeature() {
      this.gMap.events.on("featureHover", (feature) => {
        if (this.currentFeature !== feature && !this.isDrawing) {
          this.currentFeature = feature;
        }
      });
    },
    // 确定回调 confirm
    onConfirm() {
      function confirm(txt) {
        this.handleSetMode("pan");
        this.addText(
          {
            x: this.rectBounds[3].x,
            y: this.rectBounds[3].y
          },
          `${txt || ""}`
        );
        this.removeAllMarker();
        this.isDrawing = false;
        this.currentDrawingRect.update({
          data: {
            state: "drawDone"
          }
        });
      }
      this.$emit("confirm", {
        callback: confirm,
        rect: this.currentDrawingRect,
        img: this.img
      });
    },
    // 取消
    onCancel() {
      if (this.isDrawing) {
        this.removeFeatureById(`feature-${this.timestamp}`);
        this.removeAllMarker();
        // this.handleSetMode('drawRect')
        this.handleSetMode("pan");
        this.isDrawing = false;
      }
    }
  }
};
