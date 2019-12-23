import xs, { Producer, Listener, Stream, Subscription } from 'xstream'
import VueRouter from 'vue-router'
import { Store } from 'vuex'

/**
 * block 类 inspirate by flow
 * 用来描述一个路由模块
 */
abstract class StreamRouteBlock {
  public static type: 'r' = 'r'
  public static routeName: string
}

/**
 * 用来描述一个决策模块
 */
abstract class StreamDecisionBlock<T=any> {
  public static type: 'd' = 'd'
  constructor(router?: VueRouter, store?: Store<T>) {}
  /**
   * 决策
   */
  public abstract decide(router?: VueRouter, store?: Store<T>): Promise<any>
}

type IBlock = typeof StreamDecisionBlock | typeof StreamRouteBlock

/**
 * flow 类
 * 用来描述一个用户的流程
 */
export default class StreamFlow<R = any, S = any> {
  // private _routes: string[] = []
  private _block: Array<IBlock> = []
  private _step = 0
  private _stream!: Stream<IBlock>
  private _producer!: Producer<IBlock>
  private _router!: VueRouter
  private _store!: Store<S>
  private _routerListener!: Listener<IBlock>
  private _decisionListener!: Listener<IBlock>
  private _s: Subscription[] = []
  public next!: Function

  constructor(router: VueRouter, store?: Store<any>) {
    this._router = router
    store && (this._store = store)
    /**
     * 创建决策层
     */
    this._decisionListener = {
      next: async b => {
        if (b.type === 'd') {
          // this.pendding = true
          await new (b as any)().decide()
          // this.pendding = false
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
          if ('routeName' in b) {
            this._router.replace({
              name: b.routeName,
            })
            this.move()
          }
        } catch (error) {}
      },
      error: err => {
        throw new Error(err)
      },
      complete: () => {}
    }
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
          } else {
            // this._s.unsubscribe()
          }
        }
      },
      stop: () => {
        console.log('stream 已经没有订阅者')
      }
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
  /**
   * 进位或退位
   */
  private move(s: 1 | -1 | number = 1) {
    this._step += s
  }
}
