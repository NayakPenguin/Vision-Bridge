![GitHub](https://img.shields.io/github/license/Nayaker/Vision-Bridge.svg?style=flat)
![GitHub top language](https://img.shields.io/github/languages/top/Nayaker/Vision-Bridge.svg?style=flat)
![GitHub last commit](https://img.shields.io/github/last-commit/Nayaker/Vision-Bridge.svg?style=flat)
![ViewCount](https://views.whatilearened.today/views/github/Nayaker/Vision-Bridge.svg?cache=remove)

# Vision Bridge

<p align="left">  
    <br>
	<a href="#">
        <img height=80 src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png"> 
  </a>	
  <img hspace=20></div>
	<a href="#">
		<img src="https://raw.githubusercontent.com/Thomas-George-T/Thomas-George-T/master/assets/python.svg" alt="Python" title="Python" height=80 />
	</a>
 <img hspace=20></div>
	<a href="#">
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Tensorflow_logo.svg/1200px-Tensorflow_logo.svg.png" alt="" title="" height=80 />
	</a>
  <img hspace=20></div>
	<a href="#">
		<img src="https://github.com/opencv/opencv/wiki/logo/OpenCV_logo_no_text.png" alt="" title="" height=80 />
	</a>
 <img hspace=20></div>
	<a href="#">
		<img src="https://cdn.analyticsvidhya.com/wp-content/uploads/2018/12/yologo_2.png" alt="" title="" height=80 />
	</a>
 <img hspace=20></div>
	<a href="#">
		<img src="https://www.svgrepo.com/show/306500/openai.svg" alt="" title="" height=80 />
	</a>
 
  <br>
</p>
<br/><br/>

## Problem Statement

The persistent issue of limited accessibility continues to impede the full participation of people with disabilities in society, despite technological advancements and increased awareness. From navigating physical spaces to accessing information and using technology, individuals with disabilities often encounter barriers that hinder their ability to perform daily activities independently. This situation can result in feelings of isolation, exclusion, and frustration, ultimately affecting their overall quality of life. To overcome these challenges, a pressing need exists for a comprehensive solution that tackles accessibility issues and empowers people with disabilities to actively participate in all aspects of life.
<br/><br/>

## Our Solution

Our software solution is designed to effortlessly integrate with hardware devices, including smart glasses, making it a user-friendly and accessible tool for individuals with visual impairments. Through the power of Computer Vision, this straightforward and effective project offers a transformative and inclusive experience, enabling users to navigate their surroundings with ease and confidence.
<br/><br/>

## Virtual Reality Simulator for Product Experience

<img width="904" alt="Screenshot 2023-08-06 at 8 26 27 AM" src="https://github.com/Nayaker/Vision-Bridge/assets/93304796/9c6b9852-5e78-4dc3-b537-d1dceeef1ec2">
<br/><br/>

## Features

<b>1. Currency Detection Model:</b> Our simulator allows users to present images of Indian currency notes to the camera. Through Densenet and some extra dropout and densely connected layers the model is trained. Then the models weights are used in a flask api which is deployed in aws ec2 instance.The system learns to identify the denomination of the money, providing users with a seamless experience to determine the amount accurately.

<img height="300px" src="https://github.com/Nayaker/Vision-Bridge/assets/93304796/9035365a-0a11-435f-9bcc-2e8170802e50" />

<br/><br/>
<b>2. Road Safety Model:</b> Images taken through the integrated camera are used to detect the position and number of vehicles approaching at any given point in time. Also, any image of a vehicle is successfully classified into its corresponding type, thus providing the user with complete information about the traffic and helping him navigate across roads.

The classification task is performed using a DenseNet201-based model, with some additional layers, as the base learner. This base learner is used to generate several "snapshots", which are ensembled to give us the final output. Cyclical cosine annealing of the learning rate was used to ensure different snapshots land into different local minima, and the distance between these minima was maximized to obtain maximum information gain, thus ensuring that these snapshots are diverse.

The localization and detection task was performed using a YOLOv5 model (You Only Look Once), which scans through an image, and then draws anchor boxes for all objects it detects of any class amongst the ones it has been trained on, which is the COCO-80 dataset in our implementation. Some classes include traffic lights, fire hydrants, stop signs, bicycles, cars, motorbikes, airplanes, buses, trains, trucks, boats, and parking meters.

<img height="300px" src="https://github.com/Nayaker/Vision-Bridge/assets/93304796/f88486ad-b534-464e-a341-538ea847ebd6" />
<img height="300px" src="https://github.com/Nayaker/Vision-Bridge/assets/93304796/4402165b-5dc6-4d06-8b29-8cf24073d0f2" />

<br/><br/>
<b>3. Detecting common real-life objects:</b> To help the user navigate safely at home or elsewhere, he/she is also informed of the relative position and presence of some common objects one is expected to be around, such as various animals(cats, dogs, birds, etc.), various fruits(apples, oranges, bananas, etc.), different types of cutlery and utensils(bottles, cups, forks, knives, spoons, etc.), different electronic gadgets(monitor, laptop, keyboard, oven, refrigerator, etc.), among others. Thus, the user has complete knowledge of his/her surroundings, thus allowing him/her to be more confident in navigating independently.

The YOLOv5 model discussed previously (trained on the 80 classes of the COCO dataset), has been used to implement this feature.

<img height="300px" src="https://github.com/Nayaker/Vision-Bridge/assets/93304796/3ac4afe3-07e5-46d2-a507-5dc203e1bbfa" />

<br/><br/>
<b>4. Face emotion detection:</b> To help visually impaired individuals understand the facial expressions of the people they meet in their daily lives, the software uses the camera on the user's device to capture an image of the person's face, and the underlying model then comments on what emotions the person appears to be feeling, such as happy, sad, excited, angry, etc; which the user is informed of through audio feedback.

<img height="300px" src="https://github.com/Nayaker/Vision-Bridge/assets/93304796/80fbec94-446d-4975-a06a-b4ecc8cfafd7" />

<br/><br/>
<b>5. Extraction of Text from Image:</b> This remarkable feature is designed to assist users in extracting text from images they input. By leveraging advanced optical character recognition (OCR) technology, the system can accurately identify and extract text present in the provided images. Users can simply upload or capture an image containing text, and the tool will process the image, converting the textual content into editable and searchable text. This functionality proves to be immensely useful in scenarios where manual typing of text from images is time-consuming or impractical. Whether it's extracting information from documents, signs, or any other image with textual content, this feature simplifies the process and enhances productivity for users.

<img height="300px" src="https://github.com/Nayaker/Vision-Bridge/assets/93304796/1c0880c0-8fee-47a8-8714-ddde1af65710" />
<br/><br/>

## Deployment of Model
The machine learning models that are implemented using tensorflow are connected to .json files using tensorflow.js and those are used in react.js (clint side) directly. Other machine learning models that are implemented using Pytorch are put in the flask API endpoint which is called in react app with specific post request. Those flask apps are deployed in an AWS EC2 instance in the Ubuntu server.
<br/><br/>

## Hackathon team members

<b>1. <a href="https://github.com/priyam-03/">Priyam Saha</a> : </b> Worked on deploying ML models and using it in reactJS application, and ML deployment using AWS. Worked on OCR for text extraction from images,face emotion detection.  <br/><br/>
<b>2. <a href="https://github.com/Om-Mittal">Om Mittal</a> : </b> Developed the models for the classification of vehicles and implemented the YOLO-based model. <br/><br/>
<b>3. <a href="https://github.com/Nayaker">Atanu Nayak</a> :</b> Developed a seamless user simulator with React JS and vanilla CSS, created a currency detection model, implemented audio input and output features. <br/><br/>
<b>4. <a href="https://github.com/AnuragJha003">Anurag Kumar Jha</a> :</b> Developed a seamless user simulator with React JS and vanilla CSS, created a currency detection model, implemented audio input and output features. <br/><br/>


