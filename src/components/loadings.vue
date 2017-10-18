<template>
    <div>
        <div class="overlay"></div>
        <div class="markWrap clearfix">
            <i>Loading</i>
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
</template>
<style scoped lang="less">
    *{
        color: #fff;
        font-size: 34px;
    }
    .markWrap{
        position: fixed;
        width: 500px;
        z-index: 10003;
        top:50%;
        left: 50%;
        margin: -14px 0 0 -70px;
    }
    i{
        float: left;
    }
    .loading{
        float: left;
        width: 150px;
        height: 8px;
        margin: 0 0 0 15px;
    }
    .loading span{
        display: inline-block;
        width: 8px;
        height: 100%;
        margin-right: 5px;
        border-radius: 50%;
        background: #fff;
        -webkit-animation: load 1.04s ease infinite;
    }
    .loading span:last-child{
        margin-right: 0px;
    }
    @-webkit-keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
    .loading span:nth-child(1){
        -webkit-animation-delay:0.13s;
    }
    .loading span:nth-child(2){
        -webkit-animation-delay:0.26s;
    }
    .loading span:nth-child(3){
        -webkit-animation-delay:0.39s;
    }
    .loading span:nth-child(4){
        -webkit-animation-delay:0.52s;
    }
    .loading span:nth-child(5){
        -webkit-animation-delay:0.65s;
    }
</style>


