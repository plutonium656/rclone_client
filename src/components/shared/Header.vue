<template>
<div>
  <header>
    <nav class="navbar navbar-dark">
      <router-link to="/" href="#" class="navbar-brand">RClone</router-link>
      <ul class="navbar-nav mr-auto">
        <router-link tag="li" :to="'/b/'+board.name" class="nav-item" v-for="(board,index) in boards" :key="index">
          <a href="#" class="nav-link">{{board.name.substring(0,10)+'...'+'['+board.threads.length+']'}}</a>
        </router-link>
        <router-link tag="li" to="/signup" class="nav-item" v-if="!loggedIn">
          <a href="#" class="nav-link">Sign-Up</a>
        </router-link>
      </ul>
      <form class="form-inline my-2 my-lg-0" v-if="!loggedIn">
        <input class="form-control mr-sm-2" type="text" placeholder="Username" v-model="username">
        <input class="form-control mr-sm-2" type="password" placeholder="Password" v-model="password">
        <button class="btn btn-outline-danger my-2 my-sm-0" type="submit" @click.prevent="login">Login</button>
      </form>
      <form v-if="loggedIn" class="form-inline">
        <div class="form-group mb-2">
          <Label class="text-light">{{loggedInUser.username}}</Label>
          <button class="btn btn-sm btn-danger" @click.prevent="logout">Logout</button>
        </div>
      </form>
    </nav>
  </header>
      <div class="container">
    <flash-message></flash-message>
    </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        boards:[]
      }
    },
    beforeMount(){
      this.fetchBoardNames();
      this.keepHeaderUpdated();
      this.loginFromToken();
    },
    computed:{
      loggedInUser(){
        return this.$store.getters.user;
      },
      loggedIn(){
        if(this.loggedInUser.token === undefined){
          return false;
        } else {
          return true;
        }
      }
    },
    methods: {
      loginFromToken(){
        this.$store.dispatch('setAuthHeader',undefined);
        this.$http.get('authservice',{
          headers:{
            'Authorization': this.$store.getters.authHeader
          }
        })
        .then(res => {
          if(res.status === 200){
          this.$store.dispatch('setCurrentUser', {
            token: undefined,
            username:res.body.username,
            userId:res.body._id
          });
          this.username = res.body.username;
          }
        }).catch( e => {
          this.flash(e,'error');
        })
      },
      login() {
        let body = {
          username: this.username,
          password: this.password
        };
        this.$http.post('login', body)
          .then((res) => {
            this.$http.headers.common['Authorization'] = 'Bearer ' + res.body.token;
            this.$store.dispatch('setCurrentUser',{
              token:res.body.token,
              username:this.username,
              userId:res.body.userId
            });
          })
          .catch( e => {
            this.flash(e,'error');
          })
      },
      logout() {
        this.$http.headers.common['Authorization'] = '';
        this.$store.dispatch('logOutUser');
        this.username = '';
        this.password = '';
      },
      fetchBoardNames(){
        this.$http.get('b')
        .then( res => {
          this.boards = res.body;
        })
        .catch(e => {
          this.flash(e,'error');
        })
      },
      keepHeaderUpdated(){
        setInterval(this.fetchBoardNames,5000);
      }
    }
  }

</script>

<style scoped>
.container{
  margin-top:15px;
}
ul{
  display: inline-block;
}
li{
  display:inline-block;
  margin-left:15px;
}
header{
  background-color:#3581b8;
  color:#f3f8f2;
}
</style>
