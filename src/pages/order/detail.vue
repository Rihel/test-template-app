<template>
  <div class="order-detail" v-loading="loading">
    <go-back></go-back>

    <el-card class="border-0">
      <div slot="header">
        <h2>订单详情</h2>
      </div>
      <card-table header="订单信息">
        <table-info :table="orderInfoTable"></table-info>
      </card-table>

      <div class="tab-container">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="保险信息" name="1">
            <table-info
              v-if="insuranceInfoTable && insuranceInfoTable.length"
              :table="insuranceInfoTable"
            ></table-info>
            <div class="text-center" v-else>
              <p class="empty">暂无数据</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="服务信息" name="2">
            <table-info
              :table="serviceInfoTable"
              v-if="serviceInfoTable && serviceInfoTable.length"
            ></table-info>
            <div class="text-center" v-else>
              <p class="empty">暂无数据</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import CardTable from '@/components/card-table'
import TableInfo from '@/components/table-info'
import {orderDetail} from '@/const/api'
import {formatDate, Object2Options, toOptionsLabel, price} from '@/const/filter'
import {orderStatusOptions, orderTypeOptions, productType} from '@/const/config'
import zipObject from 'lodash/zipObject'
import zipWith from 'lodash/zipWith'
import split from 'lodash/split'
import {Rate, Tag} from 'element-ui'

export default {
  name: 'order-detail',
  components: {
    CardTable,
    TableInfo,
    'el-rate': Rate,
    'el-tag': Tag
  },
  data() {
    return {
      activeTab: '1',
      detail: {
        //订单详情
        images: []
      },
      loading: false
    }
  },
  methods: {
    getOrderDetail() {
      this.loading = true

      this.$axios
        .$get(`${orderDetail(this.orderId)}`)
        .then(result => {
          this.loading = false
          this.detail = result.payload
        })
        .catch(e => {
          this.loading = false
        })
    },
    formatDate,
    price
  },
  computed: {
    orderId() {
      return this.$route.query.orderId
    },
    products() {
      //商品，多个，是个数组
      return this.detail.outDtoTradeOrderLines || []
    },
    insurance() {
      //保险
      return (
        this.products.find(item => item.productType === productType['保险']) ||
        {}
      )
    },
    service() {
      //服务
      return (
        this.products.find(item => item.productType === productType['服务']) ||
        {}
      )
    },
    trade() {
      //物流，是个对象
      return this.detail.outDtoTradeOrder || {}
    },
    orderInfoTable() {
      //订单信息
      //Todo:订金,客户类型,订单状态
      const {
        id,
        createdAt,
        memberName,
        memberType,
        memberPhone,
        orderType,
        shopName,
        remark,
        status,
        payMoney = '',
        maxDeposit = '',
        isReplace
      } = this.trade
      const data = {
        订单类型: toOptionsLabel(orderType, orderTypeOptions),
        创建时间: formatDate(createdAt),
        订单号: id,
        客户姓名: memberName,
        手机号: memberPhone,
        门店: shopName,
        订单金额: price(payMoney),
        订金: price(maxDeposit),
        订单状态: toOptionsLabel(status, orderStatusOptions),
        旧车置换: isReplace ? '是' : '否'
      }
      return Object2Options(data, 'value')
    },
    insuranceInfoTable() {
      //保险信息
      const insuranceInfo = this.insurance || {}

      const {
        itemName,
        propNames,
        propValues,
        itemMoney = '',
        responsiblePeopleName
      } = insuranceInfo

      const props = zipWith(
        split(propNames, ','),
        split(propValues, ','),
        function(a, b) {
          return `${a}:${b}`
        }
      )

      const data = {
        商品名称: itemName,
        套餐内容: props.join(';'),
        商品金额: price(itemMoney),
        承保顾问: responsiblePeopleName
      }
      return !!insuranceInfo.itemName ? Object2Options(data, 'value') : []
    },
    serviceInfoTable() {
      //服务信息
      // 拼接套餐内容
      let content = ''
      this.service.lines &&
        this.service.lines.forEach(i => {
          content += i.propValues + ' '
        })

      const data = {
        商品名称: this.service.bundleName,
        套餐内容: content,
        商品金额: price(this.service.bundlePrice),
        验车专员: this.service.responsiblePeopleName
      }
      return !!this.service.bundleName ? Object2Options(data, 'value') : []
    }
  },
  mounted() {
    this.getOrderDetail()
  }
}
</script>

<style lang="less">
.order-detail {
  .car-info {
    display: flex;
    width: 100%;

    .table {
      flex: 1;
    }
  }

  .tab-container {
    margin-top: 30px;
    min-height: 300px;

    .empty {
      color: #909399;
      padding: 20px;
    }
  }

  .mb-1 {
    margin-bottom: 10px;
  }

  .mb-2 {
    margin-bottom: 20px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>
