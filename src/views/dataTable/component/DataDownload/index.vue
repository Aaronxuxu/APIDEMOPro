<template>
  <div class="downloadExcel">
    <el-button icon="el-icon-download" @click="dialogVisible = true">
      导出
    </el-button>

    <el-dialog
      title="导出配置"
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="handleDiaClose"
    >
      <el-steps :active="stepActive" simple finish-status="success">
        <el-step title="筛选" icon="el-icon-finished" />
        <el-step
          v-show="infoTemp === 'cutsomInfo'"
          title="编辑"
          icon="el-icon-edit"
        />
        <el-step title="下载" icon="el-icon-upload" />
      </el-steps>

      <!-- 步骤内容 -->
      <div ref="downloadSwiper" class="downloadExcel-fs">
        <div
          class="downloadExcel-main"
          :style="{
            width: (SwiperMaxNum + 1) * 100 + '%',
            left: `${-(100 * stepActive)}%`
          }"
        >
          <!-- 第一步 -->
          <div
            class="downloadExcel-main-swiperBox downloadExcel-main-swiperBox-first"
            :style="{
              opacity: stepActive === 0 ? 1 : 0
            }"
          >
            <el-radio-group
              v-model="infoTemp"
              class="downloadExcel-main-swiperBox-first-raidoGroup"
            >
              <el-radio label="defaultInfo" border>默认</el-radio>
              <el-radio label="cutsomInfo" border>自定义</el-radio>
            </el-radio-group>
            <transition name="radioKeyShow" mode="out-in">
              <component :is="infoTemp" />
            </transition>
          </div>
          <!-- 第二步 -->
          <div
            v-show="infoTemp === 'cutsomInfo'"
            class="downloadExcel-main-swiperBox"
            :style="{
              opacity: stepActive === 1 ? 1 : 0
            }"
          >
            <el-form
              ref="form"
              class="downloadExcel-main-form"
              :model="form"
              :rules="rules"
            >
              <el-form-item label="文件名称" prop="fieldName">
                <el-input v-model="form.fieldName" placeholder="文件名称" />
              </el-form-item>
              <el-form-item label="文档标题" prop="header">
                <el-input v-model="form.header" placeholder="文档标题" />
              </el-form-item>
              <el-form-item label="是否默认数据">
                <el-radio-group v-model="form.isDefault">
                  <el-radio :label="true" border>是</el-radio>
                  <el-radio :label="false" border>不是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="!form.isDefault"
                label="日期范围"
                prop="reqTime"
              >
                <el-date-picker
                  v-model="form.reqTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
              <el-form-item
                v-if="!form.isDefault"
                label="选择Demo"
                prop="targetDemo"
              >
                <el-select
                  v-model="form.targetDemo"
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in demoList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 最后一步 -->
          <div
            class="downloadExcel-main-swiperBox"
            :style="{
              opacity: stepActive === SwiperMaxNum ? 1 : 0
            }"
          >
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in timeLine"
                :key="index"
                :icon="
                  index === timeLine.length
                    ? 'el-icon-loading'
                    : 'el-icon-check'
                "
                :type="index === timeLine.length ? 'info' : 'success'"
                :size="index === timeLine.length ? 'large' : 'normal'"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>

      <!-- 步骤指令 -->
      <div class="downloadExcel-footer">
        <el-button v-if="stepActive !== 0" @click="handlePrev">
          上一步
        </el-button>

        <template>
          <el-button
            v-if="stepActive + 1 < SwiperMaxNum"
            type="primary"
            @click="stepActive = stepActive + 1"
          >
            下一步
          </el-button>
          <download-excel
            v-else
            :data="dataList"
            :fields="jsonFields"
            :name="form.fieldName"
            :header="form.header"
            :footer="form.footer"
            :fetch="downLoadFetch"
            :before-finish="beforFinish"
          >
            <el-button type="primary">
              {{ isError ? '重新尝试' : '提交并执行' }}
            </el-button>
          </download-excel>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import JsonExcel from 'vue-json-excel'
import { json_fields } from '../../utils/constants'
import { getReportCount, downReportCount } from '@/api/dataTable'
import { getAllApiDemo } from '@/api/apidemo'
import cutsom from './components/contentExplain/custom.vue'
import defalutExplain from './components/contentExplain/defalutExplain.vue'

const jsonfieldsArr = Object.keys(json_fields)
const defaultJSONFIELDS = jsonfieldsArr.map((e) => ({
  key: e,
  value: json_fields[e]
}))

