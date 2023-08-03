import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import BluetoothAudioIcon from '@material-ui/icons/BluetoothAudio';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';
import { currency_test } from "../features/currency_detection/api";


const VR = () => {
    const [currentModel, setCurrentModel] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [result, setResult] = useState("No feedback!"); 
    
    const [singleFile, setSingleFile] = useState({});

    // TextToSpeech.talk("Hello Beautiful World!");

    useEffect(() => {
        uploadSingleFile();
    }, [singleFile]);
    
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setSingleFile(file);
    };

    const uploadSingleFile = async () => {
        const formData = new FormData();
        console.log(singleFile.name);
        formData.append("file", singleFile);

        const response = await currency_test(formData);
        console.log("response : ", response);
        console.log(response.data.result);
        setResult("The note infront you is a " + response.data.result + " rupee note.");

    };
    
    console.log("result : ", result);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            console.log('Speech synthesis not supported.');
        }
    };

    return (
        <GrandContainer>
            <Simulator>
                <div className="back-btn">
                    <ArrowBackIosSharpIcon style={{ "fontSize": "1rem", "fill": "white" }} />
                    <div className="text">End Simulator</div>
                </div>
                <div className="vr-shape">
                    <div className="screen">
                        {/* <img className='add-layer' src="https://eu-images.contentstack.com/v3/assets/blt6b0f74e5591baa03/blt4138e585008d15dd/631967d86519941c4d578e63/sanjose.jpg?width=850&auto=webp&quality=95&format=jpg&disable=upscale" alt="" /> */}
                        {selectedImage && (
                            <div>
                            <img src={selectedImage} alt="Selected" />
                            </div>
                        )}
                    </div>
                    <div className="vr-btns">
                        <PowerSettingsNewIcon style={{ "fontSize": "1.5rem", "fill": "white" }} />
                        <div className="small-circle clr-switch-on"></div>
                        <BluetoothAudioIcon style={{ "fontSize": "1.5rem", "fill": "white" }} />
                        {/* <div className="btn">Start</div> */}
                        <div className="btn">
                            Select Model
                            <div className="drop-down">
                                <div className="item">Standard Mode</div>
                                <div className="item">Home Mode</div>
                                <div className="item">Currency Detector</div>
                                <div className="item">Human Recognition</div>
                                <div className="item">Road Safty</div>
                            </div>
                        </div>
                        <div className="btn">
                            <input type="file" id="image-upload" onChange={(e) => {handleImageUpload(e); setResult(null);}} style={{ display: 'none' }}/>
                            {/* <input type="file" id="image-upload" onChange={handleImageUpload} style={{ display: 'none' }} */}
                            <label htmlFor="image-upload">
                                Select Image
                            </label>
                            {/* {selectedImage && (
                                <div>
                                <img src={selectedImage} alt="Selected" />
                                </div>
                            )} */}
                        </div>
                        <div className="btn-mid">
                            <DoubleArrowIcon style={{ "fontSize": "2.5rem", "fill": "black" }} />
                        </div>
                        <div className="btn-long">
                            <div className="small-circle clr-switch-on"></div>
                            <div className="small-circle"></div>
                            <div className="small-circle"></div>
                            <div className="highlighted">TEST MODE</div>
                            <div className="normal">involved overview</div>
                            <VolumeUpIcon style={{ "fontSize": "1.5rem", "fill": "white" }} />
                        </div>
                    </div>
                </div>
                <div className="earphone">
                    <img src="https://www.reviews.org/app/uploads/2022/01/71lj9Fdeq0L._AC_SL1500_-removebg-preview-275x300.png" alt="" />
                </div>
                <div className="earphone-message">
                    <div className="heading">Audio Feedback</div>
                    <div className="feedback">
                        {
                            result == null ? (<>No feedback!</>) : (<>{result}</>)
                        }
                        <button className='speak-btn' onClick={() => speakText(result)}>Speak</button>
                    </div>
                    <div className="arrow"></div>
                </div>
            </Simulator>

        </GrandContainer>
    )
}

export default VR

const GrandContainer = styled.div`
    min-height: 100vh;
`

