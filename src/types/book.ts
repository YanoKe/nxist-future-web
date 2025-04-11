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
    | { type: '中图分类'; value:string}

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
    livePreview:string//在线预览
}

//API响应格式
export interface ApiResponse<T> {
  code: number    // 状态码
  message: string // 提示信息
  data: T         // 真实数据
}
