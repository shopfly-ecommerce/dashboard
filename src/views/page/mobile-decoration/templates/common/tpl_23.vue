<template>
  <div class="floor-layout tpl-23">
    <div class="layout-main">
      <layout-item :block="data.blockList[0]" @handle-edit="handleEditBlock(0)"/>
    </div>
  </div>
</template>

<script>
  import mixin from '../mixin'

  export default {
    name: 'tpl_23',
    mixins: [mixin],
    title: '单列单张大图模块',
    dataTpl: {
      tpl_id: 23,
      blockList: [
        { block_type: 'IMAGE', block_value: '', block_opt: '' }
      ]
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
