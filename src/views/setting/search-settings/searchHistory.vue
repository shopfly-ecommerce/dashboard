<template>
	<en-table-layout
		:tableData="tableData.data"
		:loading="loading"
	>
		<div slot="toolbar" class="inner-toolbar">
			<div class="toolbar-btns"></div>
			<div class="toolbar-search">
				<en-table-search @search="searchEvent"/>
			</div>
		</div>
		<template slot="table-columns">
			<el-table-column prop="keyword" label="提示词"/>
			<el-table-column prop="count" label="搜索次数"/>
			<el-table-column label="最后搜索时间">
				<template slot-scope="scope">
					{{ scope.row.modify_time | unixToDate }}
				</template>
			</el-table-column>
		</template>
		<el-pagination
			v-if="tableData"
			slot="pagination"
			@size-change="handlePageSizeChange"
			@current-change="handlePageCurrentChange"
			:current-page="tableData.page_no"
			:page-sizes="[10, 20, 50, 100]"
			:page-size="tableData.page_size"
			layout="total, sizes, prev, pager, next, jumper"
			:total="tableData.data_total">
		</el-pagination>
	</en-table-layout>
</template>

<script>
  import * as API_search from '@/api/search'

  export default {
    name: 'searchHistory',
    data() {
      return {
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 搜索列表数据 */
        tableData: ''
      }
    },
    mounted() {
      this.GET_SearchHistoryList()
    },
    activated() {
      this.GET_SearchHistoryList()
    },
    methods: {

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SearchHistoryList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SearchHistoryList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        this.params.page_no = 1
        this.GET_SearchHistoryList()
      },

      /** 获取关键词列表 */
      GET_SearchHistoryList() {
        this.loading = true
        API_search.getSearchHistoryList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => (this.loading = false))
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
	/deep/ .el-table td:not(.is-left) {
		text-align: center;
	}

	.inner-toolbar {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.toolbar-search {
		margin-right: 10px;
	}

	.goods-image {
		width: 50px;
		height: 50px;
	}
	.goods_name {
		color: #4183c4;
		&:hover {
			color: #f42424;
		}
	}
</style>
