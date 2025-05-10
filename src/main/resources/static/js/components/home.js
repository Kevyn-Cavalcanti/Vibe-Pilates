export const Home = {
    data() {
        //variáveis
    },
    methods: {
        
    },
    template: `
    <section class="home">
        <div class="paragrafo">
            <h2 class="title-home">Esse pode ser o começo da sua jornada!</h2>
            <button class="btn" @click="$router.push('/agendar')">Agende sua Primeira Aula!</button>
        </div>
    </section>
    `,
};