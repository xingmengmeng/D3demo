<template>
    <section>
        <my-head></my-head>
        <router-view></router-view>
    </section>
</template>

<script type="text/ecmascript-6">
import myHead from '../components/header';
export default {
    data () {
        return {
            msg: 'vue单页面测试  --watch!'
        }
    },
    components:{
        'my-head':myHead,
    }
}
</script>

<style>
.message {
 color: blue;
}
</style>
