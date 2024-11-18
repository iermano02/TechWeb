document.getElementById('submitSignup').addEventListener('click', (event) => {
    event.preventDefault(); // Prevenire il comportamento di invio del modulo
  
    // Ottieni i valori dei campi di input
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Verifica che tutti i campi siano compilati
    if (username && email && password) {
      // Esegui le operazioni necessarie (salvataggio, invio a un server, etc.)
      alert(`Registration successful for ${username}!`);
  
      // Puoi inviare i dati del modulo a un server, esempio con fetch o salvarli in localStorage:
      // localStorage.setItem('username', username);
  
      // Redirigi l'utente alla pagina principale
      window.location.href = "index.html";  // Ritorna alla pagina principale
    } else {
      alert('Please fill in all fields.');
    }
  });
  