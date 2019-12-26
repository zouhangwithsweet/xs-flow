#### x-flow
subscribe user's progress in your webApp (power by vuex, vue-router)

#### how to use
```ts
import Xflow from 'xflow'
import router from 'path/to/router'
import store from 'path/to/store'
import someBlocks from 'path/to/blocks'

Vue.prototype.$xflow = new Xflow(router, store)
  .push(...someBlocks)
  .create()
```

```vue
<script>
  export default {
    someHandler() {
      this.$xflow.next()
    }
  }
</script>
```

##### example
[hello app](https://zouhangwithsweet.github.io/x-flow/examples/index#/)