<template>
  <div class="floor-layout tpl-25">
    <div class="layout-main">
      <div class="left">
        <layout-item :block="data.blockList[0]" @handle-edit="handleEditBlock(0)"/>
        <layout-item :block="data.blockList[1]" @handle-edit="handleEditBlock(1)"/>
      </div>
      <div class="right">
        <layout-item :block="data.blockList[2]" @handle-edit="handleEditBlock(2)"/>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '../mixin'

  export default {
    name: 'tpl_25',
    mixins: [mixin],
    title: '左二右一图片模块',
    dataTpl: {
      tpl_id: 25,
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
