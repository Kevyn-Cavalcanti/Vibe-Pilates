export const Matricula = {
  data() {
    return {
      polo: null,
      responsavel: null,
      carregando: true,
      erro: null,
      frequenciaSelecionada: "",
      aulasSelecionadas: [],
      semLimite: false,
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
    formatarHora(hora) {
      if (!hora) return "";
      if (typeof hora === "string") return hora;
      if (hora.hour !== undefined && hora.minute !== undefined) {
        const h = hora.hour.toString().padStart(2, "0");
        const m = hora.minute.toString().padStart(2, "0");
        return `${h}:${m}`;
      }
      return hora.toString();
    },
    maximoPermitido() {
      if (this.semLimite) return Infinity;
      switch (this.frequenciaSelecionada) {
        case "1x por semana": return 1;
        case "2x por semana": return 2;
        case "3x por semana": return 3;
        default: return 0;
      }
    },
    alternarAula(aula) {
      const id = `${aula.modalidade}-${aula.diadasemana}`;
      const index = this.aulasSelecionadas.findIndex(sel => sel.id === id);

      if (index !== -1) {
        this.aulasSelecionadas.splice(index, 1);
      } else {
        if (this.aulasSelecionadas.length < this.maximoPermitido()) {
          this.aulasSelecionadas.push({
            id,
            modalidade: aula.modalidade,
            diadasemana: aula.diadasemana,
            horarioSelecionado: null,
          });
        } else {
          alert(`Você só pode selecionar até ${this.maximoPermitido()} aula(s).`);
        }
      }
    },
    onSelecionarHorario(aula, event) {
      const horario = JSON.parse(event.target.value);
      const id = `${aula.modalidade}-${aula.diadasemana}`;
      const aulaSelecionada = this.aulasSelecionadas.find(sel => sel.id === id);
      if (aulaSelecionada) {
        aulaSelecionada.horarioSelecionado = horario;
      }
    },
    enviarMatricula() {
      const idUsuario = localStorage.getItem("usuarioId");
      if (!idUsuario) {
        alert("Usuário não autenticado.");
        return;
      }

	  const planoSelecionadoRaw = document.getElementById("plano").value;
	  let planoSelecionado;
	  try {
	    planoSelecionado = JSON.parse(planoSelecionadoRaw);
	  } catch (e) {
	    alert("Plano inválido.");
	    return;
	  }
      if (!planoSelecionado) {
        alert("Por favor, selecione um plano.");
        return;
      }

      const aulasValidas = this.aulasSelecionadas.filter(sel => sel.horarioSelecionado);
      if (aulasValidas.length === 0) {
        alert("Selecione pelo menos uma aula e seu horário.");
        return;
      }

      const matricula = {
        idUsuario,
        idPolo: this.polo.idPolo,
        frequencia: this.frequenciaSelecionada,
        plano: planoSelecionado,
		aulasSelecionadas: aulasValidas.map(sel => ({
		    modalidade: sel.modalidade,
		    diaSemana: sel.diaSemana,
		    horario: sel.horarioSelecionado,
		  })),
      };

      fetch("http://localhost:8080/matricula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matricula),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao enviar matrícula.");
          return res.text();
        })
        .then((mensagem) => {
          alert(mensagem);
          this.$router.push("/home");
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao finalizar matrícula. Tente novamente.");
        });
    },
  },
  watch: {
    frequenciaSelecionada(novoValor) {
      this.aulasSelecionadas = [];

      if (novoValor === "Outro (Converse com o Diretor do Polo)") {
        this.semLimite = true;
      } else {
        this.semLimite = false;
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
            <label for="frequencia">Frequência semanal:</label>
            <select v-model="frequenciaSelecionada" id="frequencia" required>
              <option disabled value="">Selecione</option>
              <option>1x por semana</option>
              <option>2x por semana</option>
              <option>3x por semana</option>
              <option>Outro (Converse com o Diretor do Polo)</option>
            </select>

            <label>Selecione as aulas:</label>
            <div
              v-for="aula in polo.aulasDisponiveis"
              :key="aula.modalidade + aula.diadasemana"
              class="aula-grupo"
            >
			<label style="display: flex; align-items: center;">
			  <input
			    type="checkbox"
			    :checked="aulasSelecionadas.some(sel => sel.id === aula.modalidade + '-' + aula.diadasemana)"
			    @change="(e) => {
			      const selecionada = aulasSelecionadas.some(sel => sel.id === aula.modalidade + '-' + aula.diadasemana);
			      if (selecionada) {
			        // Desmarcar aula
			        aulasSelecionadas = aulasSelecionadas.filter(sel => sel.id !== aula.modalidade + '-' + aula.diadasemana);
			      } else {
			        // Adicionar aula, se ainda não atingiu o limite
			        if (aulasSelecionadas.length < maximoPermitido()) {
			          aulasSelecionadas.push({
			            id: aula.modalidade + '-' + aula.diadasemana,
			            modalidade: aula.modalidade,
			            diaSemana: aula.diadasemana,
			            horarioSelecionado: null,
			          });
			        } else {
			          alert('Você atingiu o limite de aulas permitido.');
			          e.target.checked = false;
			        }
			      }
			    }"
			  />
			  <span style="margin-left: 8px;">
			    {{ aula.modalidade }} - {{ aula.diadasemana }}
			  </span>
			</label>

              <div v-if="aulasSelecionadas.some(sel => sel.id === aula.modalidade + '-' + aula.diadasemana)">
                <select @change="onSelecionarHorario(aula, $event)">
                  <option value="">Escolha um horário</option>
                  <option
                    v-for="horario in aula.horarios"
                    :key="horario.horaInicio"
                    :value="JSON.stringify(horario)"
                  >
                    {{ formatarHora(horario.horaInicio) }} às {{ formatarHora(horario.horaFim) }} ({{ horario.professor }})
                  </option>
                </select>
              </div>
            </div>

            <label for="plano">Plano desejado:</label>
            <select name="plano" id="plano" required>
              <option disabled selected value="">Selecione</option>
			  <option 
			    v-for="(plano, index) in polo.planosDisponiveis" 
			    :key="index" 
			    :value="JSON.stringify(plano)"
			  >
			    {{ plano.nome }} - {{ plano.recorrencia }} - {{ plano.preco }}
			  </option>
            </select>

            <button type="submit" class="btn-form">Finalizar Matrícula</button>
          </form>
        </div>
      </div>
    </section>
  `,
};
