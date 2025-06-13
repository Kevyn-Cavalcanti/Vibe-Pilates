export const Calendario = {
  props: ['usuarioNome'],
  data() {
    return {
      reservas: [],
      filtroNome: '',
      usuarios: [],
      reservaselecionado: null,
    };
  },
  methods: {
    async buscaReserva() {
      try {
        const response = await fetch(`http://localhost:3000/matricula/usuario/${encodeURIComponent(this.usuarioNome)}`);
        const data = await response.json();
        console.log('API Response:', data);
        this.reservas = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
      }
    },

    buscarReservas() {
      const filtradas = this.filtroNome
        ? this.reservas.filter(reserva => reserva.id_usuario === this.filtroNome)
        : this.reservas;
      this.renderCalendar(filtradas);
    },

    renderCalendar(reservas) {
      const calendarEl = document.getElementById('calendar');
      calendarEl.innerHTML = '';

      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        nowIndicator: true,
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'pt-br',
        buttonText: {
          prev: "<<",
          today: "Hoje",
          next: ">>",
          month: "Mês",
          week: "Semana",
          day: "Dia"
        },
        initialDate: new Date(),
        navLinks: true,
        selectable: true,
        dayMaxEvents: true,
        editable: false,
        businessHours: true,
        events: reservas.map(reserva => ({
          title: reserva.descricao || 'Reserva',
          start: `${reserva.data_inicial}T${reserva.horario_inicial}`,
          end: `${reserva.data_final}T${reserva.horario_final}`,
          backgroundColor: "#FF5733",
          extendedProps: {
            reserva: reserva
          }
        })),
        eventClick: (info) => this.mostrarDetalhesReserva(info)
      });

      calendar.render();
    },

    mostrarDetalhesReserva(info) {
      const reserva = info.event.extendedProps.reserva;
      this.reservaselecionado = reserva;
    },

    fecharModal() {
      this.reservaselecionado = null;
    },

    carregarUsuarios() {
      const nomes = this.reservas.map(r => r.id_usuario);
      this.usuarios = [...new Set(nomes)];
    }
  },

  async mounted() {
    await this.buscaReserva();
    this.carregarUsuarios();
    this.renderCalendar(this.reservas);
  },

  template: `
    <div>
      <select v-model="filtroNome" @change="buscarReservas">
        <option value="">Todos Usuários</option>
        <option v-for="usuario in usuarios" :key="usuario" :value="usuario">{{ usuario }}</option>
      </select>

      <button @click="$router.push({ name: 'Criar Reserva' })" class="criar-reserva-btn">
        Criar Reserva
      </button>

      <div id="calendar"></div>

      <div v-if="reservaselecionado" class="modal">
        <div class="modal-content">
          <h3>Detalhes da reserva</h3>
          <p><strong>ID:</strong> {{ reservaselecionado.id_reserva }}</p>
          <p><strong>Descrição:</strong> {{ reservaselecionado.descricao }}</p>
          <p><strong>Data Inicial:</strong> {{ reservaselecionado.data_inicial }}</p>
          <p><strong>Data Final:</strong> {{ reservaselecionado.data_final }}</p>
          <p><strong>Horário Inicial:</strong> {{ reservaselecionado.horario_inicial }}</p>
          <p><strong>Horário Final:</strong> {{ reservaselecionado.horario_final }}</p>
          <button @click="fecharModal">Fechar</button>
        </div>
      </div>
    </div>
  `
};
