import * as THREE from "three";
import mTween from "../mTween";

const colorVec3 = (color) => {
  const colors = {};
  new THREE.Color(color).getHSL(colors);
  return new THREE.Vector3(colors.h, colors.s, colors.l);
};

//案例火参数
const fire = () => {
  return {
    name: "火焰",
    shapeType: "sphere",
    position: new THREE.Vector3(0, 0, 0),
    positionRadius: 2,
    velocityShape: "cube",
    velocity: new THREE.Vector3(0, 20, 0),
    sizeTween: new mTween([0, 0.3, 1], [1, 15, 1]),
    opacityTween: new mTween([0.7, 1], [1, 0]),
    colorTween: new mTween(
      [0.5, 1.0],
      [new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0)]
    ),
    textureURL: "./textures/smoke.png",
    pointSec: 200,
  };
};

const snow = () => {
  return {
    name: "雪花",
    pointNum: 200,
    shapeType: "cube",
    position: new THREE.Vector3(0, 30, 0),
    positionRange: new THREE.Vector3(50, 0, 50),

    velocityShape: "cube",
    velocity: new THREE.Vector3(0, -10, 0),
    velocityRange: new THREE.Vector3(5, 2, 5),
    // acceleration: new THREE.Vector3(0, -1, 0),
    angle: 0,
    angleRange: 720,
    angleVelocity: 0,
    angleVelocityRange: 60,

    sizeTween: new mTween([0, 0.25], [0.2, 2]),
    opacityTween: new mTween([2, 3], [0.8, 0]),

    _deathAge: 60,
    pointDeathAge: 5,
    textureURL: "./textures/snowflake.png",
    pointSec: 200,
  };
};

const water = () => {
  return {
    name: "喷泉",
    shapeType: "cube",
    positionRange: new THREE.Vector3(1, 2, 1),
    velocity: new THREE.Vector3(0, 13, 0),
    velocityRange: new THREE.Vector3(7, 5, 7),
    acceleration: new THREE.Vector3(0, -7, 0),
    velocityShape: "cube",
    sizeTween: new mTween([0, 0.25, 4], [0.2, 3, 0.3]),
    colorTween: new mTween(
      [0, 0.5],
      [new THREE.Vector3(0.5, 0.1, 0.8), new THREE.Vector3(0.5, 0.9, 0.3)]
    ),
    opacityTween: new mTween([0, 0.2, 3.5], [0, 1, 0]),
    _deathAge: 60,
    pointDeathAge: 4,
    textureURL: "./textures/snowflake.png",
  };
};

const smoke = () => {
  return {
    name: "烟雾",
    position: new THREE.Vector3(0, 2, 0),
    sizeTween: new mTween([0, 1], [0, 8]),
    positionRange: new THREE.Vector3(1, 10, 1),
    velocity: new THREE.Vector3(0, 10, 0),
    velocityRange: new THREE.Vector3(4, 5, 4),
    acceleration: new THREE.Vector3(0, -1, 0),
    textureURL: "./textures/smoke.png",
    opacityTween: new mTween([0, 0.3, 2], [0, 0.5, 0]),
    pointDeathAge: 2,
    blendMode: "NormalBlending",
    pointSec: 100,
  };
};

const music = () => {
  return {
    name: "音符",
    sizeTween: new mTween([0, 3, 10], [1, 5, 0]),
    positionRange: new THREE.Vector3(10, 0, 10),
    acceleration: new THREE.Vector3(0, -0.1, 0),
    velocity: new THREE.Vector3(0, 1, 0),
    velocityRange: new THREE.Vector3(5, -1, 5),
    shapeType: "cube",
    velocityShape: "cube",
    textureURL: "./textures/yinfu.png",
    pointSec: 10,
    pointDeathAge: 10,
    angleRange: 360,
    angleVelocity: 20,
    colorTween: new mTween(
      [0, 5, 10],
      [colorVec3("green"), colorVec3("red"), colorVec3("blue")]
    ),
    opacityTween: new mTween([0, 5, 10], [0, 1, 0.1]),
  };
};

const fireFly = () => {
  return {
    name: "萤火虫",
    shapeType: "cube",
    positionRange: new THREE.Vector3(50, 50, 50),
    velocityShape: "cube",
    velocityRange: new THREE.Vector3(2, 2, 2),
    textureURL: "./textures/spark.png",
    color: new THREE.Vector3(0.3, 1.0, 0.6),
    colorRange: colorVec3("blue"),
    size: 4,
    sizeRange: 2,
    pointSec: 20,
    pointDeathAge: 8,
  };
};

const example = {
  fire: fire, //火的参数
  snow: snow, //雪花
  water: water, //喷水
  smoke: smoke, //烟雾
  music: music, //音符，
  fireFly: fireFly, //萤火虫
};

const getExample = (type) => {
  if (type) {
    const values = example[type]();
    values._texture = new THREE.TextureLoader().load(values.textureURL);

    console.log(values);
    return values;
  }
};

export { example, getExample };
