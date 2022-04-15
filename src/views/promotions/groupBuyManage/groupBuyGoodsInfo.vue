<template>
  <div v-if="form" class="container">
    <el-form :model="form" label-width="100px">
      <el-form-item label="Group-buying activities">
        <span>{{ form.title }}</span>
      </el-form-item>
      <el-form-item label="The activity time">
        <span>{{ form.start_time | unixToDate }} - {{ form.end_time | unixToDate }}</span>
      </el-form-item>
      <el-form-item label="Group name">
        <span>{{ form.gb_name }}</span>
      </el-form-item>
      <el-form-item label="Group-buying title">
        <span>{{ form.gb_title }}</span>
      </el-form-item>
      <el-form-item label="Name">
        <span>{{ form.goods_name }}</span>
      </el-form-item>
      <el-form-item label="Price">
        <span>{{ form.original_price | unitPrice("￥") }}</span>
      </el-form-item>
      <el-form-item label="inventory">
        <span>{{ form.goods_num }}</span>
      </el-form-item>
      <el-form-item label="Group purchase price">
        <span>{{ form.price | unitPrice('¥') }}</span>
      </el-form-item>
      <el-form-item label="A bulk quantity">
        <span>{{ form.goods_num }}</span>
      </el-form-item>
      <el-form-item label="Group photo">
        <img :src="form.img_url" :alt="form.goods_name" class="goods-image">
      </el-form-item>
      <el-form-item label="Number of virtual">
        <span>{{ form.visual_num }}</span>
      </el-form-item>
      <el-form-item label="The amount for purchasing">
        <span>{{ form.limit_num }}</span>
      </el-form-item>
      <el-form-item label="Group classification">
        <el-select disabled v-model="form.cat_id" placeholder="Please select">
          <el-option label="There is no limit" :value="0"/>
          <el-option
            v-for="item in options"
            :key="item.cat_id"
            :label="item.cat_name"
            :value="item.cat_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Group-buying is introduced">
        <div v-html="form.remark"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as API_Promotion from '@/api/groupBuy'

  export default {
    name: 'groupBuyGoodsInfo',
    data() {
      return {
        gb_id: this.$route.params.id,
        form: '',
        options: []
      }
    },
    mounted() {
      API_Promotion.getGroupBuyGoodsDetail(this.gb_id).then(response => {
        this.form = response
      })
      API_Promotion.getGroupBuyCategory({ page_size: 9999 }).then(response => {
        this.options = response.data
      })
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    background-color: #fff;
    padding: 10px;
    .goods-image {
      width: 100px;
      height: 100px;
    }
  }
</style>
