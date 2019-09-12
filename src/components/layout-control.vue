<template>
  <div class="layout-control">
    <div
      class="mask"
      :class="{
        'mask-enter-active': visible,
        'mask-leave-active': !visible,
        'mask-block': maskBlock
      }"
      @click.self="toggleVisible"
    ></div>

    <el-card class="control-box" :class="{active: visible}">
      <div class="control-btn" @click="toggleVisible">
        <i :class="controlBtnIcon"></i>
      </div>
      <el-form label-width="180px" label-position="left" size="mini">
        <div class="control-item">
          <h3 class="label">导航模式</h3>

          <div class="options">
            <div
              class="options-item"
              :class="{active: siderMode}"
              @click="LayoutConfig.layout = 'vertical'"
            >
              <img src="@/assets/img/layout-horizontal.svg" />
            </div>
            <div
              class="options-item"
              :class="{active: !siderMode}"
              @click="LayoutConfig.layout = 'horizontal'"
            >
              <img src="@/assets/img/layout-vertical.svg" />
            </div>
          </div>
        </div>

        <div class="control-item">
          <el-form-item label="内容区域宽度">
            <el-select v-model="LayoutConfig.contentType">
              <el-option
                v-for="(item, index) in contentTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
                :hidden="item.disabled && item.disabled()"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="control-item">
          <el-form-item label="固定Header">
            <el-switch v-model="LayoutConfig.fixedHeader"></el-switch>
          </el-form-item>
        </div>

        <div class="control-item" :hidden="!LayoutConfig.fixedHeader">
          <el-form-item label="下滑时隐藏Header">
            <el-switch v-model="LayoutConfig.autoHideHeader"></el-switch>
          </el-form-item>
        </div>

        <div class="control-item" :hidden="!siderMode">
          <el-form-item label="固定侧边菜单">
            <el-switch v-model="LayoutConfig.fixedSiderbar"></el-switch>
          </el-form-item>
        </div>

        <div class="control-item" :hidden="!siderMode">
          <el-form-item label="展示折叠按钮">
            <el-switch
              v-model="LayoutConfig.menu && LayoutConfig.menu.showCollapse"
            ></el-switch>
          </el-form-item>
        </div>

        <div class="control-item">
          <h3 class="label">其他设置</h3>

          <el-form-item label="展示面包屑导航">
            <el-switch v-model="LayoutConfig.showBreadcrumb"></el-switch>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'LayoutControl',
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    controlBtnIcon() {
      return this.visible ? 'el-icon-close' : 'el-icon-setting'
    },
    siderMode() {
      return this.LayoutConfig.layout === 'vertical'
    }
  },
  data() {
    return {
      visible: false,
      maskBlock: false,
      LayoutConfig: {},
      contentTypeList: [
        {label: '定宽', value: 'fixed-width'},
        {label: '流式', value: 'auto', disabled: () => this.siderMode}
      ],
      layoutOptions: []
    }
  },
  watch: {
    visible(val) {
      this.maskBlock = true

      !val &&
        setTimeout(() => {
          this.maskBlock = false
        }, 300)
    },
    LayoutConfig: {
      handler(val, oldVal) {
        oldVal.layout && this.updateSetting()
      },
      deep: true
    }
  },
  mounted() {
    this.LayoutConfig = Object.assign({}, this.config)
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible
    },
    updateSetting() {
      this.$emit('update:config', Object.assign({}, this.LayoutConfig))

      // 触发resize 让数据报表重新绘制
      this.$nextTick(function() {
        setTimeout(function() {
          window.onresize && window.onresize()
        }, 100)
      })
    }
  }
}
</script>
<style lang="less">
.layout-control {
  @keyframes mask-fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes mask-fade-out {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
    z-index: 1500;
    display: none;

    &.mask-block {
      display: block;
    }

    &-enter-active {
      animation: mask-fade-in 0.3s;
    }

    &-leave-active {
      animation: mask-fade-out 0.3s;
    }
  }

  .control-box {
    width: 300px;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 2000;
    transition: transform 0.3s ease-in-out;
    transform: translate3d(300px, 0, 0);
    overflow: visible;
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;

    &.active {
      transform: translate3d(0, 0, 0);
    }

    .control-btn {
      position: absolute;
      top: 30%;
      left: -51px;
      width: 50px;
      height: 50px;
      background: @primary-color;
      cursor: pointer;
      text-align: center;
      line-height: 50px;
      color: rgba(255, 255, 255, 0.85);
      font-size: 25px;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .control-item {
      margin-bottom: 14px;

      .el-form-item__content {
        text-align: right;
      }

      .label {
        margin-bottom: 20px;
      }

      .options {
        img {
          margin-right: 10px;
          cursor: pointer;
        }

        .options-item {
          position: relative;
          display: inline-block;

          &.active::after {
            content: '';
            display: block;
            width: 7px;
            height: 12px;
            position: absolute;
            bottom: 15px;
            right: 20px;
            transform: rotate(45deg);
            border-bottom: 1px solid @primary-color;
            border-right: 1px solid @primary-color;
          }
        }
      }
    }
  }
}
</style>
