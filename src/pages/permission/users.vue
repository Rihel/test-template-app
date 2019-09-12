<template>
  <el-container class="users">
    <el-card class="table-card">
      <el-data-table
        ref="dataTable"
        :url="tableApi"
        :columns="columns"
        :hasPagination="true"
        :hasOperation="true"
        :hasNew="false"
        :hasDelete="false"
        :hasEdit="false"
        :onEdit="onUserEdit"
        :searchForm="searchForm"
        :headerButtons="headerButtons"
        :extraButtons="extraButtons"
        :operationAttrs="operationAttrs"
      >
      </el-data-table>
    </el-card>

    <!-- 修改用户 dialog -->
    <el-dialog
      :title="userRow.id ? '修改用户' : '新增用户'"
      :visible.sync="dialogUserVisible"
    >
      <el-form-renderer :content="userForm" ref="userForm"></el-form-renderer>

      <div slot="footer">
        <el-button @click="cancelUserEdit" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmUserEdit"
          v-loading="loading"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--分配角色 dialog-->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogRolesAssignVisible"
      width="500px"
    >
      <el-form>
        <el-form-item label="选择角色：" label-width="100px">
          <el-select
            v-model="selectedRoles"
            placeholder="请选择角色, 支持输入搜索"
            style="width: 300px;"
            v-loading="getUserRolesLoading"
            multiple
            filterable
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRolesAssign" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmRolesAssign"
          size="small"
          v-loading="loading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
const active = 'active'

import {
  consoleUsers,
  consoleUserEdit,
  consoleUserAdd,
  rolesList
} from '@/const/api'

export default {
  name: 'users',
  data() {
    return {
      roles: [], //所有角色
      headerButtons: [
        {
          type: 'primary',
          text: '新增用户',
          atClick: row => {
            this.dialogUserVisible = true
            this.userRow = row
            return false
          }
        }
      ],

      dialogUserVisible: false,
      userRow: {},
      loading: false,

      dialogRolesAssignVisible: false,
      getUserRolesLoading: false,
      selectedRoles: [],

      tableApi: consoleUsers,
      columns: [
        {prop: 'username', label: '用户账号'},
        {prop: 'fullname', label: '姓名'},
        {prop: 'mobile', label: '手机号码'},
        {prop: 'roles', label: '角色'},
        {prop: 'status', label: '账号状态'},
        {prop: 'createPerson', label: '创建人', width: '110px'}
      ],
      extraButtons: [
        {
          type: 'primary',
          text: '修改',
          show: row => {
            return row.status !== active
          },
          atClick: row => {
            this.onUserEdit(row)
            return false
          }
        },
        {
          type: 'primary',
          text: '启用',
          show: row => {
            return row.status !== active
          },
          atClick: row => {
            this.switchUserStatus(row)
            return false
          }
        },
        {
          type: 'danger',
          text: '禁用',
          show: row => {
            return row.status === active
          },
          atClick: row => {
            this.switchUserStatus(row)
            return false
          }
        },
        {
          text: '分配角色',
          type: 'success',
          atClick: row => {
            this.onRolesAssign(row)
            return false
          }
        }
      ],
      operationAttrs: {
        //操作列属性
        width: '250px'
      },
      userForm: [
        {
          $type: 'input',
          $id: 'username',
          name: 'username',
          label: '用户账号',
          rules: [
            {
              required: true,
              message: '用户账号不可为空',
              whitespace: true
            }
          ],
          $el: {placeholder: '请输入用户名全拼作为账号'}
        },
        {
          $type: 'input',
          $id: 'fullname',
          name: 'fullname',
          label: '姓名',
          rules: [{required: true, message: '姓名不可为空', whitespace: true}],
          $el: {placeholder: '请输入用户姓名'}
        },
        {
          $type: 'input',
          $id: 'password',
          label: '密码',
          $el: {
            placeholder: '密码'
          }
        },
        {
          $type: 'input',
          $id: 'mobile',
          name: 'mobile',
          label: '手机号码',
          $el: {placeholder: '手机号码'}
        }
      ],
      searchForm: [
        {
          $el: {
            placeholder: '支持用户账号和姓名搜索',
            style: 'width: 220px'
          },
          $id: 'search',
          $type: 'input'
        }
      ]
    }
  },
  watch: {
    // 避免上一个用户已分配的角色闪现
    dialogRolesAssignVisible(val) {
      if (!val) this.selectedRoles = []
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    getRoles() {
      this.$axios
        .$get(rolesList)
        .then(response => {
          this.roles = response.payload.content
        })
        .catch(response => {
          this.$message.error('获取角色列表失败')
        })
    },

    onUserEdit(row) {
      this.dialogUserVisible = true
      this.userRow = row

      // 给表单填充值
      this.$nextTick(() => {
        this.userForm.forEach(entry => {
          let value = row[entry.$id]

          this.$refs.userForm.updateValue({id: entry.$id, value})
        })
      })
    },
    cancelUserEdit() {
      this.dialogUserVisible = false
      this.userRow = {}
      this.$refs.userForm.resetFields()
    },
    confirmUserEdit() {
      let userForm = this.$refs.userForm

      userForm.validate(valid => {
        if (!valid) return

        this.loading = true

        let data = Object.assign({}, this.userRow, userForm.getFormValue())

        this.$axios({
          method: data.id ? 'put' : 'post',
          url: data.id ? consoleUserEdit(data.id) : consoleUserAdd,
          data: data
        })
          .then(resp => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.dialogUserVisible = false
            this.$refs.dataTable.getList()
          })
          .catch(e => {
            console.log(e)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    switchUserStatus(row) {
      let status = row.status == active ? 'inactive' : active

      this.$axios({
        method: 'PUT',
        url: consoleUserEdit(row.id),
        data: {
          departIds: row.departIds,
          status
        }
      })
        .then(response => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })

          this.$refs.dataTable.getList()
        })
        .catch(response => {})
    },
    onRolesAssign(row) {
      this.dialogRolesAssignVisible = true

      this.userRow = row
    },
    confirmRolesAssign() {
      this.loading = true

      this.$axios({
        method: 'PUT',
        url: consoleUserEdit(this.userRow.id),
        data: {
          rows: this.selectedRoles
        }
      })
        .then(resp => {
          this.dialogRolesAssignVisible = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$refs.dataTable.getList()
        })
        .catch(resp => {})
        .finally(() => {
          this.loading = false
        })
    },
    cancelRolesAssign() {
      this.dialogRolesAssignVisible = false
    }
  }
}
</script>
<style lang="less">
.users {
  .tree-card {
    margin-right: 30px;
    width: 35%;
  }

  .table-card {
    flex: 1;
  }
}
</style>
