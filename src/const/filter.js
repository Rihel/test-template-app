import dayjs from 'dayjs'

export function formatDate(time, format = 'YYYY-MM-DD HH:mm') {
  if (!time) {
    return ''
  }
  return dayjs(time).format(format)
}

export function options2Object(options = []) {
  return options.reduce((prev, curr) => {
    prev[curr.value] = curr.label
    return prev
  }, {})
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
export function price(val) {
  if (!val) return 0.0
  let USPrice = Number.parseFloat(val).toLocaleString('en-US')

  // 完全是整数, 需要添加小数点
  if (USPrice.toString().indexOf('.') === -1) USPrice += '.00'

  return USPrice
}

//用于将value转为option对应的label
export function toOptionsLabel(value, options) {
  const config = options2Object(options)
  return config[value] || value
}

// 将object{a:'hi'} 转为 array [{label: 'hi', value: a}]
export function Object2Options(object = {}, label = 'key') {
  return Object.keys(object).reduce((arr, key) => {
    if (label === 'key') {
      arr.push({
        label: object[key],
        value: key
      })
    } else {
      arr.push({
        label: key,
        value: object[key]
      })
    }

    return arr
  }, [])
}

// 商品上下架 前端展示逻辑
export const getGoodsOnOffStatus = ({
  allCount,
  offStatusSkuCount,
  onStatusSkuCount
}) => {
  if (onStatusSkuCount > 0) {
    return '上架'
  }
  if (offStatusSkuCount === allCount) {
    return '下架'
  }

  return ''
}

// 套餐上下架，前端展示逻辑
export const getComboOnOffStatus = row => {
  const saleStatus = {
    on: '上架',
    off: '下架'
  }
  return saleStatus[row.saleStatus] || false
}
