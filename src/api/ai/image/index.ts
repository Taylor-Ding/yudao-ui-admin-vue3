import request from '@/config/axios'

// AI API 密钥 VO
// TODO @fan：要不前端不弄太多 VO，就用这个 ImageDetailVO？！
export interface ImageDetailVO {
  id: number // 编号
  prompt: string // 提示词
  status: number // 状态
  errorMessage: string // 错误信息
  type: string // 模型下分不同的类型(清晰、真实...)
  taskId: number // dr 任务id
  picUrl: string // 任务地址
  originalPicUrl: string // 绘制图片地址
  platform: string // 平台
  model: string // 模型
  style: string // 图像生成的风格
  size: string // 图片尺寸
  buttons: ImageMjButtonsVO[] // mj 操作按钮
  createTime: string // 创建时间
  updateTime: string // 更新事件
}

export interface ImageMjButtonsVO {
  customId: string // MJ::JOB::upsample::1::85a4b4c1-8835-46c5-a15c-aea34fad1862 动作标识
  emoji: string // 图标 emoji
  label: string // Make Variations 文本
  style: number // 样式: 2（Primary）、3（Green）
}

export interface ImageMjActionVO {
  id: string // MJ::JOB::upsample::1::85a4b4c1-8835-46c5-a15c-aea34fad1862 动作标识
  customId: string // MJ::JOB::upsample::1::85a4b4c1-8835-46c5-a15c-aea34fad1862 动作标识
}


export interface ImagePageReqVO {
  pageNo: number // 分页编号
  pageSize: number // 分页大小
}

export interface ImageDallReqVO {
  prompt: string // 提示词
  model: string // 模型
  style: string // 图像生成的风格
  width: string // 图片宽度
  height: string // 图片高度
}

export interface ImageDrawReqVO {
  platform: string // 平台
  prompt: string // 提示词
  model: string // 模型
  style: string // 图像生成的风格
  width: string // 图片宽度
  height: string // 图片高度
  options: object // 绘制参数，Map<String, String>
}

export interface ImageMidjourneyImagineReqVO {
  prompt: string // 提示词
  model: string // 模型 mj nijj
  base64Array: string[] // size不能为空
  width: string // 图片宽度
  height: string // 图片高度
  version: string // 版本
}

// TODO 芋艿：review 下整体注释、方法名
// AI API 密钥 API
export const ImageApi = {
  // 获取 image 列表
  getImageList: async (params: ImagePageReqVO) => {
    return await request.get({ url: `/ai/image/my-page`, params })
  },
  // 获取 image 详细信息
  getImageDetail: async (id: number) => {
    return await request.get({ url: `/ai/image/get-my?id=${id}`})
  },
  // 生成图片
  drawImage: async (data: ImageDrawReqVO)=> {
    return await request.post({ url: `/ai/image/draw`, data })
  },
  // 删除
  deleteImage: async (id: number)=> {
    return await request.delete({ url: `/ai/image/delete-my?id=${id}`})
  },

  // ------------ midjourney

  // midjourney - imagine
  midjourneyImagine: async (data: ImageMidjourneyImagineReqVO)=> {
    return await request.post({ url: `/ai/image/midjourney/imagine`, data })
  },
  // midjourney - action
  midjourneyAction: async (params: ImageMjActionVO)=> {
    return await request.get({ url: `/ai/image/midjourney/action`, params })
  },
}