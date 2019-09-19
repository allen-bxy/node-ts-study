import * as glob from 'glob'
import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'

type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch';
type LoadOptions = {
    /**
    * 路由文件扩展名，默认值是`.{js,ts}`
    */
    extname?: string;
};
type RouteOptions = {
    /**
    * 适用于某个请求比较特殊，需要单独制定前缀的情形
    */
    prefix?: string;
    /**
    * 给当前路由添加一个或多个中间件
    */
    middlewares?: Array<Koa.Middleware>;
};
const router = new KoaRouter()

const decorate = (method: HTTPMethod, path: string, router: KoaRouter, options: RouteOptions = {}) => {
    return (target, property, descriptor) => {
        //把中间件添加到options里
        //const middlewares = []
        // if (options.middlewares) {
        //     middlewares.push(...options.middlewares)
        // }
        // middlewares.push(target[property])

        process.nextTick(() => {
            const url = options && options.prefix ? options.prefix + path : path
            //router[method](url, ...middlewares)
            router[method](url, target[property])
        })
    }
}

const method = method => (path: string, options?: RouteOptions) => decorate(method, path, router, options)

export const get = method('get')
export const post = method('post')

export const load = (folder: string, options: LoadOptions = {}): KoaRouter => {
    const extname = options.extname || '.{js,ts}'
    // console.log(extname)
    // console.log(require('path').join(folder, `./**/*${extname}`))
    glob.sync(require('path').join(folder, `./**/*${extname}`)).
        forEach(item => {
            //console.log(item) 
            require(item)
        })
    return router
}
