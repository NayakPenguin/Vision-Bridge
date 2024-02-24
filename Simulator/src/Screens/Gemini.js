import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

function Gemini() {
  const API_KEY = 'AIzaSyAFQOOj4wAE-sTdcL6Uba1PCiblgOgKJyU';
  const [data, setData] = useState(undefined);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [micListing, setMicListing] = useState(false);
  const [userVoiceInput, setUserVoiceInput] = useState("Please describe the image in short, as if you are a guide for a blind person.");
  const [audioFeedback, setAudioFeedback] = useState(null); // New state for audio feedback
  const [interactiveMode, setInteractiveMode] = useState(true);


  const userSpeaks = async () => {
    if (micListing) {
      try {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
  
        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          setUserVoiceInput(speechResult);
          setMicListing(false);
          recognition.stop(); // Stop the recognition process
        };
  
        recognition.onend = () => {
          // Optionally, you can perform additional actions when the recognition ends
          console.log('Speech recognition ended.');
        };
  
        recognition.start();
      } catch (error) {
        console.error('Speech recognition not supported:', error);
        setMicListing(false);
      }
    } else {
      setMicListing(true);
    }
  };
  
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.onend = () => {
        setAudioFeedback(null); // Reset audioFeedback after speech is finished
      };
      window.speechSynthesis.speak(speech);
    } else {
      console.log("Speech synthesis not supported.");
    }
  };
  async function fetchDataFromGeminiProAPI() {
    try {
      // ONLY TEXT
      if (!inputText) {
        alert("Please enter text!");
        return;
      }
      setLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(inputText);
      const text = result.response.text();
      setLoading(false);
      setData(text);
    } catch (error) {
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error: ", error);
    }
  }

  const fetchDataFromGeminiProVisionAPI = async () => {
    try {
      setLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
      const fileInputEl = document.querySelector("input[type=file]");
      const imageParts = await Promise.all(
        [...fileInputEl.files].map(fileToGenerativePart)
      );
  
      // Adding default inputText for every image
      const defaultInputText =
        "Describe the image as if you are a guide for a blind person";
      const userSpeechResult = await getUserSpeech();
  
      const isFirstTime = true;
      const inputText = isFirstTime ? defaultInputText : userSpeechResult;
  
      const result = await model.generateContent([inputText, ...imageParts]);
      const text = result.response.text();
  
      // Convert text to speech and get the audio blob
      const audioBlob = await textToSpeech(text);
  
      setLoading(false);
      setData(audioBlob);
    } catch (error) {
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error: ", error);
    }
  };
  
  // Function to get user speech input
  const getUserSpeech = async () => {
    return new Promise((resolve) => {
      if (micListing) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-US";
  
        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          resolve(speechResult);
        };
  
        recognition.onend = () => {
          recognition.stop();
        };
  
        recognition.start();
      } else {
        resolve("");
      }
    });
  };
  
  // Function to convert text to speech and return audio blob
  const textToSpeech = async (text) => {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        const audioBlob = new Blob([new Uint8Array(0)], { type: "audio/wav" });
        resolve(audioBlob);
      };
      utterance.onerror = (error) => {
        reject(error);
      };
      window.speechSynthesis.speak(utterance);
    });
  };
  

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
  
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }
  function renderData() {
    if (data instanceof Blob) {
      // Handle audio feedback
      return (
        <div className="feedback">
          {audioFeedback == null ? (
            <>Gemini Response Loading ....</>
          ) : (
            <>
              <audio controls>
                <source src={URL.createObjectURL(audioFeedback)} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
              <button
                className="speak-btn"
                onClick={() => speakText(audioFeedback)}
              >
                Speak
              </button>
            </>
          )}
        </div>
      );
    } else if (typeof data === 'string') {
      // Handle text response
      return <div>Response: {data}</div>;
    } else {
      // Handle other types of responses
      return <div>Unknown response type</div>;
    }
  }
  
  return (
    <>
      <h1>Vite + React | Google AI Gemini Integration</h1>
      <div className="card">
        <input type="file" />
        <input
          type="text"
          style={{ width: 400 }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        {" | "}
        <button disabled={loading} onClick={() => fetchDataFromGeminiProAPI()}>
          {loading ? "Loading..." : "Get PRO data"}
        </button>
        <button
          disabled={loading}
          onClick={() => fetchDataFromGeminiProVisionAPI()}
        >
          {loading ? "Loading..." : "Get PRO Vision data"}
        </button>
        <hr />
        {renderData()}
        {!interactiveMode && (
        <div className="earphone-message">
          <div className="heading">Audio Feedback</div>
          <div className="feedback">
            {audioFeedback == null ? (
              <>Gemini Response Loading ....</>
            ) : (
              <>
                <audio controls>
                  <source src={URL.createObjectURL(audioFeedback)} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                <button
                  className="speak-btn"
                  onClick={() => speakText(audioFeedback)}
                >
                  Speak
                </button>
              </>
            )}
          </div>
          <div className="arrow"></div>
        </div>
      )}
            </div>
    </>
  );
};
  

export default Gemini;
