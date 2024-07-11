 const chatInput = document.querySelector("#chat-input");
 const sendButton = document.querySelector("#send-btn");
 const chatContainer = document.querySelector(".chat-container");
 const themeButton = document.querySelector("#theme-btn");
 const deleteButton = document.querySelector("#delete-btn");
 let userText = null;
//  const API_KEY="AIzaSyB9xaxIG_v6izo13N_N_hn9jbfNeEuGxVc";
const loadDataFromLocalstorage=()=>{
   chatContainer.innerHTML=localStorage.getItem("all-chats");
   const defaultText=`<div class="default-text">
   <h1>BU ka GPT </h1>
   <p>Start a conversation and explore the power of AI.<br>Your chat history will be dispalyed here.</p>
   </div>`
   chatContainer.innerHTML=localStorage.getItem("all-chats") || defaultText;
}
loadDataFromLocalstorage();
 const createElement=(html,className)=>{
   const chatDiv = document.createElement("div");
   chatDiv.classList.add("chat",className);
   chatDiv.innerHTML=html;
   return chatDiv;
 }
const getchatResponse= async (incomingchatDiv)=>{
   const API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyB9xaxIG_v6izo13N_N_hn9jbfNeEuGxVc";
   const pElement = document.createElement("p");


   // const requestOptions={
   //    method: "POST",
   //    headers: {
   //       "Content-Type": "application/json",
   //       "Authorization": `Bearer ${API_KEY}`
   //    },
   //    body: JSON.stringify({
   //       prompt: userText,
   //       model: "gpt-3.5-turbo",

   //  messages: [{"role": "system", "content": prompt}],
   //      max_tokens:100
   //    })
   // }
   try{
      fetch(API_URL,{
      method: "POST",
      body: JSON.stringify({
         contents: [{parts: [{text: userText}]}],
      }),
   }).then((response)=>response.json()).then((data)=>{
       pElement.textContent=data.candidates[0].content.parts[0].text.trim();
   })}catch(error){
     console.log(error);
   }
   incomingchatDiv.querySelector(".typing-animation").remove();
   incomingchatDiv.querySelector(".chat-details").appendChild(pElement);
   localStorage.setItem("all-chat",chatContainer.innerHTML);   
   
//    try{
//      const response = await (await fetch(API_URL, requestOptions)).json();
//      console.log(response);
//    }catch(error){
//       console.log(error);
//    }
}
const copyResponse=(copyBtn)=>{
   const responseTextElement = copyBtn.parentElement.querySelector("p"); 
   navigator.clipboard.writeText(responseTextElement.textContent);
   copyBtn.textContent="done";
   setTimeout(()=>copyBtn.textContent="content_copy",1000);
}
themeButton.addEventListener("click",()=>{
   document.body.classList.toggle("light-mode");
   themeButton.innerText=document.body.classList.contains("light-mode")?"dark_mode":"light_mode";
  
});
deleteButton.addEventListener("click",()=>{
   if(confirm("Are you sure you want to delete chat?")){
     localStorage.removeItem("all-chats");
     loadDataFromLocalstorage();
   }
})
 const showTypingAnimation=()=>{
   const html = ` <div class="chat-content">
   <div class="chat-details">
       <img src="images/chatbot.jpg" alt="chatbot-img">
      <div class="typing-animation">
       <div class="typing-dot" style="--delay:0.2s"></div>
       <div class="typing-dot" style="--delay:0.3s"></div>
       <div class="typing-dot" style="--delay:0.4s"></div>
      </div>
   </div>
   <span onclick="copyResponse(this)" class="material-symbols-outlined">content_copy</span>
</div>`;
const incomingchatDiv=createElement(html,"incoming");
chatContainer.appendChild(incomingchatDiv);
getchatResponse(incomingchatDiv);
 }
 const handleOutgoingChat = ()=>{
    userText = chatInput.value.trim();
    const html = ` <div class="chat-content">
    <div class="chat-details">
        <img src="images/user.jpg" alt="user-img">
        <p>${userText}</p>
    </div>
</div>`;
const outgoingchatDiv=createElement(html,"outgoing");
document.querySelector(".default-text")?.remove();
chatContainer.appendChild(outgoingchatDiv);
setTimeout(showTypingAnimation,500);
}

 sendButton.addEventListener("click",handleOutgoingChat);