<template>
  <div class="product-detail" v-loading="loading">
    <go-back></go-back>

    <el-card>
      <h2 slot="header">{{ pageTitle }}</h2>

      <el-form-renderer label-width="100px" :content="content" ref="ruleForm">
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form-renderer>
    </el-card>
  </div>
</template>

<script>
import ElFormRender from '@femessage/el-form-renderer'

import {addProduct, editProduct, productDetail} from '@/const/api'

export default {
  name: 'product-detail',
  components: {
    ElFormRender
  },
  data() {
    return {
      loading: false,
      content: [
        {
          $type: 'input',
          $id: 'name',
          label: '商品名称',
          $el: {
            placeholder: '请输入商品名称'
          },
          rules: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ]
        },
        {
          $id: 'productImg',
          label: '商品图片',
          component: 'upload-to-ali',
          $default:
            'http://moby-oss-dev.oss-cn-beijing.aliyuncs.com/image/moby/80cb39dbb6fd52667b5025ffae18972bd50736e5-1535594564079-1536221246554.jpg',
          rules: [
            {required: true, message: '请上传商品图片', trigger: 'change'}
          ]
        },
        {
          $type: 'select',
          $id: 'region',
          label: '商品分类',
          $options: [
            {
              label: '默认分类',
              value: '默认分类'
            },
            {
              label: '分类A',
              value: '分类A'
            }
          ],
          rules: [
            {required: true, message: '请选择商品分类', trigger: 'change'}
          ]
        },
        {
          $type: 'input-number',
          $id: 'price',
          label: '商品价格',
          $el: {
            placeholder: '请输入商品价格',
            controlsPosition: 'right',
            precision: 2
          },
          rules: [
            {required: true, message: '请输入商品价格', trigger: 'change'}
          ]
        },
        {
          $type: 'radio-group',
          $id: 'resource',
          label: '是否上架',
          $options: [
            {
              label: '是',
              value: '是'
            },
            {
              label: '否',
              value: '否'
            }
          ],
          rules: [
            {required: true, message: '请选择上架状态', trigger: 'change'}
          ]
        },
        {
          $type: 'input',
          $id: 'desc',
          label: '商品描述',
          $el: {
            type: 'textarea'
          },
          rules: [{required: true, message: '请填写商品描述', trigger: 'blur'}]
        }
      ]
    }
  },
  computed: {
    productId() {
      return this.$route.params.id
    },
    isAdd() {
      return this.productId === 'add'
    },
    pageTitle() {
      return this.isAdd ? '新增商品' : '编辑商品'
    }
  },
  methods: {
    getProductDetail() {
      this.loading = true

      this.$axios
        .$get(productDetail(this.productId))
        .then(res => {
          this.loading = false

          this.$refs.ruleForm.updateForm(res.payload)
        })
        .catch(e => {
          this.loading = false
        })
    },
    submitProduct() {
      let data = this.$refs.ruleForm.getFormValue() || {}

      this.$axios({
        url: this.isAdd ? addProduct : goodsAudit(this.productId),
        method: this.isAdd ? 'post' : 'put',
        data
      }).then(res => {
        this.$message.success('操作成功')
        this.$router.back()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitProduct()
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted() {
    if (!this.isAdd) this.getProductDetail()
  }
}
</script>

<style lang="less">
.product-detail {
  .el-input {
    width: 200px;
  }

  .el-textarea {
    width: 50%;
  }
}
</style>
