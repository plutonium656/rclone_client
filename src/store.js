import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        currentUser:{
            token:undefined,
            username:'',
            userId:''
        },
        authHeader:''
    },
    getters:{
        user: state => {
            return state.currentUser;
        },
        authHeader:state => {
            return state.authHeader;
        }
    },
    mutations:{
        setCurrentUser(state,userData){
            state.currentUser.token = userData.token;
            state.currentUser.username = userData.username;
            state.currentUser.userId = userData.userId;
            
        },
        setAuthHeader(state,token){
            if(token !== undefined){
                state.authHeader = 'Bearer ' + token;
                localStorage.setItem('accessToken',token);
            }
            else {
                if(localStorage.getItem('accessToken')){
                    state.authHeader = 'Bearer ' + localStorage.getItem('accessToken');
                    state.currentUser.token = localStorage.getItem('accessToken');
                }
            }
        },
        logOutUser(state){
            state.currentUser.token = undefined;
            localStorage.removeItem('accessToken');
            state.currentUser.userId = '';
            state.currentUser.username = '';
        }
    },
    actions:{
        setCurrentUser(context,userData){
            context.commit('setCurrentUser',userData);
            context.commit('setAuthHeader',userData.token);
        },
        setAuthHeader(context,token){
            context.commit('setAuthHeader',token);
        },
        logOutUser(context){
            context.commit('logOutUser');
        }
    }
});