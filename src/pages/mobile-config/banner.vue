<template>
  <div class="banner-list">
    <el-card>
      <el-data-table
        ref="dataTable"
        :url="url"
        :columns="columns"
        :hasNew="true"
        :hasEdit="true"
        :hasDelete="true"
        :hasOperation="true"
        :hasPagination="true"
        :extraButtons="extraButtons"
        :searchForm="searchForm"
        :extraParams="extraParams"
        :beforeConfirm="beforeConfirm"
        :operationAttrs="operationAttrs"
        @edit="extraEdit"
        @new="clickNew"
      >
        <div slot="form">
          <el-form ref="form" label-width="80px" class="jump-url">
            <el-form-item label="跳转链接">
              <el-input v-model="extraParams.jumpUrl"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-data-table>
    </el-card>
  </div>
</template>

<script>
import {bannerList, bannerEdit} from '@/const/api'

const NORMAL = 'NORMAL'
const FORBIDDEN = 'FORBIDDEN'

export default {
  name: 'banner-list',
  data() {
    return {
      url: bannerList,
      columns: [
        {
          prop: 'url',
          label: '图片',
          formatter: row => {
            return (
              <img
                src={row.url || ''}
                style={{
                  width: '100px',
                  background: 'transparent',
                  padding: '0'
                }}
              />
            )
          }
        },
        {prop: 'jumpUrl', label: '跳转链接'},
        {
          prop: 'status',
          label: '状态',
          formatter: row => (row.status === NORMAL ? '启用' : '禁用')
        }
      ],
      extraButtons: [
        {
          type: 'primary',
          text: '启用',
          show: row => {
            return row.status !== NORMAL
          },
          atClick: row => {
            this.switchStatus(row)
          }
        },
        {
          type: 'default',
          text: '禁用',
          show: row => {
            return row.status === NORMAL
          },
          atClick: row => {
            this.switchStatus(row)
          }
        }
      ],
      searchForm: [
        {
          $el: {placeholder: '请选择状态'},
          $type: 'select',
          $id: 'status',
          label: '状态',
          $options: [
            {
              label: '启用',
              value: NORMAL
            },
            {
              label: '禁用',
              value: FORBIDDEN
            }
          ]
        }
      ],
      extraParams: {
        url: '',
        jumpUrl: ''
      },
      operationAttrs: {
        width: '200px'
      }
    }
  },
  methods: {
    beforeConfirm() {
      if (!this.extraParams.jumpUrl) {
        this.$message({
          type: 'warning',
          message: '请输入跳转链接'
        })
        return Promise.reject()
      }
      return Promise.resolve()
    },
    extraEdit(row) {
      this.extraParams.url = row.url
      this.extraParams.jumpUrl = row.jumpUrl
    },
    clickNew() {
      this.extraParams.url = ''
      this.extraParams.jumpUrl = ''
    },
    switchStatus(row) {
      // 切换状态
      let changedObj = {
        status: row.status === NORMAL ? FORBIDDEN : NORMAL
      }

      this.$axios
        .$put(bannerEdit(row.id), changedObj)
        .then(resp => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
        .catch(err => {})
    }
  }
}
</script>
