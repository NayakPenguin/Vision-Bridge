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
  const [singleFile, setSingleFile] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // Define selectedImage here
  let recognition; // Declare recognition outside the function to reuse it
  
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setSingleFile(file);
  };

  const userSpeaks = async () => {
    if (micListing) {
      try {
        recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          setUserVoiceInput(speechResult);
          recognition.stop(); // Stop the recognition process
          setMicListing(false);
        };

        recognition.onend = () => {
          // Optionally, you can perform additional actions when the recognition ends
          setMicListing(false);
          console.log('Speech recognition ended.');
        };

        setMicListing(true);
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
      //const userSpeechResult = await getUserSpeech();
      const userSpeechResult=      
      await userSpeaks();// Use userSpeaks to capture mic input
      
      const isFirstTime = true;
      const inputText = isFirstTime ? defaultInputText : userSpeechResult;
      
  
      const result = await model.generateContent([inputText, ...imageParts]);
      const text = result.response.text();
  
      // Convert text to speech and get the audio blob
      const audioBlob = await textToSpeech(text);
  
      setLoading(false);
      setMicListing(false);
      setData(audioBlob);
    } catch (error) {
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error: ", error);
    }
  };
  
  const getUserSpeech = async () => {
    return new Promise((resolve) => {
      if (micListing) {
        if (!recognition) {
          recognition = new window.webkitSpeechRecognition();
          recognition.lang = "en-US";

          recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            if (event.results[0].isFinal) {
              recognition.stop();
              recognition = null; // Reset recognition instance for the next use
              setMicListing(false); // Stop micListing after the first input
            }
            resolve(speechResult);
          };

          recognition.onend = () => {
            recognition.stop();
          };

          recognition.start();
        }
      } else {
        resolve("");
      }
    });
  };

  const textToSpeech = async (text) => {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
  
      // Create an audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
      // Handle the onend event
      utterance.onend = async () => {
        try {
          // Wait for a short duration to allow the AudioContext to settle
          await new Promise(resolve => setTimeout(resolve, 500));
  
          // Create an empty buffer to prevent decodeAudioData error
          const buffer = audioContext.createBuffer(1, 1, 22050);
  
          // Resolve with the buffer
          resolve(buffer);
        } catch (error) {
          // Reject if any error occurs
          reject(error);
        }
      };
  
      // Handle the onerror event
      utterance.onerror = (error) => {
        setMicListing(false); // Handle micListing update on error as well
        reject(error);
      };
  
      // Start the speech synthesis
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
    } if (typeof data === 'string') {
      // Handle text response
      return <div>Response: {data}</div>;
    } /*else {
      // Handle other types of responses
      return <div>Unknown response type</div>;
    }*/
  }

  return (
    <>
      <div className="card">
        {/*<input
          type="text"
          style={{ width: 400 }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
  /> */}
        {" | "}
        {/*<button disabled={loading} onClick={() => fetchDataFromGeminiProAPI()}>
          {loading ? "Loading..." : "Get PRO data"}
</button> */}
        {interactiveMode && (
  <button
    disabled={loading}
    onClick={() => fetchDataFromGeminiProVisionAPI()}
  >
    {loading ? "Loading..." : "Get Gemini Response"}
  </button>
)}
        <hr />
        {renderData()}
      </div>
    </>
  );
}

export default Gemini;
