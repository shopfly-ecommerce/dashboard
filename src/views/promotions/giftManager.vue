<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button type="primary" @click="handelAddGifts">new</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" />
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="gift_name" label="Name of gift" />
        <el-table-column label="Gifts pictures" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.gift_img" class="goods-image" alt="">
          </template>
        </el-table-column>
        <el-table-column  label="Present price" width="120">
          <template slot-scope="scope">
            {{ scope.row.gift_price | unitPrice('￥') }}
          </template>
        </el-table-column>
        <el-table-column prop="actual_store" label="The actual inventory" width="120"/>
        <el-table-column prop="enable_store" label="Available" width="120"/>
        <el-table-column label="Last update" width="150">
          <template slot-scope="scope">
            {{ scope.row.create_time | unixToDate }}
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="180">
          <template slot-scope="scope">
            <el-button
              type="success"
              @click="handleEditGifts(scope.row)">edit
            </el-button>
            <el-button
              type="danger"
              @click="handleDeleteGifts(scope.row)">delete
            </el-button>
          </template>
        </el-table-column>
      </template>

      <el-pagination
        slot="pagination"
        v-if="pageData"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
        :current-page="pageData.page_no"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageData.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.data_total">
      </el-pagination>
    </en-table-layout>
    <add-gift
      :currentGiftId="currentGiftId"
      :giftModelShow="giftModelShow"
      @saveGift="saveGift"/>
  </div>
</template>

<script>
  import * as API_Gift from '@/api/gift'
  import { CategoryPicker } from '@/components'
  import { AddGift } from './components'

  export default {
    name: 'giftManager',
    components: {
      [CategoryPicker.name]: CategoryPicker,
      [AddGift.name]: AddGift
    },
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** Giveaway cartridge display*/
        giftModelShow: false,

        /** Giveaway editing form*/
        giftForm: {

          /** Name of gift*/
          gift_name: '',

          /** Gifts pictures*/
          gift_img: '',

          /** Present price*/
          gift_price: 2,

          /** The actual inventory*/
          actual_store: 8,

          /** Available*/
          enable_store: 2,

          /** Last update*/
          create_time: ''
        },

        /** The list of data*/
        tableData: null,

        /** List paging data*/
        pageData: null,

        /** The current giftid */
        currentGiftId: ''
      }
    },
    mounted() {
      this.GET_GiftsList()
    },
    methods: {

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_GiftsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_GiftsList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        this.GET_GiftsList()
      },

      /** Get a list of freebies*/
      GET_GiftsList() {
        this.loading = true
        API_Gift.getGiftsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
        })
      },

      /** Delete the gifts*/
      handleDeleteGifts(row) {
        this.$confirm('Confirm to delete this gift, Whether or not to continue?', 'prompt', { type: 'warning' }).then(() => {
          API_Gift.deleteGifts(row.gift_id).then(() => {
            this.GET_GiftsList()
            this.$message.success('Delete gift successfully！')
          })
        })
      },

      /** edit*/
      handleEditGifts(row) {
        this.giftModelShow = true
        this.currentGiftId = row.gift_id
      },

      /** New gift*/
      handelAddGifts() {
        this.giftModelShow = true
        this.currentGiftId = ''
      },

      /** Save the result*/
      saveGift(target) {
        this.giftModelShow = false
        this.currentGiftId = ''
        target && this.GET_GiftsList()
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

  /deep/ div.toolbar {
    height: 70px;
    padding: 20px 0;
  }

  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .toolbar-btns {

  }

  .toolbar-search {
    margin-right: 10px;
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>

