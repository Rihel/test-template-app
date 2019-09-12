<template>
  <li
    class="notice-item"
    :class="{'notice-item-read': item.read}"
    @click="clickHandle"
  >
    <div class="avator" v-if="item.icon">
      <img :src="iconType[item.icon]" />
    </div>
    <div class="content">
      <div class="notice-title">
        {{ item.title }}
        <el-tag
          v-if="item.tagMsg"
          :type="item.tagType"
          size="mini"
          class="notice-tag"
          >{{ item.tagMsg }}</el-tag
        >
      </div>
      <div class="notice-description">
        {{ item.description }}
      </div>
      <div class="notice-time" v-if="item.time">
        {{ item.time }}
      </div>
    </div>
  </li>
</template>

<script>
import {Tag} from 'element-ui'

export default {
  name: 'NoticeItem',
  components: {
    'el-tag': Tag
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      iconType: {
        email:
          'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        dingtalk:
          'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        add:
          'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
        like:
          'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png'
      }
    }
  },
  methods: {
    clickHandle() {
      this.$emit('click-handle', Object.assign({}, this.item, {read: true}))
    }
  }
}
</script>
<style lang="less">
.notice-item {
  padding: 12px 24px;
  display: flex;
  cursor: pointer;
  transition: background 0.3s ease, opacity 0.2s linear;
  border-bottom: 1px solid #e8e8e8;

  &-read {
    opacity: 0.4;
  }

  &:hover {
    background: #e6f7ff;
  }

  .avator {
    width: 32px;
    height: 32px;
    margin-right: 16px;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .content {
    flex: 1;

    .notice {
      &-title {
        font-size: 14px;
        color: #2d303b;
        margin-bottom: 8px;

        &::after {
          content: '';
          display: block;
          clear: both;
        }

        .notice-tag {
          float: right;
        }
      }

      &-description {
        font-size: 12px;
        color: #ccc;
      }

      &-time {
        font-size: 12px;
        color: #ccc;
        margin-top: 4px;
      }
    }
  }
}
</style>
