<!-- Modbus 点位表单弹窗 -->
<template>
  <!-- TODO @AI：placeholder 都提供下 -->
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="物模型属性" prop="thingModelId">
        <el-select
          v-model="formData.thingModelId"
          placeholder="请选择物模型属性"
          filterable
          class="!w-full"
          @change="handleThingModelChange"
        >
          <!-- TODO @AI：增加 option 里的告警； -->
          <el-option
            v-for="item in propertyList"
            :key="item.id"
            :label="`${item.name} (${item.identifier})`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="功能码" prop="functionCode">
        <!-- TODO @AI：select -->
        <el-radio-group v-model="formData.functionCode">
          <el-radio
            v-for="item in ModbusFunctionCodeOptions"
            :key="item.value"
            :value="item.value"
            class="!mr-4"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- TODO @AI：不要转换，直接输入 -->
      <el-form-item label="寄存器地址" prop="registerAddress">
        <el-input
          v-model="registerAddressInput"
          placeholder="请输入寄存器地址（支持十进制或十六进制如 0x0000）"
          @blur="handleRegisterAddressBlur"
        >
          <template #append>
            <span class="text-gray-500">
              = {{ formatRegisterAddress(formData.registerAddress) }}
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="寄存器数量" prop="registerCount">
        <el-input-number
          v-model="formData.registerCount"
          :min="1"
          :max="125"
          controls-position="right"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="原始数据类型" prop="rawDataType">
        <el-select
          v-model="formData.rawDataType"
          placeholder="请选择数据类型"
          class="!w-full"
          @change="handleRawDataTypeChange"
        >
          <el-option
            v-for="item in ModbusRawDataTypeOptions"
            :key="item.value"
            :label="`${item.label} - ${item.description}`"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字节序" prop="byteOrder">
        <el-select v-model="formData.byteOrder" placeholder="请选择字节序" class="!w-full">
          <el-option
            v-for="item in currentByteOrderOptions"
            :key="item.value"
            :label="`${item.label} - ${item.description}`"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="缩放因子" prop="scale">
        <el-input-number
          v-model="formData.scale"
          :precision="6"
          :step="0.1"
          controls-position="right"
          class="!w-full"
        />
        <!-- TODO @AI：tip，使用默认的 el-input-number 里的 -->
        <div class="text-xs text-gray-400 mt-1">
          读取时：实际值 = 原始值 × 缩放因子；写入时：原始值 = 实际值 ÷ 缩放因子
        </div>
      </el-form-item>
      <el-form-item label="轮询间隔" prop="pollInterval">
        <el-input-number
          v-model="formData.pollInterval"
          :min="100"
          :step="1000"
          controls-position="right"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <!-- TODO @AI：参考下别的模块，开关 -->
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
import { ThingModelData } from '@/api/iot/thingmodel'
import { DeviceModbusPointApi, DeviceModbusPointVO } from '@/api/iot/device/modbus/point'
import {
  ModbusFunctionCodeOptions,
  ModbusRawDataTypeOptions,
  getByteOrderOptions
} from '@/views/iot/utils/constants'

defineOptions({ name: 'DeviceModbusPointForm' })

