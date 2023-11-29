const switchButton = document.querySelector(".switch-button input");

switchButton.addEventListener("click", () => {
    if (switchButton.checked) {
        // Enable dark mode
        document.body.classList.add("dark-mode");
        ReproduzirVoz("Olá! Eu sou a Sexta-feira! Sua assistente pessoal! Como posso te ajudar?");
    } else {
        // Disable dark mode
        document.body.classList.remove("dark-mode");
        ReproduzirVoz("Olá! Eu sou a Sexta-feira! Sua assistente pessoal! Como posso te ajudar");
    }
});

//Criamos o metodo para consultar a API do OpenAI
const ConsultarOpenAI = async(pergunta) => {

    //Aqui vamos configurar o cabecalho da requisicao
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer ****************************");
    myHeaders.append("Cookie", "__cf_bm=N0tLTpCU.Ta5ZACsISIDvaxahfMY8b8idmO7BZwq3Y4-1701178734-0-AUZdCJWdBj2gsT95QC325KNfiM4mB9aB5v6d7SUR+WchWgZU7RDZpCYLVj3a1tR1GaVNy42y6LqVLMUt6fBiWZw=; _cfuvid=gEch27_.4BmQvZ2HH4aOzE5uCjqw7JKnND5dabfJRKc-1701178734650-0-604800000");

    //Aqui vamos configurar o corpo da requisição
    var raw = JSON.stringify({
    "model": "ft:gpt-3.5-turbo-0613:zeros-e-um::8PrTlJrT",
    "messages": [
        {
        "role": "system",
        "content": "Jarvis é um chatbot pontual e muito simpático que responde tudo utilizando girias dos anos 90"
        },
        {
        "role": "user",
        "content": pergunta
        }
    ],
    "temperature": 0.2
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    //Aqui vamos executar a requisição
    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then(response => response.json())
    .then(result => ReproduzirVoz(result.choices[0].message.content))
    .catch(error => console.log('error', error));
}



const CapturaVoz = () => {
    var startButton = document.getElementById('capturar');
    var resultElement = document.getElementById('prompt');
 
    var recognition = new webkitSpeechRecognition();
 
    recognition.lang = window.navigator.language;
    recognition.interimResults = true;
    recognition.continuous = true;
 
    startButton.addEventListener('click', () => { recognition.start(); });
 
    recognition.addEventListener('result', (event) => {
        const result = event.results[event.results.length - 1][0].transcript;
        if (result.includes('E ai, sexta?!')) {
            recognition.start();
        }
        resultElement.value = result;
    });
 
    recognition.addEventListener('end', () => {
        const textoCapturado = resultElement.value;
        ConsultarOpenAI(textoCapturado);
    })
 }
 
 

CapturaVoz();

const ReproduzirVoz = (response) => {
 
    var myHeaders = new Headers();
    myHeaders.append("Ocp-Apim-Subscription-Key", "********************************");
    myHeaders.append("Content-Type", "application/ssml+xml");
    myHeaders.append("X-Microsoft-OutputFormat", "audio-16khz-128kbitrate-mono-mp3");
    myHeaders.append("User-Agent", "curl");

    var raw = "<speak version='1.0' xml:lang='pt-BR'>\n    <voice xml:lang='pt-BR' xml:gender='Female' name='pt-BR-BrendaNeural'>\n        Oi, eu sou a Sexta-feira! Sua assistente virtual\n    </voice>\n</speak>";

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

const endpoint  = 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1';
    fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.arrayBuffer();
            } else {
                throw new Error(`Falha na requisição: ${response.status} - ${response.statusText}`);
            }
        })
        .then(data => {
            const blob = new Blob([data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);

            const audioElement = new Audio(audioUrl);
            audioElement.play();
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

