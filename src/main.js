import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

Vue.use(VueResource);
Vue.use(VueRouter);

import App from './views/app.vue'

import Index from './views/index/indexMain.vue'



const router = new VueRouter({
    mode:'history',
    linkActiveClass:'active',//当前页的选中状态
    routes: [
        { path: '/', component: Index},
        { path: '/index', component: Index},
      
    ]
})


var myVue=new Vue({
    el: '#app',
    router:router,
    components: { App }
})

var reqNum=1,nextNum=1;
Vue.http.interceptors.push(function(request, next) {
    reqNum++;
    myVue.$refs.app.$emit('toggleLoading',true);
    next(function(response) {
        nextNum++;
        if(reqNum==nextNum){
            myVue.$refs.app.$emit('toggleLoading',false);
        } 
        if(response.status=='504'||response.status=='404'){
            myVue.$refs.app.$emit('showOverTime');
        }
        if(response.status==200){

            if(response.body.code==203||response.body.code==undefined){
                localStorage.clear();
                window.location.href='login.html';
            }else if(response.body.code==200){

            }else {
                myVue.$refs.app.$emit('showOverTime',response.body.msg);
            }
        }
        return response;
    });
});