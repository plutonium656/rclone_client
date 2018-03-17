<template>
  <div class="container">
    <div class="style-body">
      <div class="cCard" v-for="(thread,index) in threads" :key="index">
        <div class="cCard-header">
          <router-link tag="h5" :to="'/b/'+$route.params.board+'/threads/'+thread._id" >{{thread.title}}</router-link>
          <div class="group-right" v-if="isOwner(thread.author)">
            <button class="btn btn-sm btn-primary" @click="loadThreadToEdit(thread)" data-toggle="modal" data-target="#editModal">
              <i class="far fa-edit"></i> Edit</button>
            <button class="btn btn-sm btn-danger" @click="deleteThread(thread)">
              <i class="far fa-trash-alt"></i> Delete</button>
          </div>
        </div>
        <hr id="h-divider">
        <div class="cCard-body">
          <p>
            {{thread.content | shorten}}
          </p>
        </div>
        <div class="cCard-footer">
          <small class="">{{thread._id}} @ {{thread.timestamp}} by {{thread.author.username}} - Comments: {{thread.comments.length}}</small>
        </div>
      </div>
    </div>
    <form v-if="loggedIn" class="cCard">
      <h5>Submit a new Thread?</h5>
      <input type="text" placeholder="Title" class="form-control" v-model="newThread.title">
      <hr>
      <textarea rows="5" class="form-control" placeholder="Content" v-model="newThread.content"></textarea>
      <button class="btn btn-primary form-control" @click.prevent="submitPost" :disabled="newThread.title.length <=0 || newThread.content.length<=0">Submit</button>
    </form>
       <!-- MODAL BEGIN -->
  <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Edit Thread</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label class="col-form-label">Thread Title: {{threadToEdit.title}}</label>
            <input type="text" v-model="threadToEdit.title" class="form-control">
          </div>
          <div class="form-group">
            <label class="col-form-label">Content</label>
            <textarea class="form-control" v-model="threadToEdit.content"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click.prevent="updateThread" data-dismiss="modal" :disabled="threadToEdit.content.length <= 0">Submit</button>
      </div>
    </div>
  </div>
</div>
    <!-- MODAL END -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        threads: [],
        newThread: {
          title: '',
          content: '',
          userId: ''
        },
        threadToEdit:{
          title:'',
          content:'',
          threadId:''
        }
      }
    },
    methods: {
      fetchBoardData(boardName) {
        this.threads = [];
        this.$http.get('b/' + boardName)
          .then(res => {
            this.threads = res.body.threads;
            //TODO error handling!
          });
      },
      loadThreadToEdit(thread){
        this.threadToEdit.title = thread.title;
        this.threadToEdit.content = thread.content;
        this.threadToEdit.threadId = thread._id;
      }
      ,
      isOwner(threadAuthor) {
        if (this.$store.getters.user) {
          return this.$store.getters.user.username === threadAuthor.username;
        } else {
          return false;
        }

      },
      updateThread(){
        this.$http.put('b/'+this.$route.params.board+'/threads/'+this.threadToEdit.threadId,{
          title:this.threadToEdit.title,
          content:this.threadToEdit.content
        },
        {
          headers:{
            'Authorization': this.$store.getters.authHeader
          }
        })
        .then( res => {
          this.fetchBoardData(this.$route.params.board);
        })
      },
      deleteThread(thread){
        this.$http.delete('b/'+this.$route.params.board+'/threads/'+thread._id, {
              headers: {
              'Authorization': this.$store.getters.authHeader
            }
        })
        .then( res => {
          this.fetchBoardData(this.$route.params.board);
        });
      },
      submitPost() {
        let body = this.newThread;
        this.newThread = {
            title:'',
            content:'',
            userId:''
        };
        body.userId = this.$store.getters.user.userId;
        let headers = {
          'Authorization': this.$store.getters.authHeader
        };
        this.$http.post('b/' + this.$route.params.board + '/threads', body, {
            headers
          })
          .then(res => {
              console.log(res.body);
              const board = this.$route.params.board;
              const id = res.body._id;
              const path = '/b/'+board+'/threads/'+id;
            this.$router.push({path, params:{board,id}});
          });
      }
    },
    created() {
      this.fetchBoardData(this.$route.params.board);
    },
    watch: {
      $route: function (val) {
        this.fetchBoardData(val.params.board);
      }
    },
    computed: {
      loggedInUser() {
        return this.$store.getters.user;
      },
      loggedIn() {
        if (this.loggedInUser.token === undefined) {
          return false;
        } else {
          return true;
        }
      }
    },
      filters: {
        shorten: function (value) {
          if (value.length > 150) {
            return value.slice(0, 150) + '[...]';
          } else {
            return value;
          }

        }
      }
    }

</script>

<style scoped>
form{
    margin:15px 0;
}
  textarea {
    width: 100%;
  }

  .style-body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #EBE9E9;
    color: #1D1D1D;
  }

  .cCard {
    padding: 15px;
    margin: 0;
    margin-top: 10px;
    box-shadow: 1px 1px 1px #1D1D1D;
    background-color: #FFFFFF;
  }

  .cCard .cCard-header {
    padding: 10px;
    margin: 0;

  }

  .cCard .cCard-header h5 {
    padding: 0;
    margin: 0;
    font-size: 1.2em;
    float: left;
    cursor: pointer;
  }

  .cCard .cCard-header h5:hover {
    text-decoration: underline;
  }

  .cCard .cCard-body p {
    padding: 10px;
    margin-top: 0;
    margin-bottom: 0;
  }

  .cCard .cCard-footer {
    margin: 0;
    background-color: #3581B8;
  }

  .cCard .cCard-footer small {
    margin: 0;
    padding: 5px;
    color: #E5E5E5;
  }

  .wrapper {
    width: 80%;
    margin-right: auto;
    min-height: 90vh;
    padding: 15px;
    overflow: hidden;
  }

  .highlight-text {
    background-color: #F3F8F2;
    border-left: 3px solid #3581B8;
    margin: 10px;
  }

  .group-right {
    float: right;
  }

  #h-divider {
    clear: both;
    margin-top: 25px;
    width: 95%;
    border: 1px solid #3581B8;
  }

</style>
