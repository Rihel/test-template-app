<template>
  <div class="base-chart">
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  name: 'BaseChart',
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) return
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    resize() {
      this.chart && this.chart.resize()
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption(this.options)
    }
  }
}
</script>
<style lang="less">
.base-chart {
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
