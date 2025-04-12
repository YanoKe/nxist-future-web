//enum枚举
export enum SearchType {
    Title = "title",
    ISBN = "isbn",
    ID = "id",
    Author = "author"
}

// 历史记录类型
export interface SearchHistory {
    type: SearchType
    keyword: string
    timestamp: number
}


//图书状态
export enum BookStatus{
    Available = '可借阅',
    Borrowed='已借出'
}
// 精确校验 ISBN 格式（10位或13位）
type ISBN10 = `${number}-${number}-${number}-${number}`
type ISBN13 = `${number}-${number}-${number}-${number}-${number}`
type ISBN = ISBN10 | ISBN13
type BookPublishData = `${number}-${number}`
type InternationalClassification =
    | { type: 'ISBN'; value: ISBN }
    | { type: 'ISSN'; value: string }

//图书详细类型
//interface为接口
export interface Book{
    id: number
    title: string
    author: string
    status: BookStatus //状态
    cover: string //封面
    Introduction: string //简介
    publishData: BookPublishData //出版日期
    publisher:string //出版社
    language: string //语种
    classification: InternationalClassification[]
    livePreview: string//在线预览
    chineseClassification: string // 中图分类号
}


export interface FilterParams {
    classifications: string[]
    languages: string[]
    publishYears: number[]
    publishMonth?: number
    publishers: string[]
    status?: BookStatus
    hasPreview: boolean
    chineseClassification: string
}

//API响应格式
export interface ApiResponse<T> {
  code: number    // 状态码
  message: string // 提示信息
  data: T         // 真实数据
}
// 中图分类类型
export type ChineseClassification = {
    code: string
    name: string
}

export const CLASSIFICATIONS: ChineseClassification[] = [
    { code: 'ALL', name: '全部' },
    { code: 'A', name: '马克思主义、列宁主义、毛泽东思想、邓小平理论' },
    { code: 'B', name: '哲学、宗教' },
    { code: 'C', name: '社会科学总论' },
    { code: 'D', name: ' 政治、法律' },
    { code: 'E', name: '军事' },
    { code: 'F', name: '经济' },
    { code: 'G', name: '文化科学、教育、体育' },
    { code: 'H', name: '语言、文字' },
    { code: 'I', name: '文学' },
    { code: 'J', name: '艺术' },
    { code: 'K', name: '历史、地理' },
    { code: 'N', name: '自然科学总论' },
    { code: 'O', name: '数理科学和化学' },
    { code: 'P', name: '天文学、地球科学' },
    { code: 'Q', name: '生物科学' },
    { code: 'R', name: '医药、卫生' },
    { code: 'S', name: '农业科学' },
    { code: 'T', name: '工业技术' },
    { code: 'U', name: '交通运输' },
    { code: 'V', name: '航空、航天' },
    { code: 'X', name: '环境科学、安全科学' },
    { code: 'Z', name: '综合性图书' }
]
