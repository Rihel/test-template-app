<template>
  <el-card class="user-setting">
    <el-tabs tab-position="left">
      <el-tab-pane label="基本设置"></el-tab-pane>
    </el-tabs>

    <div class="right-side">
      <h2>基本设置</h2>
      <div class="main-content">
        <div class="user-form">
          <el-form-renderer :content="content" ref="ruleForm">
            <el-form-item>
              <el-button type="primary">更新基本信息</el-button>
            </el-form-item>
          </el-form-renderer>
        </div>
        <div class="user-avatar">
          <p>头像</p>
          <upload-to-ali v-model="form.avatar"></upload-to-ali>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {
        avatar:
          'https://deepexi.oss-cn-shenzhen.aliyuncs.com/xpaas-console/user-portrait.png'
      },
      content: [
        {
          $type: 'input',
          $id: 'email',
          label: '邮箱',
          $el: {
            placeholder: '邮箱'
          }
        },
        {
          $type: 'input',
          $id: 'nickName',
          label: '昵称',
          $el: {
            placeholder: '昵称'
          }
        },
        {
          $type: 'input',
          $id: 'introduction',
          label: '个人简介',
          $el: {
            placeholder: '个人简介',
            type: 'textarea'
          }
        },
        {
          $type: 'select',
          $id: 'country',
          label: '国家/地区',
          $el: {
            placeholder: '国家/地区',
            style: 'width: 100%'
          },
          $options: [{label: '中国', value: '中国'}]
        },
        {
          $type: 'input',
          $id: 'mobile',
          label: '联系电话',
          $el: {
            placeholder: '联系电话'
          }
        }
      ]
    }
  },
  methods: {}
}
</script>
<style lang="less">
.user-setting {
  .el-card__body {
    width: 100%;
    display: flex;
  }

  .right-side {
    flex: 1;
    margin-left: 20px;
  }

  .main-content {
    display: flex;

    .user-form {
      margin-top: 20px;
      width: 300px;
    }

    .user-avatar {
      flex: 1;
      padding: 26px 0 0 100px;

      .upload-item,
      .upload-box {
        margin-top: 10px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
    }
  }
}
</style>
