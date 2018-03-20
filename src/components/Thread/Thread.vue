<template>
  <div>
    <div v-if="threadData" class="container">
      <h1>{{threadData.title}}</h1>
      <p>{{threadData.content}}</p>
      <p>
        <small v-if="threadData.author">{{threadData.author.username}}</small>
      </p>
      <form>
        <div class="row">
          <div class="col-10">
            <input class="form-control" type="text" placeholder="Add a Comment" v-model="newComment.content">
          </div>
          <div class="col-2">
            <button class="btn btn-primary" @click.prevent="submitComment" :disabled="newComment.content.length <= 0">Submit Comment</button>
          </div>
        </div>
      </form>
      <ul class="list-group">
        <li v-for="(comment,index) in threadData.comments" :key="index" class="list-group-item">
          <p>{{comment.content | removeUrls}}</p>
          <div class="img-thumbnail" v-if="parseImageUrl(comment.content)">
            <a :href="parseImageUrl(comment.content)">
              <img class="" :src="parseImageUrl(comment.content)" alt="Link">
            </a>
          </div>
          <hr>
          <small class="comment-footer">{{comment.author.username}} - {{comment.timestamp}}</small>
          <div class="tools" v-if="comment.author.username === $store.getters.user.username">
            <div class="btn-group btn-group-sm" role="group" aria-label="...">
              <button type="button" class="btn btn-primary" @click="loadCommentToEdit(comment)"  data-toggle="modal" data-target="#editModal"><i class="fas fa-edit"></i> Edit</button>
              <button type="button" class="btn btn-danger" @click="deleteComment(comment._id)"><i class="far fa-trash-alt"></i> Delete</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- MODAL BEGIN -->
  <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Edit Comment</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label class="col-form-label">Your UserId: {{commentToEdit.userId}}</label>
          </div>
          <div class="form-group">
            <label class="col-form-label">Content</label>
            <textarea class="form-control" v-model="commentToEdit.content"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click.prevent="updateComment" data-dismiss="modal" :disabled="commentToEdit.content.length <= 0">Submit</button>
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
        threadData: undefined,
        newComment: {
          userId: '',
          content: '',
        },
        commentToEdit: {
          userId:'',
          content:'',
          commentId:''
        }
      }
    },
    created() {
      this.fetchThreadData();
    },
    beforeRouteUpdate() {
      this.fetchThreadData();
    },
    methods: {
      fetchThreadData() {
        this.$http.get('b/' + this.$route.params.board + '/threads/' + this.$route.params.id, {
            headers: {
              'Authorization': this.$store.getters.authHeader
            }
          })
          .then((res) => {
            this.threadData = res.body;
            console.log(res.body);
          })
          .catch(err => {
            this.threadData = {
              title: err.status,
              content: err.statusText
            };
          })
      },
      submitComment() {
        this.newComment.userId = this.$store.getters.user.userId;
        this.$http.post('b/' + this.$route.params.board + '/threads/' + this.$route.params.id,
            this.newComment, {
              headers: {
                'Authorization': this.$store.getters.authHeader
              }
            }
          )
          .then(res => {
            this.newComment = {
              userId: '',
              content: ''
            };
            this.fetchThreadData();
          })
          .catch(err => {
            alert(err);
          })
      },
      parseImageUrl(text) {
        const match = text.match(
          /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm
        );
        if (match) {
          return match;
        } else {
          return '';
        }
      },
      loadCommentToEdit(comment){
        this.commentToEdit.content = comment.content;
        this.commentToEdit.userId = this.$store.getters.user.userId;
        this.commentToEdit.commentId = comment._id;
      },
      updateComment(){
        this.$http.put('b/' + this.$route.params.board + '/threads/' + this.$route.params.id + '/' + this.commentToEdit.commentId,
        {
          author:this.commentToEdit.userId,
          content:this.commentToEdit.content
        }
        ,
        {
          headers: {
            'Authorization':this.$store.getters.authHeader
          }
        })
        .then( res => {
          this.fetchThreadData();
        });
      },      
      deleteComment(commentId){
        this.$http.delete('b/' + this.$route.params.board + '/threads/' + this.$route.params.id + '/' + commentId,{
            headers: {
              'Authorization': this.$store.getters.authHeader
            }
          })
        .then( res => {
          console.log(res);
          this.fetchThreadData();
        });
      }

    },
    filters: {
      removeUrls(value) {
        const match = value.match(
          /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm
        );
        value = value.replace(
          /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm,
          '');
        return value;
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

  .comment-footer {
    background-color: #3581B8;
    color: white;
    padding: 3px;
  }

  form {
    padding: 10px 0;
  }

  .img-thumbnail {
    float: left;
  }

  hr {
    clear: both;
  }

  .img-thumbnail a {
    clear: both;
  }

  .img-thumbnail {
    margin: 5px;
  }
  .tools{
    float: right;
  }
</style>
