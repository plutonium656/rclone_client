<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <button class="btn btn-success form-control" @click="showForm = !showForm">Add new Board</button>
        <form v-if="showForm && $store.getters.user.token !== undefined">
          <input type="text" class="form-control" placeholder="Board Name" v-model="newBoard.name">
          <input type="text" class="form-control" placeholder="Board Description" v-model="newBoard.description">
          <p>You will be the owner of the created Board and the first Moderator.</p>
          <button @click.prevent="submitNewBoard" class="btn btn-primary form-control">Submit</button>
        </form>
      </div>
    </div>
      <div class="row">
  <div class="col-4">
    <div class="list-group" id="list-tab" role="tablist">
      <a 
      class="list-group-item list-group-item-action" 
      id="list-home-list" 
      data-toggle="list" 
      :href="'#'+index" 
      role="tab" 
      aria-controls="home"
      v-for="(board,index) in boards"
      :key="index">
      {{board.name}}
      </a>
    </div>
  </div>
  <div class="col-8">
    <div class="tab-content" id="nav-tabContent">
      <div 
      class="tab-pane fade show" 
      :id="index" 
      role="tabpanel" 
      aria-labelledby="list-home-list"
      v-for="(board,index) in boards"
      :key="index">
      {{board.description}}
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      boards:[],
      showForm: false,
      newBoard: {
        name:'',
        description:'',
        ownerId:''
      }
    }
  },
  created(){
    this.fetchBoards();
  },
  methods:{
    fetchBoards(){
      this.$http.get('b')
        .then( res => {
          this.boards = res.body;
        })
        .catch( e => {
          console.log(e);
        })
    },
    submitNewBoard(){
      this.newBoard.ownerId = this.$store.getters.user.userId;
      this.newBoard.name.replace(' ','_');

      this.$http.post('b/new', {
        name:this.newBoard.name,
        description:this.newBoard.description,
        ownerId:this.newBoard.ownerId
      }, {
        headers:{
          'Authorization':this.$store.getters.authHeader
        }
      })
      .then( res => {
        this.fetchBoards();
      })
      .catch( e => {
        console.log(e);
      })
    }
  }
}
</script>

<style scoped>
  .container {
    background-color: #FFFFFF;
    margin-top: 15px;
    padding:20px;
  }
  form{
    margin: 15px 0;
  }
  .row{
    margin:15px 0;
  }
  .form-control{
    margin:5px 0;
  }
</style>
