export const Matricula = {
  data() {
    return {
      polo: null,
      responsavel: null,
      carregando: true,
      erro: null,
      frequenciaSelecionada: "",
      opcoesDeAula: [
        "Segunda: 08:00",
        "Terça: 17:00",
        "Quarta: 09:00",
        "Quinta: 14:00",
        "Sexta: 10:00",
        "Sábado: 08:00",
      ],
      aulasSelecionadas: [],
    };
  },
  mounted() {
    const id = this.$route.params.id;

    if (!id) {
      this.erro = "ID do polo não informado na URL.";
      this.carregando = false;
      return;
    }

    fetch(`http://localhost:8080/polo/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar dados do polo.");
        return res.json();
      })
      .then((dados) => {
        this.polo = dados;
        return fetch(`http://localhost:8080/usuario/${dados.idUsuario}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar dados do responsável.");
        return res.json();
      })
      .then((usuario) => {
        this.responsavel = usuario.nome;
        this.carregando = false;
      })
      .catch((err) => {
        this.erro = err.message;
        this.carregando = false;
      });
  },
  methods: {
    maximoPermitido() {
      switch (this.frequenciaSelecionada) {
        case "1x por semana": return 1;
        case "2x por semana": return 2;
        case "3x por semana": return 3;
        default: return 0;
      }
    },
    abrirChat() {
      if (this.polo && this.polo.professor) {
        this.$router.push(`/chat/${this.polo.professor}`);
      }
    },
    toggleAula(aula) {
      if (!this.frequenciaSelecionada) {
        alert("Selecione a frequência semanal primeiro.");
        return;
      }

      const index = this.aulasSelecionadas.indexOf(aula);
      if (index !== -1) {
        this.aulasSelecionadas.splice(index, 1);
      } else if (this.aulasSelecionadas.length < this.maximoPermitido()) {
        this.aulasSelecionadas.push(aula);
      } else {
        alert(`Você só pode selecionar até ${this.maximoPermitido()} aula(s).`);
      }
    },
    enviarMatricula() {
      alert("Matrícula finalizada com sucesso!");
      this.$router.push("/home");
      // Aqui você poderia adicionar um fetch futuramente para enviar os dados ao backend
    }
  },
  watch: {
    frequenciaSelecionada(novoValor) {
      if (novoValor === "Outro (Converse com o Diretor do Polo)") {
        this.abrirChat();
        this.frequenciaSelecionada = ""; // limpa a seleção após redirecionar
      } else {
        this.aulasSelecionadas = [];
      }
    },
  },
  template: `
    <section class="matricula">
      <div class="conteiner-matricula">
        <h2>Matrícula</h2>

        <div v-if="carregando">Carregando informações do polo...</div>
        <div v-else-if="erro">Erro: {{ erro }}</div>
        <div class="polo-info" v-else>
          <h3>{{ polo.nome }} - Prof. {{ responsavel }}</h3>

          <form @submit.prevent="enviarMatricula" class="form-matricula">
            <input type="hidden" name="idPolo" :value="polo.idPolo">

            <label for="frequencia">Frequência semanal:</label>
            <select v-model="frequenciaSelecionada" name="frequencia" id="frequencia" required>
              <option disabled value="">Selecione</option>
              <option>1x por semana</option>
              <option>2x por semana</option>
              <option>3x por semana</option>
              <option>Outro (Converse com o Diretor do Polo)</option>
            </select>

            <label>Selecione os dias e horários disponíveis:</label>
            <div class="dias-botoes">
              <button
                v-for="aula in opcoesDeAula"
                :key="aula"
                type="button"
                :disabled="!frequenciaSelecionada"
                :class="{ ativo: aulasSelecionadas.includes(aula), desativado: !frequenciaSelecionada }"
                @click="toggleAula(aula)"
              >
                {{ aula }}
              </button>
            </div>

            <label for="plano">Plano desejado:</label>
            <select name="planoepreco" id="plano" required>
              <option disabled selected value="">Selecione</option>
              <option value="Mensal - R$120">Mensal - R$120</option>
              <option value="Trimestral - R$330">Trimestral - R$330</option>
              <option value="Semestral - R$600">Semestral - R$600</option>
              <option value="Anual - R$1000">Anual - R$1000</option>
            </select>

            <button type="submit" class="btn-form">Finalizar Matrícula</button>
          </form>
        </div>
      </div>
    </section>
  `,
};
