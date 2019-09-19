import * as Koa from 'koa';
import { get, post } from '../utils/route-decors'

import Schema from 'async-validator'

const users = [{ name: 'baoxinyu', age: 26 }];

const validator = rule => (target, propertyKey, descriptor) => {
    const oldVal = descriptor.value
    descriptor.value = async function (ctx: Koa.Context, next: () => Promise<any>) {
        const schema = new Schema(rule)
        try {
            await schema.validate({ ...ctx.request.query, ...ctx.request.body })
                .then(res => {
                    console.log('请求成功',res,ctx.request.query)
                    return oldVal.apply(null, arguments)
                })
                .catch(error => {
                    error = error.errors[0].message
                    ctx.body = { req: false, error }
                })
        } catch (error) {
            throw error
        }
    }

    return descriptor
}

export default class User {


    @validator({
        name: [{ required: true, message: '请输入用户名' }]
    })
    @get('/users')
    public list(ctx: Koa.Context) {
        ctx.body = { req: true, data: users };
    }

    @validator({
        name: [{ required: true, message: '请输入用户名' }]
    })
    @post('/users', {
        // middlewares: [
        //     async function validate(ctx: Koa.context, next: () => Promise<any>) {
        //         const name = ctx.request.body.nama
        //         if (!name) {
        //             ctx.body = {
        //                 error: 'name is must post'
        //             }
        //             throw "请输入用户名"
        //         }
        //         await next()
        //     }
        // ]
    })
    public add(ctx: Koa.Context) {
        console.log(ctx.request.body)
        console.log(ctx.request.query)
         //users.push(ctx.request.query)
        ctx.body = { req: true, data: users }
    }
}