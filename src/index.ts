import xs, { Producer, Listener, Stream, Subscription } from 'xstream'
import VueRouter from 'vue-router'
import { Store } from 'vuex'

/**
 * block 类 inspirate by flow
 * 用来描述一个路由模块
 */
abstract class StreamRouteBlock {
  private type = 'r'
  private route!: string
  constructor(route: string) {
    this.route = route
  }
}

/**
 * 用来描述一个决策模块
 */
abstract class StreamDecisionBlock {
  private type= 'd'
  constructor() {}
  /**
   * 决策
   */
  abstract decide(): Promise<any>
}

/**
 * flow 类
 * 用来描述一个用户的流程
 */
class StreamFlow<R = any, S = any> {
  private _routes: string[] = []
  private _block: Array<StreamRouteBlock | StreamDecisionBlock> = []
  private _step = 0
  private _stream!: Stream<StreamRouteBlock | StreamDecisionBlock>
  private _producer!: Producer<StreamRouteBlock | StreamDecisionBlock>
  private _router!: VueRouter
  private _store!: Store<S>
  private _routerListener!: Listener<StreamRouteBlock | StreamDecisionBlock>
  private _s!: Subscription
  public next!: Function

  constructor(router: VueRouter, store?: Store<any>) {
    this._router = router
    /**
     * 创建路由订阅者
     */
    this._routerListener = {
      next: name => {
        try {
          // todo 完成 block 然后 move
          this.move()
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
            this._s.unsubscribe()
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
  public push(block: StreamRouteBlock | StreamDecisionBlock) {
    this._block.push(block)
    return this
  }
  /**
   * 生成流
   */
  public create() {
    this._stream = xs.create(this._producer)
    this._s = this._stream.subscribe(this._routerListener)
    return this
  }
  /**
   * 进位或退位
   */
  private move(s: 1 | -1 | number = 1) {
    this._step += s
  }
}
