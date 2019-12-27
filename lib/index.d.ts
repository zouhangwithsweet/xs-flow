import VueRouter from 'vue-router';
import { Store } from 'vuex';
interface DecideFn<S> {
    new (router?: VueRouter, store?: Store<S>): this;
    decide(): void;
    type: 'd';
}
declare type routeName = string;
interface StreamFn {
    (): routeName;
    type: 'r';
}
declare type IBlock<S = any> = StreamFn | DecideFn<S>;
/**
 * flow 类
 * 用来描述一个用户的流程
 */
export default class StreamFlow<S = any> {
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
    constructor(router: VueRouter, store?: Store<S>);
    /**
     * 生成 listener
     * @param router
     * @param store
     */
    private createListener;
    /**
     * 生成 producer
     */
    private createProducer;
    /**
     * 进位或退位
     */
    private move;
    /**
     * 记录需要跳转的路由
     * @param routeName 路由 name
     */
    push(block: IBlock): this;
    /**
     * 生成流
     */
    create(): this;
}
export {};
