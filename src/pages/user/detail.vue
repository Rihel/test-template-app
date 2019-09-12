<template>
  <div class="user-detail" v-loading="loading">
    <go-back></go-back>

    <el-card class="border-0">
      <div slot="header">
        <h2>用户详情</h2>
      </div>
      <div class="user-info">
        <div class="img">
          <img
            class="rounded-circle"
            width="120"
            :src="
              accountInfo.mcMemberAccount
                ? accountInfo.mcMemberAccount.avatarUrl
                : ''
            "
          />
        </div>
        <div class="table">
          <div class="title">
            <h3>账号信息</h3>
          </div>
          <table-info>
            <tr>
              <td class="label">账号</td>
              <td class="value" colspan="3">
                {{
                  accountInfo.mcMemberAccount
                    ? accountInfo.mcMemberAccount.mobile
                    : ''
                }}
              </td>
              <td class="label">昵称</td>
              <td class="value" colspan="3">
                {{
                  accountInfo.mcMemberAccount
                    ? accountInfo.mcMemberAccount.nickName
                    : ''
                }}
              </td>
            </tr>
            <tr>
              <td class="label">注册时间</td>
              <td class="value" colspan="3">
                {{
                  accountInfo.mcMemberAccount
                    ? accountInfo.mcMemberAccount.createdAt
                    : '' | formatDate
                }}
              </td>
              <td class="label">最近登录时间</td>
              <td class="value" colspan="3">
                {{
                  accountInfo.mcMemberAccount
                    ? accountInfo.mcMemberAccount.updatedAt
                    : '' | formatDate
                }}
              </td>
            </tr>
            <tr>
              <!-- <td class="label">关注时间</td>
              <td class="value" colspan="3">{{accountInfo.mcMemberAccount?accountInfo.mcMemberAccount.followAt:'' | formatDate}}</td> -->
              <td class="label">OpenID</td>
              <td class="value" colspan="3">
                {{ accountInfo.openId ? accountInfo.openId : '' }}
              </td>
            </tr>
          </table-info>

          <div class="title">
            <h3>基本信息</h3>
          </div>
          <table-info>
            <tr>
              <td class="label">姓名</td>
              <td class="value" colspan="4">
                {{ accountInfo.ocrInfo ? accountInfo.ocrInfo.name : '' }}
              </td>
              <td class="label">手机号</td>
              <td class="value" colspan="2">
                {{
                  accountInfo.mcMemberAccount
                    ? accountInfo.mcMemberAccount.mobile
                    : ''
                }}
              </td>
            </tr>
            <tr>
              <td class="label">性别</td>
              <td class="value" colspan="4">
                {{ accountInfo.ocrInfo ? accountInfo.ocrInfo.sex : '' }}
              </td>
              <td class="label">身份证号</td>
              <td class="value" colspan="2">
                {{ accountInfo.ocrInfo ? accountInfo.ocrInfo.num : '' }}
              </td>
            </tr>
            <tr>
              <td class="label">年龄</td>
              <td class="value" colspan="4">{{ age }}</td>
              <td class="label">生日</td>
              <td class="value" colspan="2">
                {{
                  accountInfo.ocrInfo
                    ? formatDate(accountInfo.ocrInfo.birth, 'YYYY-MM-DD')
                    : ''
                }}
              </td>
            </tr>
            <tr>
              <td class="label">通讯地址</td>
              <td class="value" colspan="6">
                {{
                  accountInfo.mcDeliveryAddress
                    ? accountInfo.mcDeliveryAddress.address
                    : ''
                }}
              </td>
            </tr>
          </table-info>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import TableInfo from '@/components/table-info'
import {userDetail} from '@/const/api'

import {formatDate, price} from '@/const/filter'
import dayjs from 'dayjs'

export default {
  name: 'user-detail',
  components: {
    TableInfo
  },
  data() {
    return {
      activeTab: '1',
      totalPath: 'payload.totalElements',
      dataPath: 'payload.content',
      accountInfo: {},
      formatDate,
      loading: false
    }
  },
  computed: {
    age() {
      if (this.accountInfo.ocrInfo) {
        let age =
          dayjs().year() - formatDate(this.accountInfo.ocrInfo.birth, 'YYYY')
        return age
      }
    },
    userId() {
      return this.$route.query.userId
    }
  },
  filters: {
    formatDate
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.loading = true

      this.$axios
        .$get(userDetail(this.userId))
        .then(res => {
          this.loading = false
          this.accountInfo = res.payload
        })
        .catch(e => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less">
.user-detail {
  .user-info {
    display: flex;
    width: 100%;
    margin-bottom: 30px;

    .title {
      margin: 10px 0;
    }

    .img {
      padding: 40px;
      margin-right: 20px;
    }

    .table {
      flex: 1;

      .table-info {
        width: 100%;

        .label {
          width: 10%;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
