<template>
  <el-form :model="pointForm" :rules="pointRules" ref="pointForm" label-width="210px" label-position="left" style="width: 400px;min-height: 500px;">
    <!--Successful registration-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.register">Register</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.register_grade_point">
        <template slot="append">Level score</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.register_consumer_point">
        <template slot="append">consumption score</template>
      </el-input>
    </el-form-item>
    <!--Improve personal data-->
    <!--<el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.perfect">Improve personal data</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.perfect_consumer_point">
        <template slot="append">Level score</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.perfect_grade_point">
        <template slot="append">consumption score</template>
      </el-input>
    </el-form-item>-->
    <!--Sign in（Once a day）-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.login">Sign in（Once a day）</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.login_grade_point">
        <template slot="append">Level score</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.login_consumer_point">
        <template slot="append">consumption score</template>
      </el-input>
    </el-form-item>
    <!--Text comments-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.comment">Text comments</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.comment_grade_point">
        <template slot="append">Level score</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.comment_consumer_point">
        <template slot="append">consumption score</template>
      </el-input>
    </el-form-item>
    <!--Upload photo comments-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.comment_img">Upload photo comments</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.comment_img_grade_point">
        <template slot="append">Level score</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.comment_img_consumer_point">
        <template slot="append">consumption score</template>
      </el-input>
    </el-form-item>
    <!--First comments-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.first_comment">First comments</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.first_comment_grade_point">
        <template slot="append">Level score</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.first_comment_consumer_point">
        <template slot="append">consumption score</template>
      </el-input>
    </el-form-item>
    <!--The purchase of goods（1How many integrals are you going to get）-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.buy_goods">The purchase of goods</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.buy_goods_grade_point">
        <template slot="append">Level score</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.buy_goods_consumer_point">
        <template slot="append">consumption score</template>
      </el-input>
    </el-form-item>
    <!--Choose Online Payment-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.online_pay">Choose Online Payment</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.online_pay_grade_point">
        <template slot="append">Level score</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.online_pay_consumer_point">
        <template slot="append">consumption score</template>
      </el-input>
    </el-form-item>
    <!--RMB to points exchange ratio-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.parities">Conversion ratio</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.parities_point">
        <template slot="append">consumption score</template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSavePoint">Save Settings</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as API_SystemSetting from '@/api/systemSetting'

  export default {
    name: 'systemSettingsPoint',
    data() {
      return {
        /** Integral*/
        pointForm: {},
        pointRules: {},
        checkboxs: ['buy_goods', 'comment', 'comment_img', 'first_comment', 'login', 'online_pay', 'parities', 'perfect', 'perfect', 'register']
      }
    },
    mounted() {
      /** Get the integral setting*/
      API_SystemSetting.getPointSetting().then(response => {
        this.checkboxs.forEach(key => {
          response[key] = !!response[key]
        })
        this.pointForm = response
      })
    },
    methods: {
      /** Save the integral Settings changes*/
      handleSavePoint() {
        const params = this.MixinClone(this.pointForm)
        this.checkboxs.forEach(key => {
          params[key] = params[key] ? 1 : 0
        })
        API_SystemSetting.editPointSetting(params).then(() => {
          this.$message.success('Save success！')
        })
      }
    }
  }
</script>
