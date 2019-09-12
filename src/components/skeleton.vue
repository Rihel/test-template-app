<template>
  <div v-show="visible" class="skeleton-box">
    <el-row :gutter="10" v-for="(row, rindex) in COLUMNS" :key="rindex">
      <el-col v-for="(col, cindex) in row" :key="cindex" :span="col">
        <div class="item"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const COLUMNS = [[20], [8, 15], [6, 18], [13, 9], [4, 3, 16]]

export default {
  data() {
    return {
      visible: false,
      COLUMNS
    }
  }
}
</script>

<style lang="less">
@keyframes card-loading {
  0%,
  to {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.skeleton-none {
  display: none !important;
}

.skeleton-box {
  z-index: 5000;
  width: 100%;
  height: 160px;
  background: #fff;
  overflow: hidden;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .item {
    height: 16px;
    background:
      linear-gradient(
        90deg,
        rgba(207, 216, 220, 0.2),
        rgba(207, 216, 220, 0.4),
        rgba(207, 216, 220, 0.2)
      );
    background-size: 600% 600%;
    border-radius: 2px;
    animation: card-loading 1.4s ease infinite;
    margin: 6px 0;
  }
}
</style>
