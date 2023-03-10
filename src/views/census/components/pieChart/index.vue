<template>
  <div class="pieChart" />
</template>

<script>
import * as echarts from 'echarts/core'
import { ToolboxComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import resize from '../mixins/resize'

echarts.use([
  ToolboxComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])

export default {
  mixins: [resize],
  props: ['option'],
  data() {
    return {
      chart: null
    }
  },
  watch: {
    option: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (val.length > 0) {
            if (!this.chart) {
              this.chart = echarts.init(this.$el)
            }
            this.chart.setOption({
              legend: {
                type: 'scroll',
                top: 0
              },
              tooltip: {
                trigger: 'item',
                formatter: '查询次数 <br/>{b} : {c} ({d}%)'
              },
              series: [
                {
                  type: 'pie',
                  radius: ['5%', '50%'],
                  center: ['50%', '50%'],
                  roseType: 'area',
                  itemStyle: {
                    borderRadius: 8
                  },

                  data: val,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            })
          }
        })
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }
}
</script>

<style>
.pieChart {
  width: 100%;
  aspect-ratio: 1;
}
</style>
