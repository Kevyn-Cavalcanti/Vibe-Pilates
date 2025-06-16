export const Usuarios = {
  data() {
    return {
      usuarios: [],
      carregandoUsuarios: true,
      usuarioEditando: null,
      novaPermissao: null,
      novoEstado: null, 
      showDeleteConfirm: false,
      usuarioParaExcluir: null,
      mensagemFeedback: '', 
      mensagemTipo: '',
      eventSource: null,
      showEditPermissaoPopup: false,
      mostrarConfirmacaoModal: false,
      modalMessage: '',
      filtroPermissao: 'Todos',
    };
  },
  computed: {
    usuariosFiltrados() {
      if (this.filtroPermissao === 'Todos') {
        return this.usuarios;
      }
      return this.usuarios.filter(usuario => usuario.permissao === this.filtroPermissao);
    }
  },
  methods: {
    getPermissaoDisplayName(permissao) {
      switch (permissao) {
        case "Aluno":
          return "Aluno";
        case "Recepcionista":
          return "Recepcionista";
        case "Instrutor":
          return "Instrutor";
        case "Administrador":
          return "Administrador";
        default:
          if (permissao === 1) return "Aluno";
          if (permissao === 2) return "Recepcionista";
          if (permissao === 3) return "Instrutor";
          if (permissao === 4) return "Administrador"; 
          return "Desconhecido";
      }
    },
    async carregarUsuarios() {
      this.carregandoUsuarios = true;
      try {
        const response = await fetch("/usuario");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao carregar usuários.");
        }
        this.usuarios = await response.json();
        this.mensagemFeedback = ''; 
        this.mensagemTipo = '';
      } catch (err) {
        this.mensagemFeedback = `❌ ${err.message}`;
        this.mensagemTipo = 'erro';
        console.error("Erro ao carregar usuários:", err);
      } finally {
        this.carregandoUsuarios = false;
      }
    },
    editarPermissao(usuario) {
      this.usuarioEditando = { ...usuario }; 
      this.novaPermissao = usuario.permissao;
      this.novoEstado = usuario.estado; 
      this.showEditPermissaoPopup = true;
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },
    async salvarPermissao() {
      if (!this.usuarioEditando || this.novaPermissao === null || this.novoEstado === null) {
        this.mensagemFeedback = "❌ Dados inválidos para salvar a permissão ou estado.";
        this.mensagemTipo = 'erro';
        return;
      }

      const usuarioAtualizado = {
        permissao: this.novaPermissao,
        estado: this.novoEstado 
      };

      try {
        const response = await fetch(`/usuario/${this.usuarioEditando.idUsuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuarioAtualizado)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao atualizar permissão e estado.");
        }

        const data = await response.json();
        const index = this.usuarios.findIndex(u => u.idUsuario === this.usuarioEditando.idUsuario);
        if (index !== -1) {
          this.usuarios[index].permissao = this.novaPermissao;
          this.usuarios[index].estado = this.novoEstado; 
        }

        this.showEditPermissaoPopup = false;
        this.modalMessage = data.mensagem || "Permissão e estado atualizados com sucesso!";
        this.mostrarConfirmacaoModal = true;
        this.mensagemTipo = 'sucesso';
      } catch (err) {
        this.mensagemFeedback = `❌ ${err.message}`;
        this.mensagemTipo = 'erro';
        console.error("Erro ao editar permissão e estado:", err);
      } finally {
        this.usuarioEditando = null;
        this.novaPermissao = null;
        this.novoEstado = null;
      }
    },
    cancelarEdicaoPermissao() {
      this.usuarioEditando = null;
      this.novaPermissao = null;
      this.novoEstado = null;
      this.showEditPermissaoPopup = false;
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },
    confirmarExclusao(usuario) {
      this.usuarioParaExcluir = usuario;
      this.showDeleteConfirm = true;
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },
    async excluirUsuario() {
      if (!this.usuarioParaExcluir) return;

      try {
        const response = await fetch(`/usuario/${this.usuarioParaExcluir.idUsuario}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao excluir usuário.");
        }

        const data = await response.json();
        this.usuarios = this.usuarios.filter(u => u.idUsuario !== this.usuarioParaExcluir.idUsuario);
        this.modalMessage = data.mensagem || "Usuário excluído com sucesso!";
        this.mostrarConfirmacaoModal = true;
        this.mensagemTipo = 'sucesso';

      } catch (err) {
        this.mensagemFeedback = `❌ ${err.message}`;
        this.mensagemTipo = 'erro';
        console.error("Erro ao excluir usuário:", err);
      } finally {
        this.usuarioParaExcluir = null;
        this.showDeleteConfirm = false;
      }
    },
    cancelarExclusao() {
      this.usuarioParaExcluir = null;
      this.showDeleteConfirm = false;
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },
    fecharConfirmacaoModal() {
      this.mostrarConfirmacaoModal = false;
      this.modalMessage = '';
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },
    iniciarSSE() {
      if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
        this.eventSource.close();
      }
      this.eventSource = new EventSource("http://localhost:8080/sse/usuario");

      this.eventSource.addEventListener("atualizacao", (event) => {
        console.log("Evento SSE recebido:", event.data);
        const usuariosAtualizados = JSON.parse(event.data);
        this.usuarios = usuariosAtualizados;
      });

      this.eventSource.onerror = (err) => {
        console.error("Erro na conexão SSE:", err);
        if (this.eventSource.readyState === EventSource.CLOSED) {
          setTimeout(() => this.iniciarSSE(), 5000);
        }
      };
    },
  },
  mounted() {
    this.carregarUsuarios();
    this.iniciarSSE();
  },
  beforeUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  },
  template: `
    <section class="users-page-container">
      <h1 class="users-page-title">Gerenciamento de Usuários</h1>

      <!-- Mensagem de feedback (sucesso/erro para operações imediatas) -->
      <div v-if="mensagemFeedback && !mostrarConfirmacaoModal" :class="['users-feedback-message', mensagemTipo]">
        {{ mensagemFeedback }}
      </div>

      <div v-if="carregandoUsuarios" class="users-loading-message">Carregando usuários...</div>

      <div v-else class="users-content-wrapper">
        <div class="users-filter-group">
          <label for="permissaoFilter" class="users-form-label">Filtrar por Permissão:</label>
          <select id="permissaoFilter" v-model="filtroPermissao" class="users-form-select">
            <option value="Todos">Todos</option>
            <option value="Aluno">Aluno</option>
            <option value="Recepcionista">Recepcionista</option>
            <option value="Instrutor">Instrutor</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <div class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th id="th-nome">Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Permissão</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuariosFiltrados" :key="usuario.idUsuario">
                <td id="td-nome">{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.telefone }}</td>
                <td>{{ getPermissaoDisplayName(usuario.permissao) }}</td>
                <td>{{ usuario.estado ? 'Ativo' : 'Inativo' }}</td>
                <td class="users-table-actions">
                  <button class="users-action-button-edit" @click="editarPermissao(usuario)">Editar Permissão</button>
                  <button class="users-action-button-delete" @click="confirmarExclusao(usuario)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Edição de Permissão -->
      <div v-if="showEditPermissaoPopup" class="users-modal-overlay">
        <div class="users-modal-content">
          <h2>Editar Permissão de {{ usuarioEditando ? usuarioEditando.nome : '' }}</h2>
          <form @submit.prevent="salvarPermissao">
            <div class="users-form-group">
              <label for="novaPermissaoSelect" class="users-form-label">Permissão:</label>
              <select id="novaPermissaoSelect" v-model="novaPermissao" class="users-form-select">
                <option value="Aluno">Aluno</option>
                <option value="Recepcionista">Recepcionista</option>
                <option value="Instrutor">Instrutor</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            <div class="users-form-group">
              <label class="users-form-label checkbox-label">
                <input type="checkbox" v-model="novoEstado" class="users-form-checkbox">
                <span>{{ novoEstado ? 'Ativo' : 'Inativo' }}</span>
              </label>
            </div>
            <div class="users-modal-actions">
              <button type="submit" class="users-btn-primary">Salvar</button>
              <button type="button" class="users-btn-secondary" @click="cancelarEdicaoPermissao">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Confirmação de Exclusão -->
      <div v-if="showDeleteConfirm" class="users-modal-overlay">
        <div class="users-modal-content">
          <p class="users-modal-icon-alert">!</p>
          <p class="users-modal-text-confirm">Você tem certeza que deseja excluir o usuário <strong>{{ usuarioParaExcluir ? usuarioParaExcluir.nome : '' }}</strong>?</p>
          <div class="users-modal-actions">
            <button class="users-btn-danger" @click="excluirUsuario">Sim, excluir</button>
            <button class="users-btn-secondary" @click="cancelarExclusao">Voltar</button>
          </div>
        </div>
      </div>

      <!-- Modal de Mensagem de Sucesso/Erro (globalizado) -->
      <div v-if="mostrarConfirmacaoModal" :class="['users-modal-overlay']">
        <div class="users-modal-content">
          <h2>{{ mensagemTipo === 'sucesso' ? 'Sucesso!' : 'Atenção!' }}</h2>
          <p class="users-modal-text-confirm">{{ modalMessage }}</p>
          <button @click="fecharConfirmacaoModal" class="users-btn-secondary">Ok</button>
        </div>
      </div>
    </section>
  `,
};
