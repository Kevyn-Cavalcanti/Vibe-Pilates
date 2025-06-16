export const Agendar = {
  data() {
    return {
      polos: [],
      carregandoPolos: true, 
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
      this.carregandoPolos = true;
      try {
        const resposta = await fetch('/polo');
        if (!resposta.ok) {
          throw new Error(`Erro ao buscar polos: ${resposta.statusText}`);
        }
        
        const polosData = await resposta.json();

        if (!Array.isArray(polosData) || polosData.length === 0) {
          this.polos = [];
          return;
        }

        const polosComProfessor = await Promise.all(polosData.map(async (polo) => {
          if (polo.idUsuario) {
            try {
              const respostaUsuario = await fetch(`/usuario/${polo.idUsuario}`);
              if (respostaUsuario.ok) {
                const usuario = await respostaUsuario.json();
                return { ...polo, professor: usuario.nome };
              } else {
                console.warn(`Usuário com ID ${polo.idUsuario} não encontrado para o polo ${polo.nome}`);
                return { ...polo, professor: 'Não Atribuído' };
              }
            } catch (error) {
              console.error(`Erro ao buscar usuário ${polo.idUsuario} para o polo ${polo.nome}:`, error);
              return { ...polo, professor: 'Erro ao Carregar' };
            }
          }
          return { ...polo, professor: 'N/A' };
        }));

        this.polos = polosComProfessor;
      } catch (erro) {
        console.error("Erro ao carregar polos:", erro);
        this.polos = [];
      } finally {
        this.carregandoPolos = false;
      }
    },
    async marcarAula(polo) {
      const id = localStorage.getItem("usuarioId");
      if (!id) {
        console.error("ID do usuário não encontrado no localStorage.");
        return;
      }

      try {
        const resposta = await fetch(`/usuario/${id}`);
        if (!resposta.ok) {
          throw new Error(`Erro ao buscar dados do usuário: ${resposta.statusText}`);
        }
        const dados = await resposta.json();

        if (dados.endereco == null) {
          this.mostrarMensagem = true;
          this.etapaFormulario = 1;
        } else {
          console.log('Usuário já possui endereço, prosseguindo com a matrícula.');
          this.$router.push(`/matricula/${polo.idPolo}`);
        }
      } catch (erro) {
        console.error("Erro ao verificar dados do usuário para matrícula:", erro);
        alert("❌ Ocorreu um erro ao verificar seus dados. Tente novamente.");
      }
    },
    avancarEtapa() {
      this.etapaFormulario = 2;
    },
    async finalizarCadastro() {
      this.mostrarMensagem = false;
      const id = localStorage.getItem("usuarioId");
      if (!id) {
        console.error("ID do usuário não encontrado no localStorage ao finalizar cadastro.");
        alert("❌ Erro: ID do usuário não disponível. Por favor, faça login novamente.");
        return;
      }

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
          const errorText = await resposta.text();
          throw new Error(`Erro ao atualizar os dados do usuário: ${errorText}`);
        }

        alert("Cadastro finalizado com sucesso!");
        this.mostrarFormulario = false;
      } catch (erro) {
        console.error(erro);
        alert(`❌ Ocorreu um erro ao salvar os dados: ${erro.message}. Tente novamente.`);
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
      if (polo.professor && polo.professor !== 'N/A' && polo.professor !== 'Erro ao Carregar') {
        this.$router.push(`/chat/${polo.professor}`); 
      } else {
        alert("Não é possível abrir o chat para este polo no momento.");
      }
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
    await this.carregarPolos();
  },
  template: `
    <div class="div-cards">
      <div v-if="carregandoPolos" class="loading-message">
        <p>Carregando polos...</p>
      </div>
      <div v-else-if="polos.length > 0" class="cards">
        <div class="polo" v-for="(polo, index) in polos" :key="index">
          <div class="info">
            <h3>{{ polo.nome }} - Recepção, {{ polo.professor }}</h3>
            <button class="marcar-btn" @click="marcarAula(polo)">Fazer Matrícula</button>
          </div>
          <div alt="chat com o diretor do polo" class="chat-icon" @click="abrirChat(polo)">
            <i class="fi fi-sr-comments"></i>
          </div>
        </div>
      </div>
      <div v-else class="nenhum-polo">
        <p>Nenhum polo disponível no momento. Por favor, volte mais tarde.</p>
      </div>
    </div>

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

    <div class="modal-overlay" v-if="mostrarFormulario">
      <div class="modal-content wraper">
        <button class="fechar-modal" @click="fecharFormulario"><i class="fi fi-br-cross"></i></button>
        <div class="form-header largura-aumentada">
          <div class="titles">
            <h2 class="title-cadastro-modal">Finalizar Cadastro</h2>
          </div>
        </div>

        <form class="cadastro-form" @submit.prevent="etapaFormulario === 1 ? avancarEtapa() : finalizarCadastro()">
          <div v-if="etapaFormulario === 1">
            <div class="input-box" :class="{ filled: cadastroCompleto.telefone }">
              <input type="tel" class="input-field" v-model="cadastroCompleto.telefone" @input="formatarTelefone" maxlength="15" required pattern="\\(\\d{2}\\) \\d{5}-\\d{4}" title="Telefone no formato (11) 91234-5678"/>
              <label class="label tel">Telefone</label>
              <i class="fi fi-rr-phone-call" id="icon-login"></i>
            </div>

            <div class="input-box" :class="{ filled: cadastroCompleto.cpf }">
              <input type="text" class="input-field" v-model="cadastroCompleto.cpf" @input="formatarCPF" maxlength="14" required pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" title="CPF no formato 123.456.789-00"/>
              <label class="label">CPF</label>
              <i class="fi fi-rr-id-card-clip-alt" id="icon-login"></i>
            </div>

            <div class="input-box" :class="{ filled: cadastroCompleto.dataNascimento }">
              <input type="date" class="input-field-nasc" v-model="cadastroCompleto.dataNascimento" @change="corrigirData" required>
              <label class="label-nasc">Data de Nascimento</label>
            </div>

            <button class="btn-form" type="submit">Avançar</button>
          </div>

          <div v-if="etapaFormulario === 2">
            <button class="voltar-modal" type="button" @click="etapaFormulario = 1">
              <i class="fi fi-rr-arrow-left"></i>
            </button>

            <div class="input-box" :class="{ filled: cadastroCompleto.cep }">
              <input type="text" class="input-field" v-model="cadastroCompleto.cep" @input="formatarCEP" maxlength="9" required pattern="\\d{5}-\\d{3}" title="CEP no formato 12345-678"/>
              <label class="label">CEP</label>
              <i class="fi fi-rr-map-marker" id="icon-login"></i>
            </div>

            <div class="input-box" :class="{ filled: cadastroCompleto.rua }">
              <input type="text" class="input-field" v-model="cadastroCompleto.rua" required>
              <label class="label">Rua</label>
              <i class="fi fi-rr-road" id="icon-login"></i>
            </div>

            <div class="input-box" :class="{ filled: cadastroCompleto.numero }">
              <input type="text" class="input-field" v-model="cadastroCompleto.numero" required>
              <label class="label num">Número</label>
              <i class="fi fi-sr-hastag" id="icon-login"></i>
            </div>

            <div class="input-box" :class="{ filled: cadastroCompleto.complemento }">
              <input type="text" class="input-field" v-model="cadastroCompleto.complemento" required>
              <label class="label comple">Complemento</label>
              <i class="fi fi-rr-apps-add" id="icon-login"></i>
            </div>

            <div class="input-box" :class="{ filled: cadastroCompleto.bairro }">
              <input type="text" class="input-field" v-model="cadastroCompleto.bairro" required>
              <label class="label bairro">Bairro</label>
              <i class="fi fi-rr-home" id="icon-login"></i>
            </div>

            <div class="input-box" :class="{ filled: cadastroCompleto.cidade }">
              <input type="text" class="input-field" v-model="cadastroCompleto.cidade" required>
              <label class="label cid">Cidade</label>
              <i class="fi fi-rr-building" id="icon-login"></i>
            </div>

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
