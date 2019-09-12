<template>
  <div class="roles">
    <el-card>
      <el-data-table
        ref="dataTable"
        :firstPage="0"
        :hasPagination="true"
        :url="url"
        :hasDelete="true"
        :hasEdit="true"
        canClearSearch="true"
        @selection-change="handleSelectionChange"
        :searchForm="searchForm"
        :extraButtons="extraButtons"
        :form="form"
        :columns="columns"
      >
      </el-data-table>
    </el-card>

    <el-dialog title="配置权限" :visible.sync="showPermissionDialog">
      <el-tree
        node-key="id"
        :props="elTreeProps"
        :data="menuList"
        show-checkbox
        @check-change="handleCheckChange"
        ref="roleTree"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="updatePermission"
          :disabled="!canSubmit"
          v-loading="submitLoading"
          >提 交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {rolesList, menu, rolesEdit, rolesDetail} from '@/const/api'

const roleStatus = {
  inactive: '禁用',
  active: '启用'
}

function flattenTree(array, children = 'children') {
  var result = []

  array.forEach(node => {
    result.push(node)
    if (node[children]) result.push(...flattenTree(node[children]))
  })

  return result
}

export default {
  name: 'roles',
  data() {
    return {
      url: rolesList,
      columns: [
        {
          type: 'selection'
        },
        {prop: 'roleNum', label: '角色编号'},
        {prop: 'name', label: '角色名称'},
        {
          prop: 'status',
          label: '状态',
          formatter: ({status}) => {
            return status === 'active' ? '启用' : '禁用'
          }
        }
      ],
      selectedRoles: [],
      form: [
        {
          $type: 'input',
          $id: 'roleNum',
          name: 'roleNum',
          label: '角色编号',
          value: '',
          rules: [
            {
              required: true,
              message: '角色编号不可为空',
              whitespace: true
            }
          ],
          $el: {placeholder: '请输入'}
        },
        {
          $type: 'input',
          $id: 'name',
          name: 'name',
          label: '角色名称',
          rules: [
            {required: true, message: '角色名称不可为空', whitespace: true},
            {
              validator: function(rule, value, callback) {
                if (value.trim().length > 10) {
                  callback('角色名称长度不可大于10')
                } else callback()
              }
            }
          ],
          $el: {placeholder: '请输入'}
        },
        {
          $type: 'select',
          $id: 'status',
          label: '状态',
          value: 'active',
          rules: [{required: true, message: '请选择状态', trigger: 'blur'}],
          $options: Object.keys(roleStatus).map(key => ({
            label: roleStatus[key],
            value: key
          })),
          $el: {
            placeholder: '请选择'
          }
        }
      ],
      searchForm: [
        {
          $el: {
            placeholder: '支持角色编号和角色名称搜索',
            style: 'width: 220px'
          },
          $id: 'search',
          $type: 'input'
        }
      ],
      extraButtons: [
        {
          text: '配置权限',
          type: 'primary',
          atClick: row => {
            this.configRow = row
            this.getPermission(row.id)
            return false
          }
        }
      ],

      showPermissionDialog: false,
      systemTree: [],
      businessTree: [],
      menuList: [],

      elTreeProps: {
        children: 'children',
        label: 'name'
      },
      // 进行权限配置的行
      configRow: '',

      canSubmit: false,
      submitLoading: false
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    getMenuList() {
      this.$axios
        .$get(menu(this.$store.state.user.id))
        .then(res => {
          this.menuList = res.payload.menu
        })
        .catch(error => {
          console.log(error)
        })
    },
    getPermission(id) {
      this.showPermissionDialog = true

      this.$axios
        .$get(rolesDetail(id))
        .then(res => {
          // 新增的角色, 未配置权限时返回payload为null
          if (res.payload === null) {
            this.$refs.roleTree.setCheckedKeys([])
          } else {
            let nodes = flattenTree(this.menuList),
              keys = Object.keys(res.payload).map(v => v),
              checkedKeys = []

            nodes.forEach(node => {
              if (keys.indexOf(node.id) > -1 && !node.children)
                checkedKeys.push(node.id)
            })

            this.$refs.roleTree.setCheckedKeys(keys)
          }
        })
        .catch(error => {})
    },
    updatePermission() {
      let checkNodes = this.$refs.roleTree.getCheckedNodes(false, true),
        permits = {}

      // TODO 目前只满足GET操作, 满足项目需要, 但并非完整的权限管理功能
      checkNodes.forEach(node => {
        permits[node.id] = ['GET']
      })

      this.submitLoading = true

      this.$axios({
        url: rolesEdit(this.configRow.id),
        method: 'put',
        data: permits
      })
        .then(res => {
          this.submitLoading = false
          this.showPermissionDialog = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })

          this.$refs.dataTable.getList()
        })
        .catch(error => {
          this.submitLoading = false
        })
    },
    handleCheckChange() {
      let roleTreeKeys = this.$refs.roleTree.getCheckedKeys()
      this.canSubmit = roleTreeKeys.length > 0
    },
    handleSelectionChange(val) {
      this.selectedRoles = val
    }
  }
}
</script>
