const content = document.getElementById("content");
const button = document.getElementById("btn");
const voice = document.getElementById("voice")
window.addEventListener("load", () => {
  greeting();
});
function speak(text) {
  // const text= content.value
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "hi-IN";
  speech.rate = 0.9;
  speech.pitch = 1;
  speech.volume = 0.9;
  speech.onend = () => {
    console.log("Finished speaking");
  };
//   window.speechSynthesis.speak(speech);
 window.speechSynthesis.cancel(); 
 window.speechSynthesis.speak(speech);
}

//   textToSpeech('Hello, world!');
// function speakText(text) {
//     responsiveVoice.speak(text, "Hindi Female", {
//       rate: 0.9,
//       pitch: 1,
//       volume: 0.9,
//       onend: function() {
//         console.log("Finished speaking");
//       }
//     });
//   }

function greeting() {
  const date = new Date();
  const hour = date.getHours();
  let greeting;
  if (hour >= 0 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
   speak(greeting);
}
let speechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();
recognition.onresult = (event) => {
    console.log(event);
  const currentIndex = event.resultIndex;
  let transcript = event.results[currentIndex][0].transcript;
  content.innerText = transcript;
  takeCommand(transcript.toLowerCase());
};

button.addEventListener("click", () => {
  recognition.start();
   button.style.display="none"
   voice.style.display="block"
});
async function takeCommand(message) {
       button.style.display="flex"
   voice.style.display="none"
  if (message.includes("hello") || message.includes("hey")) {
    speak("Hello, How can I assist you today");
  } else if (message.includes("hi")) {
    speak("Hello, How can I assist you today");
  } else if(message.includes("who are you")){
    speak("I am a virtual assistant developed by alfaiz. I can help you with various tasks such as greeting, weather, news, and more");
  }else{
      // If the user's message doesn't match any predefined commands, send it to OpenAI
      const openaiResponse =  await getCohereResponse(message);   
      speak(openaiResponse);
  }
}

async function getCohereResponse(userQuery) {
    // console.log(userQuery);
    
    const apiKey = '921cjdkN1DZAgP4Ags56bFQouWR00Bvkc0i6JT1I'; 
    const url = 'https://api.cohere.ai/v1/generate';
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "command-medium-nightly",  // Use a valid model name from Cohere's API
        prompt: userQuery,
        max_tokens: 100,
        temperature: 0.7
      })
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`API error: ${response.status} ${errorData.message}`);
      return "Sorry, I encountered an issue.";
    }

    const data = await response.json();
    // console.log(data);
    
    console.log(data.generations[0].text);
    
    // Return generated response if available
    return data.generations && data.generations[0]
      ? data.generations[0].text.trim()
      : "Sorry, I didn't understand that.";
}
