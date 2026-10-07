// === CHATBOT 2 LANGUES (FR/EN) ===
const schoolName = (document.querySelector('meta[property="og:site_name"]') || {}).content || 'Intégrale International School';

const metaValue = (n) => { const m = document.querySelector(`meta[name="school:${n}"]`); return m ? m.content : ''; };
const SCHOOL = {
  phone: metaValue('phone') || '+212 5 28 39 08 38',
  email: metaValue('email') || 'ecole.integrale.agadir@gmail.com',
  address: metaValue('address') || 'G04 Agadir bay founty, Agadir, Morocco 80000 (CC27+3G)',
  hours: metaValue('hours') || 'Lundi - Vendredi : 8h00 - 17h00'
};

const isInternational = schoolName.includes('International');

const chatbotHTML = `
  <button class="chatbot-toggle" id="chatbotToggle" aria-label="Ouvrir le chat"><svg class="chatbot-toggle-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" /></svg></button>
  <div class="chatbot-window" id="chatbotWindow">
    <div class="chatbot-header">
      <div class="chatbot-header-icon"><svg class="chatbot-header-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" /><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" /></svg></div>
      <div class="chatbot-header-text">
        <h4>Assistant ${schoolName}</h4>
        <span>En ligne • Réponses en FR / EN</span>
      </div>
      <button class="chatbot-close" id="chatbotClose" aria-label="Fermer">✕</button>
    </div>
    <div class="chatbot-messages" id="chatbotMessages">
      <div class="chatbot-msg bot"> Bonjour ! Bienvenue à ${schoolName}. Je suis là pour répondre à vos questions. / Hello! Welcome to ${schoolName}. How can I help you?</div>
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
  'bonjour': 'Bonjour ! Comment puis-je vous aider ? Voici ce que je peux vous dire :\n- Inscriptions\n- Programmes scolaires\n- Adresse et contact\n- Horaires\nTapez un mot-clé pour commencer !',
  'hello': `Hello! Welcome to ${schoolName}. I can help you with:\n- Registration\n- Academic programs\n- Address and contact\n- Hours\nType a keyword to start!`,
  'inscription': `Pour inscrire votre enfant, veuillez nous contacter ${SCHOOL.phone} ou ${SCHOOL.email} pour planifier une visite et retirer un dossier.`,
  'registration': `To register your child, please contact us ${SCHOOL.phone} or ${SCHOOL.email} to schedule a visit.`,
  'programme': isInternational
    ? 'Nous proposons un parcours complet de la Maternelle au Lycée :\nMaternelle (TPS-GS)\nPrimaire (CP-CM2)\nCollège (6e-3e)\nLycée (filières Sciences Maths, Sciences Expérimentales, Économie)'
    : 'Nous proposons un parcours complet de la Maternelle au Collège :\nMaternelle (TPS-GS)\nPrimaire (CP-CM2)\nCollège (6e-3e)',
  'program': isInternational
    ? 'We offer a complete path from Preschool to High School:\nPreschool (TPS-GS)\nPrimary (CP-CM2)\nMiddle School (6e-3e)\nHigh School (Sciences Maths, Sciences Expérimentales, Economics)'
    : 'We offer a complete path from Preschool to Middle School:\nPreschool (TPS-GS)\nPrimary (CP-CM2)\nMiddle School (6e-3e)',
  'adresse': `${SCHOOL.address}`,
  'address': `${SCHOOL.address}`,
  'horaire': `${SCHOOL.hours}`,
  'hours': `${SCHOOL.hours}`,
  'contact': `${SCHOOL.phone}\n${SCHOOL.email}`,
  'merci': 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. / You\'re welcome! Feel free to ask if you have more questions.',
  'thank': " You're welcome! Feel free to ask if you have more questions.",
  'au revoir': `Au revoir ! Bonne journée de la part de toute l'équipe de ${schoolName}.`,
  'goodbye': `Goodbye! Have a great day from all the ${schoolName} team.`,
};

function addMessage(text, isUser) {
  const div = document.createElement('div');
  div.className = `chatbot-msg ${isUser ? 'user': 'bot'}`;
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
  if (/\bfr\b|\bfranc/.test(t)) return 'Bonjour ! Tapez un mot-clé (inscription, programme, adresse, horaire, contact) pour obtenir des informations.';
  if (/\bengl|\bangl/.test(t)) return 'Hello! Type a keyword (registration, program, address, hours, contact) to get information.';
  return 'Désolé, je n\'ai pas compris. Essayez : bonjour, inscription, programme, adresse, horaire, contact. / Sorry, I didn\'t understand. Try: hello, registration, program, address, hours, contact.';
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
