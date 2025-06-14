export const CriarPolo = {
  data() {
    return {
      diasDaSemana: [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
      ],
      opcoesRecorrencia: ['Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'],
      usuarios: [], // Propriedade para armazenar a lista de usuários
      etapaFormulario: 1, // Controla a etapa atual do formulário (1, 2 ou 3)
      polo: {
        idUsuario: null, // Será selecionado via dropdown, inicializado como null
        nome: '',
        endereco: {
          rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: ''
        },
        aulasDisponiveis: [],
        planosDisponiveis: []
      },
      mensagemFeedback: '',
      mensagemTipo: '', // 'sucesso' ou 'erro'
      mostrarConfirmacaoModal: false
    };
  },
  async mounted() {
    // Ao carregar o componente, buscamos a lista de usuários para popular o dropdown
    await this.fetchUsuarios();
  },
  methods: {
    // Método para buscar a lista de usuários do backend
    async fetchUsuarios() {
      try {
        const response = await fetch('/usuario'); // Endpoint para buscar todos os usuários
        if (response.ok) {
          const data = await response.json();
          this.usuarios = data; // Popula a lista de usuários
          console.log('Usuários carregados:', this.usuarios);
        } else {
          // Se o backend retornar um objeto de erro, tentamos extrair a mensagem
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
    // Método para avançar para a próxima etapa do formulário
    avancarEtapa() {
      if (this.etapaFormulario === 1) {
        // Validação da primeira etapa
        if (this.polo.nome &&
            this.polo.endereco.rua && this.polo.endereco.numero &&
            this.polo.endereco.bairro && this.polo.endereco.cidade &&
            this.polo.endereco.estado && this.polo.endereco.cep &&
            this.polo.idUsuario) {
          this.etapaFormulario = 2; // Avança para a segunda etapa
          this.mensagemFeedback = ''; // Limpa mensagens anteriores
          this.mensagemTipo = '';
        } else {
          this.mensagemFeedback = 'Por favor, preencha todos os campos obrigatórios da primeira etapa.';
          this.mensagemTipo = 'erro';
        }
      } else if (this.etapaFormulario === 2) {
        // Validação da segunda etapa (aulas, se houver)
        // Você pode adicionar aqui validações para garantir que as aulas estão completas, se necessário.
        this.etapaFormulario = 3; // Avança para a terceira etapa
        this.mensagemFeedback = ''; // Limpa mensagens anteriores
        this.mensagemTipo = '';
      }
    },
    // Método para voltar para a etapa anterior do formulário
    voltarEtapa() {
      if (this.etapaFormulario === 3) {
        this.etapaFormulario = 2;
      } else if (this.etapaFormulario === 2) {
        this.etapaFormulario = 1;
      }
      this.mensagemFeedback = ''; // Limpa mensagens anteriores
      this.mensagemTipo = '';
    },
    adicionarAula() {
      // Adiciona uma nova entrada de aula disponível
      this.polo.aulasDisponiveis.push({
        modalidade: '',
        diadasemana: '',
        horarios: []
      });
    },
    adicionarHorario(index) {
      // Adiciona um novo horário para a aula no índice especificado
      this.polo.aulasDisponiveis[index].horarios.push({
        horaInicio: '',
        horaFim: '',
        professor: null // Inicializa com null para o dropdown
      });
    },
    adicionarPlano() {
      // Adiciona uma nova entrada de plano disponível
      this.polo.planosDisponiveis.push({
        nome: '', recorrencia: '', preco: ''
      });
    },
    async enviarFormulario() {
      console.log('Dados enviados para o backend:', JSON.stringify(this.polo, null, 2));
      this.mensagemTipo = '';

      try {
        const response = await fetch('/polo', { // Certifique-se de que esta URL está correta (ex: http://localhost:8080/polo)
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.polo)
        });

        if (response.ok) {
          const message = await response.text(); // O backend retorna uma String (ex: "Polo criado com sucesso!")
          this.mensagemFeedback = message;
          this.mensagemTipo = 'sucesso';
          this.mostrarConfirmacaoModal = true;
          console.log('Sucesso:', message);
        } else {
          const errorText = await response.text(); // O backend retorna uma String de erro
          this.mensagemFeedback = `Erro: ${errorText}`;
          this.mensagemTipo = 'erro';
          console.error('Erro ao criar polo:', errorText);
        }
      } catch (error) {
        this.mensagemFeedback = 'Erro na requisição: Não foi possível conectar ao servidor do polo.';
        this.mensagemTipo = 'erro';
        console.error('Erro na requisição:', error);
      }
    },
    // Método para resetar o formulário após o envio bem-sucedido
    resetFormulario() {
      this.polo = {
        idUsuario: null, // Reseta para null para exigir nova seleção
        nome: '',
        endereco: {
          rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: ''
        },
        aulasDisponiveis: [],
        planosDisponiveis: []
      };
      this.etapaFormulario = 1; // Volta para a primeira etapa
      this.mensagemFeedback = ''; // Limpa a mensagem de feedback
      this.mensagemTipo = '';
    },
    // Função para formatar o CEP
    formatarCEP() {
      // Remove tudo que não é dígito
      let cep = this.polo.endereco.cep.replace(/\D/g, '');

      // Limita o CEP a 8 dígitos
      if (cep.length > 8) {
        cep = cep.slice(0, 8);
      }

      // Adiciona o hífen na posição correta (depois do 5º dígito)
      if (cep.length >= 6) {
        this.polo.endereco.cep = cep.slice(0, 5) + '-' + cep.slice(5);
      } else {
        this.polo.endereco.cep = cep;
      }
    },
    formatarPreco(index) {
  let preco = this.polo.planosDisponiveis[index].preco;

  // Remove tudo que não é número
  preco = preco.replace(/\D/g, '');

  // Converte para número com duas casas decimais
  const numero = parseFloat(preco) / 100;

  // Formata como moeda brasileira
  this.polo.planosDisponiveis[index].preco = numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
},
    // Método para fechar o modal de confirmação e redirecionar
    fecharConfirmacaoModal() {
  this.mostrarConfirmacaoModal = false; // Esconde o modal
  this.resetFormulario(); // Reseta o formulário
  this.$router.push('/agendar'); // Redireciona para a página de agendamento
}
  },
  template: `
    <section class="criar-polo">
    <h1 class="titulo">Criar Polo</h1>

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
            <option v-for="usuario in usuarios" :key="usuario.idUsuario" :value="usuario.idUsuario">
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
            <h3 class="subtitulo-item">Aula {{ index + 1 }}</h3>
            <input type="text" v-model="aula.modalidade" placeholder="Modalidade" required class="form-input" />
            <select v-model="aula.diadasemana" required class="form-select">
              <option disabled value="">Dia da Semana</option>
              <option v-for="dia in diasDaSemana" :key="dia" :value="dia">{{ dia }}</option>
            </select>
            <div v-for="(horario, i) in aula.horarios" :key="i" class="horario-item">
              <h4 class="subtitulo-subitem">Horário {{ i + 1 }}</h4>
              <input type="time" v-model="horario.horaInicio" required class="form-input" />
              <input type="time" v-model="horario.horaFim" required class="form-input" />
              <!-- Campo Professor agora é um select -->
              <select v-model="horario.professor" required class="form-select">
                <option :value="null" disabled>Selecione um Professor</option>
                <option v-for="usuario in usuarios" :key="usuario.idUsuario" :value="usuario.nome">
                  {{ usuario.nome }}
                </option>
              </select>
            </div>
            <button type="button" @click="adicionarHorario(index)" id="adicionar-horario">+ Adicionar Horário</button>
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
            <h3 class="subtitulo-item">Plano {{ index + 1 }}</h3>
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
        <button type="submit" class="btn-enviar">Criar Polo</button>
      </div>
    </form>

    <!-- Modal de Confirmação -->
<div class="modal-overlay-polo" v-if="mostrarConfirmacaoModal">
  <div class="modal-content-msg-polo">
    <h2>Operação Concluída</h2>
    <p>{{ mensagemFeedback }}</p>
    <button @click="fecharConfirmacaoModal">Fechar</button>
  </div>
</div>
  </section>
  `
};
