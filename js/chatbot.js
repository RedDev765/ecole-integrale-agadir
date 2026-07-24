// === CHATBOT 2 LANGUES (FR/EN) ===
const chatbotHTML = `
  <button class="chatbot-toggle" id="chatbotToggle" aria-label="Ouvrir le chat">
    ðŸ’¬
    <span class="chatbot-notif">1</span>
  </button>
  <div class="chatbot-window" id="chatbotWindow">
    <div class="chatbot-header">
      <div class="chatbot-header-icon">ðŸŽ“</div>
      <div class="chatbot-header-text">
        <h4>Assistant Ã‰cole IntÃ©grale</h4>
        <span>En ligne â€¢ðŸ‡«ðŸ‡· FR / ðŸ‡¬ðŸ‡§ EN</span>
      </div>
      <button class="chatbot-close" id="chatbotClose" aria-label="Fermer">âœ•</button>
    </div>
    <div class="chatbot-messages" id="chatbotMessages">
      <div class="chatbot-msg bot">ðŸ‘‹ Bonjour ! Bienvenue Ã  l'Ã‰cole IntÃ©grale. Je suis lÃ  pour rÃ©pondre Ã  vos questions. / Hello! Welcome to Ã‰cole IntÃ©grale. How can I help you?</div>
    </div>
    <div class="chatbot-input-area">
      <input type="text" id="chatbotInput" placeholder="Ã‰crivez votre message..." autocomplete="off">
      <button id="chatbotSend" aria-label="Envoyer">âž¤</button>
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
const notif = toggle.querySelector('.chatbot-notif');

toggle.addEventListener('click', () => {
  chatbox.classList.toggle('open');
  notif.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
  chatbox.classList.remove('open');
});

const responses = {
  'bonjour': 'Bonjour ! Comment puis-je vous aider ? Voici ce que je peux vous dire :\n- ðŸ“‹ Inscriptions\n- ðŸ“š Programmes scolaires\n- ðŸ“ Adresse et contact\n- ðŸ• Horaires\nTapez un mot-clÃ© pour commencer !',
  'hello': 'Hello! Welcome to Ã‰cole IntÃ©grale. I can help you with:\n- ðŸ“‹ Registration\n- ðŸ“š Academic programs\n- ðŸ“ Address and contact\n- ðŸ• Hours\nType a keyword to start!',
  'inscription': 'Pour inscrire votre enfant, veuillez nous contacter ðŸ“ž 0528 39 08 38 ou ðŸ“§ ecole.integrale.agadir@gmail.com pour planifier une visite et retirer un dossier.',
  'registration': 'To register your child, please contact us ðŸ“ž 0528 39 08 38 or ðŸ“§ ecole.integrale.agadir@gmail.com to schedule a visit.',
  'programme': 'Nous proposons un parcours complet de la Maternelle au LycÃ©e :\nðŸ§¸ Maternelle (TPS-GS)\nðŸ“š Primaire (CP-CM2)\nðŸ”¬ CollÃ¨ge (6e-3e)\nðŸŽ“ LycÃ©e (Sciences Maths, Sciences ExpÃ©, Ã‰conomie)',
  'program': 'We offer a complete path from Preschool to High School:\nðŸ§¸ Preschool (TPS-GS)\nðŸ“š Primary (CP-CM2)\nðŸ”¬ Middle School (6e-3e)\nðŸŽ“ High School (Sciences, Economics)',
  'adresse': 'ðŸ“ CC27+3G, Agadir 80000 - Quartier Agadir Bay, Maroc',
  'address': 'ðŸ“ CC27+3G, Agadir 80000 - Agadir Bay district, Morocco',
  'horaire': 'ðŸ• Lundi - Vendredi : 8h00 - 17h00',
  'hours': 'ðŸ• Monday - Friday: 8:00 AM - 5:00 PM',
  'contact': 'ðŸ“ž 0528 39 08 38\nðŸ“§ ecole.integrale.agadir@gmail.com',
  'merci': 'ðŸ™ Avec plaisir ! N\'hÃ©sitez pas si vous avez d\'autres questions. / You\'re welcome! Feel free to ask if you have more questions.',
  'thank': "ðŸ™ You're welcome! Feel free to ask if you have more questions.",
  'au revoir': 'ðŸ‘‹ Au revoir ! Bonne journÃ©e de la part de toute l\'Ã©quipe de l\'Ã‰cole IntÃ©grale.',
  'goodbye': 'ðŸ‘‹ Goodbye! Have a great day from all the Ã‰cole IntÃ©grale team.',
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
  if (/fr|franc/.test(t)) return 'ðŸ‡«ðŸ‡· Bonjour ! Tapez un mot-clÃ© (inscription, programme, adresse, horaire, contact) pour obtenir des informations.';
  if (/en|angl/.test(t)) return 'ðŸ‡¬ðŸ‡§ Hello! Type a keyword (registration, program, address, hours, contact) to get information.';
  return 'ðŸ¤– DÃ©solÃ©, je n\'ai pas compris. Essayez : bonjour, inscription, programme, adresse, horaire, contact. / Sorry, I didn\'t understand. Try: hello, registration, program, address, hours, contact.';
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
