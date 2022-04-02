/**
 * Created by Andste on 2018/5/18.
 */

/** mixin */
export default {
  props: {
    /** 数据 */
    data: {
      type: Object,
      default: () => ({})
    },
    /** 是否为编辑模式 */
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'layout-item': {
      props: ['block'],
      template: `<div class="layout-item">
                   <template v-if="$parent.isEdit">
                     <div class="mask-floor" @click="$emit('handle-edit')">
                       <div class="mask-bg-floor">
                         <button type="button" class="mask-btn-floor">
                           <svg-icon icon-class="pen-leather"></svg-icon>编辑
                         </button>
                       </div>
                     </div>
                     <slot :block="block"></slot>
                     <img v-if="block.block_value" :src="block.block_value">
                     <div v-else-if="$parent.isEdit" class="no-image"></div>
                   </template>
                   <a v-else :href="$parent.blockHref(block)" v-lazy-container="{ selector: 'img' }">
                     <slot :block="block"></slot>
                     <img :data-src="block.block_value">
                   </a>
                 </div>`
    }
  },
  methods: {
    /** 获取颜色相关信息 */
    colors(columnIndex = 0) {
      const _colors = this.data.columnList[columnIndex].titleColors
      return {
        title: `background-color: ${_colors[0]}; background-image: linear-gradient(90deg, ${_colors.join(',')});`,
        color: (colorIndex = 0) => `color: ${_colors[colorIndex]}`
      }
    },
    /** 获取区块链接 */
    blockHref(block) {
      const { opt_type, opt_value } = block.block_opt
      switch (opt_type) {
        // 链接地址
        case 'URL': return opt_value
        // 商品
        case 'GOODS': return `/goods/${opt_value}`
        // 关键字
        case 'KEYWORD': return `/goods?keyword=${encodeURIComponent(opt_value)}`
        // 店铺
        case 'SHOP': return `/shop/${opt_value}`
        // 分类
        case 'CATEGORY': return `/goods?category=${opt_value}`
        default: return '/'
      }
    },
    /** 构建空的block */
    emptyBlock(num = 3, type) {
      return [...new Array(num)].map(() => ({
        block_type: type,
        block_value: '',
        block_opt: {
          opt_type: 'NONE',
          opt_value: ''
        }
      }))
    },
    /** 编辑区块 */
    handleEditBlock(columnIndex, blockIndex) {
      this.$emit('edit-block', JSON.parse(JSON.stringify(this.data)), columnIndex, blockIndex)
    },
    /** 编辑标题 */
    handleEditTitle(columnIndex) {
      this.$emit('edit-title', JSON.parse(JSON.stringify(this.data)), columnIndex)
    },
    /** 编辑标签 */
    handleEditTags(columnIndex) {
      this.$emit('edit-tags', JSON.parse(JSON.stringify(this.data)), columnIndex)
    }
  }
}
