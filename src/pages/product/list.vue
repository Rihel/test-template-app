<template>
  <div class="product-list">
    <el-card>
      <el-data-table
        ref="dataTable"
        :url="url"
        :columns="columns"
        :hasNew="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasOperation="true"
        :isTree="false"
        :hasPagination="true"
        :headerButtons="headerButtons"
        :extraButtons="extraButtons"
        :searchForm="searchForm"
      >
      </el-data-table>
    </el-card>

    <el-dialog
      title="商品审核"
      :visible.sync="dialogVisible"
      class="verify-dialog"
    >
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="商品名称">
          {{ row.name }}
        </el-form-item>

        <el-form-item label="审核结果" prop="agree">
          <el-radio v-model="formData.agree" :label="true">同意</el-radio>
          <el-radio v-if="!isEdit" v-model="formData.agree" :label="false"
            >拒绝</el-radio
          >
        </el-form-item>

        <el-form-item
          v-if="!formData.agree"
          label="拒绝理由"
          prop="rejectReason"
        >
          <el-input
            class="reason-textarea"
            type="textarea"
            v-model="formData.rejectReason"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          v-loading="isAuditLoading"
          @click="handleAudit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {goodsLists, goodsAudit} from '@/const/api'
import {goodsListColumns, searchForm} from '@/const/goods'
import {PRODUCT_DETAIL} from '@/const/path'

export default {
  name: 'goods-list',
  data() {
    return {
      url: goodsLists,
      columns: goodsListColumns,
      row: {},
      isEdit: false,
      dialogVisible: false,
      isAuditLoading: false,
      formData: {
        agree: true,
        rejectReason: ''
      },
      headerButtons: [
        {
          type: 'primary',
          text: '新增',
          atClick: row => {
            this.$router.push({
              path: PRODUCT_DETAIL('add')
            })
            return false
          }
        }
      ],
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          atClick: row => {
            this.$router.push({
              path: PRODUCT_DETAIL(row.id)
            })
            return false
          }
        },
        {
          text: '审核',
          type: 'default',
          atClick: row => {
            this.row = row
            this.isEdit = false
            this.showDialog()
            return false
          }
        }
      ],
      searchForm: searchForm
    }
  },
  watch: {
    'formData.agree': function(agree) {
      // 切换同意，清空拒绝信息
      if (agree) {
        this.formData.rejectReason = ''
      } else {
        this.$refs.form.clearValidate()
      }
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    handleAudit() {
      this.$refs.form.validate(valid => {
        if (!valid) return

        this.isAuditLoading = true
        this.$axios
          .$put(goodsAudit(this.row.id), {...this.formData})
          .then(res => {
            this.$message.success('操作成功')
            this.isAuditLoading = false
            this.dialogVisible = false
            this.$refs.dataTable.getList()
          })
          .catch(err => {
            this.$message.fail('操作失败')
            this.isAuditLoading = false
          })
      })
    }
  }
}
</script>
<style lang="less"></style>
