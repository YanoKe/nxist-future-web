// 在图书数据源文件(如 src/data/books.ts)中添加：
import { BookStatus, type Book } from '@/types/book'

export const mockBooks: Book[] = [
    {
        id: 1001,
        title: 'JavaScript高级程序设计',
        author: '尼古拉斯·泽卡斯',
        status: BookStatus.Available,
        cover: '/covers/javascript.jpg',
        Introduction: '前端开发经典著作...',
        publishData: '2023-05',
        publisher: '人民邮电出版社',
        language: '中文',
        classification: [{ type: 'ISBN', value: '978-7-115-12345-6' }],
        livePreview: 'https://preview.example.com',
        chineseClassification: 'TP312',
        isbn: '978-7-115-12345-6' // 确保类型正确
    },
    // 复制模板添加更多书籍...
]