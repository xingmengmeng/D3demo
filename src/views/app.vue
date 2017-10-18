<template>
    <section>
        <my-head></my-head>
        <router-view></router-view>
        <loading v-show="showLoading"></loading>
        <over-box-one-line v-show="noSelectT==1" @hideOverFn="hideMarkWrap" :mark-con="con"></over-box-one-line>
    </section>
</template>

<script type="text/ecmascript-6">
import myHead from '../components/header';
import loading from '../components/loadings.vue';
import overBoxOneLine from '../components/overBoxOneLine.vue';
export default {
    data () {
        return {
            showLoading:false,
            noSelectT:0,
            con:'请求超时',
        }
    },
    components:{
        'my-head':myHead,
        'loading':loading,
        'overBoxOneLine':overBoxOneLine,
    },
    created() {
        this.$on('toggleLoading', (show) => {
            this.showLoading = show;
        });
        this.$on('showOverTime', (con)=> {
            this.noSelectT=1;
            if(con){
                this.con=con;
            }
        })
    },
    methods:{
        hideMarkWrap(){
            this.noSelectT=0;
            this.con='请求超时';
        }
    }
}
</script>
