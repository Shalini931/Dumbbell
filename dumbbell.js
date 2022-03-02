const video5 = document.getElementsByClassName('input_video5')[0];
const out5 = document.getElementsByClassName('output5')[0];
const controlsElement5 = document.getElementsByClassName('control5')[0];
const canvasCtx5 = out5.getContext('2d');
const reps = document.querySelector('.reps');
const sets = document.querySelector('.sets');
const fpsControl = new FPS();

// to keep a counter track
let leftCounter = 0;
let set_counter = 0;
let leftUp = false, leftDown = false;

let rightCounter = 0;
//let rightSet_counter = 0;
let rightUp = false, rightDown = false;

// keep a track of range of motion achieved
let leftMaxAngle = 10;
//let dayRange = 0;
//let rangeforday = document.querySelector('.rangeforday');

let rightMaxAngle = 10;



const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
  spinner.style.display = 'none';
};

function zColor(data) {
  const z = clamp(data.from.z + 0.5, 0, 1);
  return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`;
}

//upper arm and lower right arm
// function checkForPerp(obj11, obj13, obj15) {
//     const vector1 = [(obj13.x - obj11.x) , (obj13.y - obj11.y)];
//     const vector2 = [(obj13.x - obj15.x) , (obj13.y - obj15.y)];

//     const dot = vector1[0]*vector2[0] + vector1[1]*vector2[1];

//     const mod_a = Math.sqrt(vector1[0]*vector1[0] + vector1[1]*vector1[1]);
//     const mod_b = Math.sqrt(vector2[0]*vector2[0] + vector2[1]*vector2[1]);

//     const angle = Math.round((Math.acos(dot/(mod_a*mod_b))*180)/3.14);

//     return angle;
// }


function angleBetweenArms(obj12, obj14, obj16, obj11, obj13, obj15) {

  const leftVector1 = [(obj14.x - obj12.x) , (obj14.y - obj12.y)];
  const leftVector2 = [(obj14.x - obj16.x) , (obj14.y - obj16.y)];
  const rightVector1 = [(obj13.x - obj11.x) , (obj13.y - obj11.y)];
  const rightVector2 = [(obj13.x - obj15.x) , (obj13.y - obj15.y)];

  const leftDot = leftVector1[0]*leftVector2[0] + leftVector1[1]*leftVector2[1];
  const leftMod_a = Math.sqrt(leftVector1[0]*leftVector1[0] + leftVector1[1]*leftVector1[1]);
  const leftMod_b = Math.sqrt(leftVector2[0]*leftVector2[0] + leftVector2[1]*leftVector2[1]);

  const rightDot = rightVector1[0]*rightVector2[0] + rightVector1[1]*rightVector2[1];
  const rightMod_a = Math.sqrt(rightVector1[0]*rightVector1[0] + rightVector1[1]*rightVector1[1]);
  const rightMod_b = Math.sqrt(rightVector2[0]*rightVector2[0] + rightVector2[1]*rightVector2[1]);

  const leftAngle =((Math.acos(leftDot/(leftMod_a*leftMod_b))*180)/3.14).toFixed(2);
  console.log(leftAngle);
  leftMaxAngle = Math.max(leftMaxAngle, leftAngle);

  const rightAngle =((Math.acos(rightDot/(rightMod_a*rightMod_b))*180)/3.14).toFixed(2);
  console.log(rightAngle);
  rightMaxAngle = Math.max(rightMaxAngle, rightAngle);

  if(leftAngle <= 25) {
      leftDown = true;
  }
  else if(leftAngle >= 130) {
      leftUp = true;
  }

  if(rightAngle <= 25) {
      rightDown = true;
  }
  else if(rightAngle >= 130) {
      rightUp = true;
  }

  if((leftUp === true && leftDown === true) && (rightUp == true && rightDown == true)) {
    if(leftUp === true && leftDown === true) {
      leftCounter += 1;
      leftUp = false;
      leftDown = false;
    }
    if(rightUp == true && rightDown == true) {
      rightCounter += 1;
      rightUp = false;
      rightDown = false;
    }
    if((leftCounter+rightCounter) % 4 === 0) {
      reps.innerHTML = '#reps = ' + (leftCounter+rightCounter)/4;

      console.log(leftMaxAngle);
      console.log(rightMaxAngle)
      //dayRange += leftMaxAngle;
      leftMaxAngle = 10;
      rightMaxAngle=10;
    }
  }

  if((leftCounter+rightCounter)/4 === 5) {
    leftCounter = 0;
    rightCounter=0;
    reps.innerHTML = '#reps = ' + Math.trunc((leftCounter+rightCounter)/4);
    set_counter += 1;
    sets.innerHTML = "#sets " + set_counter;
  }
  //console.log(reps);
  //console.log(sets);
  return 0;
}


function onResultsPose(results){

// right arm perpendicular check
//if 150deg ke upar hai tab, proceed
    // let angle = checkForPerp(results.poseLandmarks[11], results.poseLandmarks[13], results.poseLandmarks[15]);
    // console.log(angle);
    // if(angle >=  150) {
        //note for max range

        let rangeAchieved = angleBetweenArms(results.poseLandmarks[12], results.poseLandmarks[14], results.poseLandmarks[16], results.poseLandmarks[11], results.poseLandmarks[13], results.poseLandmarks[15]);
        //rangeforday.innerHTML = " Report Card for the day = " + rangeAchieved;
    // }



    document.body.classList.add('loaded');
    fpsControl.tick();

    canvasCtx5.save();
    canvasCtx5.clearRect(0, 0, out5.width, out5.height);
    canvasCtx5.drawImage(
        results.image, 0, 0, out5.width, out5.height);
    drawConnectors(
        canvasCtx5, results.poseLandmarks, POSE_CONNECTIONS, {
          color: (data) => {
            const x0 = out5.width * data.from.x;
            const y0 = out5.height * data.from.y;
            const x1 = out5.width * data.to.x;
            const y1 = out5.height * data.to.y;

            const z0 = clamp(data.from.z + 0.5, 0, 1);
            const z1 = clamp(data.to.z + 0.5, 0, 1);

            const gradient = canvasCtx5.createLinearGradient(x0, y0, x1, y1);
            gradient.addColorStop(
                0, `rgb(255, 255, 255)`);
            gradient.addColorStop(
              0, `rgb(255, 255, 255)`);
            return gradient;
          }
        });
    // drawLandmarks(
    //     canvasCtx5,
    //     Object.values(POSE_LANDMARKS_LEFT)
    //         .map(index => results.poseLandmarks[index]),
    //     {color: zColor, fillColor: 'white'});
    // drawLandmarks(
    //     canvasCtx5,
    //     Object.values(POSE_LANDMARKS_RIGHT)
    //         .map(index => results.poseLandmarks[index]),
    //     {color: zColor, fillColor: 'white'});
    // drawLandmarks(
    //     canvasCtx5,
    //     Object.values(POSE_LANDMARKS_NEUTRAL)
    //         .map(index => results.poseLandmarks[index]),
    //     {color: zColor, fillColor: 'white'});
    canvasCtx5.restore();
  }

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
}});
pose.onResults(onResultsPose);

const camera = new Camera(video5, {
  onFrame: async () => {
    await pose.send({image: video5});
  },
  width: 480,
  height: 480
});
camera.start();

new ControlPanel(controlsElement5, {
      selfieMode: true,
      upperBodyOnly: false,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
    .add([
      new StaticText({title: 'MediaPipe Pose'}),
      fpsControl,
      new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
      new Toggle({title: 'Upper-body Only', field: 'upperBodyOnly'}),
      new Toggle({title: 'Smooth Landmarks', field: 'smoothLandmarks'}),
      new Slider({
        title: 'Min Detection Confidence',
        field: 'minDetectionConfidence',
        range: [0, 1],
        step: 0.01
      }),
      new Slider({
        title: 'Min Tracking Confidence',
        field: 'minTrackingConfidence',
        range: [0, 1],
        step: 0.01
      }),
    ])
    .on(options => {
      video5.classList.toggle('selfie', options.selfieMode);
      pose.setOptions(options);
    });
