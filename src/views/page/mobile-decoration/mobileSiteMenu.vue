<template>
  <div>
    <en-table-layout
      :stripe="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddSiteMenu">add</el-button>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column label="Navigation image">
          <template slot-scope="scope">
            <img :src="scope.row.image" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="navigation_name" label="The name of the"/>
        <el-table-column prop="url" label="URL"/>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSiteMenu(scope.$index, scope.row)">edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteSiteMenu(scope.$index, scope.row)">delete</el-button>
            <el-button
              size="mini"
              :disabled="scope.$index === 0"
              @click="handleSortSiteMenu(scope.$index, scope.row, 'up')"> up</el-button>
            <el-button
              size="mini"
              :disabled="scope.$index === tableData.data.length - 1"
              @click="handleSortSiteMenu(scope.$index, scope.row, 'down')">down</el-button>
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

    <el-dialog
      :title="(siteMenuForm.id ? 'edit' : 'add') + 'Navigation menu'"
      :visible.sync="dialogVisible" width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="siteMenuForm" :rules="siteMenuRules" ref="siteMenuForm" label-width="110px">
        <el-form-item label="Navigation menu name" prop="navigation_name">
          <el-input v-model="siteMenuForm.navigation_name" clearable :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="Navigation menu link" prop="url">
          <el-input v-model="siteMenuForm.url" clearable :maxlength="225"></el-input>
        </el-form-item>
        <el-form-item label="Navigation menu picture" prop="image">
          <el-upload
            :action="MixinUploadApi"
            :on-remove="() => { siteMenuForm.image = '' }"
            :before-upload="handleImagesUrlBefore"
            :on-success="uploadSuccess"
            :file-list="siteMenuForm.image ? [{name: 'image', url: siteMenuForm.image}] : []"
            list-type="picture">
            <!--(res) => { siteMenuForm.image = res.url }-->
            <el-button size="small" type="primary">upload</el-button>
            <div slot="tip" class="el-upload__tip">Recommended to uploadjpg/pngFile, and not exceeding1MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitSiteMenuForm('siteMenuForm')">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_SiteMenu from '@/api/siteMenu'

  export default {
    name: 'mobileSiteMenu',
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10,
          client_type: 'MOBILE'
        },

        /** The list of data*/
        tableData: '',

        /** add、Edit navigation menudialog */
        dialogVisible: false,

        /** add、Edit the navigation menu form*/
        siteMenuForm: {
          navigation_name: '',
          url: 'admin/',
          image: ''
        },

        /** add、Edit navigation menu form rules*/
        siteMenuRules: {
          navigation_name: [this.MixinRequired('Please enter the navigation menu name！')],
          url: [this.MixinRequired('Please enter the navigation menu link！')],
          image: [{ required: true, message: 'Please select the navigation image！', trigger: 'change' }]
        }
      }
    },
    mounted() {
      this.GET_SiteMenuList()
    },
    methods: {
      /** Verify images before uploading*/
      handleImagesUrlBefore(file) {
        const isImage = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isImage) {
          this.$message.error('Upload menu picture can only beJPG、JPEGorPNGFormat!')
          return isImage
        }
        if (!isLt1M) {
          this.$message.error('Upload menu image size cannot exceed1MB!')
          return isLt1M
        }
        return new Promise((resolve, reject) => {
          let reader = new FileReader()
          reader.onload = (event) => {
            let image = new Image()
            image.onload = () => {
              let width = image.width
              let height = image.height
              if (width !== height) {
                this.$message.error('The picture must be square！')
                reject()
              }
              resolve()
            }
            image.src = event.target.result
          }
          reader.readAsDataURL(file)
        })
      },
      // Picture uploaded successfully
      uploadSuccess(res) {
        this.$set(this.siteMenuForm, 'image', res.url)
        this.$refs['siteMenuForm'].validateField('image')
      },
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SiteMenuList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SiteMenuList()
      },

      /** Add navigation menu*/
      handleAddSiteMenu() {
        this.siteMenuForm = {}
        this.dialogVisible = true
      },

      /** Edit navigation menu*/
      handleEditSiteMenu(index, row) {
        this.siteMenuForm = this.MixinClone(row)
        this.dialogVisible = true
      },

      /** Delete navigation menu*/
      handleDeleteSiteMenu(index, row) {
        this.$confirm('Are you sure you want to delete this navigation menu？', 'prompt', { type: 'warning' }).then(() => {
          API_SiteMenu.deleteSiteMenu(row.navigation_id).then(response => {
            this.$message.success('Delete the success！')
            this.GET_SiteMenuList()
          })
        }).catch(() => {})
      },

      /** add、Edit the navigation menu submit form*/
      submitSiteMenuForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { navigation_id } = this.siteMenuForm
            if (navigation_id) {
              API_SiteMenu.editSiteMenu(navigation_id, this.siteMenuForm).then(response => {
                this.dialogVisible = false
                this.$message.success('Save success！')
                this.MixinSetTableData(this.tableData, 'navigation_id', navigation_id, response)
              })
            } else {
              API_SiteMenu.addSiteMenu(this.params.client_type, this.siteMenuForm).then(response => {
                this.dialogVisible = false
                this.$message.success('Add a success！')
                this.GET_SiteMenuList()
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Navigation sorting*/
      handleSortSiteMenu(index, row, sort_type) {
        API_SiteMenu.sortSiteMenu(row.navigation_id, sort_type).then(response => {
          this.GET_SiteMenuList()
          this.$message.success('Operation is successful！')
        })
      },

      /** Gets the navigation menu list*/
      GET_SiteMenuList() {
        this.loading = true
        API_SiteMenu.getSiteMenuList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
