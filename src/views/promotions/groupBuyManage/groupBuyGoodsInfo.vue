<template>
  <div v-if="form" class="container">
    <el-form :model="form" label-width="100px">
      <el-form-item label="团购活动">
        <span>{{ form.title }}</span>
      </el-form-item>
      <el-form-item label="活动时间">
        <span>{{ form.start_time | unixToDate }} - {{ form.end_time | unixToDate }}</span>
      </el-form-item>
      <el-form-item label="团购名称">
        <span>{{ form.gb_name }}</span>
      </el-form-item>
      <el-form-item label="团购标题">
        <span>{{ form.gb_title }}</span>
      </el-form-item>
      <el-form-item label="商品名称">
        <span>{{ form.goods_name }}</span>
      </el-form-item>
      <el-form-item label="商品价格">
        <span>{{ form.original_price | unitPrice("￥") }}</span>
      </el-form-item>
      <el-form-item label="商品库存">
        <span>{{ form.goods_num }}</span>
      </el-form-item>
      <el-form-item label="团购价格">
        <span>{{ form.price | unitPrice('¥') }}</span>
      </el-form-item>
      <el-form-item label="团购数量">
        <span>{{ form.goods_num }}</span>
      </el-form-item>
      <el-form-item label="团购图片">
        <img :src="form.img_url" :alt="form.goods_name" class="goods-image">
      </el-form-item>
      <el-form-item label="虚拟数量">
        <span>{{ form.visual_num }}</span>
      </el-form-item>
      <el-form-item label="限购数量">
        <span>{{ form.limit_num }}</span>
      </el-form-item>
      <el-form-item label="团购分类">
        <el-select disabled v-model="form.cat_id" placeholder="请选择">
          <el-option label="不限" :value="0"/>
          <el-option
            v-for="item in options"
            :key="item.cat_id"
            :label="item.cat_name"
            :value="item.cat_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团购介绍">
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
