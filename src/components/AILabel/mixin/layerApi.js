// 图层
import AILabel from "ailabel";
import { modeStyle } from "../config";
export default {
  data() {
    return {
      // 基础图层
      gMap: "",
      // 按钮
      gBtnLayer: "",
      // 图像层
      gImageLayer: "",
      // 文字层
      gTextLayer: "",
      // 标注图层
      gMaskLayer: "",
      // 矢量数据层
      gFeatureLayer: "",

      currentDrawingRect: null
    };
  },
  methods: {
    // ==================================================
    //                          基础图层
    // ==================================================
    // init
    initGMap() {
      let container = document.querySelector(`#${this.img.id}`);
      let cWidth = container.clientWidth;
      let cHeight = container.clientHeight;
      let cRate = cHeight / cWidth;
      let imgRate = this.img.height / this.img.width;
      if (imgRate > cRate) {
        this.zoomRate = (cWidth * imgRate) / cHeight;
      }
      this.gMap = new AILabel.Map(this.img.id, {
        zoom: this.img.width * this.zoomRate,
        cx: 0,
        cy: 0,
        zoomMax: cWidth * 10,
        zoomMin: cWidth / 10,
        autoPan: false,
        drawZoom: true,
        autoFeatureSelect: false
      });
      this.gMap.tipLayer.hideTips();
      // 事件注册 ======================
      this.handleDrawDone();
      this.handleEditDone();
      this.handleHoverFeature();
    },
    // 文字层
    addLayerText() {
      this.gTextLayer = new AILabel.Layer.Text("textLayer");
      this.gMap.addLayer(this.gTextLayer);
    },
    // 图像层 Image
    addLayerImage() {
      this.gImageLayer = new AILabel.Layer.Image(
        "img",
        this.img.url + "?" + new Date().getTime(),
        {
          w: this.img.width,
          h: this.img.height
        },
        { zIndex: 1 }
      );
      this.gMap.addLayer(this.gImageLayer);

      // 标注回显
      this.img.defectList.forEach((d) => {
        this.timestamp = new Date().getTime();
        this.addRect(
          [
            { x: d.position.x, y: d.position.y },
            { x: d.position.x + d.position.width, y: d.position.y },
            {
              x: d.position.x + d.position.width,
              y: d.position.y + d.position.height
            },
            { x: d.position.x, y: d.position.y + d.position.height }
          ],
          d.type,
          "drawDone"
        );
        this.addText(
          {
            x: d.position.x,
            y: d.position.y
          },
          d.label
        );
      });
    },
    // 涂抹层 Mask
    addLayerMask() {
      this.gMaskLayer = new AILabel.Layer.Mask("maskLayer", {
        zIndex: 2,
        opacity: 1
      });
      this.gMap.addLayer(this.gMaskLayer);
    },
    // 矢量数据层 Feature
    addLayerFeature() {
      this.gFeatureLayer = new AILabel.Layer.Feature("featureLayer", {
        zIndex: 2,
        opacity: 1
      });
      this.gMap.addLayer(this.gFeatureLayer);
    },
    // ==================================================
    //                          添加元素
    // ==================================================
    // state 绘画状态    drawing 未绘画完，drawDone 画完
    addRect(points, type = "personal", state = "drawing") {
      this.currentDrawingRect = new AILabel.Feature.Rect(
        `feature-${this.timestamp}`,
        points,
        { state },
        this.setStyle(modeStyle.drawRect[type])
      );
      this.rectBounds = this.currentDrawingRect.getBounds();
      this.gFeatureLayer.addFeature(this.currentDrawingRect);
    },
    addText(points, txt = "") {
      const text = new AILabel.Text(
        `text-${this.timestamp}`,
        {
          pos: { x: points.x, y: points.y },
          offset: { x: 0, y: 10 },
          text: txt,
          wrap: true
        },
        this.setStyle(modeStyle.addText)
      );
      this.gTextLayer.addText(text);
    }
  }
};
