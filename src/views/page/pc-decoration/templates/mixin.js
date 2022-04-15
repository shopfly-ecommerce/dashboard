/**
 * Created by Andste on 2018/5/18.
 */

/** mixin */
export default {
  props: {
    /** data*/
    data: {
      type: Object,
      default: () => ({})
    },
    /** Is it in edit mode*/
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
                           <svg-icon icon-class="pen-leather"></svg-icon>edit
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
    /** Get color-related information*/
    colors(columnIndex = 0) {
      const _colors = this.data.columnList[columnIndex].titleColors
      return {
        title: `background-color: ${_colors[0]}; background-image: linear-gradient(90deg, ${_colors.join(',')});`,
        color: (colorIndex = 0) => `color: ${_colors[colorIndex]}`
      }
    },
    /** Get a block link*/
    blockHref(block) {
      const { opt_type, opt_value } = block.block_opt
      switch (opt_type) {
        // The link address
        case 'URL': return opt_value
        // goods
        case 'GOODS': return `/goods/${opt_value}`
        // keyword
        case 'KEYWORD': return `/goods?keyword=${encodeURIComponent(opt_value)}`
        // The store
        case 'SHOP': return `/shop/${opt_value}`
        // Categories
        case 'CATEGORY': return `/goods?category=${opt_value}`
        default: return '/'
      }
    },
    /** Build the emptyblock */
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
    /** Edit block*/
    handleEditBlock(columnIndex, blockIndex) {
      this.$emit('edit-block', JSON.parse(JSON.stringify(this.data)), columnIndex, blockIndex)
    },
    /** Edit the title*/
    handleEditTitle(columnIndex) {
      this.$emit('edit-title', JSON.parse(JSON.stringify(this.data)), columnIndex)
    },
    /** Edit the label*/
    handleEditTags(columnIndex) {
      this.$emit('edit-tags', JSON.parse(JSON.stringify(this.data)), columnIndex)
    }
  }
}
