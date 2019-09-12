<template>
  <div class="analysis">
    <!-- 头部卡片 -->
    <el-row :gutter="10" class="mb10">
      <el-col
        v-bind="layoutConfig"
        v-for="(item, index) in cardList"
        :key="index"
        v-skeleton="showSkeleton"
      >
        <div
          class="statistics-box shadow"
          :style="{backgroundColor: item.bgColor}"
        >
          <icon-font :icon="item.icon" />

          <div class="box-inner">
            <p class="count">{{ item.value }}</p>
            <p>{{ item.label }}</p>
          </div>

          <div class="update-time">更新时间：{{ item.updateTime }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 头部简略图表 -->
    <el-row :gutter="10" class="mb10">
      <el-col v-skeleton="showSkeleton" v-bind="layoutConfig">
        <charts-box
          name="访问量"
          amount="31232"
          subAmount="日访问量：12,423"
          class="shadow"
        >
          <base-chart
            style="height:70px;"
            slot="chart"
            ref="headLineChart"
            :options="getHeaderLineChartOptions()"
          ></base-chart>
        </charts-box>
      </el-col>

      <el-col v-skeleton="showSkeleton" v-bind="layoutConfig">
        <charts-box
          name="总销售额"
          amount="¥ 126,560"
          subAmount="日销售额￥12,423"
          class="shadow"
        >
          <base-chart
            style="height:70px;"
            slot="chart"
            ref="totalChart"
            :options="getHeaderBarChartOptions()"
          ></base-chart>
        </charts-box>
      </el-col>

      <el-col v-skeleton="showSkeleton" v-bind="layoutConfig">
        <charts-box
          name="下单量"
          amount="12,423"
          subAmount="日均下单：1242"
          class="shadow"
        >
          <base-chart
            style="height:70px;"
            slot="chart"
            ref="orderChart"
            :options="getHeaderOrderChartOptions()"
          ></base-chart>
        </charts-box>
      </el-col>

      <el-col v-skeleton="showSkeleton" v-bind="layoutConfig">
        <charts-box
          name="转化率"
          amount="60%"
          subAmount="增加20%↑"
          class="shadow"
        >
          <base-chart
            style="height:70px;"
            slot="chart"
            ref="funnelChart"
            :options="getHeaderFunnelChartOptions()"
          ></base-chart>
        </charts-box>
      </el-col>
    </el-row>

    <!-- tab切换图表 -->
    <el-card class="card-box">
      <el-tabs v-model="activeTab" v-skeleton="showSkeleton">
        <el-tab-pane label="销售趋势" name="1">
          <el-row :gutter="10">
            <el-col :xs="24" :md="17">
              <div class="s-title">
                销售趋势
              </div>
              <base-chart
                ref="barChart"
                style="height:300px;"
                :options="getBarChartOptions()"
              ></base-chart>
            </el-col>
            <el-col :xs="24" :md="7">
              <chart-list name="门店销售额排名" :list="saleData"></chart-list>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="访问量" name="2" lazy>
          <el-row :gutter="10">
            <el-col :xs="24" :md="17">
              <div class="s-title">
                访问量
              </div>
              <base-chart
                ref="viewChart"
                style="height:300px;"
                :options="getLineChartOptions()"
              ></base-chart>
            </el-col>
            <el-col :xs="24" :md="7">
              <chart-list name="门店访问量排名" :list="viewData"></chart-list>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 饼图 -->
    <el-card class="card-box">
      <el-row :gutter="10">
        <el-col v-skeleton="showSkeleton" :md="12">
          <amount-chart
            ref="amountChart"
            :totalMoney="totalMoney"
            :brandList="brandList"
            :categoryList="categoryList"
          ></amount-chart>
        </el-col>
        <el-col v-skeleton="showSkeleton" :push="1" :md="10">
          <sub-title
            style="margin-top: 0;"
            title="销售目标完成情况"
          ></sub-title>
          <div class="s-title">今日销售目标</div>
          <el-progress :percentage="90" :color="customColors"></el-progress>
          <br />
          <div class="s-title">月销售目标</div>
          <el-progress :percentage="60" :color="customColors"></el-progress>
          <br />
          <div class="s-title">季度销售目标</div>
          <el-progress :percentage="30" :color="customColors"></el-progress>
          <br />
          <div class="s-title">年度销售目标</div>
          <el-progress :percentage="10" :color="customColors"></el-progress>
        </el-col>
      </el-row>
    </el-card>

    <!-- 库存情况饼图 -->
    <el-card>
      <sub-title v-show="!showSkeleton" title="库存剩余情况"></sub-title>
      <el-row :gutter="10">
        <el-col
          v-skeleton="showSkeleton"
          :xs="24"
          :sm="12"
          :md="6"
          v-for="(i, index) in [90, 70, 50, 30]"
          :key="index"
        >
          <div class="circle-box">
            <div class="s-title">品类{{ index + 1 }}</div>
            <el-progress
              type="circle"
              :percentage="i"
              :color="circleCustomColors"
            ></el-progress>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import ChartsBox from '@/container/dashboard/charts-box'
import ChartList from '@/container/dashboard/chart-list'
import AmountChart from '@/container/dashboard/amount-chart'

import BaseChart from '@/components/base-chart'

import {Progress} from 'element-ui'

import debounce from 'lodash/debounce'

const BaseColor = '#1890FF'

export default {
  name: 'analysis',
  components: {
    ChartsBox,
    BaseChart,
    ChartList,
    AmountChart,
    'el-progress': Progress
  },
  data() {
    return {
      showSkeleton: true,
      activeTab: '1',
      layoutConfig: {
        xs: 24,
        sm: 12,
        md: 6
      },

      // tab图表数据
      saleData: Array.from(new Array(12), (i, index) => ({
        name: `门店 ${index}`,
        value: `￥${parseInt(Math.random() * 1000)}`
      })),
      viewData: Array.from(new Array(12), (i, index) => ({
        name: `门店 ${index}`,
        value: `${parseInt(Math.random() * 1000)}人`
      })),

      // 饼图数据
      totalMoney: 2100,
      brandList: Array.from(new Array(6), (i, index) => ({
        name: `品牌 ${index}`,
        value: `${(index + 1) * 100}`,
        percent: ((index + 1) * 100) / 2100
      })),
      categoryList: Array.from(new Array(3), (i, index) => ({
        name: `分类 ${index}`,
        value: `${(index + 1) * 100}`,
        percent: ((index + 1) * 100) / 2100
      })),

      // 进度条颜色
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#6f7ad3', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#5cb87a', percentage: 100}
      ],

      // 圆形进度条颜色
      circleCustomColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#6f7ad3', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#5cb87a', percentage: 100}
      ],

      cardList: [
        {
          bgColor: '#e2357c',
          icon: 'iconup',
          value: '$ 120,690',
          label: '总收入',
          updateTime: '13:00'
        },
        {
          bgColor: '#f1634e',
          icon: 'iconcomputer',
          value: '975K+',
          label: '访问量',
          updateTime: '13:00'
        },
        {
          bgColor: '#01a693',
          icon: 'iconbox',
          value: parseInt(Math.random() * 1000),
          label: '订单量',
          updateTime: '13:00'
        },
        {
          bgColor: '#00b8e5',
          icon: 'iconincome',
          value: '$ 2,206',
          label: '今日收入',
          updateTime: '13:00'
        }
      ]
    }
  },
  methods: {
    resizeHandler: debounce(function() {
      this.$nextTick(function() {
        let resizeList = [
          this.$refs.totalChart || {},
          this.$refs.headLineChart || {},
          this.$refs.barChart || {},
          this.$refs.funnelChart || {},
          this.$refs.viewChart || {},
          this.$refs.amountChart || {},
          this.$refs.orderChart || {}
        ]

        resizeList.forEach(i => {
          i.resize && i.resize()
        })
      })
    }, 100),
    getLineChartOptions() {
      // 访问量折线图
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 50,
          top: 20,
          bottom: 20
        },
        xAxis: {
          type: 'category',
          show: true,
          data: Array.from(new Array(12), (i, index) => `${index + 1}月`)
        },
        yAxis: [
          {
            type: 'value',
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '交易金额',
            type: 'line',
            barMaxWidth: '30',
            itemStyle: {
              normal: {
                color: BaseColor
              }
            },
            areaStyle: {},
            data: Array.from(new Array(12), () =>
              parseInt(Math.random() * 1000)
            )
          }
        ]
      }
    },
    getBarChartOptions() {
      // 销售趋势配置
      return {
        tooltip: {},
        grid: {
          left: 50,
          top: 20,
          bottom: 20
        },
        xAxis: {
          type: 'category',
          show: true,
          data: Array.from(new Array(12), (i, index) => `${index + 1}月`)
        },
        yAxis: [
          {
            type: 'value',
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '交易金额',
            type: 'bar',
            barMaxWidth: '30',
            itemStyle: {
              normal: {
                color: BaseColor
              }
            },
            data: Array.from(new Array(12), () =>
              parseInt(Math.random() * 1000)
            )
          }
        ]
      }
    },
    getHeaderLineChartOptions() {
      // 头部访问量配置
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 0,
          right: 0
          // containLabel: false
        },
        xAxis: {
          type: 'category',
          show: false,
          data: Array.from(new Array(12), (i, index) => `${index + 1}月`)
        },
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#955FE2'
            },
            itemStyle: {
              normal: {
                color: '#955FE2'
              }
            },
            areaStyle: {},
            data: Array.from(new Array(12), () =>
              parseInt(Math.random() * 1000)
            )
          }
        ]
      }
    },
    getHeaderOrderChartOptions() {
      // 头部订单折线图配置
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 0,
          right: 0
        },
        xAxis: {
          type: 'category',
          show: false,
          data: Array.from(new Array(12), (i, index) => `${index + 1}月`)
        },
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            name: '下单量',
            type: 'line',
            lineStyle: {
              color: '#13C2C2'
            },
            itemStyle: {
              normal: {
                color: '#13C2C2'
              }
            },
            areaStyle: {},
            data: Array.from(new Array(12), () =>
              parseInt(Math.random() * 1000)
            )
          }
        ]
      }
    },
    getHeaderBarChartOptions() {
      // 头部柱状图配置
      return {
        tooltip: {},
        grid: {
          left: '5%',
          right: '5%',
          containLabel: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          show: false
        },
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            name: '交易金额',
            type: 'bar',
            smooth: false,
            lineStyle: {
              color: BaseColor
            },
            itemStyle: {
              normal: {
                color: BaseColor
              }
            },
            data: Array.from(new Array(15), () =>
              parseInt(Math.random() * 1000)
            )
          }
        ]
      }
    },
    getHeaderFunnelChartOptions() {
      // 获取漏斗配置
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        calculable: true,
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '2%',
            top: 60,
            width: '95%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: false,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 10,
                type: 'solid'
              }
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: [
              {value: 100, name: '查看'},
              {value: 80, name: '点击'},
              {value: 60, name: '访问'},
              {value: 40, name: '咨询'},
              {value: 20, name: '下单'}
            ]
          }
        ]
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.showSkeleton = false
    }, 1000)
    window.onresize = this.resizeHandler
    // 监听resize时间 重绘图表
    // window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.resizeHandler)
    window.onresize = null
  }
}
</script>

<style lang="less">
.analysis {
  .mb10 {
    margin-bottom: 10px;
  }

  .shadow {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .card-box {
    margin-bottom: 20px;
  }

  .statistics-box {
    border-radius: 6px;
    color: #fff;
    padding: 30px 25px 15px;
    font-size: 14px;
    position: relative;
    min-height: 160px;
    margin-bottom: 10px;
    display: flex;

    i {
      font-size: 34px;
      margin: 4px 15px 0 0;
    }

    .box-inner {
      display: inline-block;
      font-size: 16px;

      .count {
        font-size: 24px;
      }
    }

    .update-time {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: rgba(0, 0, 0, 0.1);
      padding-left: 30px;
    }
  }

  .circle-box {
    text-align: center;
  }
}
</style>
