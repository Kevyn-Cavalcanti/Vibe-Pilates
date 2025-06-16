export const CriarPolo = {
  data() {
    return {
      diasDaSemana: [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
      ],
      opcoesRecorrencia: ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'],
      usuarios: [],
      etapaFormulario: 1,
      polo: {
        idPolo: null,
        idUsuario: null,
        nome: '',
        endereco: {
          rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: ''
        },
        aulasDisponiveis: [],
        planosDisponiveis: []
      },
      mensagemFeedback: '',
      mensagemTipo: '',
      mostrarConfirmacaoModal: false,
      showDeleteConfirmationModal: false,
      deleteConfirmationTitle: '',
      deleteConfirmationMessage: '',
      deleteConfirmationCallback: null,
      deleteConfirmationArgs: [],
      isEditing: false,
    };
  },
  computed: {
    usuariosSemAlunos() {
      return this.usuarios.filter(usuario => usuario.permissao !== 'Aluno');
    },
    estaEditando() {
      return this.isEditing;
    }
  },
  async mounted() {
    await this.fetchUsuarios();

	const poloIdFromRoute = this.$route.params.idPolo;
    if (poloIdFromRoute) {
      this.polo.idPolo = poloIdFromRoute;
      this.isEditing = true;
      await this.carregarPoloParaEdicao(this.polo.idPolo);
    }
  },
  methods: {
    async fetchUsuarios() {
      try {
        const response = await fetch('/usuario');
        if (response.ok) {
          const data = await response.json();
          this.usuarios = data;
          console.log('Usuários carregados:', this.usuarios);
        } else {
          const errorData = await response.json();
          this.mensagemFeedback = `Erro ao carregar usuários: ${errorData.error || response.statusText}`;
          this.mensagemTipo = 'erro';
          console.error('Erro ao carregar usuários:', errorData);
        }
      } catch (error) {
        this.mensagemFeedback = 'Erro na requisição: Não foi possível conectar ao servidor de usuários.';
        this.mensagemTipo = 'erro';
        console.error('Erro ao buscar usuários:', error);
      }
    },
    async carregarPoloParaEdicao(id) {
      try {
        const response = await fetch(`/polo/${id}`);
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Erro ao carregar polo para edição.");
        }
        const data = await response.json();
        this.polo = {
          ...data,
          idUsuario: data.idUsuario
        };
        this.polo.planosDisponiveis.forEach(plano => {
          if (typeof plano.preco === 'number') {
            plano.preco = plano.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          }
        });
        this.mensagemFeedback = '';
        this.mensagemTipo = '';
      } catch (error) {
        this.mensagemFeedback = `❌ ${error.message}`;
        this.mensagemTipo = 'erro';
        console.error("Erro ao carregar polo para edição:", error);
      }
    },
    avancarEtapa() {
      if (this.etapaFormulario === 1) {
        if (this.polo.nome &&
            this.polo.endereco.rua && this.polo.endereco.numero &&
            this.polo.endereco.bairro && this.polo.endereco.cidade &&
            this.polo.endereco.estado && this.polo.endereco.cep &&
            this.polo.idUsuario) {
          this.etapaFormulario = 2;
          this.mensagemFeedback = '';
          this.mensagemTipo = '';
        } else {
          this.mensagemFeedback = 'Por favor, preencha todos os campos obrigatórios da primeira etapa.';
          this.mensagemTipo = 'erro';
        }
      } else if (this.etapaFormulario === 2) {
        this.etapaFormulario = 3;
        this.mensagemFeedback = '';
        this.mensagemTipo = '';
      }
    },
    voltarEtapa() {
      if (this.etapaFormulario === 3) {
        this.etapaFormulario = 2;
      } else if (this.etapaFormulario === 2) {
        this.etapaFormulario = 1;
      }
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },
    adicionarAula() {
      this.polo.aulasDisponiveis.push({
        modalidade: '',
        diadasemana: '',
        horarios: []
      });
    },
    openDeleteConfirmationModal(title, message, callback, args = []) {
      this.deleteConfirmationTitle = title;
      this.deleteConfirmationMessage = message;
      this.deleteConfirmationCallback = callback;
      this.deleteConfirmationArgs = args;
      this.showDeleteConfirmationModal = true;
    },
    confirmDeleteAction() {
      if (this.deleteConfirmationCallback) {
        this.deleteConfirmationCallback(...this.deleteConfirmationArgs);
      }
      this.closeDeleteConfirmationModal();
    },
    closeDeleteConfirmationModal() {
      this.showDeleteConfirmationModal = false;
      this.deleteConfirmationTitle = '';
      this.deleteConfirmationMessage = '';
      this.deleteConfirmationCallback = null;
      this.deleteConfirmationArgs = [];
    },
    doRemoveAula(index) {
      this.polo.aulasDisponiveis.splice(index, 1);
      this.mensagemFeedback = 'Aula removida com sucesso!';
      this.mensagemTipo = 'sucesso';
    },
    removerAula(index) {
      this.openDeleteConfirmationModal('Remover Aula?', 'Tem certeza que deseja remover esta aula e todos os seus horários?', this.doRemoveAula, [index]);
    },
    adicionarHorario(index) {
      this.polo.aulasDisponiveis[index].horarios.push({
        horaInicio: '',
        horaFim: '',
        professor: null
      });
    },
    doRemoveHorario(aulaIndex, horarioIndex) {
      this.polo.aulasDisponiveis[aulaIndex].horarios.splice(horarioIndex, 1);
      this.mensagemFeedback = 'Horário removido com sucesso!';
      this.mensagemTipo = 'sucesso';
    },
    removerHorario(aulaIndex, horarioIndex) {
      this.openDeleteConfirmationModal('Remover Horário?', 'Tem certeza que deseja remover este horário?', this.doRemoveHorario, [aulaIndex, horarioIndex]);
    },
    adicionarPlano() {
      this.polo.planosDisponiveis.push({
        nome: '', recorrencia: '', preco: ''
      });
    },
    doRemovePlano(index) {
      this.polo.planosDisponiveis.splice(index, 1);
      this.mensagemFeedback = 'Plano removido com sucesso!';
      this.mensagemTipo = 'sucesso';
    },
    removerPlano(index) {
      this.openDeleteConfirmationModal('Remover Plano?', 'Tem certeza que deseja remover este plano?', this.doRemovePlano, [index]);
    },
    async enviarFormulario() {
      console.log('Dados enviados para o backend:', JSON.stringify(this.polo, null, 2));
      this.mensagemTipo = '';

      const poloParaEnvio = JSON.parse(JSON.stringify(this.polo));
      poloParaEnvio.planosDisponiveis = poloParaEnvio.planosDisponiveis.map(plano => ({
        ...plano,
        preco: parseFloat(String(plano.preco).replace(/[R$\s.]/g, '').replace(',', '.'))
      }));

      const url = this.isEditing ? `/polo/${this.polo.idPolo}` : '/polo';
      const method = this.isEditing ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(poloParaEnvio)
        });

        if (response.ok) {
          const responseText = await response.text();
          let parsedMessage;
          try {
            parsedMessage = JSON.parse(responseText).mensagem;
          } catch (e) {
            parsedMessage = responseText;
          }
          this.mensagemFeedback = parsedMessage;
          this.mensagemTipo = 'sucesso';
          this.mostrarConfirmacaoModal = true;
          console.log('Sucesso:', responseText);
        } else {
          let errorText = await response.text();
          let errorMessage;
          try {
            errorMessage = JSON.parse(errorText).error || JSON.parse(errorText).mensagem || errorText;
          } catch (e) {
            errorMessage = errorText;
          }
          this.mensagemFeedback = `Erro: ${errorMessage}`;
          this.mensagemTipo = 'erro';
          console.error('Erro ao salvar polo:', errorText);
        }
      } catch (error) {
        this.mensagemFeedback = 'Erro na requisição: Não foi possível conectar ao servidor do polo.';
        this.mensagemTipo = 'erro';
        console.error('Erro na requisição:', error);
      }
    },
    resetFormulario() {
      this.polo = {
        idPolo: null,
        idUsuario: null,
        nome: '',
        endereco: {
          rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: ''
        },
        aulasDisponiveis: [],
        planosDisponiveis: []
      };
      this.etapaFormulario = 1;
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
      this.isEditing = false;
    },
    formatarCEP() {
      let cep = this.polo.endereco.cep.replace(/\D/g, '');
      if (cep.length > 8) {
        cep = cep.slice(0, 8);
      }
      if (cep.length >= 6) {
        this.polo.endereco.cep = cep.slice(0, 5) + '-' + cep.slice(5);
      } else {
        this.polo.endereco.cep = cep;
      }
    },
    formatarPreco(index) {
      let preco = this.polo.planosDisponiveis[index].preco;
      preco = String(preco).replace(/\D/g, '');
      const numero = parseFloat(preco) / 100;
      this.polo.planosDisponiveis[index].preco = numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    },
    fecharConfirmacaoModal() {
      this.mostrarConfirmacaoModal = false;
      this.resetFormulario();
      this.$router.push('/gerenciarPolos');
    }
  },
  template: `
    <section class="criar-polo">
      <button @click="$router.push('/gerenciarPolos')" id="btn-voltar-criar-polo"><i class="fi fi-rr-arrow-left"></i> Voltar</button>
      <div class="container-criar-polo">
        <h1 class="titulo">{{ estaEditando ? 'Editar Polo' : 'Criar Polo' }}</h1>
        <form class="form-polo" @submit.prevent="etapaFormulario === 1 || etapaFormulario === 2 ? avancarEtapa() : enviarFormulario()">
          <!-- Etapa 1: Dados do Polo e Usuário Responsável -->
          <div v-if="etapaFormulario === 1">
            <div class="grupo">
              <h2>Dados do Polo</h2>
              <input type="text" v-model="polo.nome" placeholder="Nome do Polo" required class="form-input" />
              <input
                type="text"
                v-model="polo.endereco.cep"
                placeholder="CEP"
                required
                class="form-input"
                @input="formatarCEP"
                maxlength="9"
                pattern="\\d{5}-\\d{3}"
                title="CEP no formato 12345-678"
              />
              <input type="text" v-model="polo.endereco.rua" placeholder="Rua" required class="form-input" />
              <input type="text" v-model="polo.endereco.numero" placeholder="Número" required class="form-input" />
              <input type="text" v-model="polo.endereco.bairro" placeholder="Bairro" required class="form-input" />
              <input type="text" v-model="polo.endereco.cidade" placeholder="Cidade" required class="form-input" />
              <input type="text" v-model="polo.endereco.estado" placeholder="Estado" required class="form-input" />
            </div>

            <div class="grupo">
              <h2>Usuário Responsável</h2>
              <select v-model="polo.idUsuario" required class="form-select">
                <option :value="null" disabled>Selecione um Responsável</option>
                <option v-for="usuario in usuariosSemAlunos" :key="usuario.idUsuario" :value="usuario.idUsuario">
                  {{ usuario.nome }} ({{ usuario.email }})
                </option>
              </select>
            </div>
            <button type="submit" class="btn-enviar">Avançar</button>
          </div>

          <!-- Etapa 2: Aulas Disponíveis -->
          <div v-else-if="etapaFormulario === 2">
            <button type="button" @click="voltarEtapa" id="voltar-etapa"><i class="fi fi-rr-arrow-left"></i></button>

            <div class="grupo">
              <h2>Aulas Disponíveis</h2>
              <div v-for="(aula, index) in polo.aulasDisponiveis" :key="index" class="aula-item">
                <div class="aula-item-header">
                  <h3 class="subtitulo-item">Aula {{ index + 1 }} <button type="button" @click="removerAula(index)" class="action-button-remove-x"><i class="fi fi-rr-trash"></i></button></h3>
                </div>
                <input type="text" v-model="aula.modalidade" placeholder="Modalidade" required class="form-input" />
                <select v-model="aula.diadasemana" required class="form-select">
                  <option disabled value="">Dia da Semana</option>
                  <option v-for="dia in diasDaSemana" :key="dia" :value="dia">{{ dia }}</option>
                </select>
                
                <div v-for="(horario, i) in aula.horarios" :key="i" class="horario-item">
                  <div class="horario-item-header">
                    <h4 class="subtitulo-subitem">Horário {{ i + 1 }} <button type="button" @click="removerHorario(index, i)" class="action-button-remove-x"><i class="fi fi-rr-trash"></i></button></h4>
                  </div>
                  <input type="time" v-model="horario.horaInicio" required class="form-input" />
                  <input type="time" v-model="horario.horaFim" required class="form-input" />
                  <select v-model="horario.professor" required class="form-select">
                    <option :value="null" disabled>Selecione um Professor</option>
                    <option v-for="usuario in usuariosSemAlunos" :key="usuario.idUsuario" :value="usuario.nome">
                      {{ usuario.nome }}
                    </option>
                  </select>
                </div>
                <button type="button" @click="adicionarHorario(index)" id="adicionar-horario"><i class="fi fi-rr-plus"></i> Adicionar Horário</button>
                <hr class="separator-item" v-if="aula.horarios.length > 0 && i < aula.horarios.length - 1"/>
              </div>
              <button type="button" @click="adicionarAula" class="action-button">+ Adicionar Aula</button>
            </div>
            <button type="submit" class="btn-enviar">Avançar</button>
          </div>

          <!-- Etapa 3: Planos Disponíveis -->
          <div v-else-if="etapaFormulario === 3">
            <button type="button" @click="voltarEtapa" id="voltar-etapa"><i class="fi fi-rr-arrow-left"></i></button>

            <div class="grupo">
              <h2>Planos Disponíveis</h2>
              <div v-for="(plano, index) in polo.planosDisponiveis" :key="index" class="plano-item">
                <div class="plano-item-header">
                  <h3 class="subtitulo-item">Plano {{ index + 1 }} <button type="button" @click="removerPlano(index)" class="action-button-remove-x"><i class="fi fi-rr-trash"></i></button></h3>
                </div>
                <input type="text" v-model="plano.nome" placeholder="Nome do Plano" required class="form-input" />
                <select v-model="plano.recorrencia" required class="form-select">
                  <option disabled value="">Recorrência</option>
                  <option v-for="opcao in opcoesRecorrencia" :key="opcao" :value="opcao">{{ opcao }}</option>
                </select>
                <input type="text" v-model="plano.preco" placeholder="Preço" required class="form-input" @input="formatarPreco(index)" />
              </div>
              <button type="button" @click="adicionarPlano" class="action-button">+ Adicionar Plano</button>
            </div>

            <!-- Botão de Envio final -->
            <button type="submit" class="btn-enviar">{{ estaEditando ? 'Editar Polo' : 'Criar Polo' }}</button>
          </div>
        </form>

        <!-- Modal de Confirmação (para envio do formulário) -->
        <div class="modal-overlay-polo" v-if="mostrarConfirmacaoModal">
          <div class="modal-content-msg-polo">
            <h2>Operação Concluída</h2>
            <p>{{ mensagemFeedback }}</p>
            <button @click="fecharConfirmacaoModal">Fechar</button>
          </div>
        </div>

        <!-- Novo Modal de Confirmação de Exclusão (Genérico com classes fixas) -->
        <div class="users-modal-overlay" v-if="showDeleteConfirmationModal">
          <div class="users-modal-content">
            <p class="users-modal-icon-alert">!</p>
            <p class="users-modal-text-confirm">{{ deleteConfirmationMessage }}</p>
            <div class="users-modal-actions">
              <button @click="confirmDeleteAction" class="users-btn-danger">Confirmar</button>
              <button @click="closeDeleteConfirmationModal" class="users-btn-secondary">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
};
