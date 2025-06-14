export const Conta = {
  data() {
    return {
      usuario: {},
      showLogoutConfirm: false,
      logoutCallback: null
    };
  },
  mounted() {
    const id = localStorage.getItem("usuarioId");
    if (id) {
      fetch(`http://localhost:8080/usuario/${id}`)
        .then(res => res.json())
        .then(data => {
          this.usuario = data;
        })
        .catch(err => {
          console.error("Erro ao buscar dados do usuário:", err);
        });
    }
  },
  methods: {
    formatarData(dataISO) {
      if (!dataISO) return "";
      const data = new Date(dataISO);
      return data.toLocaleDateString("pt-BR");
    },
    sair() {
      this.confirmLogout(() => {
        localStorage.removeItem("usuarioId");
        localStorage.removeItem("usuarioNome");
        localStorage.removeItem("usuarioEmail");
		localStorage.removeItem("usuarioPermissao");
        this.$router.push("/");
      });
    },
    confirmLogout(navigate) {
      this.logoutCallback = navigate;
      this.showLogoutConfirm = true;
    },
    logoutNow() {
      this.showLogoutConfirm = false;
      if (this.logoutCallback) this.logoutCallback();
    },
    cancelLogout() {
      this.showLogoutConfirm = false;
      this.logoutCallback = null;
    }
  },
  template: `
<section class="conta">
  <div class="header-section">
    <h1 class="title-conta">Minha Conta</h1>
  </div>
  <div class="container-conta">
    <div class="card-conta" v-if="usuario.nome">
      <div class="user-profile">
        <i class="fi fi-ss-user icon"></i>
        <div class="user-details-header">
		<h2 style="display: inline">{{ usuario.nome }}</h2>
		<h2 style="display: inline; margin-left: 8px">{{ "- " + usuario.permissao }}</h2>
          <p class="user-email">{{ usuario.email }}</p>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="info-grupo personal-info">
          <h3>Informações Pessoais</h3>
          <p><strong>CPF:</strong> {{ usuario.cpf || '---' }}</p>
          <p><strong>Telefone:</strong> {{ usuario.telefone || '---' }}</p>
          <p><strong>Data de nascimento:</strong> {{ formatarData(usuario.dataNasc) || '---' }}</p>
          <p><strong>Membro desde:</strong> {{ formatarData(usuario.dataCad) || '---' }}</p>
        </div>

        <div class="info-grupo address-info" v-if="usuario.endereco">
          <h3>Endereço</h3>
          <p>{{ usuario.endereco.rua }}, {{ usuario.endereco.numero }}</p>
          <p>{{ usuario.endereco.bairro }} - {{ usuario.endereco.cidade }}/{{ usuario.endereco.estado }}</p>
          <p>{{ usuario.endereco.cep }}</p>
        </div>
      </div>

      <button id="sair" @click.prevent="sair">
        <i class="fi fi-rr-exit"></i> Sair da Conta
      </button>
    </div>
  </div>

  <div v-if="showLogoutConfirm" class="logout-popup">
    <div class="popup-content">
      <p id="interrogacao">?</p>
      <p>Você está prestes a sair. Deseja continuar?</p>
      <div class="btns-logout">
        <button id="btn-sim" @click="logoutNow">Sim, quero sair</button>
        <button @click="cancelLogout">Voltar</button>
      </div>
    </div>
  </div>
</section>

  `
};
