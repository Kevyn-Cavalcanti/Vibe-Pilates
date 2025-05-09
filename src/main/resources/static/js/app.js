import { Login } from './components/login.js';
import { Home } from './components/home.js';

const routes = [
    { path: '/', component: Login },
    { path: '/home', component: Home },
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

const app = {
    data() {
        return {
        };
    },
    methods: {
    },
    template: `

    <header class='header'>
        <div class="nav-top">
            <div class="nav-top-email">
                <h1>Pilates Site</h1>
            </div>
        </div>
        </div>

        <div class="nav-main" v-if="$route.path !== '/' && $route.path !== '/login'">
            <nav class="info-nav-main">
                <ul class="nav-list">
                    <li><a href="#" class="navbtn">Home</a></li>
                    <li><a href="#" class="navbtn">Agendar Aula</a></li>
                    <li><a href="#" class="navbtn">Conta</a></li>
                </ul>

            </nav>
        </div>
    </header>
	<main class="container">
		<router-view></router-view>
	</main>
    <footer>
        <div>
            <img class='Img-Footer' src="" alt="" />
            <ul class='List-Footer'>
                <li>(**) *****-****</li>
            </ul>
        </div>
        <div>
            <img class='Img-Footer' src="" alt="" />
            <p>pilates@pilates.com.br</p>
        </div>
    </footer>
    `
};

const App = Vue.createApp(app);
App.use(router);
App.mount('#app');
