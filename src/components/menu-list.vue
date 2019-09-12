<template>
  <div
    :class="{hideSidebar: siderMode && collapse, [config.layout]: true}"
    class="sidebar-container"
  >
    <div>
      <el-menu
        :collapse="siderMode && collapse"
        :default-active="$route.path"
        :collapse-transition="false"
        :mode="config.layout"
        router
        class="aside-menu"
        background-color="#2D303B"
        text-color="rgba(255, 255, 255, .65)"
        active-text-color="#FFFFFF"
      >
        <li class="logo">
          <nuxt-link to="/" :class="{'logo-horizontal': !siderMode}">
            <img
              class="logo-img"
              :src="$store.state.meta.logoSidebar"
              alt="logo"
            />
            <h1 class="logo-text">{{ $store.state.meta.appName }}</h1>
          </nuxt-link>
        </li>

        <!-- 菜单栏用户信息 -->
        <!-- <li class="user-box" v-if="siderMode">
          <div class="user-data">
            <div class="avatar">
              <img :src="$store.state.user.avatar" class="user-img" />
            </div>
            <div class="user-desc">
              <div class="name">
                {{ $store.state.user.nickname }}
              </div>
            </div>
          </div>

          <div class="tools" v-show="!collapse">
            <div class="tools-item" @click="toSetting">
              <i class="el-icon-setting"></i>
            </div>
            <div class="tools-item" @click="exit">
              <i class="el-icon-switch-button"></i>
            </div>
          </div>
        </li> -->

        <!-- <el-scrollbar wrap-class="scrollbar-wrapper">
          <menu-item :menuList="menuList" :mode='config.layout'></menu-item>
        </el-scrollbar> -->

        <li class="scrollbar-wrapper">
          <menu-item
            ref="mainMenuBox"
            :menuList="menuList"
            :mode="config.layout"
          ></menu-item>
        </li>
        <li><slot></slot></li>
      </el-menu>
    </div>

    <div
      :class="{hideSidebar: collapse}"
      class="fix-btn-wrap"
      v-if="siderMode && config.menu.showCollapse"
    >
      <div class="collapse-btn" @click="toggleCollapse">
        <img
          class="btn-icon"
          src="https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/expand.svg"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

import {Scrollbar} from 'element-ui'
import MenuItem from '@/components/menu-item.vue'

import debounce from 'lodash/debounce'

import {USER_SETTING} from '@/const/path.js'

