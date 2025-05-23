export const Conta = {
  data() {
    return {};
  },
  methods: {
    sair() {
      localStorage.removeItem("usuarioId");
      localStorage.removeItem("usuarioNome");
      localStorage.removeItem("usuarioEmail");

      this.$router.push("/");
    }
  },
  template: `
    <section class="conta">
      <h1 class="title-conta">Conta (em andamento)</h1>
      <a href="#" id="sair" @click.prevent="sair">Sair</a>
    </section>
  `,
};
