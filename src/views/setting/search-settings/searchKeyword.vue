<template>
	<div>
		<en-table-layout
			:tableData="tableData.data"
			:loading="loading"
		>
			<div slot="toolbar" class="inner-toolbar">
				<div class="toolbar-btns">
					<el-button size="mini" type="primary" @click="addDialogVisible = true">添加分词</el-button>
					<el-button size="mini" type="primary" @click="dialogSecret = true">设置秘钥</el-button>
				</div>
				<div class="toolbar-search">
					<en-table-search @search="searchEvent"/>
				</div>
			</div>

			<template slot="table-columns">
				<el-table-column prop="name" label="关键词" width="120"/>
				<el-table-column label="添加时间">
					<template slot-scope="scope">
						{{ scope.row.add_time | unixToDate }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="danger"
							@click="handleDelKeyword(scope.index, scope.row)">删除</el-button>
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
		<!--设置关键词-->
		<el-dialog
			title="设置关键词"
			:visible.sync="addDialogVisible"
			width="30%">
			<el-form>
				<el-form-item label="关键词" label-width="100px">
					<el-input v-model="customName" placeholder="请输入关键词" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click=handleAddKeyword>保 存</el-button>
		  </span>
		</el-dialog>
		<!--设置秘钥-->
		<el-dialog
			title="设置密钥"
			:visible.sync="dialogSecret"
			width="30%">
			<el-form>
				<el-form-item label="密钥" label-width="100px">
					<el-input v-model="secretKey" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogSecret = false">取 消</el-button>
		    <el-button type="primary" @click=setSecretKey>保 存</el-button>
		  </span>
		</el-dialog>
	</div>

</template>

<script>
  import * as API_search from '@/api/search'

  export default {
    name: 'searchKeyword',
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
        tableData: '',

        /** 添加关键词是否显示 */
        addDialogVisible: false,

        /** 自定义关键词 */
        customName: '',

        /** 设置密钥 */
        dialogSecret: false,

        /** 密钥 */
        secretKey: ''
      }
    },
    mounted() {
      this.GET_SearchKeywordsList()
    },
    activated() {
      this.GET_SearchKeywordsList()
    },
    methods: {

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SearchKeywordsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SearchKeywordsList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        this.params.page_no = 1
        this.GET_SearchKeywordsList()
      },

      /** 添加自定义分词 */
      handleAddKeyword() {
        if (!this.customName) {
          this.$message.error('分词名称不能为空')
          return
        }
        this.loading = true
        const name = this.customName
        API_search.addSearchKeyword({ name }).then(_ => {
          this.loading = false
          this.addDialogVisible = false
          this.customName = ''
          this.$message.success('添加成功')
          this.GET_SearchKeywordsList()
        }).catch(() => (this.loading = false))
      },

      /** 删除关键词 */
      handleDelKeyword(index, row) {
        this.$confirm('确定要删除这个关键词么？', '提示', { type: 'warning' }).then(() => {
          this.loading = true
          API_search.delSearchKeyword(row.id).then(_ => {
            this.loading = false
            this.$message.success('删除成功！')
            this.GET_SearchKeywordsList()
          }).catch(() => (this.loading = false))
        }).catch(() => {})
      },

      /** 设置密钥 */
      setSecretKey() {
        if (!this.secretKey) {
          this.$message.error('密钥不能为空')
          return
        }
        this.loading = true
        const password = this.secretKey
        API_search.setSecretKey({ password }).then(response => {
          this.loading = false
          this.dialogSecret = false
          this.secretKey = ''
          this.$message.success('设置成功')
        }).catch(() => (this.loading = false))
      },

      /** 获取关键词列表 */
      GET_SearchKeywordsList() {
        this.loading = true
        API_search.getSearchKeywordsList(this.params).then(response => {
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
