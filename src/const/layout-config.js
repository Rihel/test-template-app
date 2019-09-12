// 布局配置项
export default {
  // 菜单栏位置 horizontal vertical
  layout: 'vertical',

  // 内容宽度类型 auto fixed-width
  contentType: 'fixed-width',

  // 内容最大宽度 需类型为fixed-width
  contentMaxWidth: '1300px',

  // 头部固定
  fixedHeader: true,

  // 头部滚动时隐藏
  autoHideHeader: true,

  // 隐藏头部时的触发高度
  targetHeight: 150,

  // 固定左侧菜单栏
  fixedSiderbar: true,

  menu: {
    // 是否折叠菜单
    collapse: false,

    // 是否展示折叠icon
    showCollapse: true
  },

  // 是否展示面包屑导航
  showBreadcrumb: true
}
