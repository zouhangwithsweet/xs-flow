import VueRouter from 'vue-router';
import { Store } from 'vuex';
declare type streamFn<S = any> = ((() => string) & {
    type: 'r' | 'd';
}) | (((router?: VueRouter, store?: Store<S>) => void) & {
    type: 'r' | 'd';
});
declare type IBlock = streamFn;
/**
 * flow 类
 * 用来描述一个用户的流程
 */
export default class StreamFlow<R = any, S = any> {
    private _block;
    private _step;
    private _stream;
    private _producer;
    private _router;
    private _store;
    private _routerListener;
    private _decisionListener;
    private _s;
    next: Function;
    constructor(router: VueRouter, store?: Store<any>);
    /**
     * 记录需要跳转的路由
     * @param routeName 路由 name
     */
    push(block: IBlock): this;
    /**
     * 生成流
     */
    create(): this;
    /**
     * 进位或退位
     */
    private move;
}
export {};
