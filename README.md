# Vision Bridge
Our software solution is designed to effortlessly integrate with hardware devices, including smart glasses, making it a user-friendly and accessible tool for individuals with visual impairments. Through the power of Computer Vision, this straightforward and effective project offers a transformative and inclusive experience, enabling users to navigate their surroundings with ease and confidence.
<br/><br/>
<img height="300px" src="https://github.com/Nayaker/Vision-Bridge/assets/93304796/9035365a-0a11-435f-9bcc-2e8170802e50" />

<br/>

## Features
<b>1. Currency Detection Model:</b> Our simulator allows users to present images of Indian currency notes to the camera. Through Densenet and some extra dropout and densely connected layers the model is trained. Then the models weights are used in a flask api which is deployed in aws ec2 instance.The system learns to identify the denomination of the money, providing users with a seamless experience to determine the amount accurately.

<b>2. Road Safety Model:</b> Images taken through the integrated camera are used to detect the position and number of vehicles approaching at any given point in time. Also, any image of a vehicle is successfully classified into its corresponding type, thus providing the user with complete information about the traffic and helping him navigate across roads.

The classification task is performed using a DenseNet201-based model, with some additional layers, as the base learner. This base learner is used to generate several "snapshots", which are ensembled to give us the final output. Cyclical cosine annealing of the learning rate was used to ensure different snapshots land into different local minima, and the distance between these minima was maximized to obtain maximum information gain, thus ensuring that these snapshots are diverse. 

The localization and detection task was performed using a YOLOv5 model (You Only Look Once), which scans through an image, and then draws anchor boxes for all objects it detects of any class amongst the ones it has been trained on, which is the COCO-80 dataset in our implementation. Some classes include traffic lights, fire hydrants, stop signs, bicycles, cars, motorbikes, airplanes, buses, trains, trucks, boats, and parking meters.

<b>3. Detecting common real-life objects:</b> To help the user navigate safely at home or elsewhere, he/she is also informed of the relative position and presence of some common objects one is expected to be around, such as various animals(cats, dogs, birds, etc.), various fruits(apples, oranges, bananas, etc.), different types of cutlery and utensils(bottles, cups, forks, knives, spoons, etc.), different electronic gadgets(monitor, laptop, keyboard, oven, refrigerator, etc.), among others. Thus, the user has complete knowledge of his/her surroundings, thus allowing him/her to be more confident in navigating independently.  

The YOLOv5 model discussed previously (trained on the 80 classes of the COCO dataset), has been used to implement this feature.

<b>4. Face emotion detection:</b> To help visually impaired individuals understand the facial expressions of the people they meet in their daily lives, the software uses the camera on the user's device to capture an image of the person's face, and the underlying model then comments on what emotions the person appears to be feeling, such as happy, sad, excited, angry, etc; which the user is informed of through audio feedback.

<br/><br/>

## Hackathon team members 
<b>1. Priyam Saha:</b> Worked on deploying ML models and using it in reactJS application, and ML deployment using AWS. <br/><br/>
<b>2. Om Mittal:</b> Developed the models for face emotion detection and classification of vehicles, and also implemented the YOLO-based model. <br/><br/>
<b>3. Atanu Nayak :</b> <br/><br/>
