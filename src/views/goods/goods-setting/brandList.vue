<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
      :selection-change="handleSelectionChange"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddBrand">add</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="Please enter the brand name"/>
        </div>
      </div>
      <template slot="table-columns">
        <!--<el-table-column type="selection" width="100"/>-->
        <!--Image-->
        <el-table-column label="Image" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.logo" class="goods-image"/>
          </template>
        </el-table-column>
        <!-- name-->
        <el-table-column prop="name" label=" name" />
        <!--Operation-->
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditBrand(scope.$index, scope.row)">edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteBrand(scope.$index, scope.row)">delete</el-button>
          </template>
        </el-table-column>
      </template>
      <!--<template slot="pagination-toolbar">
        <el-button type="danger" size="mini" @click="deleteTheBrand">Delete the selected</el-button>
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
      :title="brandForm.brand_id ? 'Edit the brand' : 'Add a brand'"
      :visible.sync="dialogBrandVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <el-form :model="brandForm" :rules="brandRules" ref="brandForm" label-width="100px">
        <!-- name-->
        <el-form-item label=" name" prop="name">
          <el-input v-model="brandForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Image" prop="logo">
          <el-upload
            :action="MixinUploadApi"
            list-type="picture"
            :on-success="uploadSuccess"
            :on-remove="delGiftImg"
            :file-list="fileList"
            :multiple="false"
            :limit="1"
          >
            <el-button size="small" type="primary">upload</el-button>
            <span slot="tip" class="el-upload__tip">&nbsp;Recommended to uploadjpg/pngFile, and not exceeding1MB</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBrandVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitBrandForm('brandForm')">save</el-button>
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
        /** The list ofloadingStatus*/
        loading: false,
        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },
        /** The list of data*/
        tableData: '',
        /** The selected data*/
        selectedData: [],

        // Add and modify brand Dialogs
        dialogBrandVisible: false,

        /** Stores uploaded images*/
        fileList: [],
        /** add、Modify the brand form*/
        brandForm: {},
        /** add、Modify brand form rules*/
        brandRules: {
          name: [
            this.MixinRequired('Please enter the brand name！'),
            { min: 1, max: 20, message: 'The length of1 to20 A character', trigger: 'blur' }
          ],
          logo: [this.MixinRequired('Please upload the brandlogo！')]
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
      /** Once the image is removed*/
      delGiftImg() {
        this.fileList = []
        this.brandForm.logo = ''
      },
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_BrandList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_BrandList()
      },

      /** When the selection changes*/
      handleSelectionChange(val) {
        this.selectedData = val.map(item => item.brand_id)
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params.page_no = 1
        this.params.name = data
        if (!data) delete this.params.name
        this.GET_BrandList()
      },

      /** Modify brand operation*/
      handleEditBrand(index, row) {
        this.brandForm = this.MixinClone(row)
        this.fileList = this.brandForm.logo ? [{ name: 'brand_image', url: this.brandForm.logo }] : []
        this.dialogBrandVisible = true
      },
      /** Delete brand operation*/
      handleDeleteBrand(index, row) {
        this.$confirm('Are you sure you want to delete this brand？', 'prompt', { type: 'warning' }).then(() => {
          this.DELETE_Brand(row.brand_id)
        }).catch(() => {})
      },
      /** Delete the selected brand action*/
      deleteTheBrand() {
        if (this.selectedData.length < 1) {
          this.$message.error('You did not select any brand！')
        } else {
          this.$confirm('Are you sure you want to delete these brands？', 'prompt', { type: 'warning' }).then(() => {
            this.DELETE_Brand(this.selectedData)
          }).catch(() => {})
        }
      },

      /** Add a brand trigger event*/
      handleAddBrand() {
        this.brandForm = {}
        this.fileList = []
        this.dialogBrandVisible = true
      },

      /** add、Modify the brand form submission*/
      submitBrandForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { brand_id } = this.brandForm
            if (!brand_id) {
              API_brand.addBrand(this.brandForm).then(response => {
                this.dialogBrandVisible = false
                this.$message.success('Add a success！')
                this.$refs[formName].resetFields()
                this.GET_BrandList()
              })
            } else {
              API_brand.editBrand(brand_id, this.brandForm).then(response => {
                this.$message.success('Save success！')
                this.dialogBrandVisible = false
                this.$refs[formName].resetFields()
                this.MixinSetTableData(this.tableData, 'brand_id', brand_id, response)
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },
      /** Get a list of brands*/
      GET_BrandList() {
        this.loading = true
        API_brand.getBrandList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      },

      /** Delete the brand*/
      DELETE_Brand(ids) {
        API_brand.deleteBrand(ids).then(() => {
          this.$message.success('Delete the success！')
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
