<template>
  <el-form :model="siteForm" :rules="siteRules" ref="siteForm" label-width="130px" v-loading="loading" style="width: 500px">
    <el-form-item label="Web site name" prop="site_name">
      <el-input v-model="siteForm.site_name"></el-input>
    </el-form-item>
    <el-form-item label="Site title" prop="title">
      <el-input v-model="siteForm.title"></el-input>
    </el-form-item>
    <el-form-item label="keyword" prop="keywords">
      <el-tag
        class="site-tag"
        v-for="tag in siteForm.keywords"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="handleCloseSiteTag(tag)">
        {{tag}}
      </el-tag>
      <el-input
        class="site-new-tag-input"
        v-if="siteTagInputVisible"
        v-model="siteTagInputValue"
        ref="saveSiteTagInput"
        size="small"
        @keyup.enter.native="handleSiteTagInputConfirm"
        @blur="handleSiteTagInputConfirm"
      ></el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showSiteTagInput">+ add</el-button>
    </el-form-item>
    <el-form-item label="Website description" prop="descript">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="Please enter the website description"
        v-model="siteForm.descript"
        :maxlength="200"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="Whether the site is open" prop="siteon">
      <el-radio v-model="siteForm.siteon" :label="1">open</el-radio>
      <el-radio v-model="siteForm.siteon" :label="0">close</el-radio>
    </el-form-item>
    <el-form-item v-if="siteForm.siteon === 0" label="Close the reason" prop="close_reson">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="Please enter the reason for closing"
        v-model="siteForm.close_reson"
        :maxlength="100"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="Encryption key" prop="global_auth_key">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="Please enter the encryption key"
        v-model="siteForm.global_auth_key"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="Web siteLOGO" prop="logo">
      <el-upload
        class="site-logo"
        :action="MixinUploadApi"
        :show-file-list="false"
        :on-success="(res) => { siteForm.logo = res.url }"
        :multiple="false">
        <img v-if="siteForm.logo" :src="siteForm.logo" class="site-logo-img">
        <i v-else class="el-icon-plus logo-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="The default image" prop="default_img">
      <el-upload
        class="site-logo"
        :action="MixinUploadApi"
        :show-file-list="false"
        :on-success="(res) => { siteForm.default_img = res.url }"
        :multiple="false">
        <img v-if="siteForm.default_img" :src="siteForm.default_img" class="site-logo-img">
        <i v-else class="el-icon-plus logo-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="Test mode" prop="test_mode">
      <el-radio v-model="siteForm.test_mode" :label="1">open</el-radio>
      <el-radio v-model="siteForm.test_mode" :label="0">close</el-radio>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="submitForm">Save Settings</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as API_SystemSetting from '@/api/systemSetting'

  export default {
    name: 'systemSettingsSite',
    data() {
      return {
        loading: true,
        /** Site set up*/
        siteForm: {},
        siteRules: {
          site_name: [this.MixinRequired('The site name cannot be empty！')],
          title: [this.MixinRequired('Site headings cannot be empty！')],
          keywords: [{ type: 'array', required: true, message: 'Please add at least one keyword！', trigger: 'change' }],
          close_reson: [{ required: false, message: 'Please fill in the reason for closing！', trigger: 'blur' }],
          descript: [this.MixinRequired('The site description cannot be left empty！')],
          logo: [this.MixinRequired('Please upload the websiteLOGO！')],
          siteon: [{ required: true, message: 'Please select site status！', trigger: 'change' }],
          test_mode: [{ required: true, message: 'Select site mode！', trigger: 'change' }]
        },
        siteTagInputVisible: false,
        siteTagInputValue: ''
      }
    },
    created() {
      API_SystemSetting.getSiteSetting().then(response => {
        this.loading = false
        this.siteForm = response
        this.siteForm.keywords = response.keywords.split(',')
      }).catch(() => { this.loading = false })
    },
    watch: {
      'siteForm.siteon': function(newVal) {
        this.siteRules.close_reson[0].required = newVal === 0
      }
    },
    methods: {
      /** The keyword tag is closed*/
      handleCloseSiteTag(tag) {
        this.siteForm.keywords.splice(this.siteForm.keywords.indexOf(tag), 1)
      },
      /** Displays the key word input box*/
      showSiteTagInput() {
        this.siteTagInputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveSiteTagInput.$refs.input.focus()
        })
      },
      /** Keyword input validation*/
      handleSiteTagInputConfirm() {
        let inputValue = this.siteTagInputValue
        if (this.siteForm.keywords.includes(inputValue)) {
          this.$message.error('You cannot have duplicate keywords！')
        } else if (inputValue) {
          this.siteForm.keywords.push(inputValue)
          this.siteTagInputVisible = false
          this.siteTagInputValue = ''
        }
      },
      submitForm() {
        this.$refs['siteForm'].validate((valid) => {
          if (valid) {
            const params = this.MixinClone(this.siteForm)
            params.keywords = params.keywords.join(',')
            API_SystemSetting.editSiteSetting(params).then(() => {
              this.$message.success('Modify the success！')
            })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    background-color: #fff;
    padding: 10px;
    position: relative;
  }
  .site-tag {
    margin: 0 3px;
  }
  .site-new-tag-input {
    width: 100px;
  }
  /deep/ .site-logo .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
  }
  .logo-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .site-logo-img {
    width: 120px;
    height: 120px;
    display: block;
  }

  .image-pane .el-input-group {
    width: 200px;
  }
  .point-pane .el-input-group {
    width: 200px;
  }
</style>
