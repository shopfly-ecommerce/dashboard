<template>
  <div class="container" v-loading="loading">
    <div v-if="toolbar" class="toolbar">
      <slot name="toolbar"></slot>
    </div>
    <el-table
      v-bind="$attrs"
      v-on="$listeners"
      ref="table"
      :data="tableData"
      :row-key="rowKey"
      :stripe="stripe"
      :header-cell-style="{textAlign: 'center'}"
      :style="{width: '100%'}"
      @selection-change="selectionChange"
      highlight-current-row
    >
      <slot name="table-columns"></slot>
    </el-table>
    <div v-if="pagination" class="pagination">
      <div class="pagination-toolbar">
        <slot name="pagination-toolbar"></slot>
      </div>
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EnTableLayout',
    props: {
      /** 是否显示斑纹 */
      stripe: {
        type: Boolean,
        default: true
      },
      /** 行数据的 Key */
      rowKey: {
        type: String,
        default: null
      },
      /** 是否显示工具栏 */
      toolbar: {
        type: Boolean,
        default: true
      },
      /** 是否显示分页 */
      pagination: {
        type: Boolean,
        default: true
      },
      /** 表格数据 */
      tableData: {
        default: () => ([])
      },
      /** 加载状态 */
      loading: {
        type: Boolean,
        default: false
      },
      /** 当选择项发生变化 */
      selectionChange: {
        type: Function,
        default: () => {}
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  /** 工具栏样式 */
  .toolbar {
    display: flex;
    align-items: center;
    height: 44px;
    border-bottom: 1px solid #e6ebf5;
    background-color: #fff;
  }
  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
  }

  .toolbar-search {
    margin-right: 10px;
  }
  /** 分页样式 */
  .pagination {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    text-align: right;
    background-color: #ffffff;
    .pagination-toolbar {
      display: flex;
      align-items: center;
    }
  }
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }
</style>
