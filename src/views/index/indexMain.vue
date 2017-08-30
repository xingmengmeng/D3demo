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
<style>
    .link {
        stroke: #0099cc;
        stroke-width: 1px;
    }
    .node {
        cursor: move;
        fill: #ccc;
        stroke: #000;
        stroke-width: 1.5px;
    }
    circle {
        stroke: #c8c8c8;
        stroke-width: 1px;
    }
    .linetext{
        background: #fff;
        cursor: pointer;
    }
</style>

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
                console.dir(d3);
                var graph ={
                    "nodes": [ { name: "BeiJing",type:"person"   }, { name: "XiaMen",type:'suit' },
                          { name: "XiAn"    }, { name: "HangZhou"   },
                          { name: "ShangHai"   }, { name: "QingDao"    },
                          { name: "NanJing"    } ],
                    "links": [  { source : 0  , target: 6 ,type:'联系人'} , { source : 0  , target: 4 ,type:'cc'} ,
                           { source : 2  , target: 3,type:'ww' } , { source : 1  , target: 4 ,type:'cc'} ,
                           { source : 1  , target: 5,type:'vv' } , { source : 3  , target: 6 ,type:'22'}  ]
                }
                let nodes=graph.nodes,
                    links=graph.links;

                const w = 960,//后期改为整块区域的宽高，待修改
                      h = 500;
                let chartDiv=d3.select('body').select('#chartId');
                let svg=chartDiv.append("svg")
                    .attr("width", w)
                    .attr("height", h);
                var link = svg.selectAll(".link");
                var node = svg.selectAll(".node");
                //引入力导向图
                let force = d3.forceSimulation()
                    .force("charge",d3.forceManyBody().strength(-400))
                    .force("center",d3.forceCenter(w/2,h/2))
                    .on("tick",tick)
                    .nodes(nodes)
                    .force("link",d3.forceLink(links).distance(300).strength(2));//forceLink连接力 distance连接线长度 strength连接强度
                
                link=link.data(links)
                    .enter().append("line")
                    .attr("class", "link");
                //节点
                node = node.data(nodes)
                    .enter().append("circle")
                    .attr("r", function(d){
                        if(d.type=='person'){//根据type判断圈的大小
                            return 30;
                        }else{
                            return 20;
                        }
                    })
                    .style("fill",function(d,i){
                        if(d.type=='suit'){
                            return '#f1bebe'
                        }
						return '#ccccff'
					})
                    .call(d3.drag())
                    .on('click',nodeClick);
                //节点上的文字
                var svg_texts = svg.selectAll("text")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .style("fill", "black")
                    .attr("x", -20)
                    .attr("y", -20)
                    .text(function(d){
                        return d.name;
                    });
                //线上的文字
                var line_texts=svg.selectAll(".linetext")  
                    .data(links)  
                    .enter()  
                    .append("text")  
                    .attr("class","linetext")  
                    .text(function(d){  
                        return d.type;  
                    })
                    .on('click',function(d){
                        console.log(d.type)
                    }); 

                function nodeClick(d){
                    console.log(d.name);
                }
                function tick() {
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    node.attr("cx", function(d) { d.fx=d.x;return d.x; })
                        .attr("cy", function(d) { d.fy=d.y;return d.y; });

                    svg_texts.attr("x", function(d){ return d.x-10; })
                        .attr("y", function(d){ return d.y+5; });
                    
                    line_texts.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; })
                        .attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; }); 
                }
                function dragstarted(d) {
                    if (!d3.event.active) force.alphaTarget(0.3).restart();  //restart是重新恢复模拟
                    d.fx = d.x;    //d.x是当前位置，d.fx是固定位置
                    d.fy = d.y;
                }

                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }

                function dragended(d) {
                    if (!d3.event.active) force.alphaTarget(0);
                    d.fx = null;       //解除dragged中固定的坐标
                    d.fy = null;
                }
            }
        }
    }
</script>



