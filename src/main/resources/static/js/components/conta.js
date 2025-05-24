export const Conta = {
  data() {
    return {
      showLogoutConfirm: false,
      logoutCallback: null
    };
  },
  methods: {
    sair() {
      // Ao clicar em sair, abre o popup e passa o callback para realmente sair
      this.confirmLogout(() => {
        localStorage.removeItem("usuarioId");
        localStorage.removeItem("usuarioNome");
        localStorage.removeItem("usuarioEmail");
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
      <h1 class="title-conta">Conta (em andamento)</h1>
      <a href="#" id="sair" @click.prevent="sair">Sair</a>

      <!-- POP-UP DE CONFIRMAÇÃO DE LOGOUT -->
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
  `,
};
