<template>
  <div class="container">
    <form>
      <div class="form-group row">
          <div class="col-md-4 offset-md-4">
        <label>First Name</label>
        <input class="form-control" type="text" v-model="user.firstName">
        </div>
      </div>
      <div class="form-group row">
          <div class="col-md-4 offset-md-4">
        <label>Last Name</label>
        <input class="form-control" type="text" v-model="user.lastName">
        </div>
      </div>
      <div class="input-group-sm row">
          <div class="col-md-4 offset-md-4">
        <label>Email</label>
        <input class="form-control" type="email" v-model="user.email">
        </div>
      </div>
      <div class="form-group row">
          <div class="col-md-4 offset-md-4">
        <label>Username</label>
        <input class="form-control" type="text" v-model="user.username">
        </div>
      </div>
      <div class="form-group row">
          <div class="col-md-4 offset-md-4">
        <label>Password</label>
        <input class="form-control" type="password" v-model="password[0]">
        </div>
      </div>      
      <div class="form-group row">
          <div class="col-md-4 offset-md-4">
        <label>Repeat Password</label>
        <input class="form-control" type="password" v-model="password[1]">
        </div>
      </div>
      <div class="row">
        <button class="btn btn-sm btn-primary col-md-4 offset-md-4" :disabled="!passwordsMatching" @click.prevent="signup">Sign Up</button>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          username: ''
        },
        password:[]
      }
    },
    computed:{
        passwordsMatching(){
            if(this.password[0] !== undefined || this.password[1] !== undefined){
                return this.password[0] === this.password[1];
            } else {
                return false;
            }
        }
    },
    methods:{
        signup(){
            if(this.passwordsMatching){
                this.user.password = this.password[0];
                this.$http.post('user', this.user)
                .then((res) => {
                    console.log(res.body);
                });
            }
        }
    }
  }

</script>

<style scoped>
form{
  padding:15px;
}
</style>
