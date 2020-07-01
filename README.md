
## xs-flow
![npm](https://img.shields.io/npm/v/xs-flow)  
subscribe user's progress in your webApp (power by vuex, vue-router)

#### how to use
```ts
import XsFlow from 'xs-flow'
import router from 'path/to/router'
import store from 'path/to/store'
import someBlocks from 'path/to/blocks'

Vue.prototype.$xsFlow = new XsFlow(router, store)
  .push(...someBlocks)
  .create()
```

```vue
<script>
  export default {
    someHandler() {
      this.$xsFlow.next()
    }
  }
</script>
```

##### example
> use mobile mode to check it

[hello app](https://zouhangwithsweet.github.io/xs-flow/examples/index#/)
