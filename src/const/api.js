const mockServer = 'http://39.100.141.76:3000/mock/277/api/v1'

// 登录
export const login = `${mockServer}/login`

// 获取用户信息
export const currentUser = `${mockServer}/users/currentUser`
// 获取菜单
export const menu = userId => `${mockServer}/users/${userId}/menuResources`
// 添加菜单
export const addMenu = userId => `${mockServer}/users/${userId}/menuResources`
// 编辑菜单
export const editMenu = (userId, id) =>
  `${mockServer}/users/${userId}/menuResources/${id}`
// 删除菜单
export const deleteMenu = (userId, id) =>
  `${mockServer}/users/${userId}/menuResources/${id}`

// 商品列表
export const goodsLists = `${mockServer}/product/list`
// 商品编辑
export const goodsAudit = id => `${mockServer}/product/${id}`

export const recommendList = `${mockServer}/recommend/list`

// 首页广告页面
export const bannerList = `${mockServer}/banner/list`
export const bannerEdit = id => `${mockServer}/banner/${id}`

// 会员信息
export const userDetail = id => `${mockServer}/user/${id}`
// 用户列表
export const userList = `${mockServer}/user/list`

//订单列表
export const orderList = `${mockServer}/order/list`
// 订单详情
export const orderDetail = id => `${mockServer}/order/${id}`
// 添加商品
export const addProduct = `${mockServer}/product`
// 编辑商品
export const editProduct = id => `${mockServer}/product/${id}`
// 商品详情
export const productDetail = id => `${mockServer}/product/${id}`

// 角色列表
export const rolesList = `${mockServer}/roles/list`
// 角色权限编辑
export const rolesEdit = id => `${mockServer}/roles/${id}`
// 角色详情
export const rolesDetail = id => `${mockServer}/roles/${id}`

// 平台用户列表
export const consoleUsers = `${mockServer}/console/users`
// 平台用户编辑
export const consoleUserEdit = id => `${mockServer}/console/users/${id}`
// 添加平台用户
export const consoleUserAdd = `${mockServer}/console/users`
