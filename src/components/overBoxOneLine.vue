<template>
    <div>
        <div class="overlay" @click="hideOneLine"></div>
        <div class="markWrap">
            <div class="top"><i class="close" @click="hideOneLine">关闭</i></div>
            <p>{{markCon}}</p>
        </div>
    </div>
</template>
<style scoped lang="less">
    .markWrap{
        position: fixed;
        z-index: 10003;
        background: #fff;
        top:50%;
        left: 50%;
        margin:-70px 0 0 -200px;
        width: 400px;
        height: 140px;
        color:#333;
        .top{
            height: 40px;
            background: #F7FAFE;
            border-bottom: 1px solid #DDEDFF;
            .close{
                float: right;
                margin:10px 15px 0 0;
                width: 17px;
                height: 17px;
                background: url(../assets/images/closeIcon.png);
                font-size: 0;
                cursor: pointer;
            }
        }
        p{
            padding-top: 30px;
            text-align: center;
        }
    }
</style>
<script type="text/ecmascript-6">
    export default {
        props:['markCon'],
        methods:{
            hideOneLine(){
                this.$emit('hideOverFn');
            }
        }
    }
</script>
