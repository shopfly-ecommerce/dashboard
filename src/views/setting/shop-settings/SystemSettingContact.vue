<template>
    <el-form :model="contactForm" label-width="130px" style="width: 500px;min-height: 500px;" :rules="contactRules" ref="contactForm">
      <el-form-item label="Mobile phone" prop="phone">
        <el-input v-model="contactForm.phone" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item v-if="!MixinIsIM" label="QQ" prop="qq">
        <el-input v-model="contactForm.qq" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model="contactForm.email" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="address" class="form-item-region" prop="region">
        <en-region-picker :api="MixinRegionApi" :default="defaultRegion" @changed="(object) => { contactForm.region = object.last_id; regionObj = object }"/>
      </el-form-item>
      <el-form-item label="Detailed address" prop="address">
        <el-input v-model="contactForm.address" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="submitEditGoodsSetting('contactForm')">Save Settings</el-button>
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
          // Contact form
          contactForm: {},
          regionObj: {},
          // Rules of the form
          contactRules: {
            phone: [
              this.MixinRequired('Please enter your cell phone number！'),
              {
                validator: (rule, value, callback) => {
                  if (!RegExp.mobile.test(value)) {
                    callback(new Error('Incorrect phone format！'))
                  } else {
                    callback()
                  }
                }
              }
            ],
            email: [
              this.MixinRequired('Please enter email address！'),
              {
                validator: (rule, value, callback) => {
                  if (value !== 0 && !value) {
                    callback()
                  } else if (!RegExp.email.test(value)) {
                    callback(new Error('The mailbox format is incorrect！'))
                  } else {
                    callback()
                  }
                }
              }
            ],
            qq: this.MixinIsIM ? [] : [this.MixinRequired('Please enter theQQ！')],
            region: [this.MixinRequired('Please enter address！')],
            address: [this.MixinRequired('Please enter the detailed address！')]
          },
          // Locale ID array
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
                this.$message.success('Modify the success！')
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
