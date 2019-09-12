// 缓存处理结果
let routerTree = null

const BASE_PAGE = [
  {
    name: '首页',
    url: '/'
  }
]

/**
 * 将menuList处理成 path: [menuItem] 的形式
 *
 * @param {Array} 菜单数组
 * @param {Array} 父级的数据
 * @param {Boolean} 是否清空父级数据
 *
 * @return {Object} path: [menuItem]
 */
function formatData(array, parentData = [], clean = true) {
  let result = {}

  array.forEach(item => {
    let current = {name: item.name, url: item.url}

    item.url && (result[item.url] = [...parentData, current])

    if (item.children) {
      result = Object.assign(
        {},
        result,
        formatData(item.children, [...parentData, current], false)
      )
    }

    clean && (parentData = [])
  })

  return result
}

export default function({route, store}) {
  if (!routerTree && store.state.menuList.length > 0) {
    // 处理一次 缓存起来
    routerTree = formatData(store.state.menuList)
  }

  try {
    let path = (
      (route.matched[0] && route.matched[0].path) ||
      route.path
    ).replace(/\?/g, '')

    store.commit('update', {
      breadCrumbList: [...BASE_PAGE, ...(routerTree[path] || [])]
    })
  } catch (e) {
    store.commit('update', {
      breadCrumbList: [...BASE_PAGE]
    })
  }
}
