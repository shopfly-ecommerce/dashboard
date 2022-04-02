<template>
  <el-form :model="pointForm" :rules="pointRules" ref="pointForm" label-width="210px" label-position="left" style="width: 400px;min-height: 500px;">
    <!--成功注册-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.register">完成注册</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.register_grade_point">
        <template slot="append">等级积分</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.register_consumer_point">
        <template slot="append">消费积分</template>
      </el-input>
    </el-form-item>
    <!--完善个人资料-->
    <!--<el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.perfect">完善个人资料</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.perfect_consumer_point">
        <template slot="append">等级积分</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.perfect_grade_point">
        <template slot="append">消费积分</template>
      </el-input>
    </el-form-item>-->
    <!--登录（一天一次有效）-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.login">登录（一天一次有效）</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.login_grade_point">
        <template slot="append">等级积分</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.login_consumer_point">
        <template slot="append">消费积分</template>
      </el-input>
    </el-form-item>
    <!--文字评论-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.comment">文字评论</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.comment_grade_point">
        <template slot="append">等级积分</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.comment_consumer_point">
        <template slot="append">消费积分</template>
      </el-input>
    </el-form-item>
    <!--上传图片评论-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.comment_img">上传图片评论</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.comment_img_grade_point">
        <template slot="append">等级积分</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.comment_img_consumer_point">
        <template slot="append">消费积分</template>
      </el-input>
    </el-form-item>
    <!--每个商品首次评论-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.first_comment">每个商品首次评论</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.first_comment_grade_point">
        <template slot="append">等级积分</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.first_comment_consumer_point">
        <template slot="append">消费积分</template>
      </el-input>
    </el-form-item>
    <!--购买商品（1元等于多少积分）-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.buy_goods">购买商品（1元等于多少积分）</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.buy_goods_grade_point">
        <template slot="append">等级积分</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.buy_goods_consumer_point">
        <template slot="append">消费积分</template>
      </el-input>
    </el-form-item>
    <!--选择网上支付-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.online_pay">选择网上支付</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.online_pay_grade_point">
        <template slot="append">等级积分</template>
      </el-input>
      <el-input placeholder="10" size="small" v-model="pointForm.online_pay_consumer_point">
        <template slot="append">消费积分</template>
      </el-input>
    </el-form-item>
    <!--人民币与积分兑换比例-->
    <el-form-item prop="cancel_order_day">
      <template slot="label">
        <el-checkbox v-model="pointForm.parities">人民币与积分兑换比例</el-checkbox>
      </template>
      <el-input placeholder="10" size="small" v-model="pointForm.parities_point">
        <template slot="append">消费积分</template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSavePoint">保存设置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as API_SystemSetting from '@/api/systemSetting'

  export default {
    name: 'systemSettingsPoint',
    data() {
      return {
        /** 积分设置 */
        pointForm: {},
        pointRules: {},
        checkboxs: ['buy_goods', 'comment', 'comment_img', 'first_comment', 'login', 'online_pay', 'parities', 'perfect', 'perfect', 'register']
      }
    },
    mounted() {
      /** 获取积分设置 */
      API_SystemSetting.getPointSetting().then(response => {
        this.checkboxs.forEach(key => {
          response[key] = !!response[key]
        })
        this.pointForm = response
      })
    },
    methods: {
      /** 保存积分设置修改 */
      handleSavePoint() {
        const params = this.MixinClone(this.pointForm)
        this.checkboxs.forEach(key => {
          params[key] = params[key] ? 1 : 0
        })
        API_SystemSetting.editPointSetting(params).then(() => {
          this.$message.success('保存成功！')
        })
      }
    }
  }
</script>
