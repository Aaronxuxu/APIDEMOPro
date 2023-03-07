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
      handler(val) {
        if (val.length > 0) {
          this.chart.setOption({
            legend: {
              type: 'scroll',
              top: 'bottom'
            },
            series: [
              {
                type: 'pie',
                radius: ['8%', '50%'],
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: {
                  borderRadius: 8
                },
                labelLine: {
                  // show: false
                },
                label: {
                  // show: false
                },
                data: val
              }
            ]
          })
        }
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  mounted() {
    this.chart = echarts.init(this.$el)
  }
}
</script>

<style>
.pieChart {
  width: 100%;
  aspect-ratio: 1;
}
</style>
