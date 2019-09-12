import {goodsType, goodsStatus} from '@/const/config'
import {Object2Options, getGoodsOnOffStatus} from '@/const/filter'

export const goodsListColumns = [
  {
    prop: 'name',
    label: '商品名称',
    'show-overflow-tooltip': true
  },
  {
    prop: 'shopName',
    label: '门店'
  },
  {
    prop: 'catalogName',
    label: '后台类目'
  },
  {
    prop: 'type',
    label: '商品类型'
  },
  {
    prop: 'status',
    label: '状态',
    formatter: row => {
      let onAndOff = getGoodsOnOffStatus(row)

      if (!onAndOff) {
        // 不存在上/下架商品
        return goodsStatus[row.status]
      } else {
        return onAndOff
      }
    }
  }
]

export const searchForm = [
  {
    $el: {
      placeholder: '请输入'
    },
    label: '商品名称',
    $id: 'name',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请选择'
    },
    label: '商品状态',
    $id: 'status',
    $type: 'select',
    $options: Object2Options(goodsStatus)
  }
]
