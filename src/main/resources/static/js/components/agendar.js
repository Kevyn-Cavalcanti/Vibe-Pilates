export const Agendar = {
  data() {
    return {
      polos: [
        { nome: "Polo Pirituba", professor: "Prof. Lucas Retanero" },
        { nome: "Polo Guaianases", professor: "Prof. Vinicius Lima" },
        { nome: "Polo Itaquera", professor: "Prof. Kevyn Cavalcanti" },
        { nome: "Polo do Rock", professor: "Prof. Lucas Metalero" },
      ],
    };
  },
  methods: {
    marcarAula(polo) {
      alert(`Aula marcada para ${polo.nome} - ${polo.professor}`);
    },
    abrirChat(polo) {
      alert(`Abrindo chat com ${polo.professor}`);
    },
  },
  template: `
    <div class="div-cards">
      <div class="cards">
        <div class="polo" v-for="(polo, index) in polos" :key="index">
          <div class="info">
            <h3>{{ polo.nome }} - {{ polo.professor }}</h3>
            <button class="marcar-btn" @click="marcarAula(polo)">Marcar Aula</button>
          </div>
            <div alt="chat com o diretor do polo" class="chat-icon" @click="abrirChat(polo)">
              <i class="fi fi-sr-comments"></i>
            </div>
        </div>
      </div>
    </div>
  `,
};