const Simulator = styled.div`
    height: 100vh;
    width: 100vw;
    background-color: #171616;
    display: grid;
    place-items: center;

    .back-btn{
        position: absolute; 
        top: 20px;
        left: 20px;
        display: flex;
        align-items: center;

        /* background-color: #302e2e; */
        padding: 10px;

        .text{
            color: white;
            margin-left: 10px;
            font-weight: 300;
            font-size: 0.85rem;
            letter-spacing: 0.07rem;
        }

    }

    .vr-shape{
        height: 500px;
        width: 1000px;
        position: relative;
        /* background-color: black; */
        border-radius: 30px;
        border: 1px solid #ccc1c1;
        background-color: #272424;

        display: grid;
        place-items: center;

        padding: 10px;
        

        .screen{
            height: 450px;
            width: 950px;
            background-color: #d1cec8;
            border-radius: 20px;
            
            overflow-y: hidden;
            overflow-x: scroll;
            
            display: flex;
            align-items: center;
            justify-content: center;

            img{
                /* height: 100%; */
                width: 100%;
                /* margin-left: -50%; */
            }

            .add-layer{
                background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
            }
        }

        .screen::-webkit-scrollbar {
            display: none;
        }

        .vr-btns{
            position: absolute;
            bottom: 35px;
            left: 75px;
            height: 50px;
            width: 850px;
            background: #262424;
            border-radius: 20px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            box-shadow: rgb(40 35 35) 0px 0px 50px 0px;
            backdrop-filter: blur(8px);

            .btn{
                padding: 5px 10px;
                /* border: 1px solid #f8e2e2; */
                border-radius: 10px;
                width: 115px;
                background-color: #5f615c57;
                color: white;
                text-align: center;
                font-size: 0.75rem;
                position: relative;

                label{
                    color: white;
                }

                .drop-down{
                    width: 150%;
                    position: absolute;
                    bottom: 50px;
                    left: -25%;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    align-items: center;
                    
                    .item{
                        padding: 5px 10px;
                        /* border: 1px solid #f8e2e2; */
                        border-radius: 10px;
                        background-color: #ffffff;
                        color: #000;
                        width: 100%;
                        margin: 2.5px;
                        text-align: center;
                        font-size: 0.75rem;
                    }
                }
            }

            .btn-mid{
                height: 65px;
                width: 65px;
                border-radius: 100%;
                background-color: #fff;
                border: 1px solid #f8e2e2;
                box-shadow: rgb(150 142 142) 0px 0px 15px 0px;

                display: grid;
                place-items: center;
            }

            .small-circle{
                height: 15px;
                width: 15px;
                background-color: #5f615b;
                margin-right: 10px;
                border-radius: 50%;
            }

            .clr-switch-on{
                background-color: yellowgreen;
            }

            .btn-long{
                /* border: 1px solid #f8e2e2; */
                border-radius: 10px;
                width: 335px;
                text-align: center;
                font-size: 0.75rem;

                display: flex;
                align-items: center;
                justify-content: space-between;

                

                .highlighted{
                    background-color: yellowgreen;
                    padding: 2.5px 5px;
                    font-weight: 600;
                    margin-left: 15px;
                    margin-right: 15px;
                }

                .normal{
                    color: yellowgreen;
                    margin-right: 15px;
                }
            }
        }
    }

    .earphone{
        position: absolute; 
        height: 115px;
        width: 115px;
        bottom: 60px;
        right: 60px;

        background-color: #302e2e;
        border-radius: 100%;
        padding: 10px;

        img{
            width: 100%;
            scale: 1.25;
        }
    }

    .earphone-message{
        position: absolute; 
        bottom: 30px;
        right: 210px;
        height: 80px;
        width: 320px;
        border-radius: 10px;
        background-color: #262424;
        padding: 10px;
        

        .heading{
            font-size: 0.9rem;
            font-weight: 600;
            color: yellowgreen;
        }

        .feedback{
            font-size: 0.75rem;
            color: white;
            font-weight: 200;
        }

        .speak-btn{
            padding: 5px 10px;
            border: 1px solid transparent;
            border-radius: 10px;
            background-color: #5f615c57;
            color: white;
            text-align: center;
            font-size: 0.7rem;
            position: relative;
            margin-left: 5px;
            cursor: pointer;
        }

        .arrow{
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
    
`

