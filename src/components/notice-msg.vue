<template>
  <div class="notice-msg">
    <el-popover
      placement="bottom-end"
      width="340"
      popper-class="notice-popper"
      trigger="click"
    >
      <el-tabs v-model="activeTab" stretch @tab-click="tabClickHandle">
        <el-tab-pane
          v-for="i in tabList"
          :label="`${i.label}(${i.list.length})`"
          :name="i.name"
          :key="i.name"
        >
        </el-tab-pane>
      </el-tabs>

      <el-carousel
        :height="carouselHeight"
        indicator-position="none"
        :autoplay="false"
        :loop="false"
        arrow="never"
        ref="carousel"
        :initial-index="+activeList.name"
      >
        <el-carousel-item
          v-for="(tag, tindex) in tabList"
          :key="tindex"
          :name="tag.name"
          :style="{opacity: activeList.name === tag.name ? 1 : 0}"
        >
          <ul class="notice-list" v-if="tag.list.length > 0">
            <notice-item
              v-for="(item, index) in tag.list"
              :item="item"
              :key="index"
              @click-handle="clickHandle($event, index)"
            ></notice-item>
          </ul>
          <div class="empty-msg" v-else>
            <img
              src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            这里空空如也
          </div>
        </el-carousel-item>
      </el-carousel>

      <el-button-group v-if="activeList.list.length > 0">
        <el-button class="popover-btn" @click="clearAll"
          >清空{{ activeList.label }}</el-button
        >
        <el-button class="popover-btn" @click="readAll">全部已读</el-button>
      </el-button-group>

      <div slot="reference" class="base-btn" :class="{dark}">
        <el-badge :value="unReadNum" :hidden="unReadNum === 0">
          <i class="el-icon-bell"></i>
        </el-badge>
      </div>
    </el-popover>
  </div>
</template>

<script>
import {Popover, Badge, ButtonGroup, Carousel, CarouselItem} from 'element-ui'

import NoticeItem from '@/components/notice-item.vue'

export default {
  name: 'NoticeMsg',
  components: {
    'el-popover': Popover,
    'el-badge': Badge,
    'el-button-group': ButtonGroup,
    'el-carousel': Carousel,
    'el-carousel-item': CarouselItem,
    NoticeItem
  },
  props: {
    dark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: '0',
      unReadNum: 0,
      tabList: [
        {
          label: '通知',
          name: '0',
          list: [
            {
              icon: 'email',
              title: '你收到了 14 份新周报',
              description: '这里描述信息',
              time: '很久以前',
              read: false
            },
            {
              icon: 'dingtalk',
              title: '你收到了 14 份新周报',
              description: '这里描述信息',
              time: '很久以前',
              read: false
            },
            {
              icon: 'add',
              title: '你收到了 14 份新周报',
              description: '这里描述信息',
              time: '很久以前',
              read: false
            },
            {
              icon: 'like',
              title:
                '你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报',
              description: '这里描述信息',
              time: '很久以前',
              read: false
            }
          ]
        },
        {
          label: '消息',
          name: '1',
          list: Array.from(new Array(10), _ => ({
            icon: 'email',
            title: '你收到消息啦',
            description: '没用的消息',
            time: '很久以前',
            read: false
          }))
        },
        {
          label: '待办',
          name: '2',
          list: [
            {
              title: '这是个任务',
              description: '任务十分紧急任务十分紧急',
              tagMsg: '未开始',
              tagType: 'info',
              time: '2019 06-20 17:00',
              read: false
            },
            {
              title: '这是个任务',
              description: '任务十分紧急任务十分紧急',
              tagMsg: '马上到期',
              tagType: 'danger',
              time: '2019 06-20 17:00',
              read: false
            },
            {
              title: '这是个任务',
              description: '任务十分紧急任务十分紧急',
              tagMsg: '即将逾期',
              tagType: 'warning',
              time: '2019 06-20 17:00',
              read: false
            },
            {
              title: '这是个任务',
              description: '任务十分紧急任务十分紧急',
              tagMsg: '进行中',
              tagType: 'primary',
              time: '2019 06-20 17:00',
              read: false
            },
            {
              title: '这是个任务',
              description: '任务十分紧急任务十分紧急',
              tagMsg: '完成',
              tagType: 'success',
              time: '2019 06-20 17:00',
              read: false
            }
          ]
        }
      ]
    }
  },
  computed: {
    activeList() {
      return this.tabList[this.activeTab]
    },
    carouselHeight() {
      let height = this.activeList.list.length * 91
      height = height < 300 ? 300 : height > 500 ? 500 : height
      return `${height}px`
    }
  },
  mounted() {
    this.getUnReadMsg()
  },
  methods: {
    tabClickHandle() {
      this.$refs.carousel.setActiveItem(this.activeList.name)
    },
    clickHandle(data, index) {
      this.$set(this.activeList.list, index, data)

      this.getUnReadMsg()
    },
    clearAll() {
      this.tabList[this.activeTab].list = []

      this.getUnReadMsg()
    },
    readAll() {
      this.activeList.list.forEach((item, index) => {
        this.$set(this.activeList.list, index, {...item, read: true})
      })

      this.getUnReadMsg()
    },
    getUnReadMsg() {
      this.unReadNum = this.tabList.reduce((total, item) => {
        return (total += item.list.filter(msg => !msg.read).length)
      }, 0)
    }
  }
}
</script>
<style lang="less">
.notice-msg {
  .base-btn {
    margin-top: 15px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    vertical-align: top;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }

    &.dark {
      color: #fff;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .el-badge__content.is-fixed {
      top: 5px;
    }

    .el-icon-bell {
      font-size: 18px;
      margin-right: 0;
      vertical-align: middle;
    }
  }

  .el-badge__content {
    border: none;
  }
}

.notice-popper {
  padding: 0;
  border: none;

  .notice-list {
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 0;

    .notice-item:last-child {
      border: none;
    }
  }

  .empty-msg {
    text-align: center;
    color: #ccc;
    padding: 80px 0;

    img {
      width: 100px;
      display: block;
      margin: 0 auto 10px;
    }
  }

  .popover-btn {
    width: 170.5px;
    padding: 15px 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .el-tabs__header {
    margin-bottom: 0;
  }
}
</style>
