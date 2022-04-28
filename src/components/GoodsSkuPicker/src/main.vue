<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="805px">
    <div slot="title" class="goods-picker-title">商品选择器</div>
    <div class="goods-picker-body">
      <div class="goods-picker-search">
        <div class="item-search">
          <span>搜索范围</span>
          <en-category-picker
            @changed="(category) => { params.category_path = category ? category.category_path : '' }"
            :api="categoryApi"
            placeholder="商品分类"
            clearable
          />
          <el-input v-model="params.keyword" :placeholder="'请输入关键字，例如：商品名称'" clearable class="inline-input"/>
          <el-button @click="() => { GET_GoodsList(true) }">搜索</el-button>
        </div>
        <div class="item-search">
          <span>查找商品</span>
          <el-select
            v-model="params.ids"
            multiple
            filterable
            allow-create
            default-first-option
            reserve-keyword
            placeholder="输入商品ID后按回车添加，可添加多个"
            popper-class="params-ids-select-dropdown"
            class="inline-input goods-ids"
            @change="handleGoodsIdsChange"
          ></el-select>
          <el-button @click="handleSearchMultipleGoods">查找</el-button>
        </div>
      </div>
      <div class="goods-picker-content">
        <div class="list">
          <div
            v-for="(goods, index) in goodsList"
            :key="goods.sku_id"
            :class="['goods-item', isSelected(goods) && 'selected']"
          >
            <span class="icon-selected"></span>
            <div class="goods-image">
              <img :src="goods.thumbnail">
            </div>
            <div class="goods-other">
              <div class="goods-name">{{ goods.goods_name }}</div>
              <div class="goods-price">{{ goods.price | formatPrice }}</div>
            </div>
            <div class="goods-mask">
              <a :href="buyerDomain + '/goods/' + goods.goods_id" target="_blank" class="mask-view" title="查看详情"><i></i></a>
              <div class="mask-check" title="选择商品" @click="handleClickItem(goods, index)"><i></i></div>
            </div>
          </div>
          <el-button
            v-if="goodsList.length > 0"
            type="primary"
            size="small"
            :loading="loading"
            @click="handleLoadMore"
            class="load-more"
          >加载更多</el-button>
        </div>
        <div class="selected-list" :id="'goods-picker-selected-' + _uid">
          <transition-group name="slide-fade">
            <div
              v-for="(goods, index) in selectedList"
              v-if="goods"
              :key="goods.sku_id"
              class="goods-item slide-fade-item selected"
            >
              <span class="icon-selected"></span>
              <div class="goods-image">
                <img :src="goods.thumbnail">
              </div>
              <div class="goods-other">
                <div class="goods-name">{{ goods.goods_name }}</div>
                <div class="goods-price">{{ goods.price | formatPrice }}</div>
              </div>
              <div class="goods-mask">
                <a :href="buyerDomain + '/goods/' + goods.goods_id" target="_blank" class="mask-view" title="查看详情"><i></i></a>
                <div class="mask-check" title="取消选择商品" @click="handleRemoveItem(goods, index)"><i></i></div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div slot="footer" class="goods-picker-footer">
      <div class="upload-status-num">
        最多可选个数：<span>{{ limit < 1 ? '无限制' : limit }}</span>
        已选个数：<span>{{ selectedNum }}</span>
        还可选个数：<span>{{ limit < 1 ? '无限制' : limit - selectedNum }}</span>
      </div>
      <span>
        <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: 'EnGoodsSkuPicker',
    mixins: [mixin]
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "./styles";
</style>
<style type="text/scss" lang="scss">
  .params-ids-select-dropdown {
    display: none !important;
  }
</style>
