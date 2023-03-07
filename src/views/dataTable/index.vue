<template>
  <div class="dataTable">
    <!-- 头部 -->
    <div v-show="!isMobile" class="dataTable-Header">
      <div class="dataTable-Header-Left">
        <el-input
          v-model="queryProps.classify"
          placeholder="项目名称（按回车键即可搜索）"
          clearable
          @change="handleSearch"
        />
        <el-select v-model="queryProps.sortProps" @change="handleSortSelect">
          <el-option
            v-for="item in selectOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" @click="getDataList">刷新</el-button>
        <el-button type="info" @click="refreshProps">重置</el-button>
      </div>
      <DataDownload />
    </div>
    <!-- 表格数据 -->
    <div class="dataTable-Main">
      <el-table
        v-loading="loading"
        border
        :data="dataList"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <template slot="empty">
          <el-empty>
            <el-button type="primary" @click="refreshProps">刷新</el-button>
          </el-empty>
        </template>
        <el-table-column label="查询时间" prop="reqTime" width="200">
          <template slot-scope="scope">
            {{ scope.row.reqTime | fileterTime }}
          </template>
        </el-table-column>
        <el-table-column label="所属Demo" prop="classify">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="点击跳转Demo页面"
              placement="left"
            >
              <div
                class="dataTable-Main-Table-Classify"
                @click="handleDemoPage(scope.row.classify.apiURL)"
              >
                <div class="dataTable-Main-Table-Classify-Label">
                  中文名称：
                  <span class="dataTable-Main-Table-Classify-Label-Span">
                    {{ scope.row.classify.classifyLabel }}
                  </span>
                </div>
                <div class="dataTable-Main-Table-Classify-Label">
                  英文名称：
                  <span class="dataTable-Main-Table-Classify-Label-Span">
                    {{ scope.row.classify.classifyName }}
                  </span>
                </div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="查询内容" prop="textVal">
          <template slot-scope="scope">
            <div class="dataTable-Main-Table-cell">
              {{ scope.row.textVal }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="dataTable-Footer">
      <el-pagination
        :current-page="queryProps.pageNo"
        :page-size="queryProps.pageSize"
        :page-sizes="[10, 30, 50, 70, 100]"
        :layout="
          isMobile
            ? 'prev, pager, next'
            : 'total, sizes, prev, pager, next, jumper'
        "
        :total="total"
        :small="isMobile"
        hide-on-single-page
        background
        @size-change="(num) => handlePagePropsChange(num, 'pageSize')"
        @current-change="(num) => handlePagePropsChange(num, 'pageNo')"
      />
    </div>
  </div>
</template>

<script>
import { getReportCount } from '@/api/dataTable'
import DataDownload from './component/DataDownload'
import _omit from 'lodash/omit'
import moment from 'moment'
export default {
  components: { DataDownload },
  filters: {
    fileterTime(val) {
      return moment(val).format('YYYY-MM-DD hh:mm')
    }
  },
  data() {
    return {
      dataList: [],
      queryProps: {
        pageNo: 1,
        pageSize: 10,
        classify: '',
        sortProps: -1
      },
      total: 1,
      loading: true,
      selectOption: [
        { label: '最早排序', value: '最早排序' },
        { label: '最近排序', value: '最近排序' }
      ]
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile
    }
  },
  watch: {
    '$route.query': {
      deep: true,
      immediate: true,
      handler(val) {
        const {
          pageNo = 1,
          pageSize = 10,
          classify = '',
          sortProps = '最近排序'
        } = val
        this.queryProps = {
          pageNo: Number(pageNo),
          pageSize: Number(pageSize),
          classify,
          sortProps
        }
        this.getDataList()
      }
    }
  },
  methods: {
    // 获取数据
    async getDataList() {
      this.loading = true
      const { sortProps } = this.queryProps
      try {
        const {
          data: { list, total }
        } = await getReportCount({
          ...this.queryProps,
          sortProps: sortProps === '最早排序' ? 1 : -1
        })
        this.total = total
        this.dataList = list
        this.loading = false
      } catch (error) {
        const { msg } = error
        this.loading = false
        return this.$message({
          type: 'error',
          message: msg
        })
      }
    },

    /*
      头部相关函数
    */
    //  搜索
    handleSearch() {
      return this.$router.push({
        name: 'DataTable',
        query: this.queryProps
      })
    },
    // 排序
    handleSortSelect(val) {
      console.log(val)
      return this.$router.push({
        name: 'DataTable',
        query: this.queryProps
      })
    },
    // 重置参数
    refreshProps() {
      return this.$router.push({
        name: 'DataTable'
      })
    },

    /*
      表格函数
    */
    handleDemoPage(url) {
      return window.open(url)
    },

    /*
      分页
    */
    // 页面跳转/页码更换
    handlePagePropsChange(num, key) {
      let obj = this.queryProps

      if (this.queryProps.classify.trim() === '') {
        obj = _omit(obj, ['classify'])
      }

      if (this.queryProps.sortProps.trim() === '') {
        obj = _omit(obj, ['sortProps'])
      }

      if (key === 'pageSize') {
        obj = {
          ...obj,
          pageNo: 1
        }
      }
      return this.$router.push({
        name: 'DataTable',
        query: { ...obj, [key]: num }
      })
    }
  }
}
</script>

<style scoped>
.dataTable {
  padding: 20px;
}
.dataTable-Header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* padding: 0 0 15px; */
}
.dataTable-Header-Left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
.dataTable-Header-Left .el-button {
  margin: 0;
}

.dataTable-Main {
  padding: 10px 0;
}
.dataTable-Main-Table-cell {
  text-align: left;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.dataTable-Main-Table-Classify {
  text-align: left;
  cursor: pointer;
}
.dataTable-Main-Table-Classify-Label {
  text-align: left;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dataTable-Main-Table-Classify-Label-Span {
  font-weight: 700;
  letter-spacing: 1px;
  word-spacing: 1px;
}
.dataTable-Footer {
  /* padding: 25px 0 0; */
  text-align: center;
}
</style>
