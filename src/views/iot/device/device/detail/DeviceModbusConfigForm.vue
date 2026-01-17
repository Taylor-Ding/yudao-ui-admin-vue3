<!-- Modbus 连接配置弹窗 -->
<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="IP 地址" prop="ip">
        <el-input v-model="formData.ip" placeholder="请输入 Modbus 服务器 IP 地址" />
      </el-form-item>
      <el-form-item label="请输入 Modbus 端口" prop="port">
        <el-input-number
          v-model="formData.port"
          :min="1"
          :max="65535"
          controls-position="right"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="从站地址" prop="slaveId">
        <el-input-number
          v-model="formData.slaveId"
          :min="1"
          :max="247"
          controls-position="right"
          class="!w-full"
        />
        <!-- TODO @AI：placehoder 需要写下 -->
      </el-form-item>
      <el-form-item label="连接超时" prop="timeout">
        <el-input-number
          v-model="formData.timeout"
          :min="1000"
          :step="1000"
          controls-position="right"
          class="!w-full"
        />
        <!-- TODO @AI：placehoder 需要写下 -->
        <div class="text-xs text-gray-400 mt-1">单位：毫秒</div>
        <!-- TODO @AI：上面的毫秒，可以去掉 -->
      </el-form-item>
      <el-form-item label="重试间隔" prop="retryInterval">
        <el-input-number
          v-model="formData.retryInterval"
          :min="1000"
          :step="1000"
          controls-position="right"
          class="!w-full"
        />
        <!-- TODO @AI：placehoder 需要写下 -->
        <div class="text-xs text-gray-400 mt-1">单位：毫秒</div>
        <!-- TODO @AI：上面的毫秒，可以去掉 -->
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <!-- TODO @AI：看看别的禁用，应该是怎么样的 -->
        <el-switch
          v-model="formData.status"
          :active-value="0"
          :inactive-value="1"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="formLoading">确定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { DeviceModbusConfigApi, DeviceModbusConfigVO } from '@/api/iot/device/modbus/config'

defineOptions({ name: 'DeviceModbusConfigForm' })

const props = defineProps<{
  deviceId: number
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('编辑 Modbus 连接配置')
const formLoading = ref(false)
const formRef = ref()

/** 表单数据 */
// TODO @AI；
const formData = ref<DeviceModbusConfigVO>({
  deviceId: props.deviceId,
  ip: '',
  port: 502,
  slaveId: 1,
  timeout: 3000,
  retryInterval: 10000,
  status: 0 // TODO @AI：commonstatusenum；
})

/** 表单校验规则 */
const formRules = {
  ip: [{ required: true, message: '请输入 IP 地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
  slaveId: [{ required: true, message: '请输入从站地址', trigger: 'blur' }],
  timeout: [{ required: true, message: '请输入连接超时时间', trigger: 'blur' }],
  retryInterval: [{ required: true, message: '请输入重试间隔', trigger: 'blur' }]
}

/** 打开弹窗 */
const open = async (data?: DeviceModbusConfigVO) => {
  dialogVisible.value = true
  resetForm()
  // 编辑模式
  if (data && data.id) {
    formData.value = { ...data }
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    deviceId: props.deviceId,
    ip: '',
    port: 502,
    slaveId: 1,
    timeout: 3000,
    retryInterval: 1000,
    status: 0
  }
  formRef.value?.resetFields()
}

/** 提交表单 */
const submitForm = async () => {
  // TODO @AI：注释，需要补充下；参考别的模块
  try {
    await formRef.value?.validate()
    formLoading.value = true

    formData.value.deviceId = props.deviceId
    await DeviceModbusConfigApi.saveModbusConfig(formData.value)
    message.success('保存成功')

    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 暴露方法 */
defineExpose({ open })
</script>
