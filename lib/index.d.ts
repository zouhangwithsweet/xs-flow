import VueRouter from 'vue-router';
import { Store } from 'vuex';
/**
 * block 类 inspirate by flow
 * 用来描述一个路由模块
 */
declare abstract class StreamRouteBlock {
    static type: 'r';
    static routeName: string;
}
/**
 * 用来描述一个决策模块
 */
declare abstract class StreamDecisionBlock<T = any> {
    static type: 'd';
    constructor(router?: VueRouter, store?: Store<T>);
    /**
     * 决策
     */
    abstract decide(router?: VueRouter, store?: Store<T>): Promise<any>;
}
declare type IBlock = typeof StreamDecisionBlock | typeof StreamRouteBlock;
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
