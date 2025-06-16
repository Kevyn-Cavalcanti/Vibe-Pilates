export const GerenciarPolos = {
  data() {
    return {
      polos: [],
      carregandoPolos: true,
      poloParaExcluir: null,
      mensagemFeedback: '',
      mensagemTipo: '',
      showDeleteConfirm: false,
    };
  },
  async mounted() {
    await this.carregarPolos();
  },
  methods: {
    async carregarPolos() {
      this.carregandoPolos = true;
      try {
        const response = await fetch("/polo"); 
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao carregar polos.");
        }
        this.polos = await response.json();
        this.mensagemFeedback = '';
        this.mensagemTipo = '';
      } catch (err) {
        this.mensagemFeedback = `❌ ${err.message}`;
        this.mensagemTipo = 'erro';
        console.error("Erro ao carregar polos:", err);
      } finally {
        this.carregandoPolos = false;
      }
    },
    confirmarExclusao(polo) {
      this.poloParaExcluir = polo;
      this.showDeleteConfirm = true;
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },
    async excluirPolo() {
      if (!this.poloParaExcluir) return;

      try {
        const response = await fetch(`/polo/${this.poloParaExcluir.id}`, { 
          method: 'DELETE'
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao excluir polo.");
        }
        const data = await response.json();
        this.polos = this.polos.filter(p => p.id !== this.poloParaExcluir.id);
        this.mensagemFeedback = data.mensagem || "Polo excluído com sucesso!";
        this.mensagemTipo = 'sucesso';
        this.showDeleteConfirm = false;
        alert(this.mensagemFeedback);
      } catch (err) {
        this.mensagemFeedback = `❌ ${err.message}`;
        this.mensagemTipo = 'erro';
        console.error("Erro ao excluir polo:", err);
        this.showDeleteConfirm = false;
        alert(this.mensagemFeedback);
      } finally {
        this.poloParaExcluir = null;
      }
    },
    cancelarExclusao() {
      this.poloParaExcluir = null;
      this.showDeleteConfirm = false;
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },
    criarOuEditarPolo(polo = null) {
      if (polo) {
        this.$router.push(`/criarPolo/${polo.id}`); 
      } else {
        this.$router.push('/criarPolo'); 
      }
    },
  },
  template: `
    <section class="users-page-container">
      <h1 class="users-page-title">Gerenciamento de Polos</h1>

      <!-- Mensagem de feedback (sucesso/erro para operações imediatas) -->
      <div v-if="mensagemFeedback" :class="['users-feedback-message', mensagemTipo]">
        {{ mensagemFeedback }}
      </div>

      <div v-if="carregandoPolos" class="users-loading-message">Carregando polos...</div>

      <div v-else class="users-content-wrapper">
        <!-- Botão para criar um novo polo -->
        <button class="users-action-button-add" @click="criarOuEditarPolo()">+ Criar Novo Polo</button>
        
        <div class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th id="th-nome">Nome do Polo</th>
                <th>Endereço</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="polo in polos" :key="polo.id">
                <td id="td-nome">{{ polo.nome }}</td>
                <td>{{ polo.endereco ? polo.endereco.rua + ', ' + polo.endereco.numero + ', ' + polo.endereco.cidade : 'N/A' }}</td>
                <!-- Pode ser necessário buscar o nome do responsável se o backend retornar apenas o ID -->
                <td>{{ polo.idUsuario ? polo.idUsuario : 'N/A' }}</td> 
                <td class="users-table-actions">
                  <button class="users-action-button-edit" @click="criarOuEditarPolo(polo)">Editar</button>
                  <button class="users-action-button-delete" @click="confirmarExclusao(polo)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Confirmação de Exclusão (com estilo do Usuarios) -->
      <div v-if="showDeleteConfirm" class="users-modal-overlay">
        <div class="users-modal-content">
          <p class="users-modal-icon-alert">!</p>
          <p class="users-modal-text-confirm">Você tem certeza que deseja excluir o polo <strong>{{ poloParaExcluir ? poloParaExcluir.nome : '' }}</strong>?</p>
          <div class="users-modal-actions">
            <button class="users-btn-danger" @click="excluirPolo">Sim, excluir</button>
            <button class="users-btn-secondary" @click="cancelarExclusao">Voltar</button>
          </div>
        </div>
      </div>

      <!-- Modal de Mensagem de Sucesso/Erro (globalizado) - se esta tela tiver seu próprio feedback modal -->
      <!-- Exemplo:
      <div v-if="mostrarConfirmacaoModal" :class="['users-modal-overlay']">
        <div class="users-modal-content">
          <h2>{{ mensagemTipo === 'sucesso' ? 'Sucesso!' : 'Atenção!' }}</h2>
          <p class="users-modal-text-confirm">{{ modalMessage }}</p>
          <button @click="fecharConfirmacaoModal" class="users-btn-secondary">Ok</button>
        </div>
      </div>
      -->
    </section>
  `,
};
