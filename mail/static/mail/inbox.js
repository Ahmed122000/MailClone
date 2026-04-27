document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector("#send-button").addEventListener('click', sendMail)
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function sendMail(event){
  event.preventDefault();

  let recipients = document.querySelector("#compose-recipients").value;
  let subject = document.querySelector("#compose-subject").value;
  let body = document.querySelector("#compose-body").value;
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients, 
      subject: subject,
      body: body,  
    })
  })
  .then(response => response.json())
  .then(respone=> {
    console.log(respone); 
    load_mailbox("sent")
  })
  .catch(error => console.error(`Error sending this mail: ${error}`));
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  get_mails(mailbox)
}

function get_mails(mailBox){
  console.log(`/emails/${mailBox}`)
  fetch(`/emails/${mailBox}`)
  .then(response => response.json())
  .then(emails => displayEmails(emails))
  .catch(error => console.error(`error fetching mails:${error}`))
}


function displayEmails(emails){
  console.log("displaying emails")
  let emailArea = document.querySelector("#emails-view")
  emailArea.innerHTML = ''

  if(!emails || emails.length === 0){
    emailArea.innerHTML = '<p class = "no-emails"> No Emails Found. </p>'
    return 
  }

  emails.forEach(email => {
    console.log(email)
    console.log(`sender: ${email.sender}`)
    let emailDiv = document.createElement("div");
    emailDiv.className = 'mail'
    emailDiv.dataset.id = email.id 
    
    if(email.read){
      emailDiv.classList.add("read")
    }
    emailDiv.innerHTML = `
      <div class="mail-sender"> ${email.sender || email.from || "UnKnown"} </div>
      <div class="mail-subject"> ${email.subject || "(No Subject)"} </div>
      <div class="mail-timestamp"> ${email.timestamp ||email.date} </div>
    `
    emailArea.appendChild(emailDiv)
  });

}

