<template>
  <div class="floor-layout tpl-27">
    <div class="layout-main">
      <layout-item
        v-for="(block, index) in data.blockList"
        :key="index"
        :block="block"
        @handle-edit="handleEditBlock(index)"
      />
    </div>
  </div>
</template>

<script>
  import mixin from '../mixin'

  export default {
    name: 'tpl_27',
    mixins: [mixin],
    title: 'Five-column single-row small graph module',
    dataTpl: {
      tpl_id: 27,
      blockList: [
        { block_type: 'IMAGE', block_value: '', block_opt: '' },
        { block_type: 'IMAGE', block_value: '', block_opt: '' },
        { block_type: 'IMAGE', block_value: '', block_opt: '' },
        { block_type: 'IMAGE', block_value: '', block_opt: '' },
        { block_type: 'IMAGE', block_value: '', block_opt: '' }
      ]
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
