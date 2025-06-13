export const Agendar = {
  data() {
    return {
      polos: [],
      mostrarFormulario: false,
      mostrarMensagem: false,
      etapaFormulario: 1,
      cadastroCompleto: {
        telefone: '',
        cpf: '',
        dataNascimento: '',
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      }
    };
  },
  methods: {
    async carregarPolos() {
      const resposta = await fetch('/polo');
      const polos = await resposta.json();

      for (const polo of polos) {
        const respostaUsuario = await fetch(`/usuario/${polo.idUsuario}`);
        const usuario = await respostaUsuario.json();
        polo.professor = usuario.nome;
      }

      this.polos = polos;
    },
    async marcarAula(polo) {
      const id = localStorage.getItem("usuarioId");
      const resposta = await fetch(`/usuario/${id}`);
      const dados = await resposta.json();
      if (dados.endereco == null) {
        this.mostrarMensagem = true;
        this.etapaFormulario = 1;
      } else {
        console.log('já tem, segue com polo');
        this.$router.push(`/matricula/${polo.idPolo}`);
      }
    },
    avancarEtapa() {
      this.etapaFormulario = 2;
    },
    async finalizarCadastro() {
      this.mostrarMensagem = false;
      const id = localStorage.getItem("usuarioId");

      const payload = {
        telefone: this.cadastroCompleto.telefone,
        cpf: this.cadastroCompleto.cpf,
        dataNasc: this.cadastroCompleto.dataNascimento,
        endereco: {
          cep: this.cadastroCompleto.cep,
          rua: this.cadastroCompleto.rua,
          numero: this.cadastroCompleto.numero,
          complemento: this.cadastroCompleto.complemento,
          bairro: this.cadastroCompleto.bairro,
          cidade: this.cadastroCompleto.cidade,
          estado: this.cadastroCompleto.estado,
        }
      };

      try {
        const resposta = await fetch(`/usuario/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!resposta.ok) {
          throw new Error('Erro ao atualizar os dados do usuário.');
        }

        alert("Cadastro finalizado com sucesso!");
        this.mostrarFormulario = false;
      } catch (erro) {
        console.error(erro);
        alert("❌ Ocorreu um erro ao salvar os dados. Tente novamente.");
      }
    },
    fecharFormulario() {
      this.mostrarFormulario = false;
      this.mostrarMensagem = false;
      this.etapaFormulario = 1;
      this.cadastroCompleto = {
        telefone: '',
        cpf: '',
        dataNascimento: '',
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      };
    },
    abrirChat(polo) {
	  this.$router.push(`/chat/${polo.professor}`);
    },
    formatarTelefone() {
      let telefone = this.cadastroCompleto.telefone.replace(/\D/g, '');

      if (telefone.length > 11) {
        telefone = telefone.slice(0, 11);
      }

      if (telefone.length > 0) {
        telefone = '(' + telefone;
      }
      if (telefone.length > 3) {
        telefone = telefone.slice(0, 3) + ') ' + telefone.slice(3);
      }
      if (telefone.length > 10) {
        telefone = telefone.slice(0, 10) + '-' + telefone.slice(10);
      } else if (telefone.length > 9) {
        telefone = telefone.slice(0, 9) + '-' + telefone.slice(9);
      }

      this.cadastroCompleto.telefone = telefone;
    },
    formatarCPF() {
      let cpf = this.cadastroCompleto.cpf.replace(/\D/g, '');

      if (cpf.length > 11) {
        cpf = cpf.slice(0, 11);
      }

      let formatado = '';

      if (cpf.length > 0) {
        formatado = cpf.slice(0, 3);
      }
      if (cpf.length >= 4) {
        formatado = cpf.slice(0, 3) + '.' + cpf.slice(3, 6);
      }
      if (cpf.length >= 7) {
        formatado = cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6, 9);
      }
      if (cpf.length >= 10) {
        formatado = cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6, 9) + '-' + cpf.slice(9, 11);
      }

      this.cadastroCompleto.cpf = formatado;
    },
    formatarCEP() {
      let cep = this.cadastroCompleto.cep.replace(/\D/g, '');

      if (cep.length > 8) {
        cep = cep.slice(0, 8);
      }

      if (cep.length >= 6) {
        this.cadastroCompleto.cep = cep.slice(0, 5) + '-' + cep.slice(5);
      } else {
        this.cadastroCompleto.cep = cep;
      }
    }, 
    corrigirData() {
  const data = this.cadastroCompleto.dataNascimento;
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(data)) {
    this.cadastroCompleto.dataNascimento = "";
    return;
  }

  const ano = parseInt(data.split('-')[0]);
  if (ano > 9999) {
    this.cadastroCompleto.dataNascimento = "";
  }
  }
  },
  async mounted() {
    try {
      await this.carregarPolos();
    } catch (err) {
      console.error("Erro ao carregar polos:", err);
    }
  },
  template: `
    <div class="div-cards">
      <div class="cards">
        <div class="polo" v-for="(polo, index) in polos" :key="index">
          <div class="info">
            <h3>{{ polo.nome }} - Prof. {{ polo.professor }}</h3>
            <button class="marcar-btn" @click="marcarAula(polo)">Fazer Matrícula</button>
          </div>
          <div alt="chat com o diretor do polo" class="chat-icon" @click="abrirChat(polo)">
            <i class="fi fi-sr-comments"></i>
          </div>
        </div>
      </div>
    </div>

        <!-- Modal de mensagem -->
      <div v-if="mostrarMensagem && !mostrarFormulario" class="modal-overlay">
        <div class="modal-content-msg">
          <i id="icon-msg" class="fi fi-rr-info"></i>
          <p id="msg-modal">Quase lá!</p>
          <p>Antes de dar início à sua matrícula, precisamos só de algumas informações do seu perfil.</p>
          <div class="btns-msg">
            <button @click="mostrarMensagem = false">Fechar</button>
            <button id="btn-prosseguir" @click="mostrarFormulario = true">Prosseguir</button>
          </div>
        </div>
      </div>

    <!-- Modal do formulário -->
    <div class="modal-overlay" v-if="mostrarFormulario">
      <div class="modal-content wraper">
        <button class="fechar-modal" @click="fecharFormulario"><i class="fi fi-br-cross"></i></button>
        <div class="form-header largura-aumentada">
          <div class="titles">
            <h2 class="title-cadastro-modal">Finalizar Cadastro</h2>
          </div>
        </div>

        <form class="cadastro-form" @submit.prevent="etapaFormulario === 1 ? avancarEtapa() : finalizarCadastro()">
          <!-- Etapa 1 -->
          <div v-if="etapaFormulario === 1">
            <!-- Telefone -->
            <div class="input-box" :class="{ filled: cadastroCompleto.telefone }">
              <input type="tel" class="input-field" v-model="cadastroCompleto.telefone" @input="formatarTelefone" maxlength="15" required pattern="\\(\\d{2}\\) \\d{5}-\\d{4}" title="Telefone no formato (11) 91234-5678"/>
              <label class="label tel">Telefone</label>
              <i class="fi fi-rr-phone-call" id="icon-login"></i>
            </div>

            <!-- CPF -->
            <div class="input-box" :class="{ filled: cadastroCompleto.cpf }">
              <input type="text" class="input-field" v-model="cadastroCompleto.cpf" @input="formatarCPF" maxlength="14" required pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" title="CPF no formato 123.456.789-00"/>
              <label class="label">CPF</label>
              <i class="fi fi-rr-id-card-clip-alt" id="icon-login"></i>
            </div>

            <!-- Data de Nascimento -->
            <div class="input-box" :class="{ filled: cadastroCompleto.dataNascimento }">
              <input type="date" class="input-field-nasc" v-model="cadastroCompleto.dataNascimento" @change="corrigirData" required>
              <label class="label-nasc">Data de Nascimento</label>
            </div>

            <button class="btn-form" type="submit">Avançar</button>
          </div>

          <!-- Etapa 2 -->
          <div v-if="etapaFormulario === 2">
            <!-- Botão voltar -->
            <button class="voltar-modal" type="button" @click="etapaFormulario = 1">
              <i class="fi fi-rr-arrow-left"></i>
            </button>

            <!-- CEP -->
            <div class="input-box" :class="{ filled: cadastroCompleto.cep }">
              <input type="text" class="input-field" v-model="cadastroCompleto.cep" @input="formatarCEP" maxlength="9" required pattern="\\d{5}-\\d{3}" title="CEP no formato 12345-678"/>
              <label class="label">CEP</label>
              <i class="fi fi-rr-map-marker" id="icon-login"></i>
            </div>

            <!-- Rua -->
            <div class="input-box" :class="{ filled: cadastroCompleto.rua }">
              <input type="text" class="input-field" v-model="cadastroCompleto.rua" required>
              <label class="label">Rua</label>
              <i class="fi fi-rr-road" id="icon-login"></i>
            </div>

            <!-- Número -->
            <div class="input-box" :class="{ filled: cadastroCompleto.numero }">
              <input type="text" class="input-field" v-model="cadastroCompleto.numero" required>
              <label class="label num">Número</label>
              <i class="fi fi-sr-hastag" id="icon-login"></i>
            </div>

            <!-- Complemento -->
            <div class="input-box" :class="{ filled: cadastroCompleto.complemento }">
              <input type="text" class="input-field" v-model="cadastroCompleto.complemento" required>
              <label class="label comple">Complemento</label>
              <i class="fi fi-rr-apps-add" id="icon-login"></i>
            </div>

            <!-- Bairro -->
            <div class="input-box" :class="{ filled: cadastroCompleto.bairro }">
              <input type="text" class="input-field" v-model="cadastroCompleto.bairro" required>
              <label class="label bairro">Bairro</label>
              <i class="fi fi-rr-home" id="icon-login"></i>
            </div>

            <!-- Cidade -->
            <div class="input-box" :class="{ filled: cadastroCompleto.cidade }">
              <input type="text" class="input-field" v-model="cadastroCompleto.cidade" required>
              <label class="label cid">Cidade</label>
              <i class="fi fi-rr-building" id="icon-login"></i>
            </div>

            <!-- Estado -->
            <div class="input-box" :class="{ filled: cadastroCompleto.estado }">
              <input type="text" class="input-field" v-model="cadastroCompleto.estado" required>
              <label class="label est">Estado</label>
              <i class="fi fi-rr-globe" id="icon-login"></i>
            </div>

            <button class="btn-form" type="submit">Finalizar Cadastro</button>
          </div>
        </form>
      </div>
    </div>
  `,
};
