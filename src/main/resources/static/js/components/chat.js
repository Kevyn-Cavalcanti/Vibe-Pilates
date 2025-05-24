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
	window.scrollTo({
	  top: document.documentElement.scrollHeight / 2,
	  behavior: 'smooth'
	});
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
              this.$nextTick(() => this.scrollToBottom());
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
        this.scrollToBottom();
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
    scrollToBottom() {
		const ml = this.$refs.messageList;
		if (ml) ml.scrollTop = (ml.scrollHeight - ml.clientHeight) / 2;
    },
    sendMessage() {
		window.scrollTo({
			  top: document.documentElement.scrollHeight / 2,
			  behavior: 'smooth'
			});
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
      this.$nextTick(() => this.scrollToBottom());
      input.value = '';
      input.focus();
    }
  },
  mounted() {
    this.connect();
  },
  template: `
  <div class="image-background" style="height: 100vh; display: flex; justify-content: center; align-items: center;">
  <div id="chat-area" style="width: 750px; height: 700px; border-radius: 12px; display: flex; flex-direction: column; background: linear-gradient(to bottom, #f7f7f7, #ffffff); border: 1px solid #ccc; overflow: hidden;">

	  <div id="chat-header" style="display: flex; align-items: center; padding: 8px 12px; border-bottom: 1px solid #ccc; background: #f7f7f7;">
	    <button @click="closeChat" style="background: transparent; border: none; font-size: 22px; font-weight: bold; color: #999; cursor: pointer; margin-right: 16px;">
	      ✕
	    </button>
	    <h2 id="chat-with-name" style="margin: 0; font-size: 22px; color: #333;">{{ selectedUser }}</h2>
	  </div>
        <div id="message-list" ref="messageList" style="flex-grow: 1; padding: 30px; overflow-y: auto; background: linear-gradient(to bottom, #f9f9f9, #ffffff); font-size: 17px; color: #333; display: flex; flex-direction: column;">
		<div
		  v-for="(message, index) in displayedMessages"
		  :key="index"
		  :class="['message', message.sender === username ? 'sent' : 'received']"
		  :style="{
		    maxWidth: '80%',
		    margin: '12px 18px',
		    display: 'flex',
		    flexDirection: 'column',
		    fontSize: '16px',
		    wordWrap: 'break-word',
		    alignItems: message.sender === username ? 'flex-end' : 'flex-start',
		    alignSelf: message.sender === username ? 'flex-end' : 'flex-start'
		  }"
		>
		  <div class="sender-name" style="font-weight: bold; margin-bottom: 6px; font-size: 15px; color: #555;">
		    {{ message.sender === username ? 'Você' : message.sender }}
		  </div>
		  <div
		    class="bubble"
		    :style="{
		      padding: '16px 22px',
		      borderRadius: '18px',
		      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
		      backgroundColor: message.sender === username ? '#0A0A0A' : '#e0e0e0',
		      color: message.sender === username ? 'white' : '#222',
		      borderBottomRightRadius: message.sender === username ? '0' : '18px',
		      borderBottomLeftRadius: message.sender === username ? '18px' : '0'
		    }"
		  >
		    {{ message.content }}
		   </div>
          </div>
        </div>
        <div id="message-input" style="display: flex; padding: 18px 20px; border-top: 1px solid #ccc; background: linear-gradient(to right, #f0f0f0, #ffffff);">
          <input
            ref="messageInput"
            type="text"
            placeholder="Digite uma mensagem..."
            @keyup.enter="sendMessage"
            style="flex: 1; padding: 16px; border: 1px solid #ccc; border-radius: 6px; font-size: 17px; outline: none;"
          />
          <button @click="sendMessage" style="margin-left: 12px; padding: 16px 26px; background-color: #0A0A0A; border: none; color: white; border-radius: 6px; font-size: 17px; cursor: pointer; transition: background-color 0.2s ease;">
            Enviar
          </button>
        </div>
      </div>
    </div>
  `
};
