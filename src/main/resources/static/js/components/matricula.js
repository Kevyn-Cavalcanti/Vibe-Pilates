export const Matricula = {
  data() {
    return {
      diasDaSemana: [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
      ],
      opcoesRecorrencia: ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'],
      usuarios: [], // Propriedade para armazenar a lista de usuários
      etapaFormulario: 1, // Controla a etapa atual do formulário (1, 2 ou 3) - Embora não tenha etapas formais, mantido para consistência
      polo: null, // Dados do polo
      responsavel: null, // Nome do responsável pelo polo
      carregando: true,
      erro: null,
      frequenciaSelecionada: "",
      aulasSelecionadas: [],
      semLimite: false,
      mensagemFeedback: '', // Adicionado para mensagens de feedback
      mensagemTipo: '', // 'sucesso' ou 'erro'
      mostrarConfirmacaoModal: false, // Adicionado para controlar o modal de confirmação
    };
  },
  async mounted() {
    const id = this.$route.params.id;

    if (!id) {
      this.erro = "ID do polo não informado na URL.";
      this.mensagemFeedback = "❌ ID do polo não informado na URL.";
      this.mensagemTipo = "erro";
      this.carregando = false;
      return;
    }

    try {
      // Busca dados do polo
      const poloResponse = await fetch(`/polo/${id}`); // Ajustar URL base se necessário
      if (!poloResponse.ok) {
        const errorData = await poloResponse.text();
        throw new Error(`Erro ao carregar dados do polo: ${errorData}`);
      }
      this.polo = await poloResponse.json();

      // Busca dados do responsável pelo polo
      const usuarioResponse = await fetch(`/usuario/${this.polo.idUsuario}`); // Ajustar URL base se necessário
      if (!usuarioResponse.ok) {
        const errorData = await usuarioResponse.json();
        throw new Error(`Erro ao carregar dados do responsável: ${errorData.error}`);
      }
      const usuario = await usuarioResponse.json();
      this.responsavel = usuario.nome;

      this.carregando = false;
    } catch (err) {
      this.erro = err.message;
      this.mensagemFeedback = `❌ ${err.message}`;
      this.mensagemTipo = "erro";
      this.carregando = false;
      console.error(err);
    }
  },
  methods: {
    formatarHora(hora) {
      if (!hora) return "";
      if (typeof hora === "string" && hora.match(/^\d{2}:\d{2}$/)) return hora;
      
      if (hora.hour !== undefined && hora.minute !== undefined) {
        const h = String(hora.hour).padStart(2, "0");
        const m = String(hora.minute).padStart(2, "0");
        return `${h}:${m}`;
      }
      return String(hora);
    },
    // Formata o preço para exibição com R$ e vírgula decimal
    formatarPrecoParaExibicao(precoString) {
      if (!precoString || String(precoString).trim() === '') return '';
      // Garante que o valor seja um número (substitui vírgula por ponto para parseFloat)
      let numericValue = parseFloat(String(precoString).replace(',', '.'));
      if (isNaN(numericValue)) return precoString; // Retorna o original se não for um número válido

      return numericValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
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
    alternarAula(aula, event) {
      const id = `${aula.modalidade}-${aula.diadasemana}`;
      const index = this.aulasSelecionadas.findIndex(sel => sel.id === id);

      if (event.target.checked) {
        if (this.aulasSelecionadas.length < this.maximoPermitido()) {
          this.aulasSelecionadas.push({
            id,
            modalidade: aula.modalidade,
            diadasemana: aula.diadasemana,
            horarioSelecionado: null,
          });
          this.mensagemFeedback = '';
          this.mensagemTipo = '';
        } else {
          event.target.checked = false;
          this.mensagemFeedback = `❌ Você só pode selecionar até ${this.maximoPermitido()} aula(s).`;
          this.mensagemTipo = 'erro';
        }
      } else {
        if (index !== -1) {
          this.aulasSelecionadas.splice(index, 1);
          this.mensagemFeedback = '';
          this.mensagemTipo = '';
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
    async enviarMatricula() {
      this.mensagemFeedback = '';
      this.mensagemTipo = '';

      const idUsuario = localStorage.getItem("usuarioId");
      if (!idUsuario) {
        this.mensagemFeedback = "❌ Usuário não autenticado. Faça login para continuar.";
        this.mensagemTipo = "erro";
        return;
      }

      const planoElement = document.getElementById("plano");
      if (!planoElement || planoElement.value === "") {
        this.mensagemFeedback = "❌ Por favor, selecione um plano.";
        this.mensagemTipo = "erro";
        return;
      }

      let planoSelecionado;
      try {
        planoSelecionado = JSON.parse(planoElement.value);
      } catch (e) {
        this.mensagemFeedback = "❌ Plano inválido. Tente novamente.";
        this.mensagemTipo = "erro";
        console.error("Erro ao fazer parse do plano:", e);
        return;
      }

      const aulasValidas = this.aulasSelecionadas.filter(sel => sel.horarioSelecionado);
      if (aulasValidas.length === 0 && !this.semLimite) {
        this.mensagemFeedback = "❌ Selecione pelo menos uma aula e seu horário.";
        this.mensagemTipo = "erro";
        return;
      }

      const matricula = {
        idUsuario,
        idPolo: this.polo.idPolo,
        frequencia: this.frequenciaSelecionada,
        plano: {
          ...planoSelecionado,
          preco: String(planoSelecionado.preco).replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.'),
        },
        aulasSelecionadas: aulasValidas.map(sel => ({
          modalidade: sel.modalidade,
          diaSemana: sel.diadasemana,
          horario: sel.horarioSelecionado,
        })),
      };

      try {
        const response = await fetch("/matricula", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(matricula),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao enviar matrícula: ${errorText}`);
        }

        const mensagem = await response.text();
        this.mensagemFeedback = `✅ ${mensagem}`;
        this.mensagemTipo = "sucesso";
        this.mostrarConfirmacaoModal = true; // Exibe o modal de confirmação
      } catch (err) {
        this.mensagemFeedback = `❌ Erro ao finalizar matrícula: ${err.message}. Tente novamente.`;
        this.mensagemTipo = "erro";
        console.error(err);
      }
    },
    resetFormulario() {
      this.frequenciaSelecionada = "";
      this.aulasSelecionadas = [];
      this.semLimite = false;
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },
    fecharConfirmacaoModal() {
      this.mostrarConfirmacaoModal = false;
      this.resetFormulario();
      this.$router.push("/home");
    },
  },
  watch: {
    frequenciaSelecionada(novoValor) {
      this.aulasSelecionadas = [];
      this.mensagemFeedback = '';

      if (novoValor === "Outro (Converse com o Diretor do Polo)") {
        this.semLimite = true;
      } else {
        this.semLimite = false;
      }
    },
  },
  template: `
    <section class="matricula">
      <button @click="$router.push('/agendar')" id="btn-voltar"><i class="fi fi-rr-arrow-left"></i> Voltar</button>
      <div class="container-matricula">
        <h1 class="titulo">Matrícula</h1>

        <!-- Mensagem de feedback (sucesso/erro) -->
        <div v-if="mensagemFeedback && !mostrarConfirmacaoModal" :class="['mensagem-feedback', mensagemTipo]">
          {{ mensagemFeedback }}
        </div>

        <div v-if="carregando">Carregando informações do polo...</div>
        <div v-else-if="erro">Erro: {{ erro }}</div>

        <form @submit.prevent="enviarMatricula" class="form-matricula-new" v-else>
          <div class="grupo">
            <h2>Informações do Polo</h2>
            <h3 class="subtitulo-item">{{ polo.nome }}</h3>
            <p class="text-info">Responsável: {{ responsavel }}</p>
            <p class="text-info">Endereço: {{ polo.endereco.rua }}, {{ polo.endereco.numero }} - {{ polo.endereco.bairro }}, {{ polo.endereco.cidade }} - {{ polo.endereco.estado }}</p>
          </div>

          <div class="grupo">
            <h2>Frequência Semanal</h2>
            <select v-model="frequenciaSelecionada" id="frequencia" required class="form-select">
              <option disabled value="">Selecione</option>
              <option>1x por semana</option>
              <option>2x por semana</option>
              <option>3x por semana</option>
              <option>Outro (Converse com o Diretor do Polo)</option>
            </select>
          </div>

          <div class="grupo">
            <h2>Aulas Disponíveis</h2>
            <p class="text-info">Selecione até {{ semLimite ? 'o limite acordado' : maximoPermitido() }} aula(s).</p>
            <div
              v-for="(aula, index) in polo.aulasDisponiveis"
              :key="aula.modalidade + aula.diadasemana"
              class="aula-item"
            >
              <h3 class="subtitulo-item">Aula {{ index + 1 }}</h3>
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="aulasSelecionadas.some(sel => sel.id === aula.modalidade + '-' + aula.diadasemana)"
                  @change="alternarAula(aula, $event)"
                />
                <span>
                  {{ aula.modalidade }} - {{ aula.diadasemana }}
                </span>
              </label>

              <div v-if="aulasSelecionadas.some(sel => sel.id === aula.modalidade + '-' + aula.diadasemana)" class="horario-select-container">
                <select @change="onSelecionarHorario(aula, $event)" class="form-select">
                  <option value="">Escolha um horário</option>
                  <option
                    v-for="horario in aula.horarios"
                    :key="horario.horaInicio + horario.professor"
                    :value="JSON.stringify(horario)"
                  >
                    {{ formatarHora(horario.horaInicio) }} às {{ formatarHora(horario.horaFim) }} ({{ horario.professor }})
                  </option>
                </select>
              </div>
              <hr class="separator-item" v-if="index < polo.aulasDisponiveis.length - 1" />
            </div>
          </div>

          <div class="grupo">
            <h2>Planos Desejados</h2>
            <select name="plano" id="plano" required class="form-select">
              <option disabled selected value="">Selecione</option>
              <option
                v-for="(plano, index) in polo.planosDisponiveis"
                :key="index"
                :value="JSON.stringify(plano)"
              >
                {{ plano.nome }} - {{ plano.recorrencia }} - {{ formatarPrecoParaExibicao(plano.preco) }}
              </option>
            </select>
          </div>

          <button type="submit" class="btn-enviar-matricula">Finalizar Matrícula</button>
        </form>

        <!-- Modal de Confirmação -->
        <div class="modal-overlay-confirm" v-if="mostrarConfirmacaoModal">
          <div class="modal-content-confirm">
            <h2>Matrícula Realizada!</h2>
            <p>{{ mensagemFeedback }}</p>
            <button id="btn-confirmar-matricula" @click="fecharConfirmacaoModal">Fechar</button>
          </div>
        </div>
      </div>
    </section>
  `,
};