const props = defineProps<{
  deviceId: number
  thingModelList: ThingModelData[]
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref<'create' | 'update'>('create')
const formRef = ref()

// TODO @AI：注释的风格，你看看是不是有些地方要尾注释（和别的模块保持一样的风格）

/** 表单数据 */
// TODO @AI：里面的枚举类型，改成直接用枚举
const formData = ref<DeviceModbusPointVO>({
  deviceId: props.deviceId,
  thingModelId: 0,
  identifier: '',
  name: '',
  functionCode: 3,
  registerAddress: 0,
  registerCount: 1,
  byteOrder: 'AB',
  rawDataType: 'INT16',
  scale: 1,
  pollInterval: 5000,
  status: 0
})

/** 寄存器地址输入框（支持十六进制） */
const registerAddressInput = ref('0')

/** 表单校验规则 */
const formRules = {
  thingModelId: [{ required: true, message: '请选择物模型属性', trigger: 'change' }],
  functionCode: [{ required: true, message: '请选择功能码', trigger: 'change' }],
  registerAddress: [{ required: true, message: '请输入寄存器地址', trigger: 'blur' }],
  registerCount: [{ required: true, message: '请输入寄存器数量', trigger: 'blur' }],
  rawDataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
  pollInterval: [{ required: true, message: '请输入轮询间隔', trigger: 'blur' }]
}

/** 筛选属性类型的物模型 */
const propertyList = computed(() => {
  return props.thingModelList.filter((item) => item.type === 1) // type=1 为属性
})

/** 当前字节序选项（根据数据类型动态变化） */
const currentByteOrderOptions = computed(() => {
  return getByteOrderOptions(formData.value.rawDataType)
})

/** 打开弹窗 */
const open = async (type: 'create' | 'update', id?: number) => {
  dialogVisible.value = true
  formType.value = type
  // TODO @AI：参考别的模块，写法；
  dialogTitle.value = type === 'create' ? '新增 Modbus 点位' : '编辑 Modbus 点位'
  resetForm()

  if (type === 'update' && id) {
    formLoading.value = true
    try {
      const data = await DeviceModbusPointApi.getModbusPoint(id)
      formData.value = data
      registerAddressInput.value = formatRegisterAddress(data.registerAddress)
    } finally {
      formLoading.value = false
    }
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    deviceId: props.deviceId,
    thingModelId: 0,
    identifier: '',
    name: '',
    functionCode: 3,
    registerAddress: 0,
    registerCount: 1,
    byteOrder: 'AB',
    rawDataType: 'INT16',
    scale: 1,
    pollInterval: 5000,
    status: 0
  }
  registerAddressInput.value = '0'
  formRef.value?.resetFields()
}

/** 物模型属性变化 */
const handleThingModelChange = (thingModelId: number) => {
  const thingModel = props.thingModelList.find((item) => item.id === thingModelId)
  // TODO @AI：这里有 linter 告警，可以看看。
  if (thingModel) {
    formData.value.identifier = thingModel.identifier
    formData.value.name = thingModel.name
  }
}

/** 数据类型变化 */
const handleRawDataTypeChange = (rawDataType: string) => {
  // 根据数据类型自动设置寄存器数量
  const option = ModbusRawDataTypeOptions.find((item) => item.value === rawDataType)
  if (option && option.registerCount > 0) {
    formData.value.registerCount = option.registerCount
  }

  // 重置字节序为第一个选项
  const byteOrderOptions = getByteOrderOptions(rawDataType)
  if (byteOrderOptions.length > 0) {
    formData.value.byteOrder = byteOrderOptions[0].value
  }
}

/** 寄存器地址输入框失焦 */
const handleRegisterAddressBlur = () => {
  const input = registerAddressInput.value.trim()
  let address = 0

  if (input.toLowerCase().startsWith('0x')) {
    // 十六进制
    address = parseInt(input, 16)
  } else {
    // 十进制
    address = parseInt(input, 10)
  }

  if (isNaN(address) || address < 0) {
    address = 0
  }

  formData.value.registerAddress = address
  registerAddressInput.value = formatRegisterAddress(address)
}

/** 格式化寄存器地址为十六进制 */
const formatRegisterAddress = (address: number) => {
  return '0x' + address.toString(16).toUpperCase().padStart(4, '0')
}

/** 提交表单 */
const submitForm = async () => {
  try {
    await formRef.value?.validate()
    formLoading.value = true

    // TODO @AI：这里的注释风格，可以看看。
    if (formType.value === 'create') {
      await DeviceModbusPointApi.createModbusPoint(formData.value)
      message.success('创建成功')
    } else {
      await DeviceModbusPointApi.updateModbusPoint(formData.value)
      message.success('更新成功')
    }

    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 暴露方法 */
defineExpose({ open })
</script>
