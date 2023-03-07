<template>
  <div class="columChart" />
</template>

<script>
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import resize from '../mixins/resize'

echarts.use([GridComponent, BarChart, CanvasRenderer])

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
          // console.log(val)
          this.chart.setOption({
            xAxis: {
              type: 'category',
              data: val.map((e) => e.name)
            },
            yAxis: {
              type: 'value'
            },
            label: {
              show: true
            },
            series: [
              {
                data: val.map((e) => e.value),
                type: 'bar'
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

<style scoped>
.columChart {
  width: 100%;
  aspect-ratio: 1;
}
</style>
