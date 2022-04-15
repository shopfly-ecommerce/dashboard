<template>
  <div>
    <en-table-layout
      pagination
      :tableData="tableData"
      :loading="loading">
      <template slot="table-columns">
        <!--The date of-->
        <el-table-column label="The date of">
          <template slot-scope="scope">{{ scope.row.add_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
        </el-table-column>
        <!--Member name-->
        <el-table-column prop="member_name" label="Member name"/>
        <!--Order no.-->
        <el-table-column prop="order_sn" label="Order no."/>
        <!--The invoice amount-->
        <el-table-column label="The invoice amount">
          <template slot-scope="scope">{{ scope.row.receipt_amount | unitPrice('￥') }}</template>
        </el-table-column>
        <!--Invoice category-->
        <el-table-column prop="receipt_type" label="Invoice type"/>
        <!--Operation-->
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleOperateReceipt(scope.row)">To view
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
    <el-dialog title="Details on the invoice" center :visible.sync="dialogReceiptVisible" width="550px">
      <div v-for="item in viewRectiptData" class="item-receipt">
        <span >{{ item.label }}:</span>
        <en-table-layout v-if="item.key === 'sku_list'" :tableData="goodsList">
          <template slot="table-columns">
            <el-table-column label="Name">
              <template slot-scope="scope">
                <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.name }}</a>
              </template>
            </el-table-column>
            <el-table-column label="Price" width="80">
              <template slot-scope="scope"> {{ scope.row.original_price | unitPrice('￥') }}</template>
            </el-table-column>
            <el-table-column  prop="num" label="Quantity" width="50"/>
          </template>
        </en-table-layout>
        <span v-else class="item-receipt-value">{{ item.value || 'There is no' }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Receipt from '@/api/receipt'
  export default {
    name: 'receiptHistory',
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: [],

        /** The invoice data currently being viewed*/
        viewRectiptData: [],

        /** The list of items associated with the current invoice*/
        goodsList: [],

        /** View invoice detailsdialog */
        dialogReceiptVisible: false
      }
    },
    mounted() {
      this.GET_ReceiptHistory()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ReceiptHistory()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ReceiptHistory()
      },

      /** Check the invoice*/
      handleOperateReceipt(row) {
        API_Receipt.getHistoryReceiptDetail(row.history_id).then(response => {
          const keys = [
            { label: 'The invoice looked up', key: 'receipt_title' },
            { label: 'Invoice type', key: 'receipt_type' },
            { label: 'The invoice id number', key: 'tax_no' },
            { label: 'Bill-to address', key: 'receipt_addr' },
            { label: 'The invoice content', key: 'receipt_content' },
            { label: 'The invoice details', key: 'sku_list' }
          ]
          this.viewRectiptData = keys.map(item => {
            if (item.key === 'receipt_addr') {
              item.value = (response['ship_province'] || '') + (response['ship_city'] || '') + (response['ship_county'] || '') +
                (response['ship_town'] || '') + (response['ship_addr'] || '')
            } else {
              item.value = response[item.key]
            }
            return item
          })
          this.goodsList = response.sku_list
          this.dialogReceiptVisible = true
        })
      },

      /** Obtain invoice history*/
      GET_ReceiptHistory() {
        this.loading = true
        API_Receipt.getHistoryReceiptList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ div.toolbar {
    display: none;
  }

  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .item-receipt {
    padding: 10px;
    .item-receipt-label {
      display: inline-block;
    }

    .item-receipt-value {
      display: inline-block;
      margin-left: 20px;
    }
  }
</style>
