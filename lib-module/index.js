var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import xs from 'xstream';
/**
 * flow 类
 * 用来描述一个用户的流程
 */
var StreamFlow = /** @class */ (function () {
    function StreamFlow(router, store) {
        var _this = this;
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
            next: function (b) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(b.type === 'd')) return [3 /*break*/, 2];
                            // this.pendding = true
                            return [4 /*yield*/, new b(router, store).decide()
                                // this.pendding = false
                            ];
                        case 1:
                            // this.pendding = true
                            _a.sent();
                            // this.pendding = false
                            this.move();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); },
            error: function (err) {
                throw new Error(err);
            },
            complete: function () { }
        };
        /**
         * 创建路由订阅者
         */
        this._routerListener = {
            next: function (b) {
                try {
                    // todo 完成 block 然后 move
                    if (b.type === 'r') {
                        _this._router.replace({
                            name: b() || '',
                        });
                        _this.move();
                    }
                }
                catch (error) { }
            },
            error: function (err) {
                throw new Error(err);
            },
            complete: function () { }
        };
        /**
         * 创建流producer
         */
        this._producer = {
            start: function (l) {
                /**
                 * 初始化 next 方法
                 */
                _this.next = function () {
                    if (_this._block[_this._step]) {
                        l.next(_this._block[_this._step]);
                    }
                    else {
                        // this._s.unsubscribe()
                    }
                };
            },
            stop: function () {
                console.log('stream 已经没有订阅者');
            }
        };
    }
    /**
     * 记录需要跳转的路由
     * @param routeName 路由 name
     */
    StreamFlow.prototype.push = function (block) {
        this._block.push(block);
        return this;
    };
    /**
     * 生成流
     */
    StreamFlow.prototype.create = function () {
        this._stream = xs.create(this._producer);
        this._s.push(this._stream.subscribe(this._routerListener), this._stream.subscribe(this._decisionListener));
        return this;
    };
    /**
     * 进位或退位
     */
    StreamFlow.prototype.move = function (s) {
        if (s === void 0) { s = 1; }
        this._step += s;
        if (this._step === this._block.length) {
            this._s.forEach(function (s) { return s.unsubscribe(); });
        }
    };
    return StreamFlow;
}());
export default StreamFlow;
