import * as Koa from 'koa'
import * as bodify from 'koa-body'
import * as serve from 'koa-static'
import * as timing from 'koa-xtime'

const app = new Koa()
app.use(timing())
app.use(serve(`${__dirname}/public`))
app.use(bodify({
    multipart:true,
    // 使用非严格模式，解析 delete 请求的请求体
    strict:false
}))

import {load} from './utils/route-decors'
import {resolve} from 'path'
const router = load(resolve(__dirname,'./routes'))
// console.log(__dirname)
// console.log(resolve(__dirname,'./routes'))
// console.log(router)
app.use(router.routes())

app.listen(3000, () => {
    console.log('监听3000端口')
})