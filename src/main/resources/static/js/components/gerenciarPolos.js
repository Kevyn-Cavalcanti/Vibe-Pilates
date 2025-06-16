export const GerenciarPolos = {
  data() {
    return {
      polos: [],
      usuarios: [],
      carregandoPolos: true,
      carregandoUsuarios: true,
      poloParaExcluir: null,
      mensagemFeedback: '',
      mensagemTipo: '',
      showDeleteConfirm: false,
    };
  },
  async mounted() {
    await this.carregarUsuarios();
    await this.carregarPolos();
  },
  methods: {
    async carregarUsuarios() {
      this.carregandoUsuarios = true;
      try {
        const response = await fetch('/usuario');
        const text = await response.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonErr) {
          throw new Error('Resposta inválida do servidor: ' + text);
        }

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar usuários.');
        }

        this.usuarios = data;
      } catch (err) {
        this.mensagemFeedback = err.message;
        this.mensagemTipo = 'erro';
        console.error('Erro ao carregar usuários:', err);
      } finally {
        this.carregandoUsuarios = false;
      }
    },

    async carregarPolos() {
      this.carregandoPolos = true;
      try {
        const response = await fetch('/polo');
        const text = await response.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonErr) {
          throw new Error('Resposta inválida do servidor: ' + text);
        }

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar polos.');
        }

        this.polos = data.map(polo => {
          const usuario = this.usuarios.find(u => u.idUsuario === polo.idUsuario);
          return {
            ...polo,
            nomeResponsavel: usuario ? usuario.nome : 'N/A'
          };
        });

        this.mensagemFeedback = '';
        this.mensagemTipo = '';
      } catch (err) {
        this.mensagemFeedback = err.message;
        this.mensagemTipo = 'erro';
        console.error('Erro ao carregar polos:', err);
      } finally {
        this.carregandoPolos = false;
      }
    },

    confirmarExclusao(poloId) {
      const polo = this.polos.find(p => p.idPolo === poloId);
      this.poloParaExcluir = polo;
      this.showDeleteConfirm = true;
      this.mensagemFeedback = '';
      this.mensagemTipo = '';
    },

    async excluirPolo() {
      if (!this.poloParaExcluir) return;

      try {
        const response = await fetch(`/polo/${this.poloParaExcluir.idPolo}`, {
          method: 'DELETE',
        });

        const text = await response.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonErr) {
          throw new Error('Resposta inválida do servidor: ' + text);
        }

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao excluir polo.');
        }

        this.polos = this.polos.filter(p => p.idPolo !== this.poloParaExcluir.idPolo);
        this.mensagemFeedback = data.mensagem || 'Polo excluído com sucesso!';
        this.mensagemTipo = 'sucesso';
        this.showDeleteConfirm = false;
        alert(this.mensagemFeedback);
      } catch (err) {
        this.mensagemFeedback = err.message;
        this.mensagemTipo = 'erro';
        console.error('Erro ao excluir polo:', err);
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

    criarOuEditarPolo(poloId = null) {
      if (poloId) {
        this.$router.push(`/criarPolo/${poloId}`);
      } else {
        this.$router.push('/criarPolo');
      }
    },
  },

  template: `
    <section class="users-page-container">
      <h1 class="users-page-title">Gerenciamento de Polos</h1>

      <div v-if="mensagemFeedback" :class="['users-feedback-message', mensagemTipo]">
        {{ mensagemFeedback }}
      </div>

      <div v-if="carregandoPolos || carregandoUsuarios" class="users-loading-message">Carregando polos e usuários...</div>

      <div v-else class="users-content-wrapper">
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
              <tr v-for="polo in polos" :key="polo.idPolo">
                <td id="td-nome">{{ polo.nome }}</td>
                <td>
                  {{ polo.endereco ? polo.endereco.rua + ', ' + polo.endereco.numero + ', ' + polo.endereco.cidade : 'N/A' }}
                </td>
                <td>{{ polo.nomeResponsavel }}</td>
                <td class="users-table-actions">
                  <button class="users-action-button-edit" @click="criarOuEditarPolo(polo.idPolo)">Editar</button>
                  <button class="users-action-button-delete" @click="confirmarExclusao(polo.idPolo)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showDeleteConfirm" class="users-modal-overlay">
        <div class="users-modal-content">
          <p class="users-modal-icon-alert">!</p>
          <p class="users-modal-text-confirm">
            Você tem certeza que deseja excluir o polo
            <strong>{{ poloParaExcluir ? poloParaExcluir.nome : '' }}</strong>?
          </p>
          <div class="users-modal-actions">
            <button class="users-btn-danger" @click="excluirPolo">Sim, excluir</button>
            <button class="users-btn-secondary" @click="cancelarExclusao">Voltar</button>
          </div>
        </div>
      </div>
    </section>
  `,
};
