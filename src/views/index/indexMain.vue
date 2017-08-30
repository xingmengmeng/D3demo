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
        stroke: #000;
        stroke-width: 1.5px;
    }
    .node {
        cursor: move;
        fill: #ccc;
        stroke: #000;
        stroke-width: 1.5px;
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
                /*var links = [
                    {id:1,source: "Microsoft", target: "Amazon", type: "licensing"},
                    {id:2,source: "Microsoft", target: "HTC", type: "licensing"},
                    {id:3,source: "Samsung", target: "Apple", type: "suit"},
                    {id:4,source: "Motorola", target: "Apple", type: "suit"},
                    {id:5,source: "Nokia", target: "Apple", type: "resolved"},
                    {id:6,source: "HTC", target: "Apple", type: "suit"},
                ];
                var nodes = {};
                links.forEach(function(link) {
                    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source,id:link.id,type:link.type});
                    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target,id:link.id,type:link.type});
                });*/

                var graph ={
                    "nodes": [
                        {"x": 469, "y": 410},
                        {"x": 493, "y": 364},
                        {"x": 442, "y": 365},
                        {"x": 467, "y": 314},
                        {"x": 477, "y": 248},
                        {"x": 425, "y": 207},
                        {"x": 402, "y": 155},
                        {"x": 369, "y": 196},
                        {"x": 350, "y": 148},
                        {"x": 539, "y": 222},
                        {"x": 594, "y": 235},
                        {"x": 582, "y": 185},
                        {"x": 633, "y": 200}
                    ],
                    "links": [
                        {"source":  0, "target":  1},
                        {"source":  1, "target":  2},
                        {"source":  2, "target":  0},
                        {"source":  1, "target":  3},
                        {"source":  3, "target":  2},
                        {"source":  3, "target":  4},
                        {"source":  4, "target":  5},
                        {"source":  5, "target":  6},
                        {"source":  5, "target":  7},
                        {"source":  6, "target":  7},
                        {"source":  6, "target":  8},
                        {"source":  7, "target":  8},
                        {"source":  9, "target":  4},
                        {"source":  9, "target": 11},
                        {"source":  9, "target": 10},
                        {"source": 10, "target": 11},
                        {"source": 11, "target": 12},
                        {"source": 12, "target": 10}
                    ]
                };
                var nodes=graph.nodes;
                var links=graph.links;

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
                    .force("charge",d3.forceManyBody())
                    .force("center",d3.forceCenter(w/2,h/2))
                    .on("tick",tick)
                    .nodes(nodes)
                    .force("link",d3.forceLink(links));
                
                link=link.data(links)
                    .enter().append("line")
                    .attr("class", "link");
                node = node.data(nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", 12)
                    // .on("dblclick", dblclick)
                    .call(d3.drag());

                console.log(svg);
                function tick() {
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    node.attr("cx", function(d) { d.fx=d.x;return d.x; })
                        .attr("cy", function(d) { d.fy=d.y;return d.y; });
                    }
            }
        }
    }
</script>



