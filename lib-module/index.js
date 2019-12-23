import xs from 'xstream';
/**
 * block 类 inspirate by flow
 * 用来描述一个路由模块
 */
class StreamRouteBlock {
}
StreamRouteBlock.type = 'r';
/**
 * 用来描述一个决策模块
 */
class StreamDecisionBlock {
    constructor(router, store) {
    }
}
StreamDecisionBlock.type = 'd';
/**
 * flow 类
 * 用来描述一个用户的流程
 */
export default class StreamFlow {
    constructor(router, store) {
        // private _routes: string[] = []
        this._block = [];
        this._step = 0;
        this._s = [];
        this._router = router;
        store && (this._store = store);
        /**
         * 创建决策层
         */
        this._decisionListener = {
            next: async (b) => {
                if (b.type === 'd') {
                    // this.pendding = true
                    await new b().decide();
                    // this.pendding = false
                    this.move();
                }
            },
            error: err => {
                throw new Error(err);
            },
            complete: () => { }
        };
        /**
         * 创建路由订阅者
         */
        this._routerListener = {
            next: b => {
                try {
                    // todo 完成 block 然后 move
                    if ('routeName' in b) {
                        this._router.replace({
                            name: b.routeName,
                        });
                        this.move();
                    }
                }
                catch (error) { }
            },
            error: err => {
                throw new Error(err);
            },
            complete: () => { }
        };
        /**
         * 创建流producer
         */
        this._producer = {
            start: l => {
                /**
                 * 初始化 next 方法
                 */
                this.next = () => {
                    if (this._block[this._step]) {
                        l.next(this._block[this._step]);
                    }
                    else {
                        // this._s.unsubscribe()
                    }
                };
            },
            stop: () => {
                console.log('stream 已经没有订阅者');
            }
        };
    }
    /**
     * 记录需要跳转的路由
     * @param routeName 路由 name
     */
    push(block) {
        this._block.push(block);
        return this;
    }
    /**
     * 生成流
     */
    create() {
        this._stream = xs.create(this._producer);
        this._s.push(this._stream.subscribe(this._routerListener), this._stream.subscribe(this._decisionListener));
        return this;
    }
    /**
     * 进位或退位
     */
    move(s = 1) {
        this._step += s;
    }
}
