<template>
	<div>
		<en-table-layout
			:tableData="tableData.data"
			:loading="loading"
		>
			<div slot="toolbar" class="inner-toolbar">
				<div class="toolbar-btns">
					<el-button size="mini" type="primary" @click="addDialogVisible = true">Add the word</el-button>
					<el-button size="mini" type="primary" @click="dialogSecret = true">Set the secret key</el-button>
				</div>
				<div class="toolbar-search">
					<en-table-search @search="searchEvent"/>
				</div>
			</div>

			<template slot="table-columns">
				<el-table-column prop="name" label="keywords" width="120"/>
				<el-table-column label="Add the time">
					<template slot-scope="scope">
						{{ scope.row.add_time | unixToDate }}
					</template>
				</el-table-column>
				<el-table-column label="Operation" width="150">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="danger"
							@click="handleDelKeyword(scope.index, scope.row)">delete</el-button>
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
		<!--Set keywords-->
		<el-dialog
			title="Set keywords"
			:visible.sync="addDialogVisible"
			width="30%">
			<el-form>
				<el-form-item label="keywords" label-width="100px">
					<el-input v-model="customName" placeholder="Please enter keywords" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">cancel</el-button>
		    <el-button type="primary" @click=handleAddKeyword>save</el-button>
		  </span>
		</el-dialog>
		<!--Set the secret key-->
		<el-dialog
			title="Set the key"
			:visible.sync="dialogSecret"
			width="30%">
			<el-form>
				<el-form-item label="The key" label-width="100px">
					<el-input v-model="secretKey" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogSecret = false">cancel</el-button>
		    <el-button type="primary" @click=setSecretKey>save</el-button>
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
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** Search for list data*/
        tableData: '',

        /** Add whether keywords are displayed*/
        addDialogVisible: false,

        /** Custom keywords*/
        customName: '',

        /** Set the key*/
        dialogSecret: false,

        /** The key*/
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

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SearchKeywordsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SearchKeywordsList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        this.params.page_no = 1
        this.GET_SearchKeywordsList()
      },

      /** Add custom participles*/
      handleAddKeyword() {
        if (!this.customName) {
          this.$message.error('Participle names cannot be empty')
          return
        }
        this.loading = true
        const name = this.customName
        API_search.addSearchKeyword({ name }).then(_ => {
          this.loading = false
          this.addDialogVisible = false
          this.customName = ''
          this.$message.success('Add a success')
          this.GET_SearchKeywordsList()
        }).catch(() => (this.loading = false))
      },

      /** Delete keywords*/
      handleDelKeyword(index, row) {
        this.$confirm('Are you sure you want to delete this keyword？', 'prompt', { type: 'warning' }).then(() => {
          this.loading = true
          API_search.delSearchKeyword(row.id).then(_ => {
            this.loading = false
            this.$message.success('Delete the success！')
            this.GET_SearchKeywordsList()
          }).catch(() => (this.loading = false))
        }).catch(() => {})
      },

      /** Set the key*/
      setSecretKey() {
        if (!this.secretKey) {
          this.$message.error('The key cannot be empty')
          return
        }
        this.loading = true
        const password = this.secretKey
        API_search.setSecretKey({ password }).then(response => {
          this.loading = false
          this.dialogSecret = false
          this.secretKey = ''
          this.$message.success('Set up the success')
        }).catch(() => (this.loading = false))
      },

      /** Get a list of keywords*/
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
