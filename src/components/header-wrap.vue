<template>
  <div class="header-wrap" :class="{hideHeader, vertical: siderMode}">
    <el-row class="head-container">
      <!-- <div
        :class="['head-btn-left', {hideSidebar: collapse}]"
        @click="collapse = !collapse"
      >
        <div class="icon-box"></div>
      </div> -->

      <component
        :is="siderMode ? 'div' : 'menu-list'"
        :config="config"
        :class="{vertical: siderMode}"
        :style="mainStyle"
      >
        <div class="head-right">
          <notice-msg :dark="!siderMode"></notice-msg>

          <el-popover
            placement="bottom-end"
            width="280"
            :popper-class="`user-popper ${userPopper && 'active'}`"
            v-model="userPopper"
            trigger="click"
          >
            <div class="user-data">
              <div class="avatar">
                <img :src="userImg" class="user-img" />
              </div>
              <div class="user-desc">
                <div class="name">
                  {{ $store.state.user.nickname }}
                </div>
                <div class="email">
                  admin@deepexi.com
                </div>
              </div>
            </div>

            <div class="tools">
              <div class="tools-item" @click="toSetting">
                <i class="el-icon-setting"></i> 用户设置
              </div>
              <div class="tools-item" @click="exit">
                <i class="el-icon-switch-button"></i> 退出
              </div>
            </div>

            <div slot="reference">
              <div class="head-active">
                <img :src="userImg" class="user-img" />
              </div>
              <!-- 用户名称 -->
              <div class="user-name" :style="{color: !siderMode && '#fff'}">
                {{ $store.state.user.nickname }}
              </div>
            </div>
          </el-popover>

          <!-- <el-dropdown placement="bottom-end" @command="commandHandle">
            <span class="el-dropdown-link">
              <i
                class="el-icon-arrow-down el-icon--right set-Iconcolor"
              ></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="user-drop-menu">
              <el-dropdown-item
                v-for="(item, index) in dropdownList"
                :key="index"
                :command="item.command"
                >{{ item.title }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
      </component>
    </el-row>
  </div>
</template>

<script>
import {Popover} from 'element-ui'
import NoticeMsg from '@/components/notice-msg.vue'
import MenuList from '@/components/menu-list.vue'

import debounce from 'lodash/debounce'

import {USER_SETTING} from '@/const/path.js'

export default {
  name: 'HeaderWrap',
  components: {
    'el-popover': Popover,
    NoticeMsg,
    MenuList
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
  watch: {
    autoHideHeader: {
      handler(val) {
        this.$nextTick(function() {
          this.hideHeader = false
          if (val) {
            window.addEventListener('scroll', this.scrollHandle)
          } else {
            window.removeEventListener('scroll', this.scrollHandle)
          }
        })
      },
      immediate: true
    }
  },
  computed: {
    autoHideHeader() {
      return this.config.fixedHeader && this.config.autoHideHeader
    },
    siderMode() {
      return this.config.layout === 'vertical'
    },
    userImg() {
      return this.$store.state.user.avatar
    }
  },
  data() {
    return {
      hideHeader: false,
      prevScrollTop: 0,
      userPopper: false
    }
  },
  methods: {
    scrollHandle: debounce(function() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0

      this.hideHeader =
        !(this.prevScrollTop > scrollTop) &&
        scrollTop >= this.config.targetHeight

      this.prevScrollTop = scrollTop
    }, 20),
    toSetting() {
      this.$router.push({
        path: USER_SETTING
      })
    },
    exit() {
      this.$store.commit('logout')
    }
  }
}
</script>
<style lang="less">
.header-wrap {
  height: @header-height;
  box-shadow: 1px 0 6px rgba(0, 21, 41, 0.2);
  transition: transform 0.2s ease, opacity 0.5s ease;
  opacity: 1;
  background: @menu-bgcolor;
  z-index: 100;

  &.vertical {
    background: #fff;
  }

  &.hideHeader {
    transform: translate3d(0, -@header-height, 0);
    opacity: 0;
  }

  .head-container {
    height: 100%;

    .vertical {
      display: flex;
      justify-content: flex-end;
      padding-right: 20px;
    }

    &::after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .head-btn-left {
    float: left;
    padding: 15px 20px;

    img {
      width: 30px;
      height: 30px;
    }

    .icon-box {
      width: 30px;
      height: 30px;
      background: url('../assets/menu-on.svg') no-repeat;
      background-size: cover;
    }
  }

  .head-btn-left:hover {
    background: rgba(0, 0, 0, 0.025);
    cursor: pointer;
  }

  .head-btn-left.hideSidebar {
    .icon-box {
      width: 30px;
      height: 30px;
      background: url('../assets/menu-off.svg') no-repeat;
      background-size: cover;
    }
  }

  .head-right {
    height: 100%;
    line-height: @header-height;
    padding-right: 24px;

    div {
      vertical-align: top;
      display: inline-block;
    }

    .head-active {
      vertical-align: top;
      cursor: pointer;

      .user-img {
        vertical-align: middle;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin: 0 15px;
      }
    }

    .user-name {
      text-align: center;
      overflow: hidden;
      margin-right: 10px;
      cursor: pointer;
    }

    .head-search {
      .set-search {
        margin-right: 5px;
      }

      .head-autocomplete {
        .el-icon-search {
          cursor: pointer;
          font-size: 18px;
        }
      }

      .el-dropdown-link {
        font-size: 18px;
        color: #a2a2b1 !important;
      }
    }

    .head-message {
      margin: 0 30px 0 20px;

      .item {
        .set-IconSize {
          height: 100%;
          max-width: 100%;
        }
      }
    }
  }
}

@keyframes rotate-in {
  0% {
    opacity: 0;
    transform: rotateY(90deg);
  }

  25% {
    opacity: 0.5;
    transform: rotateY(25deg);
  }

  50% {
    opacity: 1;
    transform: rotateY(-30deg);
  }

  80% {
    opacity: 1;
    transform: rotateY(20deg);
  }

  100% {
    opacity: 1;
    transform: rotateY(0);
  }
}

.user-popper {
  background: @menu-bgcolor;
  padding: 0;
  border-radius: 8px;
  transform-origin: center center;

  &.active {
    animation: rotate-in 1s linear;
  }

  .popper__arrow {
    border-bottom-color: @menu-bgcolor !important;

    &::after {
      border-bottom-color: @menu-bgcolor !important;
    }
  }

  .user-data {
    padding: 10px;
    display: flex;
    color: @white;

    .avatar {
      width: 60px;
      height: 60px;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .user-desc {
      line-height: 22px;
      font-size: 16px;
      padding-top: 6px;

      .name {
        font-weight: bold;
      }
    }
  }

  .tools {
    padding: 10px 0;
    color: @white;

    .tools-item {
      padding: 10px 20px;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      i {
        margin-right: 10px;
      }
    }
  }
}
</style>
