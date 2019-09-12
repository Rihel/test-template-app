<template>
  <div class="recommend">
    <el-row :gutter="12">
      <el-col :span="4">
        <el-card>
          栏目
          <el-menu
            default-active="0"
            class="column-list"
            @select="handleNodeClick"
          >
            <el-menu-item
              :index="column.programa"
              v-for="(column, index) in columnData"
              :key="column.programa"
            >
              <span slot="title">{{ column.label }}</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card>
          <el-button
            size="small"
            type="primary"
            :style="'margin-bottom: 22px;'"
            @click="onShowDialog"
            >新增</el-button
          >
          每个栏目客户端最多显示6个推荐位，为了显示效果，推荐位个数需为双数。
          <el-data-table
            ref="dataTable"
            :url="recommendUrl"
            :columns="recommendColumns"
            :hasNew="false"
            :hasEdit="false"
            :hasDelete="false"
            :hasOperation="false"
            :isTree="false"
            dataPath=""
            :hasPagination="false"
            @update="onUpdate"
          >
            <el-table-column label="操作" min-width="210px">
              <template slot-scope="scope">
                <el-button
                  v-for="(btn, i) in recommendExtraButtons"
                  v-if="
                    'show' in btn
                      ? typeof scope === undefined
                        ? ''
                        : btn.show(scope)
                      : true
                  "
                  v-bind="btn"
                  @click="btn.atClick(scope)"
                  :key="i"
                  size="small"
                  >{{ btn.text }}</el-button
                >
              </template>
            </el-table-column>
          </el-data-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="新增推荐位" :visible.sync="dialogVisible">
      <el-data-table
        ref="goodsDataTable"
        :url="dialogUrl"
        :columns="dialogColumns"
        :hasNew="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasOperation="true"
        :isTree="false"
        :hasPagination="true"
        :extraButtons="goodsExtraButtons"
        :searchForm="goodsSearchForm"
        :extraParams="extraParams"
      >
      </el-data-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {goodsLists, recommendList} from '@/const/api'

let goodsColumns = [
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
  }
]
let comboColumns = [
  {
    prop: 'name',
    label: '商品名称',
    'show-overflow-tooltip': true
  },
  {
    prop: 'shop.name',
    label: '门店'
  },
  {
    prop: 'prdCatalog.name',
    label: '后台类目'
  }
]
const goodsStatus = {
  ON: '上架',
  NOT_ON: '下架'
}
export default {
  name: 'index-recommend',
  data() {
    let extraParams = {}
    const selectColums = {
      type: 'selection'
    }
    return {
      currentRec: [],
      columnData: [
        {
          label: '热销商品',
          programa: '0'
        },
        {
          label: '推荐商品',
          programa: '1'
        },
        {
          label: '活动商品',
          programa: '2'
        }
      ],
      recommendUrl: `${recommendList}?programa=0`,
      recommendColumns: [
        {
          prop: 'goodsInfo.name',
          label: '商品',
          minWidth: '170px',
          'show-overflow-tooltip': true
        },
        {
          prop: 'goodsInfo.shopName',
          label: '门店',
          minWidth: '170px',
          'show-overflow-tooltip': true
        },
        {
          prop: 'goodsInfo.status',
          label: '状态',
          minWidth: '',
          formatter: row => {
            return goodsStatus[row.goodsInfo && row.goodsInfo.status]
          }
        }
      ],
      recommendExtraButtons: [
        {
          text: '上移',
          atClick: scope => {
            this.handleSort(scope.row, 'up', scope.$index)
          },
          show: scope => {
            return scope.$index !== 0
          }
        },
        {
          text: '下移',
          atClick: scope => {
            this.handleSort(scope.row, 'down', scope.$index)
          },
          show: scope => {
            return scope.$index !== this.currentRec.length - 1
          }
        },
        {
          text: '删除',
          type: 'danger',
          atClick: scope => {
            this.onDelete(scope.row, scope.$index)
          }
        }
      ],
      dialogVisible: false,
      dialogUrl: `${goodsLists}?status=on&type=NEW_CARS`,
      dialogColumns: [],
      goodsExtraButtons: [
        {
          text: '选择',
          atClick: row => {
            this.onChooseGood(row)
          },
          show: row => {
            const selectArr = this.currentRec.filter(item => {
              return item.goodsInfo && item.goodsInfo.goodsId === row.id
            })
            return selectArr.length === 0
          }
        }
      ],
      goodsSearchForm: [
        {
          $el: {
            placeholder: '请输入'
          },
          label: '商品名称',
          $id: 'name',
          $type: 'input'
        }
      ],
      operationAttrs: {
        width: 200,
        fixed: 'right'
      },
      extraParams
    }
  },
  watch: {
    dialogVisible: function(val) {
      if (!val) {
        try {
          this.$refs.goodsDataTable.$refs.searchForm.resetFields()
          this.dialogUrl = ''
        } catch (e) {}
      }
    }
  },
  methods: {
    onUpdate(data) {
      this.currentRec = data
    },
    onShowDialog(row) {
      this.dialogVisible = true
      this.dialogUrl = ''
      // 切换新增可选商品
      let type = ''
      switch (this.currentCol) {
        case '0':
        default:
          type = 'NEW_CARS'
          break
        case '1':
          type = 'BOUTIQUE'
          break
        case '2':
          type = 'UNKEEP'
          break
      }

      let query = `?status=on&type=${type}`

      this.dialogUrl = goodsLists + query
      this.dialogColumns = goodsColumns
    },
    onDelete(row, index) {
      if (!row) {
        return
      }

      this.$confirm('确认删除吗', '提示', {
        type: 'warning'
      })
        .then(res => {
          this.$axios.$delete(`${recommendList}/${row.id}`).then(res => {
            this.currentRec.splice(index, 1)
          })
        })
        .catch(er => {})
    },
    onChooseGood(row) {
      this.$axios
        .$post(`${recommendList}`, {
          programa: this.currentCol,
          itemId: row.id
        })
        .then(res => {
          this.dialogVisible = false
          this.$refs.dataTable.getList()
        })
    },
    handleSort(row, type, index) {
      this.$axios
        .$put(
          `${recommendList}/${
            row.id
          }?operation=${type}` /*, {
          operation: type
        }*/
        )
        .then(res => {
          let obj = this.currentRec.splice(index, 1)[0]
          this.currentRec.splice(type === 'up' ? index - 1 : index + 1, 0, obj)

          this.$message.success('操作成功')
        })
    },
    handleNodeClick(column) {
      // 相同栏目，不再请求
      if (this.currentCol === column) {
        return
      }
      this.currentCol = column
      this.recommendUrl = `${recommendList}?programa=${column}`
    }
  },
  mounted() {
    // 设置默认当前栏目为热销车型
    this.currentCol = this.columnData[0].programa
  }
}
</script>
<style lang="less">
.recommend {
  .column-list {
    border-right: none;
  }

  .el-tree {
    // margin-top: 10px;
    margin-right: 20px;
  }

  .el-data-table {
    width: 100%;
  }
}
</style>
