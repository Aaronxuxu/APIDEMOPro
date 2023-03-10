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
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (val.length > 0) {
            if (!this.chart) {
              this.chart = echarts.init(this.$el)
            }
            this.chart.setOption({
              xAxis: {
                type: 'category',
                data: val.map((e) => e.name)
              },
              yAxis: {
                type: 'value'
              },

              tooltip: {
                trigger: 'item',
                formatter: '查询次数 <br/>{b} : {c}'
              },
              series: [
                {
                  data: val.map((e) => e.value),
                  type: 'bar',
                  showBackground: true,
                  backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
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

<style scoped>
.columChart {
  width: 100%;
  aspect-ratio: 1;
}
</style>
