<template>
    <el-form :model="contactForm" label-width="130px" style="width: 500px;min-height: 500px;" :rules="contactRules" ref="contactForm">
      <el-form-item label="手机" prop="phone">
        <el-input v-model="contactForm.phone" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item v-if="!MixinIsIM" label="QQ" prop="qq">
        <el-input v-model="contactForm.qq" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="contactForm.email" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="地址" class="form-item-region" prop="region">
        <en-region-picker :api="MixinRegionApi" :default="defaultRegion" @changed="(object) => { contactForm.region = object.last_id; regionObj = object }"/>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="contactForm.address" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="submitEditGoodsSetting('contactForm')">保存设置</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
    import * as API_SystemSetting from '@/api/systemSetting'
    import { RegExp } from '~/ui-utils'
    export default {
      name: 'SystemSettingContact',
      data() {
        return {
          // 联系方式表单
          contactForm: {},
          regionObj: {},
          // 表单规则
          contactRules: {
            phone: [
              this.MixinRequired('请输入手机号！'),
              {
                validator: (rule, value, callback) => {
                  if (!RegExp.mobile.test(value)) {
                    callback(new Error('手机格式有误！'))
                  } else {
                    callback()
                  }
                }
              }
            ],
            email: [
              this.MixinRequired('请输入邮箱！'),
              {
                validator: (rule, value, callback) => {
                  if (value !== 0 && !value) {
                    callback()
                  } else if (!RegExp.email.test(value)) {
                    callback(new Error('邮箱格式有误！'))
                  } else {
                    callback()
                  }
                }
              }
            ],
            qq: this.MixinIsIM ? [] : [this.MixinRequired('请输入QQ！')],
            region: [this.MixinRequired('请输入地址！')],
            address: [this.MixinRequired('请输入详细地址！')]
          },
          // 地区id数组
          defaultRegion: null
        }
      },
      mounted() {
        API_SystemSetting.getContactSettings().then(response => {
          this.contactForm = response
          this.defaultRegion = [
            response.province_id,
            response.city_id,
            response.county_id,
            response.town_id
          ]
        })
      },
      methods: {
        submitEditGoodsSetting(formName) {
          this.$refs[formName].validate(valid => {
            if (valid) {
              let regionParams = {
                province_id: this.regionObj.regions.province_id,
                city_id: this.regionObj.regions.city_id,
                county_id: this.regionObj.regions.region_id,
                town_id: this.regionObj.regions.town_id,

                province: this.regionObj.regions.province,
                city: this.regionObj.regions.city,
                county: this.regionObj.regions.region,
                town: this.regionObj.regions.town
              }
              const params = this.MixinClone({ ...this.contactForm, ...regionParams })
              API_SystemSetting.editContactSettings(params).then(() => {
                this.$message.success('修改成功！')
              })
            }
          })
        }
      }
    }
</script>

<style type="text/scss" lang="scss" scoped>
 /deep/ .el-tabs__content{
   overflow: visible;
 }
</style>
