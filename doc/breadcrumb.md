## 面包屑导航食用方式

1. 首先在 /const/layout-config.js 中的 showBreadcrumb 值要为 true

2. 菜单列表数据示例

```javascript
[
  {
     "id": "1",
     "name": "用户列表",
     "children": [{
       "id": "101",
       "name": "用户详情",
       "parentId": "1",
       "url": "/user/:id"
     }]
  },
  {
     "id": "2",
     "name": "商品列表",
     "url": "/product/list",
     "hidden": true //hidden为true将不渲染在菜单栏中
  }
]

// 将会处理为

{
  '/user/:id': [{name: '用户列表', url: ''}, {name: '用户详情', url: '/user/:id'}],
  '/product/list': [{name: '商品列表', url: '/product/list'}]
}
```

3. 在middleware拦截，根据访问的路由path，获取面包屑列表进行渲染

> 默认会在所有面包屑列表前增加首页 {name: "首页", url: "/"}
