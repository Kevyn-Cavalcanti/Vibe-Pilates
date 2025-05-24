export const Chat = {
  data() {
    return {
      stompClient: null,
      username: null,
      selectedUser: null,
      chatMap: {},
      displayedMessages: [],
      roomSubscriptions: {},
      professor: null
    };
  },
  created() {
    this.professor = this.$route.params.username;
    this.displayedMessages = [];
    // window.scrollTo removido
  },
  methods: {
    getChatKey(userA, userB) {
      return [userA, userB].sort().join('-');
    },
    connect() {
      this.username = localStorage.getItem("usuarioNome");

      const socket = new SockJS("/ws?username=" + encodeURIComponent(this.username));
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = false;

      this.stompClient.connect({ username: this.username }, () => {
        const roomId = this.getChatKey(this.username, this.professor);

        if (!this.roomSubscriptions[roomId]) {
          this.stompClient.subscribe("/topic/room/" + roomId, (msg) => {
            const message = JSON.parse(msg.body);
            if (message.sender === this.username) return;

            const chatKey = this.getChatKey(this.username, message.sender);
            if (!this.chatMap[chatKey]) {
              this.chatMap[chatKey] = [];
            }
            this.chatMap[chatKey].push(message);

            if (this.selectedUser === message.sender || this.selectedUser === message.recipient) {
              this.appendMessage({ sender: message.sender, content: message.content });
              // scrollToBottom removido
            }
          });
          this.roomSubscriptions[roomId] = true;
        }

        this.stompClient.send("/app/chat.addUser", {}, JSON.stringify({ sender: this.username }));
        this.openChatWith(this.professor);
      });
    },
    openChatWith(user) {
      this.selectedUser = user;
      this.clearMessages();

      const chatKey = this.getChatKey(this.username, user);
      if (this.chatMap[chatKey]) {
        this.chatMap[chatKey].forEach(m => {
          this.appendMessage({ sender: m.sender, content: m.content });
        });
      }

      this.$nextTick(() => {
        // scrollToBottom removido
        this.$refs.messageInput.focus();
      });
    },
    closeChat() {
      this.selectedUser = null;
      this.$router.push('/agendar');
    },
    clearMessages() {
      this.displayedMessages = [];
    },
    appendMessage(messageObj) {
      this.displayedMessages.push(messageObj);
    },
    // scrollToBottom removido completamente
    sendMessage() {
      const input = this.$refs.messageInput;
      const content = input.value.trim();
      if (!content || !this.selectedUser) return;

      const msg = {
        sender: this.username,
        recipient: this.selectedUser,
        content: content,
        type: "CHAT"
      };

      this.stompClient.send("/app/chat.privateMessage", {}, JSON.stringify(msg));

      const chatKey = this.getChatKey(this.username, this.selectedUser);
      if (!this.chatMap[chatKey]) {
        this.chatMap[chatKey] = [];
      }
      this.chatMap[chatKey].push(msg);

      this.appendMessage({ sender: this.username, content: content });
      // scrollToBottom removido
      input.value = '';
      input.focus();
    }
  },
  mounted() {
    this.connect();
  },
  template: `
  <div class="chat-wrapper">
    <div id="chat-area">
      <div id="chat-header">
        <button @click="closeChat">✕</button>
        <h2 id="chat-with-name">{{ selectedUser }}</h2>
      </div>
      <div id="message-list" ref="messageList">
        <div
          v-for="(message, index) in displayedMessages"
          :key="index"
          :class="['message', message.sender === username ? 'sent' : 'received']"
        >
          <div class="sender-name">
            {{ message.sender === username ? 'Você' : message.sender }}
          </div>
          <div class="bubble">
            {{ message.content }}
          </div>
        </div>
      </div>
      <div id="message-input">
        <input
          ref="messageInput"
          type="text"
          placeholder="Digite uma mensagem..."
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">Enviar</button>
      </div>
    </div>
  </div>
`

};
