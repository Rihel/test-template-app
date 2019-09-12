<template>
  <div class="user-list">
    <el-card>
      <el-data-table
        ref="dataTable"
        v-loading="loading"
        :url="url"
        :dataPath="dataPath"
        :totalPath="totalPath"
        :columns="columns"
        :hasNew="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasOperation="true"
        :hasPagination="true"
        :extraButtons="extraButtons"
        :searchForm="searchForm"
      >
      </el-data-table>
    </el-card>
  </div>
</template>

<script>
import {formatDate} from '@/const/filter'
import {userList} from '@/const/api'
import {USER_DETAIL} from '@/const/path'

export default {
  name: 'user-list',
  data() {
    return {
      url: userList,
      loading: false,
      dataPath: 'payload.content',
      totalPath: 'payload.totalElements',
      columns: [
        {
          prop: 'nickName',
          label: '昵称'
        },
        {
          prop: 'mobile',
          label: '手机号',
          minWidth: 100
        },
        {
          prop: 'sex',
          label: '性别'
        },
        {
          prop: 'createdAt',
          label: '注册时间',
          minWidth: 150,
          formatter: row => formatDate(row.createdAt)
        }
      ],
      extraButtons: [
        {
          text: '查看',
          atClick: row => {
            this.$router.push(USER_DETAIL(row.id))
            return false
          }
        }
      ],
      searchForm: [
        {
          $el: {
            placeholder: '请输入用户昵称'
          },
          label: '用户昵称',
          $id: 'nickName',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请输入手机号'
          },
          label: '手机号',
          $id: 'mobile',
          $type: 'input'
        }
      ]
    }
  }
}
</script>