export default {
  components: {
    downloadExcel: JsonExcel,
    defaultInfo: defalutExplain,
    cutsomInfo: cutsom
  },

  data() {
    return {
      jsonFields: json_fields,
      dialogVisible: false,

      /*
        文件导出参数
      */
      dataList: [],
      form: {
        fieldName: `Demo数据-${Date.now()}`,
        header: 'Demo查询数据统计',
        footer: '',
        isDefault: true,
        reqTime: [Date.now() - 1000 * 3600 * 24, Date.now()],
        targetDemo: 'ALL'
      },
      // 当前模板选项
      infoTemp: 'defaultInfo',
      // 当前步骤
      stepActive: 0,
      rules: {
        fieldName: [
          { required: true, trigger: 'change', message: '文件名称必填！' }
        ],
        header: [{ required: true, trigger: 'change', message: '文档标题必填' }]
      },

      // 时间选择器参数
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // Demo项目数据
      demoList: [],

      // 时间戳
      timeLine: [],

      // 下载出现异常
      isError: false
    }
  },
  computed: {
    selJSONFIELDS() {
      return defaultJSONFIELDS
    },
    SwiperMaxNum() {
      return this.infoTemp === 'defaultInfo' ? 1 : 2
    }
  },
  watch: {
    'form.isDefault': {
      handler(val) {
        if (!val && this.demoList.length === 0) {
          this.getDemoList()
        }
      }
    }
  },
  methods: {
    async downLoadFetch() {
      if (
        this.infoTemp === 'cutsomInfo' &&
        !(await this.$refs.form.validate())
      ) {
        return this.$message({
          type: 'warning',
          message: '部分必填项未填！'
        })
      }

      if (this.isError) {
        this.timeLine = []
      }
      this.stepActive = this.SwiperMaxNum
      this.timeLine.push({
        content: '开始请求数据.....',
        timestamp: Date.now().toString()
      })
      try {
        let dataList = []
        let dataTotal = 0
        if (this.infoTemp === 'defaultInfo' || this.form.isDefault) {
          const { query } = this.$route

          const {
            data: { list, total }
          } = await getReportCount({
            ...query,
            sortProps:
              query.sortProps && query.sortProps === '最早排序' ? 1 : -1
          })

          dataList = list
          dataTotal = total
        } else {
          const {
            data: { list, total }
          } = await downReportCount(this.form)
          dataList = list
          dataTotal = total
        }
        if (dataList.length === 0 || dataTotal === 0) {
          return this.$message({
            type: 'error',
            message: '暂时找不到指定数据。'
          })
        }
        this.form = {
          ...this.form,
          footer: `总数量为：${dataTotal}`
        }
        this.timeLine.push({
          content: '数据请求完成！',
          timestamp: Date.now().toString()
        })

        return dataList
      } catch (error) {
        this.timeLine.push({
          content: '数据请求失败！',
          timestamp: Date.now().toString()
        })
        this.isError = true
        return this.$message({
          type: 'error',
          message: error.msg
        })
      }
    },

    beforFinish() {
      this.timeLine.push({
        content: '文件下载中，完成后请自行打开浏览......',
        timestamp: Date.now().toString()
      })
    },

    // 获取Demo
    async getDemoList() {
      try {
        const { data } = await getAllApiDemo()
        const dataList = [
          { label: '全部', value: 'ALL' },
          ...data.map((e) => ({
            label: e.classifyLabel,
            value: e._id
          }))
        ]

        return (this.demoList = dataList)
      } catch (error) {
        return this.$message({
          type: 'error',
          message: '获取Demo出现异常，暂时无法使用自定义导出功能'
        })
      }
    },

    // 重置参数
    resetFormData() {
      this.form = {
        fieldName: `Demo数据-${Date.now()}`,
        header: 'Demo查询数据统计',
        footer: '',
        isDefault: true,
        reqTime: [Date.now() - 1000 * 3600 * 24, Date.now()],
        targetDemo: 'ALL'
      }
    },
    // 上一步
    handlePrev() {
      const stepActive = this.stepActive
      if (this.infoTemp !== 'defaultInfo' && stepActive === 1) {
        this.resetFormData()
      }
      return (this.stepActive = stepActive - 1)
    },

    // 弹窗关闭
    handleDiaClose(done) {
      this.stepActive = 0
      this.infoTemp = 'defaultInfo'
      this.resetFormData()
      this.timeLine = []
      return done()
    }
  }
}
</script>

<style scoped>
.downloadExcel {
  display: flex;
  align-items: center;
  gap: 10px;
}
.downloadExcel-fs {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.downloadExcel-fs .downloadExcel-main {
  display: flex;
  position: relative;
  width: 300%;
  left: 0;
  background-color: #fff;
  transition: left 0.5s ease-in-out;
}

.downloadExcel-main-swiperBox {
  flex: 1;
  padding: 10px;
  transition: opacity 0.5s ease-in-out;
}
.downloadExcel-main-swiperBox-first {
  display: flex;
  align-items: center;
  gap: 10px;
}
.downloadExcel-main-swiperBox-first-raidoGroup {
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.downloadExcel-main-swiperBox-first-raidoGroup .el-radio {
  margin: 0;
}
.downloadExcel-main-form {
  padding: 15px;
}
.downloadExcel-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.radioKeyShow-enter-active,
.radioKeyShow-leave-active {
  transition: opacity 0.5s;
}
.radioKeyShow-enter,
.radioKeyShow-leave-to {
  opacity: 0;
}
</style>

<style>
.downloadExcel-main-swiperBox-first .downloadExcel-main-swiperBox-first-main {
  width: 65%;
  height: 100%;
  padding: 10px;
}

.downloadExcel-main-swiperBox-first-main-title {
  line-height: 2;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
}
.downloadExcel-main-swiperBox-first
  .downloadExcel-main-swiperBox-first-main
  .downloadExcel-main-swiperBox-first-main-li {
  display: flex;
  align-items: flex-start;
  line-height: 2;
  padding: 0 15px;
  font-size: 18px;
}
.downloadExcel-main-swiperBox-first-main-li-label {
  width: 100px;
}
</style>
