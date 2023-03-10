<template>
  <div class="lineChart" />
</template>

<script>
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

import moment from 'moment'

import resize from '../mixins/resize'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

export default {
  mixins: [resize],
  props: ['option'],
  data() {
    return {
      chart: null
    }
  },
  computed: {
    xArr() {
      const arr = []
      for (let i = 7; i >= 1; i--) {
        arr.push(moment().subtract(i, 'day').format('YYYY-MM-DD'))
      }
      return arr
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
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                type: 'scroll',
                data: val.map((e) => e.name),
                top: 'bottom'
              },
              grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.xArr
              },
              yAxis: {
                type: 'value'
              },
              series: val.map((e) => ({
                name: e.name,
                type: 'line',
                data: e.data
              }))
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
  },
  mounted() {}
}
</script>

<style scope>
.lineChart {
  width: 100%;
  aspect-ratio: 1 / 1;
}
@media (min-width: 768px) {
  .lineChart {
    aspect-ratio: 3 / 1;
  }
}
</style>
