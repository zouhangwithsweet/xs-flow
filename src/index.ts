import xs, { Producer, Listener, Stream, Subscription } from 'xstream'
import VueRouter, { RouteConfig } from 'vue-router'
import { Store } from 'vuex'

export declare class DecideFn<S = any> {
  constructor (router?: VueRouter, store?: Store<S>)
  decide(): Promise<any>
  static type: 'd'
}
type routeName = string
export interface StreamFn {
  (): routeName
  type: 'r'
}

export type IBlock= StreamFn | typeof DecideFn

/**
 * block 包装器
 * @param params 
 */
export const wrapper = (params: string | Function) => {
  if (typeof params === 'string') {
    return () => params
  }
  if (typeof params === 'function') {
    return function(this: any, router?: VueRouter, store?: Store<any>) {
      this.decide = params.bind(null, router, store)
    }
  }
}

/**
 * flow 类
 * 用来描述一个用户的流程
 */
export default class StreamFlow<S = any> {
  private _block: Array<IBlock> = []
  private _step = 0
  private _stream!: Stream<IBlock>
  private _producer!: Producer<IBlock>
  private _router!: VueRouter
  private _store!: Store<S>
  private _routerListener!: Listener<IBlock>
  private _decisionListener!: Listener<IBlock>
  private _s: Subscription[] = []
  private _options: null | {
    mode: 'replace' | 'push',
    callBack?: Function
  } = null
  public next!: Function

  constructor(router: VueRouter, store?: Store<S>, options?: {
    mode: 'replace' | 'push',
    callback?: Function
  }) {
    this._router = router
    store && (this._store = store)
    options && (this._options = options)
    this.createProducer()
    this.createListener(router, store)
  }
  /**
   * 生成 listener
   * @param router 
   * @param store 
   */
  private createListener(router: VueRouter, store?: Store<S>) {
    /**
     * 创建决策层
     */
    this._decisionListener = {
      next: async b => {
        if (b.type === 'd') {
          await new b(router, store).decide()
          this.move()
        }
      },
      error: err => {
        throw new Error(err)
      },
      complete: () => {}
    }
    /**
     * 创建路由订阅者
     */
    this._routerListener = {
      next: b => {
        try {
          // todo 完成 block 然后 move
          if (b.type === 'r') {
            if (this._options) {
              const { mode } = this._options
              this._router[mode]({
                name: b(),
              })
            } else {
              this._router.replace({
                name: b(),
              })
            }
            this.move()
          }
        } catch (error) {}
      },
      error: err => {
        throw new Error(err)
      },
      complete: () => {}
    }
  }
  /**
   * 生成 producer
   */
  private createProducer() {
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
            l.next(this._block[this._step])
          }
        }
      },
      stop: () => {
        if (this._options) {
          const { callBack } = this._options
          callBack && callBack()
        }
      }
    }
  }
  /**
   * 进位或退位
   */
  private move(s: 1 | -1 | number = 1) {
    this._step += s
    if (this._step === this._block.length) {
      this._s.forEach( s => s.unsubscribe())
    }
  }
  /**
   * 记录需要跳转的路由
   * @param routeName 路由 name
   */
  public push(block: IBlock) {
    this._block.push(block)
    return this
  }
  /**
   * 生成流
   */
  public create() {
    this._stream = xs.create(this._producer)
    this._s.push(
      this._stream.subscribe(this._routerListener),
      this._stream.subscribe(this._decisionListener),
    )
    return this
  }
}