export default {
  name: 'MenuList',
  components: {
    MenuItem,
    ElScrollbar: Scrollbar
  },
  props: {
    mainStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      menuWidthList: null
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val.layout === 'horizontal') {
          this.addResizeHandle()
        } else {
          this.removeResizeHandle()

          this.$nextTick(function() {
            this.menuList = this.storeMenuList
          })
        }
        this.LayoutConfig = Object.assign({}, val)
      },
      immediate: true
    },
    storeMenuList: {
      handler(val) {
        this.menuList = JSON.parse(JSON.stringify(val))
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({storeMenuList: 'menuList'}),
    siderMode() {
      return this.config.layout === 'vertical'
    },
    collapse() {
      return this.LayoutConfig.menu && this.LayoutConfig.menu.collapse
    }
  },
  data() {
    return {
      LayoutConfig: {},
      menuList: []
    }
  },
  mounted() {
    !this.siderMode &&
      this.$nextTick(function() {
        this.resizeHandler()
      })
  },
  beforeDestroy() {
    this.removeResizeHandle()
  },
  methods: {
    toSetting() {
      this.$router.push({
        path: USER_SETTING
      })
    },
    exit() {
      this.$store.commit('logout')
    },
    reComputedMenu(boxWidth, widthList) {
      // 根据宽度计算菜单合并
      let storeMenuList = JSON.parse(JSON.stringify(this.storeMenuList)),
        resultList = []
      boxWidth -= 50 //减去整合项宽度

      for (let i = 0; i < widthList.length; i++) {
        boxWidth -= widthList[i]
        if (boxWidth < 0) {
          resultList = storeMenuList.splice(i, storeMenuList.length - 1)
          break
        }
      }

      if (resultList.length > 0) {
        storeMenuList.push({
          id: 'hidden-menu',
          name: '···',
          children: resultList.map(i => {
            return {
              ...i,
              parentId: 'hidden-menu'
            }
          })
        })
      }

      this.menuList = storeMenuList
    },
    addResizeHandle() {
      window.addEventListener('resize', this.resizeHandler)
    },
    removeResizeHandle() {
      window.removeEventListener('resize', this.resizeHandler)
    },
    resizeHandler: debounce(function() {
      this.$nextTick(function() {
        let list = this.$refs.mainMenuBox.$el.children,
          boxWidth = this.$refs.mainMenuBox.$el.offsetWidth,
          widthList = this.menuWidthList || []

        if (!this.menuWidthList) {
          for (let i = 0; i < list.length; i++) {
            widthList.push(list[i].offsetWidth)
          }
        }

        this.reComputedMenu(boxWidth, widthList)
      })
    }, 100),
    toggleCollapse() {
      this.LayoutConfig.menu.collapse = !this.LayoutConfig.menu.collapse

      this.$emit('update:config', Object.assign({}, this.LayoutConfig))
    }
  }
}
</script>
<style lang="less">
.sidebar-container {
  position: relative;
  width: 200px;
  // height: 100%;
  overflow: hidden;
  // box-shadow: 1px 0 6px rgba(0, 21, 41, 0.35);
  background-color: #2d303b;
  padding-bottom: 60px;
  box-sizing: border-box;
  transition: max-width 0.3s ease, width 0.3s ease;

  &.horizontal {
    width: 100%;
    height: 64px;

    .el-submenu__icon-arrow {
      font-size: 14px;
      right: 2px;
      top: 35px;
    }

    .aside-menu {
      display: flex;
      justify-content: space-between;

      li {
        outline: none;
      }

      &::after,
      &::before {
        display: none;
      }
    }

    .scrollbar-wrapper {
      display: inline-block;
      height: 64px;
      // max-width: calc(100% - 130px - 300px);
      flex: 1;
      padding-right: 20px;
      margin-left: 20px;
      overflow-x: hidden !important;
      margin-bottom: 0 !important;

      .el-scrollbar__view {
        height: 100%;
      }
    }
  }

  .logo {
    position: relative;
    height: 62px;
    line-height: 62px;
    padding-left: 14px;
    background: #2d303b;
    overflow: hidden;
    display: inline-block;
    vertical-align: top;

    .logo-img {
      vertical-align: middle;
    }

    .logo-text {
      color: #fff;
      display: inline-block;
      vertical-align: middle;
      font-size: 20px;
      margin: 0 0 0 5px;
      font-weight: 400;
      opacity: 1;
    }
  }

  .user-box {
    padding: 10px;
    margin-top: 10px;
    text-align: center;
    color: @white;

    .avatar {
      max-width: 60px;
      max-height: 60px;
      display: block;
      margin: 0 auto 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .name {
      font-size: 18px;
      font-weight: 400;
      color: #fff;
    }

    .tools {
      display: flex;
      justify-content: center;
      margin-top: 10px;

      .tools-item {
        cursor: pointer;
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        background: rgba(0, 0, 0, 0.2);
        margin: 0 4px;
        border-radius: 50%;
        transition: background 0.3s ease;

        &:hover {
          background: @black;
          color: #fff;
        }
      }
    }
  }

  .el-scrollbar__bar.is-vertical {
    right: 0;
  }

  .is-horizontal {
    display: none;
  }

  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;

    .item-title {
      position: relative;

      &::before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 50%;
        left: -12px;
        transform: translateY(-50%);
        bottom: 0;
        width: 5px;
        height: 5px;
        background: rgba(171, 172, 176, 1);
        border-radius: 1px;
      }
    }
  }

  .fix-btn-wrap {
    width: 200px;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    transition: width 0.28s;

    &.hideSidebar {
      width: 64px;
    }

    .collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      width: 100%;
      background: #343744;
      cursor: pointer;
    }

    .btn-icon {
      transform: rotate(180deg);
      font-size: 16px;
      width: 16px;
    }
  }

  // 折叠
  &.hideSidebar {
    width: 64px !important;

    .logo {
      padding-left: 14px;
    }

    .scrollbar-wrapper {
      height: calc(100vh - 60px - 50px);
    }

    // 有子菜单
    .sub-menu-title,
    .el-submenu__icon-arrow {
      display: none;
    }

    [class*='icon'] {
      font-size: 16px;
      margin: 0;
    }

    .fix-btn-wrap {
      .btn-icon {
        transform: rotate(0deg);
      }
    }
  }

  // when menu collapsed
  .menu--vertical {
    // the scroll bar appears when the subMenu is too long
    > .menu--popup {
      max-height: 100vh;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 20px;
      }
    }
  }
}

.el-menu--popup {
  min-width: 160px;
}

.el-menu--horizontal {
  .el-submenu__title,
  .el-menu-item {
    padding: 0 20px !important;
  }
}
</style>
