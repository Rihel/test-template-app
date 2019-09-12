<template>
  <div class="menu-item-box">
    <div
      v-for="m in menuList"
      :key="m.id"
      class="menu-item"
      :class="{'horizontal-item': mode === 'horizontal'}"
      v-if="!m.hidden"
    >
      <el-menu-item :index="m.url" v-if="!m.children">
        <icon-font :icon="m.icon"></icon-font>
        <!-- <span slot="title" class="item-title">{{ m.name }}</span> -->
        <span class="sub-menu-title">{{ m.name }}</span>
      </el-menu-item>

      <el-submenu v-else :index="m.id + ''">
        <template slot="title">
          <!--<i class="el-icon-menu"></i>-->
          <img
            v-if="checkUrl(m.icon)"
            class="menu-item-img"
            :src="m.icon"
            alt=""
          />
          <icon-font v-else :icon="m.icon"></icon-font>
          <span class="sub-menu-title">{{ m.name }}</span>
        </template>

        <menu-item :menuList="m.children"></menu-item>
      </el-submenu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    mode: {
      type: String
    },
    menuList: {
      type: Array
    }
  },
  methods: {
    checkUrl(urlString) {
      const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
      return urlString && reg.test(urlString)
    }
  }
}
</script>
<style lang="less">
.menu-item-box {
  height: 100%;
  overflow: hidden;

  .menu-item {
    &.horizontal-item {
      height: 100%;
      display: inline-block;
      // 覆盖默认样式
      .el-menu-item,
      .el-submenu__title {
        height: 64px;
        line-height: 64px;

        &.is-active {
          color: #5d81f9;
        }
      }
    }

    .menu-item-img {
      width: 16px;
      margin-right: 3px;
    }
  }
}
</style>
