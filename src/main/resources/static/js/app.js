import { Login } from './components/login.js';
import { Home } from './components/home.js';
import { Agendar } from './components/agendar.js';
import { Conta } from './components/conta.js';
import { Matricula } from './components/matricula.js';
import { Chat } from './components/chat.js';

const routes = [
    { path: '/', component: Login },
    { path: '/home', component: Home },
    { path: '/agendar', component: Agendar },
    { path: '/conta', component: Conta },
    { path: '/matricula/:id', component: Matricula, props: true},
    { path: '/chat/:username', component: Chat, name: 'chat' }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

function sair() {
  localStorage.removeItem("usuarioId");
  localStorage.removeItem("usuarioNome");
  localStorage.removeItem("usuarioEmail");
}

router.beforeEach((to, from, next) => {
  const id = localStorage.getItem("usuarioId");

  if (!id && to.path !== '/') {
    next('/');
  } else if (id && to.path === '/') {
    next('/home');
  } else if (!id && to.path === '/') {
    sair();
    next();
  } else {
    next();
  }
});

router.afterEach((to) => {
    const mainElement = document.querySelector('body');

    if (mainElement) {
        if (to.path === '/' || to.path === '/home' || to.name === 'chat') {
            mainElement.classList.add('image-background');
        } else {
            mainElement.classList.remove('image-background');
        }
    }
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
            <nav class="nav-main" v-if="$route.path !== '/' && $route.path !== '/login'">
                <ul class="nav-list">
                    <li><router-link to="/home" class="navbtn">Home</router-link></li>
                    <li><router-link to="/agendar" class="navbtn">Agendar Aula</router-link></li>
                    <li><router-link to="/conta" class="navbtn">Conta</router-link></li>
                </ul>
            </nav>
    </header>
	<main class="container">
		<router-view></router-view>
	</main>
    <footer>
        <div>
            <img class='Img-Footer' src="" alt="" />
            <ul class='List-Footer'>
                <li>(11) 12345-6789</li>
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
