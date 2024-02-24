import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import BluetoothAudioIcon from "@material-ui/icons/BluetoothAudio";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import ArrowBackIosSharpIcon from "@material-ui/icons/ArrowBackIosSharp";
import Webcam from "react-webcam";
import axios from 'axios';
import MicIcon from '@material-ui/icons/Mic';
import { currency_test, object_localize } from "../features/currency_detection/api";
import camera from "../Camera";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini component
import Gemini from "./Gemini";


const VR = () => {
  const [currentModel, setCurrentModel] = useState("Select Model");
  const [result, setResult] = useState("No feedback!");
  const [openDropDown, setOpenDropDown] = useState(false);
  const [webcamRef, setWebcamRef] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Define selectedImage here
  const [singleFile, setSingleFile] = useState({});
  const [processingImage, setProcessingImage] = useState(false); // New state variable
  const [currentMode, setCurrentMode] = useState("Offline Mode");
  const [userVoiceInput, setUserVoiceInput] = useState("Please describe the image in short, as if you are a guide for a blind person.");
  const [micListing, setMicListing] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [data, setData] = useState(null); // Add this line
  const [audioFeedback, setAudioFeedback] = useState(null); // New state for audio feedback


  const API_KEY = 'AIzaSyAFQOOj4wAE-sTdcL6Uba1PCiblgOgKJyU';

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user", // or 'environment' for rear camera
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (webcamRef && webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
    });
  }, [webcamRef]);
  useEffect(() => {
    uploadSingleFile();
  }, [singleFile]);


  const ApplyAi = async (currentModel, formData) => {
    if (currentModel == "Currency Detector") {
      const response = await currency_test(formData);
      console.log("response : ", response);
      console.log(response.data.result);
      setResult(
        "The note infront you is a " + response.data.result + " rupee note."
      );
    }
    // } else if (currentModel == "Vehicle Detector") {
    //   const response = await vehicle_classify(formData);
    //   console.log("response : ", response);
    //   console.log(response.data.result);
    //   setResult("The vehicle infront you is a " + response.data.result);
    // }
    else if (currentModel == "Standard Mode") {
      const response = await object_localize(formData);
      console.log(response);

      setResult("The objects infront you are " + response.data.data);
    }
  };

 
  const ApplyGemini = async (userInput, imageData) => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
      // Generate content from Gemini Pro model
      const result = await model.generateContent(userInput);
      const text = result.response.text();
  
      // Set the result state
      setResult(text);
  
      // Convert text to speech and get the audio blob
      const audioBlob = await textToSpeech(text);
  
      // Set the audio feedback state
      setAudioFeedback(audioBlob);
  
      // Play the audio using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioBlob.arrayBuffer();
      audioContext.decodeAudioData(audioBuffer, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      });
  
    } catch (error) {
      setResult("Error processing with Gemini");
      console.error("ApplyGemini error: ", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  // Function to convert text to speech and return audio blob
 // Function to convert text to speech and return audio blob


  

  console.log("result : ", result);

  const uploadSingleFile = async () => {
    const formData = new FormData();
    console.log(singleFile.name);
    formData.append("file", singleFile);
    
    if(currentMode == "Offline Mode"){
      await ApplyAi(currentModel, formData);
    }
    else {
      await ApplyGemini(userVoiceInput, formData);
    }

    // const response = await currency_test(formData);
    // console.log("response : ", response);
    // console.log(response.data.result);
    // setResult(
    //   "The note infront you is a " + response.data.result + " rupee note."
    // );
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setSingleFile(file);
  };

  {
    /*const captureImage = async () => {
    console.log('Capture image function called');

    if (!processingImage) {
      setProcessingImage(true);

      let imageSrc;

      // Check if the image is from the webcam or selected from file input
      if (selectedImage) {
        // Image is from file input
        imageSrc = selectedImage;
        console.log('From file input');
      } else if (webcamRef && webcamRef.current) {
        // Image is from the webcam
        const screenshot = webcamRef.current.getScreenshot();
        imageSrc = screenshot;
        console.log('From webcam');
      }

      if (imageSrc) {
        setSelectedImage(imageSrc);
        setResult('The note in front of you is being displayed.');

        // Use createObjectURL to set the background image directly
        const imageUrl = URL.createObjectURL(new Blob([await fetch(imageSrc).then((res) => res.blob())]));
        document.getElementById('simulator-screen').style.backgroundImage = `url(${imageUrl})`;
        document.getElementById('simulator-screen').style.backgroundSize = 'cover';
        document.getElementById('simulator-screen').style.backgroundRepeat = 'no-repeat';

        const formData = new FormData();
        formData.append('file', imageUrl, 'webcam-snapshot.png');

        try {
          const response = await currency_test(formData);
          setResult(`The note in front of you is a ${response.data.result} rupee note.`);
        } catch (error) {
          setResult('Error processing the image.');
        } finally {
          setProcessingImage(false);

          // Re-enable webcam (if it was disabled)
          if (webcamRef && webcamRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
              webcamRef.current.srcObject = stream;
              webcamRef.current.play(); // Play the video stream
            });
          }
        }
      }
    }
  }; */
  }
  const captureImage = async () => {
    console.log("Capture image function called");

    if (!processingImage) {
      setProcessingImage(true);

      try {
        const screenshot = webcamRef.getScreenshot();
        setSelectedImage(screenshot);
        // setResult("The note in front of you is being displayed.");

        // Use createObjectURL to set the background image directly
        const imageUrl = URL.createObjectURL(
          new Blob([await fetch(screenshot).then((res) => res.blob())])
        );
        document.getElementById(
          "simulator-screen"
        ).style.backgroundImage = `url(${imageUrl})`;
        document.getElementById("simulator-screen").style.backgroundSize =
          "cover";
        document.getElementById("simulator-screen").style.backgroundRepeat =
          "no-repeat";

        const formData = new FormData();
        const blob = await fetch(screenshot).then((res) => res.blob());
        formData.append("file", blob);

        try {
          // const response = await currency_test(formData);
          // setResult(
          //   `The note in front of you is a ${response.data.result} rupee note.`
          // );

          if(currentMode == "Offline Mode"){
            await ApplyAi(currentModel, formData);
          }
          else {
            await ApplyGemini(userVoiceInput, formData);
          }

        } catch (error) {
          setResult("Error processing the image.");
        } finally {
          setProcessingImage(false);
        }
      } catch (error) {
        console.error("Error capturing image:", error);
        setProcessingImage(false);
      }
    }
  };

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
  
  const handleChangeMode = () => {
    if(currentMode == "Offline Mode") setCurrentMode("Interactive Mode");
    else setCurrentMode("Offline Mode");
  }

  return (
    <GrandContainer>
      <Simulator>
        <div className="back-btn">
          <ArrowBackIosSharpIcon style={{ fontSize: "1rem", fill: "white" }} />
          <div className="text">End Simulator</div>
        </div>

        <div className="vr-shape">
        {currentMode === "Interactive Mode" && (
        <Gemini
          inputText={userVoiceInput}
          onData={(geminiData) => {
            setResult(geminiData);
            setData(geminiData); // Set Gemini data to the state
            // Speak the Gemini data
            speakText(geminiData);
          }}
        />
      )}
          <div className="screen" id="simulator-screen">
            {selectedImage && !processingImage && (
              <div>
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}
            {!processingImage && (
              <Webcam
                ref={setWebcamRef}
                videoConstraints={videoConstraints}
                onClick={captureImage}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: "20px",
                }}
              />
            )}
          </div>
          <div className="vr-btns">
            {
              currentMode != "Offline Mode" ? 
              <div className="mic-btn" onClick={userSpeaks} style={{ background: micListing ? 'orange' : '#ffffff54' }}>
                <MicIcon style={{ fontSize: "1.5rem", fill: "black" }} />
              </div> : null
            }
            <PowerSettingsNewIcon
              style={{ fontSize: "1.5rem", fill: "white" }}
            />
            <div className="small-circle clr-switch-on"></div>
            <BluetoothAudioIcon style={{ fontSize: "1.5rem", fill: "white" }} />
            <div className="btn" onClick={() => setOpenDropDown(!openDropDown)}>
              <div className="clicker">{currentModel}</div>
              {openDropDown ? (
                <div className="drop-down">
                  <div
                    className="item"
                    onClick={() => setCurrentModel("Standard Mode")}
                  >
                    Standard Mode
                  </div>
                  <div
                    className="item"
                    onClick={() => setCurrentModel("Home Mode")}
                  >
                    Home Mode
                  </div>
                  <div
                    className="item"
                    onClick={() => setCurrentModel("Currency Detector")}
                  >
                    Currency Detector
                  </div>
                  <div
                    className="item"
                    onClick={() => setCurrentModel("Human Recognition")}
                  >
                    Human Recognition
                  </div>
                  <div
                    className="item"
                    onClick={() => setCurrentModel("Road Safty")}
                  >
                    Road Safty
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="btn">
              <input
                type="file"
                id="image-upload"
                onChange={(e) => {
                  handleImageUpload(e);
                  setResult(null);
                }}
                style={{ display: "none" }}
              />
              <label htmlFor="image-upload">Select Image</label>
            </div>
            <div className="btn-mid" onClick={captureImage}>
              <DoubleArrowIcon style={{ fontSize: "2.5rem", fill: "black" }} />
            </div>
            <div className="btn-long">
              <div className="small-circle clr-switch-on"></div>
              <div className="small-circle"></div>
              <div className="small-circle"></div>
              <div className="highlighted" onClick={() => handleChangeMode()}>
                {currentMode}
              </div>
              <div className="normal">Running</div>
              <VolumeUpIcon style={{ fontSize: "1.5rem", fill: "white" }} />
            </div>
          </div>
        </div>
        <div className="earphone">
          <img
            src="https://www.reviews.org/app/uploads/2022/01/71lj9Fdeq0L._AC_SL1500_-removebg-preview-275x300.png"
            alt=""
          />
        </div>
        <div className="earphone-message">
          <div className="heading">Audio Feedback</div>
          <div className="feedback">
  {audioFeedback == null ? (
    <>No feedback!</>
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
        {/*<Webcam
          ref={setWebcamRef}
          videoConstraints={videoConstraints}
          onClick={captureImage}
          style={{ display: 'block', width: '100%', height: '100%' }}
            /> */}
      </Simulator>
    </GrandContainer>
  );
};

export default VR;

const GrandContainer = styled.div`
  min-height: 100vh;
`;

const Simulator = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #171616;
  display: grid;
  place-items: center;

  .back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    padding: 10px;

    .text {
      color: white;
      margin-left: 10px;
      font-weight: 300;
      font-size: 0.85rem;
      letter-spacing: 0.07rem;
    }
  }

  .vr-shape {
    height: 500px;
    width: 1000px;
    position: relative;
    border-radius: 30px;
    border: 1px solid #ccc1c1;
    background-color: #272424;
    display: grid;
    place-items: center;
    padding: 10px;

    .ai-button{
      position: absolute;
      background-color: orange;
      border-radius: 100px;
      top: -12.5px;
      right: -10px;
      font-size: 0.75rem;
      padding: 2.5px 15px;
      padding-right: 35px;

      display: flex;
      align-items: center;
      
      b{
        font-size: 0.85rem;
        font-weight: 500;
        margin-left: 5px;
      }

      img{
        height: 35px;
        position: absolute;
        top: -5px;
        right: -5px;
      }
    }

    .screen {
      height: 450px;
      width: 950px;
      background-color: #d1cec8;
      border-radius: 20px;
      overflow-y: hidden;
      overflow-x: scroll;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
      }
    }

    .screen::-webkit-scrollbar {
      display: none;
    }

    .vr-btns {
      position: absolute;
      bottom: 35px;
      left: 50px;
      height: 50px;
      width: 900px;
      background: #262424;
      border-radius: 20px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: rgb(40 35 35) 0px 0px 50px 0px;
      backdrop-filter: blur(8px);

      .mic-btn{
        position: absolute;
        left: calc(495px - 17.5px);
        bottom: 70px;
        height: 35px;
        width: 35px;
        border-radius: 100%;
        background-color: #ffffff54;
        /* border: 1px solid #f8e2e2; */
        box-shadow: rgb(150 142 142) 0px 0px 15px 0px;
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .btn {
        padding: 5px 10px;
        border-radius: 10px;
        width: 140px;
        background-color: #5f615c57;
        color: white;
        text-align: center;
        font-size: 0.75rem;
        position: relative;

        label {
          color: white;
        }

        .clicker {
          color: white;
          cursor: pointer;
        }

        .drop-down {
          width: 150%;
          position: absolute;
          bottom: 50px;
          left: -25%;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          align-items: center;

          .item {
            padding: 5px 10px;
            border-radius: 10px;
            cursor: pointer;
            background-color: #ffffff;
            color: #000;
            width: 80%;
            margin: 2.5px;
            text-align: center;
            font-size: 0.75rem;
            border: 1px solid transparent;

            &:hover {
              border: 1px solid black;
            }
          }
        }
      }

      .btn-flex {
        width: 140px;
      }

      .btn-mid {
        height: 65px;
        width: 65px;
        border-radius: 100%;
        background-color: #fff;
        border: 1px solid #f8e2e2;
        box-shadow: rgb(150 142 142) 0px 0px 15px 0px;
        display: grid;
        place-items: center;
      }

      .small-circle {
        height: 15px;
        width: 15px;
        background-color: #5f615b;
        margin-right: 10px;
        border-radius: 50%;
      }

      .clr-switch-on {
        background-color: yellowgreen;
      }

      .btn-long {
        border-radius: 10px;
        width: 335px;
        text-align: center;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .highlighted {
          background-color: yellowgreen;
          padding: 2.5px 5px;
          font-weight: 600;
          margin-left: 15px;
          margin-right: 15px;
          /* width: 120px; */
          flex: 1;
          cursor: pointer;
        }

        .normal {
          color: yellowgreen;
          margin-right: 15px;
        }
      }
    }
  }

  .earphone {
    position: absolute;
    height: 115px;
    width: 115px;
    bottom: 60px;
    right: 60px;
    background-color: #302e2e;
    border-radius: 100%;
    padding: 10px;

    img {
      width: 100%;
      scale: 1.25;
    }
  }

  .earphone-message {
    position: absolute;
    bottom: 30px;
    right: 210px;
    height: 80px;
    width: 320px;
    border-radius: 10px;
    background-color: #262424;
    padding: 10px;

    .heading {
      font-size: 0.9rem;
      font-weight: 600;
      color: yellowgreen;
    }

    .feedback {
      font-size: 0.75rem;
      color: white;
      font-weight: 200;
    }

    .speak-btn {
      padding: 5px 10px;
      border-radius: 10px;
      background-color: #5f615c57;
      color: white;
      text-align: center;
      font-size: 0.7rem;
      position: relative;
      margin-left: 5px;
      cursor: pointer;
      border: none;
    }

    .arrow {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 0 10px 20px;
      border-color: transparent transparent transparent #262424;
      position: absolute;
      bottom: calc(50% - 10px);
      right: -20px;
    }
  }
`;
