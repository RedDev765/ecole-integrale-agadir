// === CHATBOT 2 LANGUES (FR/EN) ===
const chatbotHTML = `
  <button class="chatbot-toggle" id="chatbotToggle" aria-label="Ouvrir le chat">
    💬
  </button>
  <div class="chatbot-window" id="chatbotWindow">
    <div class="chatbot-header">
      <div class="chatbot-header-icon">🎓</div>
      <div class="chatbot-header-text">
        <h4>Assistant École Intégrale</h4>
        <span>En ligne •🇫🇷 FR / 🇬🇧 EN</span>
      </div>
      <button class="chatbot-close" id="chatbotClose" aria-label="Fermer">✕</button>
    </div>
    <div class="chatbot-messages" id="chatbotMessages">
      <div class="chatbot-msg bot">👋 Bonjour ! Bienvenue à l'École Intégrale. Je suis là pour répondre à vos questions. / Hello! Welcome to École Intégrale. How can I help you?</div>
    </div>
    <div class="chatbot-input-area">
      <input type="text" id="chatbotInput" placeholder="Écrivez votre message..." autocomplete="off">
      <button id="chatbotSend" aria-label="Envoyer">➤</button>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', chatbotHTML);

const toggle = document.getElementById('chatbotToggle');
const chatbox = document.getElementById('chatbotWindow');
const closeBtn = document.getElementById('chatbotClose');
const messages = document.getElementById('chatbotMessages');
const input = document.getElementById('chatbotInput');
const sendBtn = document.getElementById('chatbotSend');

toggle.addEventListener('click', () => {
  chatbox.classList.toggle('open');
});

closeBtn.addEventListener('click', () => {
  chatbox.classList.remove('open');
});

const responses = {
  'bonjour': 'Bonjour ! Comment puis-je vous aider ? Voici ce que je peux vous dire :\n- 📋 Inscriptions\n- 📚 Programmes scolaires\n- 📍 Adresse et contact\n- 🕐 Horaires\nTapez un mot-clé pour commencer !',
  'hello': 'Hello! Welcome to École Intégrale. I can help you with:\n- 📋 Registration\n- 📚 Academic programs\n- 📍 Address and contact\n- 🕐 Hours\nType a keyword to start!',
  'inscription': 'Pour inscrire votre enfant, veuillez nous contacter 📞 0528 39 08 38 ou 📧 ecole.integrale.agadir@gmail.com pour planifier une visite et retirer un dossier.',
  'registration': 'To register your child, please contact us 📞 0528 39 08 38 or 📧 ecole.integrale.agadir@gmail.com to schedule a visit.',
  'programme': 'Nous proposons un parcours complet de la Maternelle au Lycée :\n🧸 Maternelle (TPS-GS)\n📚 Primaire (CP-CM2)\n🔬 Collège (6e-3e)\n🎓 Lycée (Sciences Maths, Sciences Expé, Économie)',
  'program': 'We offer a complete path from Preschool to High School:\n🧸 Preschool (TPS-GS)\n📚 Primary (CP-CM2)\n🔬 Middle School (6e-3e)\n🎓 High School (Sciences, Economics)',
  'adresse': '📍 CC27+3G, Agadir 80000 - Quartier Agadir Bay, Maroc',
  'address': '📍 CC27+3G, Agadir 80000 - Agadir Bay district, Morocco',
  'horaire': '🕐 Lundi - Vendredi : 8h00 - 17h00',
  'hours': '🕐 Monday - Friday: 8:00 AM - 5:00 PM',
  'contact': '📞 0528 39 08 38\n📧 ecole.integrale.agadir@gmail.com',
  'merci': '🙏 Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. / You\'re welcome! Feel free to ask if you have more questions.',
  'thank': "🙏 You're welcome! Feel free to ask if you have more questions.",
  'au revoir': '👋 Au revoir ! Bonne journée de la part de toute l\'équipe de l\'École Intégrale.',
  'goodbye': '👋 Goodbye! Have a great day from all the École Intégrale team.',
};

function addMessage(text, isUser) {
  const div = document.createElement('div');
  div.className = `chatbot-msg ${isUser ? 'user' : 'bot'}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function getResponse(inputText) {
  const t = inputText.toLowerCase().trim();
  const keys = Object.keys(responses);
  for (const key of keys) {
    if (t.includes(key)) return responses[key];
  }
  if (/\bfr\b|\bfranc/.test(t)) return '🇫🇷 Bonjour ! Tapez un mot-clé (inscription, programme, adresse, horaire, contact) pour obtenir des informations.';
  if (/\bengl|\bangl/.test(t)) return '🇬🇧 Hello! Type a keyword (registration, program, address, hours, contact) to get information.';
  return '🤖 Désolé, je n\'ai pas compris. Essayez : bonjour, inscription, programme, adresse, horaire, contact. / Sorry, I didn\'t understand. Try: hello, registration, program, address, hours, contact.';
}

function handleSend() {
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = '';
  setTimeout(() => {
    addMessage(getResponse(text), false);
  }, 400);
}

sendBtn.addEventListener('click', handleSend);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSend();
});
