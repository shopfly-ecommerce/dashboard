<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="805px">
    <div slot="title" class="goods-picker-title">Commodity selector</div>
    <div class="goods-picker-body">
      <div class="goods-picker-search">
        <div class="item-search">
          <span>A search scope</span>
          <en-category-picker
            @changed="(category) => { params.category_path = category ? category.category_path : '' }"
            :api="categoryApi"
            placeholder="Category"
            clearable
          />
          <el-input v-model="params.keyword" :placeholder="'Please enter a keyword, for example：Name'" clearable class="inline-input"/>
          <el-button @click="() => { GET_GoodsList(true) }">search</el-button>
        </div>
        <div class="item-search">
          <span>To find the goods</span>
          <el-select
            v-model="params.ids"
            multiple
            filterable
            allow-create
            default-first-option
            reserve-keyword
            placeholder="Input the commodityIDPress Enter to add more"
            popper-class="params-ids-select-dropdown"
            class="inline-input goods-ids"
            @change="handleGoodsIdsChange"
          ></el-select>
          <el-button @click="handleSearchMultipleGoods">To find the</el-button>
        </div>
      </div>
      <div class="goods-picker-content">
        <div class="list">
          <div
            v-for="(goods, index) in goodsList"
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
              <a :href="buyerDomain + '/goods/' + goods.goods_id" target="_blank" class="mask-view" title="Check the details"><i></i></a>
              <div class="mask-check" title="Choose goods" @click="handleClickItem(goods, index)"><i></i></div>
            </div>
          </div>
          <el-button
            v-if="goodsList.length > 0"
            type="primary"
            size="small"
            :loading="loading"
            @click="handleLoadMore"
            class="load-more"
          >To load more</el-button>
        </div>
        <div class="selected-list" :id="'goods-picker-selected-' + _uid">
          <transition-group name="slide-fade">
            <div
              v-for="(goods, index) in selectedList"
              v-if="goods"
              :key="index"
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
                <a :href="buyerDomain + '/goods/' + goods.goods_id" target="_blank" class="mask-view" title="Check the details"><i></i></a>
                <div class="mask-check" title="Deselect merchandise" @click="handleRemoveItem(goods, index)"><i></i></div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div slot="footer" class="goods-picker-footer">
      <div class="upload-status-num">
        Maximum number of choices：<span>{{ limit < 1 ? 'unlimited' : limit }}</span>
        The number of the selected：<span>{{ selectedNum }}</span>
        Also optional number：<span>{{ limit < 1 ? 'unlimited' : limit - selectedNum }}</span>
      </div>
      <span>
        <el-button @click="dialogVisible = false">cancel</el-button>
      <el-button type="primary" @click="handleConfirm">save</el-button>
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
