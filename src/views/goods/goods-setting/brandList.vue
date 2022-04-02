<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
      :selection-change="handleSelectionChange"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddBrand">添加</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="请输入品牌名称"/>
        </div>
      </div>
      <template slot="table-columns">
        <!--<el-table-column type="selection" width="100"/>-->
        <!--品牌图片-->
        <el-table-column label="品牌图片" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.logo" class="goods-image"/>
          </template>
        </el-table-column>
        <!--品牌名称-->
        <el-table-column prop="name" label="品牌名称" />
        <!--操作-->
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditBrand(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteBrand(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
      <!--<template slot="pagination-toolbar">
        <el-button type="danger" size="mini" @click="deleteTheBrand">删除选中</el-button>
      </template>-->
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
    <el-dialog
      :title="brandForm.brand_id ? '编辑品牌' : '添加品牌'"
      :visible.sync="dialogBrandVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <el-form :model="brandForm" :rules="brandRules" ref="brandForm" label-width="100px">
        <!--品牌名称-->
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="brandForm.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌图片" prop="logo">
          <el-upload
            :action="MixinUploadApi"
            list-type="picture"
            :on-success="uploadSuccess"
            :on-remove="delGiftImg"
            :file-list="fileList"
            :multiple="false"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">&nbsp;建议上传jpg/png文件，且不超过1MB</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBrandVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBrandForm('brandForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_brand from '@/api/goodsSetting'

  export default {
    name: 'brandList',
    data() {
      return {
        /** 列表loading状态 */
        loading: false,
        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },
        /** 列表数据 */
        tableData: '',
        /** 被选数据 */
        selectedData: [],

        // 添加、修改品牌 dialog
        dialogBrandVisible: false,

        /** 存储上传的图片*/
        fileList: [],
        /** 添加、修改品牌 表单 */
        brandForm: {},
        /** 添加、修改品牌 表单规则 */
        brandRules: {
          name: [
            this.MixinRequired('请输入品牌名称！'),
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          logo: [this.MixinRequired('请上传品牌logo！')]
        }
      }
    },
    mounted() {
      this.GET_BrandList()
    },
    methods: {
      uploadSuccess(res) {
        this.$set(this.brandForm, 'logo', res.url)
        this.$refs['brandForm'].validateField('logo')
      },
      /** 图片移除之后 */
      delGiftImg() {
        this.fileList = []
        this.brandForm.logo = ''
      },
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_BrandList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_BrandList()
      },

      /** 当选择项发生变化 */
      handleSelectionChange(val) {
        this.selectedData = val.map(item => item.brand_id)
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params.page_no = 1
        this.params.name = data
        if (!data) delete this.params.name
        this.GET_BrandList()
      },

      /** 修改品牌操作 */
      handleEditBrand(index, row) {
        this.brandForm = this.MixinClone(row)
        this.fileList = this.brandForm.logo ? [{ name: 'brand_image', url: this.brandForm.logo }] : []
        this.dialogBrandVisible = true
      },
      /** 删除品牌操作 */
      handleDeleteBrand(index, row) {
        this.$confirm('确定要删除这个品牌吗？', '提示', { type: 'warning' }).then(() => {
          this.DELETE_Brand(row.brand_id)
        }).catch(() => {})
      },
      /** 删除选中品牌操作 */
      deleteTheBrand() {
        if (this.selectedData.length < 1) {
          this.$message.error('您未选中任何品牌！')
        } else {
          this.$confirm('确定要删除这些品牌吗？', '提示', { type: 'warning' }).then(() => {
            this.DELETE_Brand(this.selectedData)
          }).catch(() => {})
        }
      },

      /** 添加品牌触发事件 */
      handleAddBrand() {
        this.brandForm = {}
        this.fileList = []
        this.dialogBrandVisible = true
      },

      /** 添加、修改品牌 表单提交 */
      submitBrandForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { brand_id } = this.brandForm
            if (!brand_id) {
              API_brand.addBrand(this.brandForm).then(response => {
                this.dialogBrandVisible = false
                this.$message.success('添加成功！')
                this.$refs[formName].resetFields()
                this.GET_BrandList()
              })
            } else {
              API_brand.editBrand(brand_id, this.brandForm).then(response => {
                this.$message.success('保存成功！')
                this.dialogBrandVisible = false
                this.$refs[formName].resetFields()
                this.MixinSetTableData(this.tableData, 'brand_id', brand_id, response)
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },
      /** 获取品牌列表 */
      GET_BrandList() {
        this.loading = true
        API_brand.getBrandList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      },

      /** 删除品牌 */
      DELETE_Brand(ids) {
        API_brand.deleteBrand(ids).then(() => {
          this.$message.success('删除成功！')
          this.GET_BrandList()
        })
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
    padding: 0 20px;
  }

  .goods-image {
    max-width: 85px;
    height: 50px;
  }

  /deep/ .el-select .el-input {
    width: 100px;
  }

  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  /deep/ .el-form-item__content .edui-editor {
    line-height: normal;
  }
</style>
