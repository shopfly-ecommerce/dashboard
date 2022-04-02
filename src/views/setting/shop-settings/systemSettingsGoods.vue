<template>
  <el-form :model="goodsForm" :rules="goodsRules" ref="goodsForm" label-width="130px" style="width: 350px;min-height: 500px;">
    <el-form-item
      label="库存预警数"
      prop="goods_warning_count"
      :rules="[
          { required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', message: '库存预警数必须为数字值', trigger: 'blur' }
        ]">
      <el-input-number v-model="goodsForm.goods_warning_count" controls-position="right" :min="0" :max="99999"/>
    </el-form-item>
    <el-form-item label="缩略图尺寸">
      <el-input placeholder="100" size="small" v-model="goodsForm.thumbnail_width">
        <template slot="prepend">宽</template>
        <template slot="append">px</template>
      </el-input>
      <el-input placeholder="100" size="small" v-model="goodsForm.thumbnail_height">
        <template slot="prepend">高</template>
        <template slot="append">px</template>
      </el-input>
    </el-form-item>
    <el-form-item label="小图尺寸" prop="cancel_order_day">
      <el-input placeholder="400" size="small" v-model="goodsForm.small_width">
        <template slot="prepend">宽</template>
        <template slot="append">px</template>
      </el-input>
      <el-input placeholder="400" size="small" v-model="goodsForm.small_height">
        <template slot="prepend">高</template>
        <template slot="append">px</template>
      </el-input>
    </el-form-item>
    <el-form-item label="大图尺寸" prop="cancel_order_day">
      <el-input placeholder="800" size="small" v-model="goodsForm.big_width">
        <template slot="prepend">宽</template>
        <template slot="append">px</template>
      </el-input>
      <el-input placeholder="800" size="small" v-model="goodsForm.big_height">
        <template slot="prepend">高</template>
        <template slot="append">px</template>
      </el-input>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="submitEditGoodsSetting">保存设置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as API_Goods from '@/api/goods'

  export default {
    name: 'systemSettingsGoods',
    data() {
      return {
        // 商品设置
        goodsForm: {
          marcket_auth: 1,
          update_auth: 1,
          thumbnail_width: 100,
          thumbnail_height: 100,
          small_width: 400,
          small_height: 400,
          big_width: 800,
          big_height: 800,
          goods_warning_count: 0
        },
        goodsRules: {}
      }
    },
    mounted() {
      API_Goods.getGoodsSettings().then(response => {
        Object.keys(this.goodsForm).forEach(key => {
          this.goodsForm[key] = response[key]
        })
      })
    },
    methods: {
      submitEditGoodsSetting() {
        API_Goods.editGoodsSettings(this.goodsForm).then(() => {
          this.$message.success('修改成功！')
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .image-pane .el-input-group {
    width: 200px;
  }
  .point-pane .el-input-group {
    width: 200px;
  }
</style>
