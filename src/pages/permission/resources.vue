<template>
  <el-container class="resources">
    <el-card class="tree-card">
      <div slot="header">
        <el-button
          type="primary"
          size="small"
          @click="
            isRoot = true
            showAppendDialog()
          "
          >新增根节点</el-button
        >
      </div>

      <div>
        <el-tree
          v-loading="loadingTree"
          node-key="id"
          :props="elTreeProps"
          :data="menuTree"
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          draggable
          :allowDrop="allowDrop"
          @node-drop="onDrop"
          ref="menuTree"
        >
          <div class="custom-tree-node" slot-scope="{node, data}">
            <span class="el-tree-node__label">{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="
                  isRoot = false
                  showAppendDialog()
                "
              >
                添加节点
              </el-button>
              <el-button type="text" size="mini" @click="remove(data)">
                删除
              </el-button>
            </span>
          </div>
          >
        </el-tree>
      </div>
    </el-card>

    <el-card class="form-card">
      <div slot="header">
        <p>资源详情</p>
      </div>
      <div>
        <el-form ref="form" label-width="80px">
          <el-form-item label="名称:">
            <el-input v-model="selectedNode.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="英文名称:">
            <el-input
              v-model="selectedNode.nameEn"
              placeholder="英文名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="路径:">
            <el-input
              v-model="selectedNode.url"
              placeholder="/routes"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标:">
            <el-input v-model="selectedNode.icon" placeholder="图标"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input
              type="textarea"
              v-model="selectedNode.remark"
              placeholder="备注"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="update"
              size="small"
              :disabled="!selectedNode.id"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--新增 dialog-->
    <el-dialog title="新增" :visible.sync="dialogVisible">
      <el-form>
        <el-form-item label="父节点:">
          <div>{{ selectedNode.name ? selectedNode.name : '无' }}</div>
        </el-form-item>
      </el-form>
      <el-form-renderer :content="form" ref="newForm"></el-form-renderer>
      <div slot="footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="append"
          v-loading="loading"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {menu, addMenu, editMenu, deleteMenu} from '@/const/api'

const prev = 'prev'
const inner = 'inner'

export default {
  name: 'resources',
  data: function() {
    return {
      loadingTree: false,
      menuTree: [],
      elTreeProps: {
        children: 'children',
        label: 'name'
      },

      isRoot: false,
      dialogVisible: false,
      selectedNode: {},
      loading: false,

      form: [
        {
          $id: 'name',
          $type: 'input',
          label: '名称',
          $el: {
            placeholder: '名称'
          },
          rules: [{required: true, message: '请输入', trigger: 'blur'}]
        },
        {
          $id: 'nameEn',
          $type: 'input',
          label: '英文名称',
          $el: {
            placeholder: '英文名称'
          },
          rules: [{required: true, message: '请输入', trigger: 'blur'}]
        },
        {
          $id: 'url',
          $type: 'input',
          label: '路径',
          $el: {
            placeholder: '路径'
          }
        },
        {
          $id: 'icon',
          $type: 'input',
          label: '图标',
          $el: {
            placeholder: '可以是绝对地址, 或者element-ui的icon名'
          }
        },
        {
          $id: 'remark',
          $type: 'input',
          label: '备注',
          $el: {
            placeholder: '备注',
            type: 'textarea'
          }
        }
      ]
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.id
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    getMenuList() {
      this.loadingTree = true

      this.$axios
        .$get(menu(this.userId))
        .then(res => {
          this.menuTree = res.payload.menu
        })
        .catch(error => {})
        .finally(() => {
          this.loadingTree = false
        })
    },
    showAppendDialog() {
      this.dialogVisible = true
    },
    append() {
      this.$refs.newForm.validate(valid => {
        if (!valid) return

        let data = this.$refs.newForm.getFormValue()

        if (!this.isRoot) data.parentId = this.selectedNode.id

        // TODO 目前只满足GET操作, 满足项目需要, 但并非完整的权限管理功能
        data.operators = ['GET']
        data.projectNo = process.env.PROJECT_NO

        this.$axios
          .$post(addMenu(this.userId), data)
          .then(response => {
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '操作成功!'
            })

            this.getMenuList()
          })
          .catch(e => {})
      })
    },
    cancel() {
      this.dialogVisible = false
      this.$refs.newForm.resetFields()
    },
    update() {
      this.$axios
        .$put(editMenu(this.userId, this.selectedNode.id), this.selectedNode)
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })

          this.getMenuList()
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: '操作失败!'
          })
        })
    },
    remove(data) {
      this.$confirm(`确认删除 ${data.name} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .$delete(deleteMenu(this.userId, data.id))
            .then(response => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })

              this.getMenuList()
            })
            .catch(e => {
              this.$message({
                type: 'success',
                message: '操作失败!'
              })
            })
        })
        .catch(e => {})
    },
    handleNodeClick(node) {
      this.selectedNode = node
    },
    /**
     * 算法如下
     * 假设node为拖拽的节点，拖拽后的顺序为: prev, node, next, 则 sort = prev.sort
     * @param dragNode
     * @param dropNode
     * @param dropType
     * @param ev
     */
    onDrop(dragNode, dropNode, dropType, ev) {
      const firstSort = -1

      // 默认是在后面插入
      let sort = dropNode.data.sort
      let parentId = dropNode.data.parentId

      // 变为子节点
      if (dropType == inner) {
        sort = firstSort
        parentId = dropNode.data.id
      }

      this.loadingTree = true

      this.$axios
        .$put(editMenu(this.userId, ragNode.data.id), {
          parentId,
          sort,
          tag: dropNode.data.tag
        })
        .then(resp => {
          // this.getMenuList()
        })
        .catch(e => {})
        .finally(() => {
          this.loadingTree = false
        })
    },
    allowDrop(dragNode, dropNode, dropType) {
      // 当 prev 时, 意味着得到的是node与next两个节点, 无法根据算法求出sort值, 故什么也不做
      return dropType != prev
    }
  }
}
</script>
<style lang="less">
.resources {
  .tree-card {
    margin-right: 30px;
    width: 35%;
  }

  .form-card {
    flex: 1;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
