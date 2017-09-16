<template>
    <section class="container">
        <div class="topSelect box-shadow clearfix">
            <h3 class="left">关系图谱调查</h3>
            <div class="right messDiv">
                <label class="left">查询编号：</label>
                <input type="text" placeholder="请输入编号" class="left txt" v-model="idNo">
                <input type="button" value="查询" class="btnBlue" @click="getData">
            </div>
        </div>
        <section class="mainContain">
            <div class="leftSide">
                <div class="everyDiv box-shadow">
                    <h5>调查概览：</h5>
                    <ul>
                        <li class="messLi" v-for="(infos,index) in surveyInfos" :key="index">
                            <span @click="changeShowF(infos.ocMenubm,'showF')" class="menuSpan" :class="showF==infos.ocMenubm?'active':''">{{infos.name}} <i>{{infos.sl}}</i></span>
                            <ul v-show="showF==infos.ocMenubm" v-if="infos">
                                <li v-for="(ocMenu,curIndex) in infos.children" :key="curIndex" @click="showAllNode(ocMenu.type)" class="typeLi">{{ocMenu.name}} <i>{{ocMenu.sl}}</i></li>
                                <!--<li>222</li>-->
                            </ul>
                        </li>
                        <!--<li class="messLi">
                            <span>评分-C</span>
                            <ul v-show="showF==2">
                                <li>1111</li>
                                <li>222</li>
                            </ul>
                        </li>-->
                    </ul>
                </div>
                <div class="everyDiv box-shadow">
                    <h5>{{typeTitle}}：</h5>
                    <ul v-if="attrData">
                        <li class="messLi" v-for="(curD,index) in attrData" :key="index">
                            <span @click="changeShowF(curD.ocMenubm,'showM')" class="menuSpan" :class="showM==curD.ocMenubm?'active':''">{{curD.name}}</span>
                            <ul v-show="showM==curD.ocMenubm" v-if="curD" class="attrDetails">
                                <li v-for="(attrCur,attrIndex) in curD.children" :key="attrIndex">{{attrCur.name}}</li>
                                <!--<li>222</li>-->
                            </ul>
                        </li>
                        <!--<li class="messLi">
                            <span>共有属性</span>
                            <ul>
                                <li>1111</li>
                                <li>222</li>
                            </ul>
                        </li>-->
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
        stroke: #a5abb6;
        stroke-width: 1px;
    }
    .node {
        cursor: pointer;
        fill: #ccc;
        stroke: #000;
        stroke-width: 1.5px;
    }
    .circle {
        stroke: #9aa1ac;
        stroke-width: 1px;
        cursor: pointer;
    }
    .circleActive {
        stroke: #ceebfe;
        stroke-width: 5px;
        cursor: pointer;
    }
    .linetext{
        fill: #666;
        font-size: 12px;
        background-color: #fff;
        cursor: pointer;
    }
    .nodesText{
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
    .everyDiv{
        h5{
            font-size: 14px;
            padding:10px 0;
        }
        .messLi{
            display: inline-block;
            padding:5px 10px;
            width: 100%;
            border-bottom: 1px #ddd dashed;
            box-sizing: border-box;
            ul{
                padding:5px 10px;
                box-sizing:border-box;
            }
            .typeLi{
                cursor: pointer;
            }
            .menuSpan{
                display: inline-block;
                padding-right:30px;
                width: 100%;
                background: url(../../assets/images/showNext.png) right center no-repeat;
                background-size: 14px 10px;
                box-sizing: border-box;
                cursor: pointer;
                &.active{
                    background: url(../../assets/images/hideNext.png) right center no-repeat;
                    background-size: 14px 10px;
                }
            }
            i{
                float: right;
                font-style: normal;
            }
        }
    }
    .attrDetails{
        max-height: 120px;
        overflow-y: scroll;
    }
</style>
<script>
    import * as d3 from "d3";
    require('../../assets/css/layout.less');
    export default {
        data(){
            return{
                chartWidth:900,
                chartHeight:400,
                graph:null,
                showF:-1,
                showM:-1,
                idNo:'',
                surveyInfos:null,//调查概览数据
                attrData:null,//属性数据
                typeTitle:'主体属性',
                nodes:null,
                curType:'',
            }
        },
        mounted(){
            this.getChartHeight();
            this.getData();
        },
        methods:{
            getChartHeight(){
                let winHeight=document.documentElement.clientHeight,
                    aChart=document.querySelector('#chartId');
                //头部 50  头下方title 52  图的title30  中间间隔30
                aChart.style.height=winHeight-50-52-30-30+'px';
                this.chartHeight=winHeight-50-52-30-30;
                this.chartWidth=aChart.clientWidth;
            },
            getData(){
                /*this.$http.get('/graph/data.gm?idNo='+this.idNo+'&pfbz=0').then(function(res){
                    if(res.data.code==200){
                        this.graph=res.data.data;
                        this.surveyInfos=res.data.data.surveyInfos.concat();
                        this.drawChart();//画图
                    }
                })*/
                this.drawChart();//画图
            },
            drawChart(){
                console.dir(d3);
                const _this=this;
                this.graph ={
                    "nodes": [ { name: "BeiJing",type:"person" ,id:'1'  }, { name: "XiaMen",type:'suit',id:'2' },
                          { name: "XiAn",id:'3'    }, { name: "HangZhou" ,id:'4'  },
                          { name: "ShangHai" ,id:'5'  }, { name: "QingDao"  ,id:'6'  },
                          { name: "NanJing"  ,id:'7'  } ],
                    "links": [  { source : 0  , target: 6 ,type:'联系人'} , { source : 0  , target: 4 ,type:'cc'} ,
                           { source : 2  , target: 3,type:'ww' } , { source : 1  , target: 4 ,type:'cc'} ,
                           { source : 1  , target: 5,type:'vv' } , { source : 3  , target: 6 ,type:'22'}  ]
                }
                //每次请求完重新加载显示图
                d3.select('#svgId').remove();   //删除整个SVG
                d3.select('#svgId')
                    .selectAll('*')
                    .remove();                    //清空SVG中的内容
                //开始设置
                let nodes=this.graph.nodes,
                    links=this.graph.links;

                const w = this.chartWidth,//后期改为整块区域的宽高，待修改
                      h = this.chartHeight;
                let chartDiv=d3.select('body').select('#chartId');
                let svg=chartDiv.append("svg")
                    .attr('id','svgId')
                    .attr("width", w)
                    .attr("height", h);
                //箭头
                var marker=svg.append("marker")
                    .attr("id", "resolved")
                    .attr("markerUnits","userSpaceOnUse")
                    .attr("viewBox", "0 -5 10 10")//坐标系的区域
                    .attr("refX",36)//箭头坐标
                    .attr("refY", 0)
                    .attr("markerWidth", 10)//标识的大小
                    .attr("markerHeight", 10)
                    .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
                    .attr("stroke-width",2)//箭头宽度
                    .append("path")
                    .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                    .attr('fill','#a5abb6');//箭头颜色


                var link = svg.selectAll(".link");
                var node = svg.selectAll(".node");
                //引入力导向图
                let force = d3.forceSimulation()
                    .force("charge",d3.forceManyBody().strength(-300))
                    .force("center",d3.forceCenter(w/2,h/2))
                    .on("tick",tick)
                    .nodes(nodes)
                    .force("link",d3.forceLink(links).distance(180)/*.strength(2)*/);//forceLink连接力 distance连接线长度 strength连接强度
                console.dir(force);
                link=link.data(links)
                    .enter().append("path")
                    .attr('d',function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y})
                    .attr('id',function(d,i){return 'path'+i;})
                    .attr("class", "link")
                    .style('fill','#000')
                    .attr("marker-end","url(#resolved)");
                //节点
                node = node.data(nodes)
                    .enter().append("circle")
                    .attr("r", function(d){
                        if(d.type=='Person'){//根据type判断圈的大小
                            return 35;
                        }else{
                            return 25;
                        }
                    })
                    .attr('class','circle')
                    .style("fill",function(node,i){
                        return _this.fillColor(node);
					})
                    .call(d3.drag()
                        .on("start",dragstarted)
                        .on("drag",dragged)
                        .on("end",dragended))
                    .on('click',function(d){
                        _this.nodeClick.call(this,d,this);
                        _this.nodeColor(d);
                    });  
                _this.nodes=node;                                                                                                
                //节点上的文字
                var svg_texts = svg.selectAll("text")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .style("fill", "black")
                    .attr("x", 0)
                    .attr("y", 0)
                    .text(function(d){
                        return d.name;
                    })
                    .attr('text-anchor','middle')
                    .attr('class','nodesText')
                    .call(d3.drag()
                        .on("start",dragstarted)
                        .on("drag",dragged)
                        .on("end",dragended))
                    .on('click',function(d){
                        _this.nodeClick.call(this,d,this);
                        //d3.select(cur).style("fill","yellow");
                        _this.nodeColor(d);
                    }); 
                //线上的文字
                var line_texts=svg.selectAll(".linetext")  
                    .data(links)  
                    .enter()  
                    .append("text")  
                    .attr("class","linetext") 
                    .attr('x','0')
                    .attr('dy','4') 
                    .attr('text-anchor','middle')
                    .append('textPath').attr(
                        'xlink:href',function(d,i){
                            return '#path'+i;
                        }
                    )
                    .attr('startOffset','50%')
                    .text(function(d){  
                        return d.type;  
                    })
                    .on('click',_this.lineClick); 


                function tick() {
                    /*link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });*/
                    link.attr('d', function(d) { 
                        var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                        return path;
                    });  
                    
                    //更新节点坐标  限制节点位置
                    var raduis=18;
                    node.attr('transform',function(d){
                        d.x = d.x - (2*raduis) < 0  ? (2*raduis) : d.x ;
                        d.x = d.x + (2*raduis) > w ? w - (2*raduis) : d.x ; 
                        d.y = d.y - (2*raduis) < 0  ? (2*raduis) : d.y ;
                        d.y = d.y + (2*raduis) > h ? h - (2*raduis) : d.y ;
                        return 'translate('+d.x+','+d.y+')';})
                    //更新文字坐标
                    svg_texts.attr("x", function(d){ return d.x; })
                        .attr("y", function(d){ return d.y+5; });

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
            },
            //点击力导向图中的点   改变颜色
            nodeColor(d){
                var _this=this;
                /*this.nodes.style("fill",function(node){
                    if(d.id==node.id){
                        return '#cc8b01';
                    }else{
                        return _this.fillColor(node);
                    }
                });*/
                this.nodes.attr("class",function(node){
                    if(d.id==node.id){
                        return 'circleActive';
                    }else{
                        return 'circle';
                    }
                });
            },
            //点击评分列表  右侧图相应类型颜色变化
            showAllNode(typeStr){
                var _this=this;
                /*this.nodes.style("fill",function(node){
                    if(typeStr==node.type){
                        return '#cc8b01';
                    }else{
                        return _this.fillColor(node);
                    }
                });*/
                this.nodes.attr("class",function(node){
                    if(typeStr==node.type){
                        return 'circleActive';
                    }else{
                        return 'circle';
                    }
                });
            },
            //颜色设置  根绝类型设置
            fillColor(node){
                if(node.type=='Person'){
                    return '#ccccff'
                }else if(node.type=='App'){
                    return '#c7d890'
                }else if(node.type=='Account'){
                    return '#9dbfe2'
                }else if(node.type=='Tel'){
                    return '#e8a29b'
                }else if(node.type=='BankCard'){
                    return '#fbe1a1'
                }else if(node.type=='Device'){
                    return '#b2a4c1'
                }else if(node.type=='House'){
                    return '#fbc8d9'
                }else if(node.type=='Address'){
                    return '#c0ad9d'
                }else if(node.type=='Company'){
                    return '#fbc999'
                }else{
                    return '#cccccc'
                }
            },
            changeShowF(menuId,showStr){
                if(showStr=='showF'){
                    if(this.showF==menuId){
                        this.showF=-1;
                        return;
                    }
                    this.showF=menuId;
                }else{
                    if(this.showM==menuId){
                        this.showM=-1;
                        return;
                    }
                    this.showM=menuId;
                } 
            },
            nodeClick(d,cur){
                this.typeTitle='主体属性';

                let nodeId=d.id,
                    nodeType=d.type;
                this.$http.get('/graph/findSubjectAtt.gm?id='+nodeId+'&type='+nodeType).then(function(res){
                    if(res.data.code==200){
                        this.attrData=res.data.data.concat();
                    }
                })
                //d3.select(cur).style("fill","yellow");
            },
            lineClick(d){
                this.typeTitle='关系属性';

                let linkId=d.id,
                    linkType=d.type;
                this.$http.get('/graph/findRelationAtt.gm?id='+linkId+'&type='+linkType).then(function(res){
                    if(res.data.code==200){
                        this.attrData=res.data.data.concat();
                    }
                })
            }
        }
    }
</script>



