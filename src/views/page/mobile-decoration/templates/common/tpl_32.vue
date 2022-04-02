<template>
  <div class="floor-layout tpl-32">
    <div class="layout-main">
      <div class="left">
        <layout-item :block="data.blockList[0]" @handle-edit="handleEditBlock(0)"/>
      </div>
      <div class="right">
        <layout-item :block="data.blockList[1]" @handle-edit="handleEditBlock(1)"/>
        <layout-item :block="data.blockList[2]" @handle-edit="handleEditBlock(2)"/>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '../mixin'

  export default {
    name: 'tpl_32',
    mixins: [mixin],
    title: '左一右二竖排模板',
    dataTpl: {
      tpl_id: 32,
      blockList: [
        { block_type: 'IMAGE', block_value: '', block_opt: '' },
        { block_type: 'IMAGE', block_value: '', block_opt: '' },
        { block_type: 'IMAGE', block_value: '', block_opt: '' }
      ]
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
