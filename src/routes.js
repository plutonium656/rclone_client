import Home from "./components/Home/Home.vue";
import Signup from "./components/Signup/Signup.vue";
import Board from "./components/Board/Board.vue";
import Thread from "./components/Thread/Thread.vue";
export default
    [
        {path:'/', component:Home},
        {path:'/signup',component:Signup},
        {path:'/b/:board', component:Board},
        {path:'/b/:board/threads/:id', component:Thread}
    ]