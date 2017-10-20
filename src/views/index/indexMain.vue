<template>
    <section class="container">
        <div class="topSelect box-shadow clearfix">
            <h3 class="left">关系图谱调查</h3>
            <div class="right messDiv">
                <label class="left">身份证号：</label>
                <input type="text" placeholder="请输入身份证号" class="left txt" v-model="idNo">
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
                                <li v-for="(ocMenu,curIndex) in infos.children" :key="curIndex" @click="showAllNode(ocMenu.ids)" class="typeLi">{{ocMenu.name}} <i>{{ocMenu.sl}}</i></li>
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
                <h5 class="chartTitle box-shadow">关系图 <i @click="onStatus=!onStatus" :class="onStatus?'active':''"></i></h5>
                <div class="chartWrap box-shadow" id="chartId">
                    <span class="errorSpan">{{error}}</span>
                </div>
            </div> 
        </section>
    </section>
</template>
<style>
    .link {
        fill:none;
        stroke: #a5abb6;
        stroke-width: 1px;
    }
    .node {
        cursor: pointer;
        fill: #ccc;
        stroke: #000;
        stroke-width: 1.5px;
    }
    .circleActive {
        stroke: #ff3333;
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
            i{
                float: right;
                margin-top:4px;
                width: 54px;
                height: 34px;
                background: url(../../assets/images/off.png) no-repeat;
                background-size: 70%;
                cursor: pointer;
                &.active{
                    background: url(../../assets/images/on.png) no-repeat;
                    background-size: 70%;
                }
            }
        }
        .chartWrap{
            position: relative;
            border:1px #ddd solid;
            box-sizing: border-box;
            .errorSpan{
                position: absolute;
                top:50%;
                left:50%;
            }
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
                onStatus:true,//开关状态
                error:'',
            }
        },
        mounted(){
            this.getChartHeight();
            //this.getData();
        },
        watch:{
            onStatus(str){
                if(this.idNo){
                    this.getData();
                }
            }
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
                let pfbz=this.onStatus?0:1;
                this.$http.get('/graph/data.gm?idNo='+this.idNo+'&pfbz='+pfbz).then(function(res){
                    if(res.data.code==200){
                        this.graph=res.data.data;
                        this.surveyInfos=res.data.data.surveyInfos.concat();
                        this.drawChart();//画图
                    }
                })
                //this.drawChart();//画图
            },
            drawChart(){
                const _this=this;
                /*this.graph ={
                    "nodes": [ { name: "BeiJing",type:"person" ,id:'1'  }, { name: "XiaMen",type:'suit',id:'2' },
                          { name: "XiAn",id:'3'    }, { name: "HangZhou" ,id:'4'  },
                          { name: "ShangHai" ,id:'5'  }, { name: "QingDao"  ,id:'6'  },
                          { name: "NanJing"  ,id:'7'  } ],
                    "links": [  { source : 0  , target: 6 ,type:'联系人'} , { source : 0  , target: 4 ,type:'cc'} ,
                           { source : 2  , target: 3,type:'ww' } , { source : 1  , target: 4 ,type:'cc'} ,
                           { source : 1  , target: 5,type:'vv' } , { source : 1  , target: 5,type:'ljfksjfs' ,arrow:'back'} ,{ source : 3  , target: 6 ,type:'22'}  ]
                }*/
                //每次请求完重新加载显示图
                d3.select('#svgId').remove();   //删除整个SVG
                d3.select('#svgId')
                    .selectAll('*')
                    .remove();                    //清空SVG中的内容
                //开始设置
                let nodes=this.graph.nodes,
                    links=this.graph.links;
                
                //关系分组  
                var linkGroup = {};  
                //对连接线进行统计和分组，不区分连接线的方向，只要属于同两个实体，即认为是同一组  
                var linkmap = {}  
                for(var i=0; i<links.length; i++){  
                    var key = links[i].source<links[i].target?links[i].source+':'+links[i].target:links[i].target+':'+links[i].source;  
                    if(!linkmap.hasOwnProperty(key)){  
                        linkmap[key] = 0;  
                    }  
                    linkmap[key]+=1;  
                    if(!linkGroup.hasOwnProperty(key)){  
                        linkGroup[key]=[];  
                    }  
                    linkGroup[key].push(links[i]);  
                }  
                //为每一条连接线分配size属性，同时对每一组连接线进行编号  
                for(var i=0; i<links.length; i++){  
                    var key = links[i].source<links[i].target?links[i].source+':'+links[i].target:links[i].target+':'+links[i].source;  
                    links[i].size = linkmap[key];  
                    //同一组的关系进行编号  
                    var group = linkGroup[key];  
                    var keyPair = key.split(':');  
                    var type = 'noself';//标示该组关系是指向两个不同实体还是同一个实体  
                    if(keyPair[0]==keyPair[1]){  
                        type = 'self';  
                    }  
                    //给节点分配编号  
                    setLinkNumber(group,type);  
                }  

                const w = this.chartWidth,//后期改为整块区域的宽高，待修改
                      h = this.chartHeight;
                let chartDiv=d3.select('body').select('#chartId');
                let svg=chartDiv.append("svg")
                    .attr('id','svgId')
                    .attr("width", w)
                    .attr("height", h);
                //箭头
                var marker=svg.selectAll("marker")  
                    .data(["resolved", "resolved2", "resolved3"]) 
                    .enter().append("marker")
                    .data(["resolved", "resolved2", "resolved3"])
                    .attr("id", String)
                    .attr("markerUnits","userSpaceOnUse")
                    .attr("viewBox", "0 -5 10 10")//坐标系的区域
                    .attr("refX",43)//箭头坐标
                    .attr("refY", function(d){
                        if(d=='resolved') return 0;
                        if(d=='resolved2') return 2;
                        if(d=='resolved3') return -2;
                    })
                    .attr("markerWidth", 10)//标识的大小
                    .attr("markerHeight", 10)
                    .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
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
                
                link=link.data(links)
                    .enter().append("path")
                    .attr('d',function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y})
                    .attr('id',function(d,i){return 'path'+i;})
                    .attr("class", "link")
                    .attr("marker-end",function(d){
                        /*if((d.size==1&&d.linknum==1)||(d.size==3&&d.linknum==1)){
                            return "url(#resolved)";
                        }else if((d.size==2&&d.linknum==1)||(d.size==3&&d.linknum==2)){
                            return "url(#resolved3)";
                        }else if((d.size==2&&d.linknum==-1)||(d.size==3&&d.linknum==-2)){
                            return "url(#resolved2)";
                        }*/
                        let isEven=d.size%2==0?true:false;//判断size是不是偶数
                        let numIsEven=d.linknum%2==0?true:false;//判断size是不是偶数
                        if(d.linknum<0){
                            return "url(#resolved2)";
                        }else{
                            if(isEven){//size偶数 且正弧度
                                return "url(#resolved3)";
                            }else{//size基数 且正弧度
                                if(numIsEven){//偶数线
                                    return "url(#resolved3)";
                                }else{
                                    return "url(#resolved)";
                                }
                            }
                        } 
                    });
                //节点
                node = node.data(nodes)
                    .enter().append("circle")
                    .attr("r", function(d){
                        if(d.type=='Person'||d.type=='Main'){//根据type判断圈的大小
                            return 38;
                        }else{
                            return 32;
                        }
                    })
                    .style("fill",function(node,i){
                        return _this.fillColor(node);
					})
                    .attr('stroke',function(d){
                        return _this.strColor(d);
                    })
                    .attr('stroke-width','3px')
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
                    .style("fill", "#fff")
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
                        /*var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                        return path;*/
                        //控制线超界
                        var raduis=22; 
                        d.source.x = d.source.x - (2*raduis) < 0  ? (2*raduis) : d.source.x ;
                        d.source.x = d.source.x + (2*raduis) > w ? w - (2*raduis) : d.source.x ; 
                        d.source.y = d.source.y - (2*raduis) < 0  ? (2*raduis) : d.source.y ;
                        d.source.y = d.source.y + (2*raduis) > h ? h - (2*raduis) : d.source.y ;

                        d.target.x = d.target.x - (2*raduis) < 0  ? (2*raduis) : d.target.x ;
                        d.target.x = d.target.x + (2*raduis) > w ? w - (2*raduis) : d.target.x ; 
                        d.target.y = d.target.y - (2*raduis) < 0  ? (2*raduis) : d.target.y ;
                        d.target.y = d.target.y + (2*raduis) > h ? h - (2*raduis) : d.target.y ;
                        //如果连接线连接的是同一个实体，则对path属性进行调整，绘制的圆弧属于长圆弧，同时对终点坐标进行微调，避免因坐标一致导致弧无法绘制 
                        if(d.target==d.source){  
                            dr = 30/d.linknum;  
                            return"M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 1,1 " + d.target.x + "," + (d.target.y+1);  
                        }else if(d.size%2!=0 && d.linknum==1){//如果两个节点之间的连接线数量为奇数条，则设置编号为1的连接线为直线，其他连接线会均分在两边  
                            return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;  
                        }  
                        //根据连接线编号值来动态确定该条椭圆弧线的长半轴和短半轴，当两者一致时绘制的是圆弧  
                        //注意A属性后面的参数，前两个为长半轴和短半轴，第三个默认为0，第四个表示弧度大于180度则为1，小于则为0，这在绘制连接到相同节点的连接线时用到；第五个参数，0表示正角，1表示负角，即用来控制弧形凹凸的方向。本文正是结合编号的正负情况来控制该条连接线的凹凸方向，从而达到连接线对称的效果  
                        var curve=1.5;  
                        var homogeneous=1.2;  
                        var dx = d.target.x - d.source.x,  
                            dy = d.target.y - d.source.y,  
                            dr = Math.sqrt(dx*dx+dy*dy)*(d.linknum+homogeneous)/(curve*homogeneous);  
                        //当节点编号为负数时，对弧形进行反向凹凸，达到对称效果  
                        if(d.linknum<0){  
                            dr = Math.sqrt(dx*dx+dy*dy)*(-1*d.linknum+homogeneous)/(curve*homogeneous);  
                            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,0 " + d.target.x + "," + d.target.y;  
                        }  
                        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                    });  
                    
                    //更新节点坐标  限制节点位置
                    var raduis=22;
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
                    d.fx = d.x;       //解除dragged中固定的坐标
                    d.fy = d.y;
                }

                function setLinkNumber(group,type){  
                    if(group.length==0) return;  
                    //对该分组内的关系按照方向进行分类，此处根据连接的实体ASCII值大小分成两部分  
                    var linksA = [], linksB = [];  
                    for(var i = 0;i<group.length;i++){  
                        var link = group[i];  
                        if(link.source < link.target){  
                            linksA.push(link);  
                        }else{  
                            linksB.push(link);  
                        }  
                    }  
                    //确定关系最大编号。为了使得连接两个实体的关系曲线呈现对称，根据关系数量奇偶性进行平分。  
                    //特殊情况：当关系都是连接到同一个实体时，不平分  
                    var maxLinkNumber = 0;  
                    if(type=='self'){  
                        maxLinkNumber = group.length;  
                    }else{  
                        maxLinkNumber = group.length%2==0?group.length/2:(group.length+1)/2;  
                    }  
                    //如果两个方向的关系数量一样多，直接分别设置编号即可  
                    if(linksA.length==linksB.length){  
                        var startLinkNumber = 1;  
                        for(var i=0;i<linksA.length;i++){  
                            linksA[i].linknum = startLinkNumber++;  
                        }  
                        startLinkNumber = 1;  
                        for(var i=0;i<linksB.length;i++){  
                            linksB[i].linknum = startLinkNumber++;  
                        }  
                    }else{//当两个方向的关系数量不对等时，先对数量少的那组关系从最大编号值进行逆序编号，然后在对另一组数量多的关系从编号1一直编号到最大编号，再对剩余关系进行负编号  
                        //如果抛开负号，可以发现，最终所有关系的编号序列一定是对称的（对称是为了保证后续绘图时曲线的弯曲程度也是对称的）  
                        var biggerLinks,smallerLinks;  
                        if(linksA.length>linksB.length){  
                            biggerLinks = linksA;  
                            smallerLinks = linksB;  
                        }else{  
                            biggerLinks = linksB;  
                            smallerLinks = linksA;  
                        }  
            
                        var startLinkNumber = maxLinkNumber;  
                        for(var i=0;i<smallerLinks.length;i++){  
                            smallerLinks[i].linknum = startLinkNumber--;  
                        }  
                        var tmpNumber = startLinkNumber;  
            
                        startLinkNumber = 1;  
                        var p = 0;  
                        while(startLinkNumber<=maxLinkNumber){  
                            biggerLinks[p++].linknum = startLinkNumber++;  
                        }  
                        //开始负编号  
                        startLinkNumber = 0-tmpNumber;  
                        for(var i=p;i<biggerLinks.length;i++){  
                            biggerLinks[i].linknum = startLinkNumber++;  
                        }  
                    }   
                } 
            },
            //点击力导向图中的点   改变颜色
            nodeColor(d){
                var _this=this;
                this.nodes.attr("class",function(node){
                    if(d.id==node.id){
                        return 'circleActive';
                    }else{
                        return 'circle';
                    }
                });
            },
            //点击评分列表  右侧图相应类型颜色变化
            showAllNode(ids){
                var _this=this;
                this.nodes.attr("class",function(node){
                    if(ids.indexOf(node.id)!=-1){
                        return 'circleActive';
                    }else{
                        return 'circle';
                    }
                });
                /*this.nodes.attr("class",function(node){
                    if(typeStr==node.type){
                        return 'circleActive';
                    }else{
                        return 'circle';
                    }
                });*/
            },
            //颜色设置  根绝类型设置
            fillColor(node){
                if(node.type=='Person'){
                    return '#8588ff'
                }else if(node.type=='Main'){
                    return '#82c3e8'
                }else if(node.type=='Apply'){
                    return '#f66f13'
                }else if(node.type=='Address'){
                    return '#c3e20e'
                }else if(node.type=='Company'){
                    return '#ed6cac'
                }else if(node.type=='BankCard'){
                    return '#50e3c2'
                }else if(node.type=='SocialMediaId'){
                    return '#69aef4'
                }else if(node.type=='Device'){
                    return '#ffbf2f'
                }else if(node.type=='HouseProperty'){
                    return '#8de0ff'
                }else if(node.type=='Telephone'){
                    return '#fbc999'
                }else{
                    return '#ccc'
                }
            },
            strColor(node){
                if(node.type=='Person'){
                    return 'rgb(194,195,255)'
                }else if(node.type=='Main'){
                    return 'rgb(182,228,254)'
                }else if(node.type=='Apply'){
                    return 'rgb(250,183,137)'
                }else if(node.type=='Address'){
                    return 'rgb(225,240,134)'
                }else if(node.type=='Company'){
                    return 'rgb(246,181,213)'
                }else if(node.type=='BankCard'){
                    return 'rgb(167,241,224)'
                }else if(node.type=='SocialMediaId'){
                    return 'rgb(180,214,249)'
                }else if(node.type=='Device'){
                    return 'rgb(255,223,151)'
                }else if(node.type=='HouseProperty'){
                    return 'rgb(198,239,255)'
                }else if(node.type=='Telephone'){
                    return 'rgb(254,220,187)'
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



