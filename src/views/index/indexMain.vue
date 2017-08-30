<template>
    <section class="container">
        <div class="topSelect box-shadow clearfix">
            <h3 class="left">关系图谱调查</h3>
            <div class="right messDiv">
                <label class="left">查询编号：</label>
                <input type="text" placeholder="请输入编号" class="left txt">
                <input type="button" value="查询" class="btnBlue">
            </div>
        </div>
        <section class="mainContain">
            <div class="leftSide">
                <div class="everyDiv box-shadow">
                    <h5>调查概览：</h5>
                    <ul>
                        <li>
                            <span>评分-D</span>
                            <ul>
                                <li>1111</li>
                                <li>222</li>
                            </ul>
                        </li>
                        <li>
                            <span>评分-C</span>
                            <ul>
                                <li>1111</li>
                                <li>222</li>
                            </ul>
                        </li>
                        <li>
                            <span>评分-B</span>
                            <ul>
                                <li>1111</li>
                                <li>222</li>
                            </ul>
                        </li>
                        <li>
                            <span>评分-A</span>
                            <ul>
                                <li>1111</li>
                                <li>222</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="everyDiv box-shadow">
                    <h5>主体属性：</h5>
                    <ul>
                        <li>
                            <span>特有属性</span>
                            <ul>
                                <li>1111</li>
                                <li>222</li>
                            </ul>
                        </li>
                        <li>
                            <span>共有属性</span>
                            <ul>
                                <li>1111</li>
                                <li>222</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="rightSide">
                <h5 class="chartTitle box-shadow">关系图</h5>
                <div class="chartWrap box-shadow" id="chartId">

                </div>
            </div>
        </section>
    </section>
</template>
<style lang="less" scoped>
    h3{
        height: 30px;
        line-height: 30px;
        font-weight: normal;
    }
    .topSelect{
        padding:10px;
        margin:5px;
        border:1px #ddd solid;
        box-sizing: border-box;
        .messDiv{
            label{
                height: 30px;
                line-height: 30px;
            }
            .txt{
                padding:0 5px;
                margin:0 10px;
                height: 30px;
                line-height: 30px;
                box-sizing: border-box;
                color:#333;
            }
        }
    }
    .mainContain{
        margin:0 5px;
        .everyDiv{
            padding:10px;
            margin-bottom:10px;
            border:1px #ddd solid;
            box-sizing: border-box;
        }
        .chartTitle{
            padding:0 10px;
            margin-bottom: 10px;
            height: 30px;
            line-height: 30px;
            border:1px #ddd solid;
            box-sizing: border-box;
        }
        .chartWrap{
            border:1px #ddd solid;
            box-sizing: border-box;
        }
    }
</style>
<script>
    import * as d3 from "d3";
    require('../../assets/css/layout.less');
    export default {
        data(){
            return{

            }
        },
        mounted(){
            this.getChartHeight();
            this.drawChart();//画图
        },
        methods:{
            getChartHeight(){
                let winHeight=document.documentElement.clientHeight,
                    aChart=document.querySelector('#chartId');
                //头部 50  头下方title 52  图的title30  中间间隔30
                aChart.style.height=winHeight-50-52-30-30+'px';
            },
            drawChart(){
                var links = [
                    {id:1,source: "Microsoft", target: "Amazon", type: "licensing"},
                    {id:2,source: "Microsoft", target: "HTC", type: "licensing"},
                    {id:3,source: "Samsung", target: "Apple", type: "suit"},
                    {id:4,source: "Motorola", target: "Apple", type: "suit"},
                    {id:5,source: "Nokia", target: "Apple", type: "resolved"},
                    {id:6,source: "HTC", target: "Apple", type: "suit"},
                ];
                var nodes = {};
                links.forEach(function(link) {
                    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source,id:link.id});
                    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target,id:link.id});
                });
                var w = 960,
                    h = 500;

                console.dir(d3);
                let chartDiv=d3.select('body').select('#chartId');
                //引入力导向图
                let force = d3.forceSimulation();
                console.log(force);
            }
        }
    }
</script>



