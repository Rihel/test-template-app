<template>
  <div class="order-list">
    <el-card>
      <el-data-table
        ref="dataTable"
        :url="url"
        :columns="columns"
        totalPath="payload.total"
        dataPath="payload.list"
        :hasNew="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasOperation="true"
        :isTree="false"
        :hasPagination="true"
        :extraButtons="extraButtons"
        :searchForm="searchForm"
      >
      </el-data-table>
    </el-card>
  </div>
</template>

<script>
import {productType, ORDER_STATUS, ORDER_STATUS_LIST} from '@/const/config'
import {formatDate, price} from '@/const/filter'
import {orderList} from '@/const/api'
import {ORDER_DETAIL} from '@/const/path'

export default {
  name: 'order-list',
  data() {
    return {
      url: orderList,
      columns: [
        {
          prop: 'id',
          label: '订单号',
          minWidth: 100
        },
        {
          prop: 'memberName',
          label: '姓名'
        },
        {
          prop: 'memberPhone',
          label: '手机号',
          minWidth: 100
        },
        {
          prop: 'productName',
          label: '商品名'
        },
        {
          prop: 'payMoney',
          label: '支付金额',
          formatter: row => `￥${price(row.payMoney || 0)}`,
          minWidth: 120
        },
        {
          prop: 'status',
          label: '订单状态',
          minWidth: 120,
          formatter: row => ORDER_STATUS[row.status]
        },
        {
          prop: 'createdAt',
          label: '下单时间',
          minWidth: 120,
          formatter: row => formatDate(row.createdAt)
        }
      ],
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          atClick: row => {
            this.$router.push(ORDER_DETAIL(row.id))
            return false
          }
        }
      ],
      searchForm: [
        {
          $el: {placeholder: '请输入姓名'},
          label: '姓名',
          $id: 'memberName',
          $type: 'input'
        },
        {
          $el: {placeholder: '请输入手机号'},
          label: '手机号',
          $id: 'memberPhone',
          $type: 'input'
        },
        {
          $el: {placeholder: '请输入订单号'},
          label: '订单号',
          $id: 'id',
          $type: 'input'
        },
        {
          $el: {placeholder: '请选择订单状态'},
          label: '订单状态',
          $id: 'status',
          $type: 'select',
          $options: ORDER_STATUS_LIST
        }
      ]
    }
  }
}
</script>
