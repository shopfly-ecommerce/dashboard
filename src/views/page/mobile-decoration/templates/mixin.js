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
      props: ['block', 'isEdit', 'blockHref'],
      template: `<div class="layout-item">
                   <template v-if="isEdit || $parent.isEdit">
                     <div class="mask-floor" @click="$emit('handle-edit')">
                       <div class="mask-bg-floor">
                         <button type="button" class="mask-btn-floor">
                           <svg-icon icon-class="pen-leather"></svg-icon>edit
                         </button>
                       </div>
                     </div>
                     <slot :block="block"></slot>
                     <template v-if="block.block_type === 'IMAGE'">
                       <img v-if="block.block_value" :src="block.block_value">
                       <div v-else-if="isEdit || $parent.isEdit" class="no-image"></div>
                     </template>
                   </template>
                   <a v-else :href="blockHref || $parent.blockHref(block)">
                     <slot :block="block"></slot>
                     <img v-if="block.block_type === 'IMAGE'" :src="block.block_value">
                   </a>
                 </div>`
    }
  },
  methods: {
    /** Get a block link*/
    blockHref(block) {
      if (block.block_type === 'GOODS') {
        if (!block.block_value) return '#'
        return `/goods/${block.block_value.goods_id}`
      }
      if (!block || !block.block_opt) return '#'
      const { opt_type, opt_value } = block.block_opt
      switch (opt_type) {
        // The link address
        case 'URL': return opt_value
        // goods
        case 'GOODS': return `/goods/${opt_value}`
        // keyword
        case 'KEYWORD': return `/goods?keyword=${opt_value}`
        // Categories
        case 'CATEGORY': return `/goods?category=${opt_value}`
        default: return '/'
      }
    },
    /** Edit block*/
    handleEditBlock(blockIndex) {
      this.$emit('edit-block', JSON.parse(JSON.stringify(this.data)), blockIndex)
    }
  }
}
