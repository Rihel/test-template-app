import range from 'lodash/range'
import map from 'lodash/map'

//订单类型
export const orderTypeOptions = [
  {value: 'NEW_VEHICLE_ORDER_TYPE', label: '新车订单'},
  {value: 'MAINTAI_AFTER_SALES_ORDER_TYPE', label: '保养订单'},
  {value: 'BOUTIQUE_AFTER_SALES_ORDER_TYPE', label: '精品订单'}
]

export const orderTypeToProductType = {
  NEW_VEHICLE_ORDER_TYPE: 'NEW_CAR',
  MAINTAI_AFTER_SALES_ORDER_TYPE: 'MAINTAIN'
}

//订单状态
export const orderStatusOptions = [
  {value: 'to_be_paid', label: '待支付订金'},
  {value: 'intention_buy', label: '意向下单'},
  {value: 'paid_part', label: '支付部分订金'},
  {value: 'cancelled', label: '已取消'},
  {value: 'paid', label: '已付款'},
  {value: 'installment_commented', label: '已办理金融分期'},
  {value: 'balance_payment_commented', label: '已支付尾款'},
  {value: 'invoice_commented', label: '已开具发票'},
  {value: 'insurance_commented', label: '已办理车险'},
  {value: 'car_cards_commented', label: '已验车上牌'},
  {value: 'boutique_commented', label: '已加装精品'},
  {value: 'car_deliver_commented', label: '车辆交付完成'},
  {value: 'commented', label: '已评价'},
  {value: 'refund_accepted', label: '退款申请通过'},
  {value: 'refund_applied', label: '退款申请中'},
  {value: 'refund_cancelled', label: '取消退款申请'},
  {value: 'refund_rejected', label: '退款申请拒绝'},
  {value: 'refunded', label: '已退款'},
  {value: 'close', label: '已关闭'},
  {value: 'billing_confirm', label: '确认结算'}
]

export const goodsType = {
  NEW_CARS: '新车',
  UNKEEP: '备件',
  BOUTIQUE: '精品',
  SERVICE: '服务',
  INSURANCE: '保险',
  FINANCE: '金融',
  MANHOUR: '工时'
}

//商品类型
export const productType = {
  NEW_CAR: '新车',
  INSURANCE: '保险',
  MAINTAIN: '备件',
  FINANCE: '金融',
  INSTALLMENT: '分期',
  SERVICE: '服务',
  MANHOUR: '工时',
  BOUTIQUE: '精品',
  FREE_BOUTIQUE: '免费精品',
  新车: 'NEW_CAR',
  保险: 'INSURANCE',
  备件: 'MAINTAIN',
  金融: 'FINANCE',
  分期: 'INSTALLMENT',
  服务: 'SERVICE',
  工时: 'MANHOUR',
  精品: 'BOUTIQUE',
  免费精品: 'FREE_BOUTIQUE'
}

export const goodsStatus = {
  on: '上架',
  off: '下架',
  rejected: '驳回',
  passed: '审核通过',
  unaudited: '待审核',
  draft: '草稿',
  canceled: '已取消申请'
}
export const goodsSource = {
  post: '自定义',
  template: '自定义模板',
  head_template: '总部模板'
}

// 字段查询
// saleStatus: on / off
// auditStatus: UNAUDIT / PASSED / REJECTED / DRAFT
export const comboStatus = {
  on: '上架',
  off: '下架',
  REJECTED: '驳回',
  PASSED: '审核通过',
  UNAUDIT: '待审核'
}
export const comboSource = {
  POST: '自定义',
  TEMPLATE: '自定义模板',
  HEAD_TEMPLATE: '总部模板'
}

// 属性管理
export const inputMethods = {
  INPUT: '手工输入',
  SELECT: '选项输入'
}

//车型年款
export const yearOptions = map(range(17), item => {
  // 车型年款选项为未来两年 过去十五年
  const year = new Date().getFullYear() + 2
  return {
    label: `${year - item}年款`,
    value: `${year - item}年款`
  }
})

//预约状态

export const subscribeType = {
  WAITING_STORE: '待到店',
  ALREADY_STORE: '已到店',
  WAITING_MAINTENANCE: '待保养',
  ALREADY_MAINTENANCE: '已保养',
  WAITING_PICK_CAR: '待取车',
  ALREADY_PICK_CAR: '已取车'
}
//证件类型
export const certificateType = {
  1: '身份证',
  2: '护照',
  3: '台胞证',
  4: '军官证',
  5: '回乡证',
  6: '驾驶证',
  7: '行驶证'
}
// 预约类型
export const reservationType = {
  PRODUCT_CONSULTANT_SUBSCRIBE: '产品顾问预约',
  BUSINESS_CONSULTANT_SUBSCRIBE: '商品顾问预约',
  MAINTENANCE_SUBSCRIBE: '保养预约'
}

export const changeTips = {
  PRICE_CONTROL: '已开启价格控制，请维护价格',
  HEAD_TEMPLATE_UPDATE: '总部模板有更新，请设置生效时间',
  UPDATE_UNEFFECTED: '更新待生效',
  UPDATE_EFFECTED: '更新已生效',
  CHANGE_UNAUDITED: '变更待审核',
  CHANGE_UNEFFECTED: '变更待生效',
  CHANGE_REJECTED: '变更被驳回',
  CHANGE_EFFECTED: '变更已生效',
  EFFECTIVE_TIME_PASSED: '生效时间已过，请重新设置',
  CHANGE_OVERWRITTEN: '变更被覆盖',
  PERMISSION_WITHDRAWN: '模板权限已收回请下架',
  DISABLED: '模板权限已收回请下架'
}

export const changeStatus = {
  UPDATE_EFFECTED: '已生效',
  UPDATE_UNEFFECTED: '待生效',
  CHANGE_REJECTED: '变更被驳回',
  CHANGE_UNAUDITED: '变更待审核',
  EFFECTIVE_TIME_PASSED: '生效时间已过'
  // CHANGE_OVERWRITTEN: '变更被覆盖'
}

export const gender = {
  // ocr sex值是中文
  男: '男性',
  女: '女性'
}

export const payType = {
  WEIXIN: '微信',
  UNION_PAY: '银联在线支付',
  UNION_CLOUD_POS: '银联云POS'
}

export const payChannel = {
  101: '微信',
  301: '银联'
}

export const focusGoodsType = {
  item_newcar: '新车',
  item_unkeep: '备件',
  item_boutique: '精品',
  item_service: '服务',
  item_insurance: '保险',
  item_finance: '金融',
  bundle_maintain: '保养套餐'
}

export const productTypeOpts = [
  {value: 'NEW_CAR', label: '新车'},
  {value: 'INSTALLMENT', label: '分期'},
  {value: 'BOUTIQUE', label: '精品'},
  {value: 'FREE_BOUTIQUE', label: '免费精品'},
  {value: 'SERVICE', label: '服务'},
  {value: 'INSURANCE', label: '保险'},
  {value: 'MAINTAIN', label: '保养'},
  {value: 'FREE_MAINTAIN', label: '免费保养'}
]

const Obj2Array = obj =>
  Object.keys(obj).map(k => ({
    label: obj[k],
    value: k
  }))

// 订单状态
export const ORDER_STATUS = {
  0: '待支付',
  1: '待收货',
  2: '已完成'
}

export const ORDER_STATUS_LIST = Obj2Array(ORDER_STATUS)
