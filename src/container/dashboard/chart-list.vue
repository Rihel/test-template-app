<template>
  <div :class="{'chart-list': true, empty: list.length == 0}">
    <div class="title">{{ name }}</div>

    <div class="list-box">
      <div class="item" v-for="(item, index) in list" :key="index">
        <el-row>
          <el-col :xs="2" :sm="2" :md="2">
            <icon-font
              :icon="`iconrank-${index + 1}`"
              :class="[`rank-${index + 1}`]"
              v-if="index < 3"
            ></icon-font>
            <span class="index" v-else>{{ index + 1 }}</span>
          </el-col>
          <el-col :xs="16" :sm="16" :md="16">
            <span class="item-name">{{ item.name }}</span>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6">
            <span class="unit">{{
              item.formatter ? item.formatter(item) : item.value
            }}</span>
          </el-col>
        </el-row>
      </div>

      <div v-if="list.length == 0" class="no-result">
        - 暂无数据 -
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    list: {
      type: Array,
      default: _ => []
    }
  }
}
</script>

<style lang="less" scoped>
.chart-list {
  .title {
    .s-title();
  }

  .list-box {
    overflow-y: auto;
    max-height: 350px;
  }

  .item {
    line-height: 26px;
    margin-bottom: 10px;

    span {
      vertical-align: middle;
      display: inline-block;
    }
  }

  .no-result {
    margin-top: 40px;
    text-align: center;
  }

  i[class^='icon'] {
    color: #f99;
    font-size: 20px;
    vertical-align: middle;

    &.rank-1 {
      color: #ffd31a;
    }

    &.rank-2 {
      color: #8a8a8a;
    }

    &.rank-3 {
      color: #78331e;
    }
  }

  .index {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background: #f0f2f5;
    margin-right: 14px;
  }

  .item-name {
    .text-overflow();
  }

  .unit {
    width: 95%;
    text-align: right;
  }
}
</style>
