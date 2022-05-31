<template>
  <div class="pic-template">
    <!-- 占位用 -->
    <img
      v-if="backgroundImage !== ''"
      ref="background-image"
      :src="backgroundImage"
      style="width: 100%; height: auto; display: block; opacity: 0;"
      @error="handleImageError"
    >
    <!-- 生成图片 -->
    <div
      ref="template-box"
      class="template-box"
      :style="{ transform: `scale(${scale})`, opacity: show ? '1' : '0' }"
    >
      <!-- 背景图 -->
      <img
        v-if="backgroundImage !== ''"
        class="background-image"
        :src="backgroundImage"
        :style="{ minWidth, minHeight, display: 'block' }"
        @error="handleImageError"
      >
      <template v-for="(item, index) in components">
        <!-- 文本 -->
        <template v-if="item.type === 1">
          <p
            :key="index"
            :style="item.style"
            class="item"
          >
            {{ item.content }}
          </p>
        </template>
        <!-- 图片 -->
        <template v-else-if="item.type === 2">
          <img
            :key="index"
            :src="item.content"
            :style="item.style"
            class="item item-image"
          >
        </template>
      </template>
      <!-- 生成好的证书图片 -->
      <img v-if="renderImage" :src="renderImage" class="touch-img" alt="touch-img">
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { toBlobURL, convertToBlobImage } from './utils'

export default {
  name: 'PicTemplate',
  model: {
    prop: 'loading',
    event: 'change'
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      minWidth: 0, // 最小宽度
      minHeight: 0, // 最小高度
      scale: 1, // 缩放
      pixelRatio: window.devicePixelRatio, // 设备缩放
      renderImage: '', // 生成好的证书图片
      backgroundImage: '', // 证书背景图
      components: [],
      show: false,
      ops: {
        debug: false,
        renderType: 'base64',
        imageType: 'image/png',
        autoRender: true
      }
    }
  },
  watch: {
    data: {
      handler: async function(data) {
        await this.setData(data)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.renderImage)
    this.revokeObjectURL()
  },
  methods: {
    init() {
      Object.assign(this.ops, this.options)
    },
    revokeObjectURL() {
      URL.revokeObjectURL(this.backgroundImage)
      const nodeList = this.$refs['template-box'].querySelectorAll('.item-image')
      if (!nodeList) return
      Array.from(nodeList).forEach(f => {
        URL.revokeObjectURL(f.src)
      })
    },
    async setData() {
      if (!this.data['bgImage']) {
        throw new Error('[PicTemplate] 必须要一个背景图片')
      }
      try {
        this.$emit('change', true)
        await this.$nextTick()
        this.revokeObjectURL()
        const bgImage = await toBlobURL(this.data['bgImage'], true)
        if (bgImage && bgImage.url) {
          const { width, height, url } = bgImage
          this.backgroundImage = url
          await new Promise(res => setTimeout(res, 300))
          const boxWidth = this.$refs['background-image'].clientWidth
          this.scale = boxWidth / width
          this.pixelRatio = width / boxWidth
          this.minWidth = width + 'px'
          this.minHeight = height + 'px'
          // 格式化
          this.setComponents(this.data['list'])
          await this.$nextTick()
          // 转换为本地图片
          const imgs = this.$refs['template-box'].querySelectorAll('.item-image')
          await convertToBlobImage(imgs, 10000)
          this.show = true
          if (this.ops['autoRender']) await this.render()
        }
        if (!this.ops['autoRender']) this.$emit('change', false)
      } catch (err) {
        this.$emit('change', false)
        this.$emit('error', err)
      }
    },
    // 渲染
    async render() {
      try {
        this.$emit('change', true)
        URL.revokeObjectURL(this.renderImage)
        await this.$nextTick()
        await new Promise(res => setTimeout(() => res(), 500))
        const options = {
          scale: this.pixelRatio,
          logging: this.ops['debug'], // 日志开关，便于查看 html2canvas 的内部执行流程
          useCORS: true, // 【重要】开启跨域配置
          allowTaint: true, // 【重要】开启画布污染
          backgroundColor: null, // 背景颜色
          scrollX: 0,
          scrollY: 0
        }
        const canvas = await html2canvas(this.$refs['template-box'], options)
        // 生成图片
        if (this.ops['renderType'] === 'base64') {
          this.renderImage = canvas.toDataURL(this.ops['imageType'])
        } else if (this.ops['renderType'] === 'blob') {
          this.renderImage = await new Promise((res, rej) => {
            canvas.toBlob(function(blob) {
              if (blob) {
                res(URL.createObjectURL(blob))
              } else {
                rej('toBlob error')
              }
            }, this.ops['imageType'])
          })
        }
        // 回调
        this.ops['renderEnd'] && this.ops['renderEnd']({ image: this.renderImage, canvas })
        this.$emit('change', false)
        return canvas
      } catch (err) {
        this.$emit('error', err)
        this.$emit('change', false)
        return null
      }
    },
    setComponents(list = []) {
      const components = []
      list.forEach(field => {
        const { type, content, fontSize, fontColor, fontWeight, x, y, alignment, style = {}} = field
        const component = {
          type,
          content,
          style: {
            top: `${y}px`,
            left: `${x}px`
          }
        }
        if (fontSize) component.style['fontSize'] = `${fontSize}px`
        if (fontColor) component.style['color'] = fontColor
        if (fontWeight) component.style['fontWeight'] = fontWeight
        // 设置字体对齐方式
        if (alignment === 2) {
          component.style['transform'] = `translate(-50%, 0)`
        } else if (alignment === 3) {
          component.style['transform'] = `translate(-100%, 0)`
        }
        // 合并
        Object.assign(component.style, style)
        // 提交
        components.push(component)
      })
      // 设置
      this.components = components
    },
    handleImageError() {
      this.$emit('change', false)
      this.$emit('error', '证书图片加载失败')
    }
  }
}
</script>

<style lang='scss' scoped>
.pic-template {
  position: relative;
  overflow: hidden;
  user-select: none;
  .template-box {
    position: absolute;
    top: 0;
    left: 0;
    width: max-content;
    transform-origin: top left;
    .item {
      position: absolute;
      width: max-content;
      margin: 0;
      padding: 0;
    }
    .touch-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      opacity: 0;
      user-select: auto;
    }
  }
}
</style>
