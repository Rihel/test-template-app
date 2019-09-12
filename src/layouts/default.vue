<template>
  <el-container
    class="layout-container"
    :class="{fixedSiderbar: siderMode && LayoutConfig.fixedSiderbar}"
  >
    <!-- 左侧菜单栏 -->
    <menu-list
      :class="{fixedSiderbar: LayoutConfig.fixedSiderbar}"
      v-if="siderMode"
      :config.sync="LayoutConfig"
    ></menu-list>

    <div
      class="main-container"
      :class="{
        fixedHeader: LayoutConfig.fixedHeader,
        [LayoutConfig.layout]: true,
        collapse: siderMode && collapse,
        mainContainerFixedSiderbar: siderMode && !LayoutConfig.fixedSiderbar
      }"
      ref="mainContainer"
    >
      <header-wrap :config="LayoutConfig" :mainStyle="mainStyle"></header-wrap>

      <bread-crumb
        :mainStyle="mainStyle"
        v-if="LayoutConfig.showBreadcrumb"
      ></bread-crumb>

      <el-main
        class="nuxt-main"
        :class="{horizontal: !siderMode}"
        :style="mainStyle"
      >
        <nuxt></nuxt>
      </el-main>
      <el-footer>
        <copyright></copyright>
      </el-footer>
    </div>
    <!-- 布局控件 -->
    <layout-control :config.sync="LayoutConfig"></layout-control>
  </el-container>
</template>

<script>
import Copyright from '@/components/copyright.vue'
import MenuList from '@/components/menu-list.vue'
import LayoutControl from '@/components/layout-control.vue'
import HeaderWrap from '@/components/header-wrap.vue'
import BreadCrumb from '@/components/bread-crumb.vue'

import LayoutConfig from '@/const/layout-config'

export default {
  components: {
    Copyright,
    MenuList,
    LayoutControl,
    HeaderWrap,
    BreadCrumb
  },
  data() {
    return {
      LayoutConfig,
      dropdownList: [
        {
          title: '个人设置',
          command: 'toSetting'
        },
        {
          title: '退出',
          command: 'exit'
        }
      ]
    }
  },
  computed: {
    collapse() {
      return this.LayoutConfig.menu.collapse
    },
    mainStyle() {
      return this.siderMode
        ? {}
        : {
            maxWidth:
              (this.LayoutConfig.contentType === 'fixed-width' &&
                this.LayoutConfig.contentMaxWidth) ||
              '100vw',
            width: '100%',
            margin: '0 auto'
          }
    },
    siderMode() {
      return this.LayoutConfig.layout === 'vertical'
    }
  },
  methods: {
    commandHandle(command) {
      this[command] && this[command].call()
    }
  }
}
</script>

<style lang="less">
#__nuxt {
  .layout-container {
    min-height: 100vh;
    overflow-y: auto;

    .fixedSiderbar {
      width: @siderbar-width;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
      margin: auto;
    }
  }

  .el-icon-sort {
    transform: rotate(-90deg);
  }

  // dropdown
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }

  .nuxt-main {
    margin: 10px 10px 0;
    padding: 10px;
    transition: max-width 0.3s ease;
    overflow-x: hidden;

    &.horizontal {
      padding: 20px 20px 0;
    }
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .main-container {
    min-height: calc(100vh - @header-height);
    width: calc(100vw - @siderbar-width);
    overflow-x: hidden;
    flex: 1;
    background: #f0f2f5;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: padding 0.3s ease;

    &.fixedHeader {
      padding-top: @header-height;

      .header-wrap {
        position: fixed;
        top: 0;
        width: calc(100vw - @siderbar-width);
        z-index: 1000;
      }
    }

    &.horizontal {
      .header-wrap {
        width: 100vw;
      }
    }

    &.vertical {
      padding-left: @siderbar-width;
    }

    &.collapse {
      padding-left: 64px;

      .header-wrap {
        width: calc(100vw - 64px);
      }
    }

    &.mainContainerFixedSiderbar {
      padding-left: 0;
    }
  }
}
</style>
