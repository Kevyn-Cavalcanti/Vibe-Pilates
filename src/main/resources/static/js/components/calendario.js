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
    planoRecorrenciaParaSemanas(recorrencia) {
      switch ((recorrencia || '').toLowerCase()) {
        case 'mensal': return 4;
        case 'bimestral': return 8;
        case 'trimestral': return 12;
        case 'semestral': return 24;
        case 'anual': return 48;
        default: return 4; // padrão mensal
      }
    },

    async buscaMatricula() {
      try {
        const response = await fetch(`http://localhost:8080/matricula/usuario/${encodeURIComponent(this.usuarioNome)}`);
        const data = await response.json();

        console.log('Resposta da API (matrícula):', data);

        // Mapear as aulas selecionadas, incluindo a duração em semanas
        const aulasComRecorrencia = data.flatMap(matricula => {
          const duracaoSemanas = this.planoRecorrenciaParaSemanas(matricula.plano?.recorrencia);
          return (matricula.aulasSelecionadas || []).map(aula => ({
            ...aula,
            duracaoSemanas
          }));
        });

        // Filtrar aulas inválidas
        const aulasFiltradas = aulasComRecorrencia.filter(aula => {
          if (!aula) {
            console.warn('Aula inválida (null/undefined)', aula);
            return false;
          }
          if (!aula.diaSemana) {
            console.warn('Falta diaSemana na aula:', aula);
            return false;
          }
          if (!aula.horario) {
            console.warn('Falta horário na aula:', aula);
            return false;
          }
          if (!aula.horario.horaInicio) {
            console.warn('Falta horaInicio no horário:', aula.horario);
            return false;
          }
          if (!aula.horario.horaFim) {
            console.warn('Falta horaFim no horário:', aula.horario);
            return false;
          }
          return true;
        });

        console.log('Aulas válidas depois do filtro:', aulasFiltradas);

        this.reservas = aulasFiltradas;
      } catch (error) {
        console.error('Erro ao buscar matrícula:', error);
      }
    },

    renderCalendar(reservas) {
      const calendarEl = document.getElementById('calendar');
      calendarEl.innerHTML = '';

      const diaMap = {
        'Domingo': 0, 'Segunda-feira': 1, 'Terça-feira': 2,
        'Quarta-feira': 3, 'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6
      };

      const hoje = new Date();

      const events = [];

      reservas.forEach(aula => {
        const targetDia = diaMap[aula.diaSemana];
        if (targetDia === undefined) return;

        const diff = (targetDia - hoje.getDay() + 7) % 7;
        const dataBase = new Date(hoje);
        dataBase.setDate(hoje.getDate() + diff);

        const semanas = aula.duracaoSemanas || 4;

        for (let i = 0; i < semanas; i++) {
          const dataEvento = new Date(dataBase);
          dataEvento.setDate(dataBase.getDate() + (7 * i));

          const dataString = dataEvento.toISOString().split('T')[0];

          events.push({
            title: `${aula.modalidade} - ${aula.horario.professor}`,
            start: `${dataString}T${aula.horario.horaInicio}`,
            end: `${dataString}T${aula.horario.horaFim}`,
            backgroundColor: "#28a745",
            extendedProps: {
              descricao: aula.modalidade,
              professor: aula.horario.professor,
              dia: aula.diaSemana,
              horario: aula.horario
            }
          });
        }
      });

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
        initialDate: hoje,
        navLinks: true,
        selectable: true,
        dayMaxEvents: true,
        editable: false,
        businessHours: true,
        events: events,
        eventClick: (info) => this.mostrarDetalhesReserva(info)
      });

      calendar.render();
    },

    mostrarDetalhesReserva(info) {
      const reserva = info.event.extendedProps;
      this.reservaselecionado = {
        descricao: reserva.descricao,
        professor: reserva.professor,
        dia: reserva.dia,
        horarioInicio: reserva.horario.horaInicio,
        horarioFim: reserva.horario.horaFim
      };
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
    await this.buscaMatricula();
    this.renderCalendar(this.reservas);
  },

  template: `
    <div id="container-calendario">

      <h2 class="title-calendario">Aulas Agendadas para o usuário: {{ usuarioNome }}</h2>

      <div id="calendar"></div>

      <div v-if="reservaselecionado" class="modal">
        <div class="modal-content">
          <h3>Detalhes da reserva</h3>
          <p><strong>Modalidade:</strong> {{ reservaselecionado.descricao }}</p>
          <p><strong>Professor:</strong> {{ reservaselecionado.professor }}</p>
          <p><strong>Dia da Semana:</strong> {{ reservaselecionado.dia }}</p>
          <p><strong>Horário:</strong> {{ reservaselecionado.horarioInicio }} - {{ reservaselecionado.horarioFim }}</p>
          <button @click="fecharModal">Fechar</button>
        </div>
      </div>
    </div>
  `
};
