<template>
  <div class="floor-layout tpl-42">
    <div class="layout-main">
      <layout-item :block="data.blockList[0]" @handle-edit="handleEditBlock(0)">
        <template slot-scope="{ block }">{{ block.block_value }}</template>
      </layout-item>
    </div>
  </div>
</template>

<script>
  import mixin from '../mixin'

  export default {
    name: 'tpl_42',
    mixins: [mixin],
    title: '文本模块',
    dataTpl: {
      tpl_id: 42,
      blockList: [
        { block_type: 'TEXT', block_value: '', block_opt: '' }
      ]
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
