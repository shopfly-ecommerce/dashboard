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
      /** Whether to show markings*/
      stripe: {
        type: Boolean,
        default: true
      },
      /** The rows of dataKey */
      rowKey: {
        type: String,
        default: null
      },
      /** Whether to display toolbar*/
      toolbar: {
        type: Boolean,
        default: true
      },
      /** Whether paging is displayed*/
      pagination: {
        type: Boolean,
        default: true
      },
      /** Tabular data*/
      tableData: {
        default: () => ([])
      },
      /** Loading status*/
      loading: {
        type: Boolean,
        default: false
      },
      /** When the selection changes*/
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
  /** Toolbar Style*/
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
  /** Pagination style*/
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
