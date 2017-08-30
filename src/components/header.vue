<template>
    <header class="container" id="header">
        <router-link to="/index" class="logo left">logo</router-link>
        <!--<a href="javascript:;" class="logo left">logo</a>-->
        <div class="right headRight">
            <!--<div class="headerIcon">
                <img src="../assets/images/_header.png" >
            </div>-->
            <span class="headerUserName">{{userName}}</span>
            <i class="line"></i>
            <div class="layoutIcon" @click="logoutFn($event)">退出</div>
        </div>
    </header>
</template>
<style>

</style>
<script type="text/ecmascript-6">
    require('../assets/css/reset.min.less');
    require('../assets/css/layout.less');
    export default {
        data () {
            return {
                userName:'',
            }
        },
        components:{

        },
        mounted(){
            this.userName=localStorage.userName;
        },
        methods:{
            logoutFn(e){
                if(e.target.innerHTML=='退出'){
                    this.$http.get('biPc/login/logout.gm').then(function (res) {
                        if(res.data.code==200){
                            localStorage.clear();
                            window.location.href='login.html';
                        }
                    })
                }
            },
        }
    }
</script>

