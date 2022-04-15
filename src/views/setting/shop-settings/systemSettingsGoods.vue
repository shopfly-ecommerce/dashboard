<template>
  <el-form :model="goodsForm" :rules="goodsRules" ref="goodsForm" label-width="130px" style="width: 350px;min-height: 500px;">
    <el-form-item
      label="Inventory warning number"
      prop="goods_warning_count"
      :rules="[
          { required: true, message: 'The quantity cannot be empty', trigger: 'blur' },
          { type: 'number', message: 'The inventory warning number must be a numeric value', trigger: 'blur' }
        ]">
      <el-input-number v-model="goodsForm.goods_warning_count" controls-position="right" :min="0" :max="99999"/>
    </el-form-item>
    <el-form-item label="Thumbnail size">
      <el-input placeholder="100" size="small" v-model="goodsForm.thumbnail_width">
        <template slot="prepend">wide</template>
        <template slot="append">px</template>
      </el-input>
      <el-input placeholder="100" size="small" v-model="goodsForm.thumbnail_height">
        <template slot="prepend">high</template>
        <template slot="append">px</template>
      </el-input>
    </el-form-item>
    <el-form-item label="Large size" prop="cancel_order_day">
      <el-input placeholder="400" size="small" v-model="goodsForm.small_width">
        <template slot="prepend">wide</template>
        <template slot="append">px</template>
      </el-input>
      <el-input placeholder="400" size="small" v-model="goodsForm.small_height">
        <template slot="prepend">high</template>
        <template slot="append">px</template>
      </el-input>
    </el-form-item>
    <el-form-item label="A larger size" prop="cancel_order_day">
      <el-input placeholder="800" size="small" v-model="goodsForm.big_width">
        <template slot="prepend">wide</template>
        <template slot="append">px</template>
      </el-input>
      <el-input placeholder="800" size="small" v-model="goodsForm.big_height">
        <template slot="prepend">high</template>
        <template slot="append">px</template>
      </el-input>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="submitEditGoodsSetting">Save Settings</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as API_Goods from '@/api/goods'

  export default {
    name: 'systemSettingsGoods',
    data() {
      return {
        // Goods set
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
          this.$message.success('Modify the success！')
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
