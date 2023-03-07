<template>
  <div class="ApiDemo">
    <div class="ApiDemo-Header">
      <el-input
        v-model="queryProps.searchKey"
        :style="{ width: '200px' }"
        placeholder="Demo名称"
        clearable
      />

      <el-button
        v-show="!isMobile"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
      >
        搜索
      </el-button>

      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="dialogVisible = true"
      >
        添加
      </el-button>

      <el-button v-show="!isMobile" type="primary" icon="el-icon-download">
        导出
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="ApiDemo-Main">
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center', cursor: 'pointer' }"
        @cell-dblclick="setEditKey"
      >
        <template slot="empty">
          <el-empty>
            <el-button type="primary" @click="getDataList">刷新</el-button>
          </el-empty>
        </template>
        <el-table-column prop="classifyName" label="英文名称">
          <template slot-scope="scope">
            <template
              v-if="
                editForm.id === scope.row._id && editForm.key === 'classifyName'
              "
            >
              <el-input
                ref="editFormInput"
                v-model="editForm.value"
                clearable
                placeholder="英文名称"
                @blur="() => handleBlur(scope.row.classifyName, scope.$index)"
                @keyup.enter.native="$event.target.blur()"
              />
            </template>
            <template v-else>{{ scope.row.classifyName }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="classifyLabel" label="中文名称">
          <template slot-scope="scope">
            <template
              v-if="
                editForm.id === scope.row._id &&
                editForm.key === 'classifyLabel'
              "
            >
              <el-input
                ref="editFormInput"
                v-model="editForm.value"
                clearable
                placeholder="英文名称"
                @blur="() => handleBlur(scope.row.classifyLabel, scope.$index)"
                @keyup.enter.native="$event.target.blur()"
              />
            </template>
            <template v-else>{{ scope.row.classifyLabel }}</template>
          </template>
        </el-table-column>

        <el-table-column prop="apiURL" label="路径">
          <template slot-scope="scope">
            <template
              v-if="editForm.id === scope.row._id && editForm.key === 'apiURL'"
            >
              <el-input
                ref="editFormInput"
                v-model="editForm.value"
                clearable
                placeholder="英文名称"
                @blur="() => handleBlur(scope.row.apiURL, scope.$index)"
                @keyup.enter.native="$event.target.blur()"
              />
            </template>
            <template v-else>{{ scope.row.apiURL }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="showOrHide" label="状态（是否上线）">
          <template slot-scope="scope">
            <div
              class="ApiDemo-Main-Table-cell"
              style="justify-content: center"
            >
              <el-tag :type="scope.row.showOrHide ? 'success' : 'danger'">
                {{ scope.row.showOrHide ? '已上线' : '未上线' }}
              </el-tag>
              <el-tooltip
                class="item"
                effect="dark"
                content="修改上线状态"
                placement="right"
              >
                <el-button
                  type="success"
                  icon="el-icon-refresh"
                  size="small"
                  @click="changeDemoState(scope.row, scope.$index)"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <div
              class="ApiDemo-Main-Table-cell"
              :style="{ 'justify-content': isMobile ? 'center' : 'flex-start' }"
            >
              <el-tooltip
                v-if="scope.row.showOrHide"
                class="item"
                effect="dark"
                content="跳转到Demo页面"
                placement="top"
              >
                <el-button
                  type="primary"
                  :size="isMobile ? 'mini' : 'medium'"
                  @click="handleWatch(scope.row.apiURL)"
                >
                  查看
                </el-button>
              </el-tooltip>
              <el-button
                type="info"
                :size="isMobile ? 'mini' : 'medium'"
                @click="handleDataTable(scope.row)"
              >
                统计
              </el-button>
              <el-button
                type="danger"
                :size="isMobile ? 'mini' : 'medium'"
                @click="handleDel(scope.row._id)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="ApiDemo-Footer">
      <el-pagination
        hide-on-single-page
        :page-size="queryProps.pageSize"
        :current-page="queryProps.pageNo"
        :page-sizes="[10, 30, 50, 70, 100]"
        :layout="
          isMobile
            ? 'prev, pager, next'
            : 'total, sizes, prev, pager, next, jumper'
        "
        :total="total"
        :small="isMobile"
        background
        @size-change="(num) => handlePagePropsChange(num, 'pageSize')"
        @current-change="(num) => handlePagePropsChange(num, 'pageNo')"
      />
    </div>

    <!-- 弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      class="apiDemo-form"
      :width="isMobile ? '90%' : '60%'"
      :before-close="closeDIOandResetForm"
    >
      <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent>
        <el-form-item prop="classifyName" label="英文名称">
          <el-input
            v-model="form.classifyName"
            placeholder="英文名称"
            clearable
          />
        </el-form-item>
        <el-form-item prop="classifyLabel" label="中文名称">
          <el-input
            v-model="form.classifyLabel"
            placeholder="中文名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="项目路径">
          <el-input v-model="form.apiURL" placeholder="项目路径" clearable />
        </el-form-item>
        <el-form-item label="是否可以上线？">
          <el-radio-group v-model="form.showOrHide" size="medium ">
            <el-radio :label="true" border>是</el-radio>
            <el-radio :label="false" border>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="apiDemo-form-footer">
            <el-button
              type="info"
              :size="isMobile ? 'small' : 'medium'"
              :disabled="formLoading"
            >
              清空
            </el-button>
            <el-button
              type="danger"
              :size="isMobile ? 'small' : 'medium'"
              :disabled="formLoading"
              @click="() => closeDIOandResetForm()"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              :size="isMobile ? 'small' : 'medium'"
              :loading="formLoading"
              native-type="submit"
              @click="addData"
            >
              确认
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getApiDemo, addApiDemo, editApiDemo, delApiDemo } from '@/api/apidemo'

import _omit from 'lodash/omit'

export default {
  data() {
    return {
      dataList: [],
      total: 1,
      // 路由请求参数
      queryProps: {
        pageNo: 1,
        pageSize: 10,
        searchKey: ''
      },
      loading: true,
      dialogVisible: false,
      form: {
        classifyName: '',
        classifyLabel: '',
        apiURL: '',
        showOrHide: true
      },
      rules: {
        classifyName: [
          {
            required: true,
            trigger: 'change',
            message: 'Demo英文名称必填！'
          }
        ],
        classifyLabel: [
          {
            required: true,
            trigger: 'change',
            message: 'Demo中文名称必填！'
          }
        ]
      },
      formLoading: false,
      editForm: {
        id: '',
        key: '',
        value: ''
      }
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile
    }
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(val) {
        const { pageNo = 1, pageSize = 10, searchKey = '' } = val
        this.queryProps = {
          pageNo: Number(pageNo),
          pageSize: Number(pageSize),
          searchKey
        }
        this.getDataList()
      }
    }
  },

  methods: {
    // 获取表格数据
    async getDataList() {
      this.loading = true
      try {
        const {
          data: { list, total }
        } = await getApiDemo(this.queryProps)
        this.dataList = list
        this.total = total
        this.loading = false
      } catch (error) {
        this.loading = false
        const { msg } = error
        return this.$message({
          type: 'error',
          message: msg
        })
      }
    },

    // 搜索
    handleSearch() {
      return this.$router.push({
        name: 'DemoData',
        query: { ...this.queryProps, pageNo: 1 }
      })
    },

    // 页面跳转/页码更换
    handlePagePropsChange(num, key) {
      let obj = this.queryProps

      if (this.queryProps.searchKey.trim() === '') {
        obj = _omit(obj, ['searchKey'])
      }

      if (key === 'pageSize') {
        obj = {
          ...obj,
          pageNo: 1
        }
      }
      return this.$router.push({
        name: 'DemoData',
        query: { ...obj, [key]: num }
      })
    },

    // 添加数据（先验证后提交）
    addData() {
      return this.$refs.form.validate(async (bol) => {
        if (!bol) {
          return this.$notify({
            type: 'warning',
            title: '警告！',
            message: '必填项还未填充完毕'
          })
        }
        this.formLoading = true
        try {
          await addApiDemo(this.form)
          this.$message({
            type: 'success',
            message: '添加成功！'
          })
          this.formLoading = false
          this.getDataList()
          return this.closeDIOandResetForm()
        } catch (error) {
          const { msg } = error
          this.formLoading = false
          return this.$message({
            type: 'error',
            message: msg
          })
        }
      })
    },

    // 关闭弹窗并重置表单数据
    closeDIOandResetForm(key) {
      this.form = {
        classifyName: '',
        classifyLabel: '',
        apiURL: '',
        showOrHide: true
      }
      this.$refs.form.resetFields()
      return key ? key() : (this.dialogVisible = false)
    },

    // 查看该项目（跳外部连接）
    handleWatch(url) {
      // 还未有域名后续改动
      return window.open('https://www.baidu.com')
    },

    // 删除项目
    handleDel(id) {
      this.$confirm(
        '此操作将永久删除该Demo链接与其相关的浏览量数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          try {
            await delApiDemo(id)
            this.$message({
              type: 'success',
              message: '该Demo相关数据已删除'
            })
            const { pageNo } = this.queryProps
            const dataLength = this.dataList.length
            if (dataLength === 1 && pageNo !== 1) {
              let obj = this.queryProps

              if (this.queryProps.searchKey.trim() === '') {
                obj = _omit(obj, ['searchKey'])
              }
              return this.$router.push({
                name: 'DemoData',
                query: { ...obj, pageNo: pageNo - 1 }
              })
            }
            return this.getDataList()
          } catch (error) {
            const { msg } = error
            return this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {})
    },

    // 选择编辑的属性
    setEditKey(row, column) {
      const { property } = column
      const { _id: id } = row
      if (property === 'operate' || property === 'showOrHide') return

      this.editForm = {
        id,
        key: property,
        value: row[property]
      }
      return this.$nextTick(() => {
        this.$refs.editFormInput.focus()
      })
    },

    // 编辑时Input框失去焦点
    handleBlur(oldVal, index) {
      const rules = this.rules
      const { value, key } = this.editForm
      if (oldVal === value) {
        return this.clearEditForm()
      }
      if (rules.hasOwnProperty(key) && value.trim() === '') {
        this.$notify({
          type: 'warning',
          message: '很抱歉，该栏位的内容是必填的，因此修改失败。'
        })
        return this.clearEditForm()
      }

      return this.requestEditForm(index)
    },

    // 清空编辑表单
    clearEditForm() {
      return (this.editForm = {
        id: '',
        key: '',
        value: ''
      })
    },

    // 提交修改内容请求
    async requestEditForm(index) {
      const { id, key, value } = this.editForm

      try {
        const { data } = await editApiDemo({ id, [key]: value })
        this.loading = true
        this.dataList.splice(index, 1, data)
        this.$message({
          type: 'success',
          message: '修改成功！'
        })
        this.loading = false
        return this.clearEditForm()
      } catch (error) {
        const { msg } = error
        return this.$message({
          type: 'error',
          message: msg
        })
      }
    },

    // 修改Demo上线状态
    async changeDemoState(target, index) {
      const { _id: id, showOrHide } = target
      try {
        const { data } = await editApiDemo({ id, showOrHide: !showOrHide })
        this.loading = true
        this.$message({
          type: 'success',
          message: '修改上线状态成功！'
        })
        this.loading = false
        return this.dataList.splice(index, 1, data)
      } catch (error) {
        const { msg } = error
        return this.$message({
          type: 'error',
          message: msg
        })
      }
    },

    // 跳转至统计中心
    handleDataTable(row) {
      return this.$router.push({
        name: 'DataTable',
        query: {
          classify: row.classifyName
        }
      })
    }
  }
}
</script>

<style  scoped>
.ApiDemo {
  padding: 20px;
}
.ApiDemo-Header {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 15px;
  flex-wrap: wrap;
}
.ApiDemo-Main-Table-cell {
  display: flex;
  /* justify-content: flex-start; */
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.ApiDemo-Main-Table-cell .el-button {
  margin: 0;
}
.ApiDemo-Footer {
  padding: 25px 0 0;
  text-align: center;
}

.apiDemo-form-footer {
  text-align: right;
}
</style>
