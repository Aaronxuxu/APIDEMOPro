<template>
  <div ref="census" class="census">
    <el-row>
      <el-col
        :span="20"
        :offset="2"
        :sm="{ span: 11, offset: 0 }"
        :lg="{ span: 7, offset: 1 }"
      >
        <div class="census-col">
          <div class="census-header">
            <div class="census-header-title">
              Demo浏览饼图
              <el-button
                icon="el-icon-refresh"
                circle
                type="info"
                size="small"
                @click="handleReFresh('percentage')"
              />
            </div>

            <div class="census-header-tips">总量：{{ percentage.total }}</div>
          </div>
          <div v-loading="percentage.isLoading" class="census-main">
            <pieChart ref="pieChart" :option="percentage.list" />
          </div>
        </div>
      </el-col>
      <el-col
        :span="20"
        :offset="2"
        :sm="{ span: 11, offset: 2 }"
        :lg="{ span: 7, offset: 1 }"
      >
        <div class="census-col">
          <div class="census-header">
            <div class="census-header-title">
              Demo浏览柱状图
              <el-button
                icon="el-icon-refresh"
                circle
                type="info"
                size="small"
                @click="handleReFresh('percentage')"
              />
            </div>

            <div class="census-header-tips">总量：{{ percentage.total }}</div>
          </div>
          <div v-loading="percentage.isLoading" class="census-main">
            <columChart ref="pieChart" :option="percentage.list" />
          </div>
        </div>
      </el-col>
      <el-col
        :span="20"
        :offset="2"
        :sm="{ span: 11, offset: 0 }"
        :lg="{ span: 7, offset: 1 }"
      >
        <div class="census-col">
          <div class="census-header">
            <div class="census-header-title">
              <div>
                查询排行榜
                <span class="census-header-title-desc">
                  {{ rankList.curRankKey | filterRankKey }}
                </span>
              </div>
              <div>
                <el-button
                  icon="el-icon-sort"
                  circle
                  type="primary"
                  size="small"
                  @click="handleChangeRankKey"
                />
                <el-button
                  icon="el-icon-refresh"
                  circle
                  type="info"
                  size="small"
                  @click="handleReFresh('rankList')"
                />
              </div>
            </div>
          </div>
          <div class="census-main">
            <el-table
              v-loading="rankList.isLoading"
              :data="rankList.dataList"
              :cell-style="{ 'text-align': 'center' }"
              :header-cell-style="{
                'text-align': 'center'
              }"
              stripe
            >
              <template slot="empty">
                <el-empty>
                  <el-button type="primary" @click="handleReFresh('rankList')">
                    刷新
                  </el-button>
                </el-empty>
              </template>
              <el-table-column label="名次">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column label="Demo名称">
                <template slot-scope="scope">
                  <div class="census-main-table-ceil">
                    {{ scope.row.label }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="查询次数" />
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getIndexPageData, reFreshData } from '@/api/census'
import pieChart from './components/pieChart'
import columChart from './components/columChart'
import lineChart from './components/lineChart'

export default {
  components: { pieChart, columChart, lineChart },
  filters: {
    filterRankKey(val) {
      return val === 'hour' ? '一小时内' : val === 'day' ? '一天内' : '一周内'
    }
  },
  data() {
    return {
      percentage: {
        total: 0,
        list: [],
        isLoading: true
      },
      rankList: {
        curRankKey: 'hour',
        curIndex: 0,
        isLoading: true,
        dataList: [],
        rankArr: [
          { label: '一小时内', value: 'hour' },
          { label: '一天内', value: 'day' },
          { label: '一周内', value: 'weekly' }
        ]
      }
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile
    }
  },

  mounted() {
    this.getDataLists()
  },
  methods: {
    async getDataLists() {
      try {
        const { hourSort, percentage } = await getIndexPageData()
        if (percentage.status === 1) {
          this.percentage = {
            total: percentage.total,
            list: percentage.data.map((e) => ({
              value: e.total,
              name: e.classifyLabel
            })),
            isLoading: false
          }
        }
        if (hourSort.status === 1) {
          this.rankList = {
            ...this.rankList,
            isLoading: false,
            dataList: hourSort.data
          }
        }
      } catch (error) {
        return this.$message({
          type: 'error',
          message: error.msg
        })
      }
    },
    async handleReFresh(key) {
      this[key].isLoading = true
      let chiKey = null
      if (key === 'rankList') {
        chiKey = this.rankList.curRankKey
      }
      try {
        const { data, total } = await reFreshData({ key, chiKey })
        if (key === 'percentage') {
          this.percentage = {
            ...this.percentage,
            total: total,
            list: data.map((e) => ({
              value: e.total,
              name: e.classifyLabel
            }))
          }
        }
        if (key === 'rankList') {
          this.rankList = { ...this.rankList, dataList: data }
        }
      } catch (error) {
        this.$message({
          type: 'error',
          message: '刷新数据失败！'
        })
      }
      this[key].isLoading = false
    },
    handleChangeRankKey() {
      const curIndex = (this.rankList.curIndex + 1) % 3
      const curKey = this.rankList.rankArr[curIndex].value
      this.rankList = { ...this.rankList, curIndex, curRankKey: curKey }
      return this.handleReFresh('rankList')
    }
  }
}
</script>

<style scoped>
.census {
  min-height: calc(100vh - 50px);
  padding: 40px;
  background-color: #f7f7f7;
}

.census-col {
  margin-bottom: 30px;
  border-radius: 15px;
  padding: 15px;
  background-color: #fff;
  overflow: hidden;
}
.census-header {
  line-height: 2;
  font-weight: 600;
  font-size: 24px;
}
.census-header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.census-header-title-desc {
  font-size: 16px;
  font-weight: 500;
}
.census-header-tips {
  padding: 15px 0 0;
  font-size: 20px;
  text-align: right;
}

.census-main-table-ceil {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

