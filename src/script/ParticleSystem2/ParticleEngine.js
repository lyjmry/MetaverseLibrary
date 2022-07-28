import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import PointAttributeData from "./PointData";
import particleFrag from "./shader/Particle.frag";
import particleVert from "./shader/Particle.vert";
import mTween from "./mTween";

export default class Particles {
  constructor(param) {
    this.initData();
    this.setParams(param);
    this.createParticle(); //
  }

  //初始化创建
  initData() {
    this.id = THREE.MathUtils.generateUUID();
    this.pointSec = 100;
    this.name = null;
    this.position = new THREE.Vector3();
    this.shapeType = "cube"; //或者cube（发射类别)
    this.positionRange = new THREE.Vector3(); //默认是0（点随机的位置范围）针对shapetype=‘cube’有效果
    this.positionRadius = 0; //默认是0该参数针对于shapeType==‘sphere；有效
    this.positionRadiusRange = 0; //点位半径随机

    this.velocityShape = "cube"; //或者sphere 简称变成啥
    this.velocity = new THREE.Vector3(); //速度的方向和长度
    this.velocityRange = new THREE.Vector3();
    this.speed = 0; //速度
    this.speedRange = 0;
    this.acceleration = new THREE.Vector3(); //加速度
    this.accelerationRange = new THREE.Vector3();

    this.age = 0; //初始化时间
    this._deathAge = 60; //死亡周期（一个周期的时间）时间单位s
    this.pointAge = 0;
    this.pointDeathAge = 1;

    this.alive = true; //点能不能动
    this._loop = true; //是否循环

    this.pointNum = this.pointSec * Math.min(this._deathAge, this.age); //初始化点的数据

    this.angle = 0; //角度
    this.angleRange = 0;
    this.angleVelocity = 0; //旋转速度
    this.angleVelocityRange = 0;
    this.angleAcceleration = 0; //旋转加速度
    this.angleAccelerationRange = 0;

    this.size = 0; //尺寸
    this.sizeRange = 0;
    this.sizeTween = new mTween();

    this.opacity = 1; //透明度
    this.opacityRange = 0;
    this.opacityTween = new mTween();

    this.color = new THREE.Vector3(1, 1, 1);
    this.colorRange = new THREE.Vector3(0, 0, 0);
    this.colorTween = new mTween();
    this.textureURL = null;
    this._texture = new THREE.TextureLoader().load("./textures/star.png");

    this.blendMode = "AdditiveBlending"; //blending:THREE.AdditiveBlending//THREE.NormalBlending
  }

  //设置播放状态
  set state(stat) {
    this.alive = stat;
    this.age = 0;
  }

  //获取播放状态
  get state() {
    return this.alive;
  }

  //设置循环状态
  set loop(state) {
    this._loop = state;
    this.alive = true;
    this.age = 0;
  }

  //获取循环状态
  get loop() {
    return this._loop;
  }

  //设置贴图
  set map(texture) {
    this._texture = texture;
    this.material.uniforms.maps.value = this._texture;
  }

  get map() {
    return this._texture;
  }

  //生命周期
  set deathAge(value) {
    this._deathAge = value;
    this.age = 0;
    this.alive = true;
  }

  get deathAge() {
    return this._deathAge;
  }

  //设置父对象
  setParent(object) {
    object.add(this.mesh);
  }

  //参数继承
  setParams(param) {
    Object.assign(this, param);
    this.pointNum =
      this.pointSec * Math.min(this.pointDeathAge, this._deathAge);

    if (this.textureURL) {
      this._texture = new THREE.TextureLoader().load(this.textureURL);
    }
  }

  //获取当前状态参数
  getParams() {
    const resultParam = {
      position: this.position,
      positionRange: this.positionRange,
      shapeType: this.shapeType,
      positionRadius: this.positionRadius,
      velocityShape: this.velocityShape,
      velocity: this.velocity,
      velocityRange: this.velocityRange,
      speed: this.speed,
      speedRange: this.speedRange,
      acceleration: this.acceleration,
      accelerationRange: this.accelerationRange,
      age: this.pointAge,
      deathAge: this.pointDeathAge,
      ageRandom: this.pointAgeRandom,
      angle: this.angle,
      angleRange: this.angleRange,
      angleVelocity: this.angleVelocity,
      angleVelocityRange: this.angleVelocityRange,
      angleAcceleration: this.angleAcceleration,
      angleAccelerationRange: this.angleAccelerationRange,
      size: this.size,
      sizeRange: this.sizeRange,
      sizeTween: this.sizeTween,
      opacity: this.opacity,
      opacityRange: this.opacityRange,
      opacityTween: this.opacityTween,
      color: this.color,
      colorRange: this.colorRange,
      colorTween: this.colorTween,
      _loop: this._loop,
      _texture: this._texture,
      pointNum: this.pointNum,
    };

    return resultParam;
  }

  //初始化场景内部点的数据
  initPointStartData() {
    //固定参数
    this.pointMatrixData = new PointAttributeData({
      position: this.position,
      positionRange: this.positionRange,
      shapeType: this.shapeType,
      positionRadius: this.positionRadius,
      positionRadiusRange: this.positionRadiusRange,
      velocityShape: this.velocityShape,
      velocity: this.velocity,
      velocityRange: this.velocityRange,
      speed: this.speed,
      speedRange: this.speedRange,
      acceleration: this.acceleration,
      accelerationRange: this.accelerationRange,
      age: this.pointAge,
      deathAge: this.pointDeathAge,
      deathAgeRange: this.pointDeathAge,
      ageRandom: this.pointAgeRandom,
      angle: this.angle,
      angleRange: this.angleRange,
      angleVelocity: this.angleVelocity,
      angleVelocityRange: this.angleVelocityRange,
      angleAcceleration: this.angleAcceleration,
      angleAccelerationRange: this.angleAccelerationRange,
      size: this.size,
      sizeRange: this.sizeRange,
      sizeTween: this.sizeTween,
      opacity: this.opacity,
      opacityRange: this.opacityRange,
      opacityTween: this.opacityTween,
      color: this.color,
      colorRange: this.colorRange,
      colorTween: this.colorTween,
      deathAge: this.pointDeathAge,
    });

    return this.pointMatrixData;
  }

  //创建粒子
  createParticle() {
    this.geometry = new THREE.BufferGeometry();

    this.pointAnimationData = []; //存储每个点变换信息的

    const positionArray = [];
    const angleArray = [];
    const sizeArray = [];
    const opacityArray = [];
    const colorArray = [];
    const visibleArray = [];

    for (let s = 0; s < this.pointNum; s++) {
      this.pointAnimationData[s] = this.initPointStartData();
      positionArray[s * 3] = this.pointAnimationData[s].position.x;
      positionArray[s * 3 + 1] = this.pointAnimationData[s].position.y;
      positionArray[s * 3 + 2] = this.pointAnimationData[s].position.z;
      angleArray[s] = this.pointAnimationData[s].angle;
      sizeArray[s] = this.pointAnimationData[s].size;
      opacityArray[s] = this.pointAnimationData[s].opacity;
      colorArray[s * 3] = this.pointAnimationData[s].color.r;
      colorArray[s * 3 + 1] = this.pointAnimationData[s].color.g;
      colorArray[s * 3 + 2] = this.pointAnimationData[s].color.b;
      visibleArray[s] = this.pointAnimationData[s].alive;
    }

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positionArray, 3)
    );

    this.geometry.setAttribute(
      "startPos",
      new THREE.Float32BufferAttribute(positionArray, 3)
    );

    this.geometry.setAttribute(
      "angle",
      new THREE.Float32BufferAttribute(angleArray, 1)
    );
    this.geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizeArray, 1)
    );

    this.geometry.setAttribute(
      "opacity",
      new THREE.Float32BufferAttribute(opacityArray, 1)
    );
    this.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorArray, 3)
    );

    this.geometry.setAttribute(
      "visible",
      new THREE.Float32BufferAttribute(visibleArray, 1)
    );

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        maps: {
          value: this._texture,
        },
        density: {
          //粒子密度
          value: 0.5,
        },
      },
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      transparent: true,
      alphaTest: 0.5,
      // depthTest: false,
      depthWrite: false,
      blending: THREE[this.blendMode],
    });

    this.mesh = new THREE.Points(this.geometry, this.material); //添加到场景内部的点粒子几何体

    //抛出
    this.mesh.styleType = "particle";
    this.mesh.system = this;
  }

  //动画更新
  update(time) {
    const positionArray = this.geometry.attributes.position.array;
    const angleArray = this.geometry.attributes.angle.array;
    const sizeArray = this.geometry.attributes.size.array;
    const opacityArray = this.geometry.attributes.opacity.array;
    const colorArray = this.geometry.attributes.color.array;
    const visibleArray = this.geometry.attributes.visible.array;
    const startPosArray = this.geometry.attributes.startPos.array;

    const reStartArray = [];

    for (let i = 0; i < this.pointNum; i++) {
      const pointState = this.pointAnimationData[i];

      if (pointState.alive == 1) {
        pointState.update(time);

        if (pointState.age > this.pointDeathAge) {
          pointState.alive = 0; //不可见
          reStartArray.push(i);
        }

        positionArray[i * 3] = pointState.position.x;
        positionArray[i * 3 + 1] = pointState.position.y;
        positionArray[i * 3 + 2] = pointState.position.z;
        angleArray[i] = pointState.angle;
        sizeArray[i] = pointState.size;
        opacityArray[i] = pointState.opacity;
        colorArray[i * 3] = pointState.color.r;
        colorArray[i * 3 + 1] = pointState.color.g;
        colorArray[i * 3 + 2] = pointState.color.b;
        visibleArray[i] = pointState.alive;
      }
    }

    //位置参数更新
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.angle.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.opacity.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.visible.needsUpdate = true;

    if (!this.alive) return;

    if (this.age < this.pointDeathAge) {
      let startIndex = Math.round(this.pointSec * (this.age + 0));
      let endIndex = Math.round(this.pointSec * (this.age + time));
      if (endIndex > this.pointNum) {
        endIndex = this.pointNum;
      }
      for (let m = startIndex; m < endIndex; m++) {
        this.pointAnimationData[m].alive = 1;
      }
    }

    for (let j = 0; j < reStartArray.length; j++) {
      const n = reStartArray[j];
      // console.log('babab');
      this.pointAnimationData[n] = this.initPointStartData();
      this.pointAnimationData[n].alive = 1;
      positionArray[n * 3] = this.pointAnimationData[n].position.x;
      positionArray[n * 3 + 1] = this.pointAnimationData[n].position.y;
      positionArray[n * 3 + 2] = this.pointAnimationData[n].position.z;
      startPosArray[n * 3] = this.pointAnimationData[n].position.x;
      startPosArray[n * 3 + 1] = this.pointAnimationData[n].position.y;
      startPosArray[n * 3 + 2] = this.pointAnimationData[n].position.z;
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.startPos.needsUpdate = true;

    this.age += time;
    // console.log(this.age);
    if (this.age > this._deathAge && !this.loop) {
      this.alive = false;
    }
  }

  //粒子密度
  set density(value) {
    value = 1 - value;
    this.mesh.material.uniforms.density.value = value;
  }

  //获取粒子密度
  get density() {
    return 1 - this.mesh.material.uniforms.density.value;
  }

  particleNumChange(num = 200, geometry) {
    this.state = false;
    // this.change = true;
    this.pointSec = num;
    const nums = this.pointSec * Math.min(this.pointDeathAge, this._deathAge); //初始化点的数据

    this.pointNum = Math.ceil(nums);
    // console.log(this.pointNum, "点的数量");

    const positionArray = [];
    const angleArray = [];
    const sizeArray = [];
    const opacityArray = [];
    const colorArray = [];
    const visibleArray = [];

    for (let s = 0; s < this.pointNum; s++) {
      this.pointAnimationData[s] = this.initPointStartData();
      positionArray[s * 3] = this.pointAnimationData[s].position.x;
      positionArray[s * 3 + 1] = this.pointAnimationData[s].position.y;
      positionArray[s * 3 + 2] = this.pointAnimationData[s].position.z;
      angleArray[s] = this.pointAnimationData[s].angle;
      sizeArray[s] = this.pointAnimationData[s].size;
      opacityArray[s] = this.pointAnimationData[s].opacity;
      colorArray[s * 3] = this.pointAnimationData[s].color.r;
      colorArray[s * 3 + 1] = this.pointAnimationData[s].color.g;
      colorArray[s * 3 + 2] = this.pointAnimationData[s].color.b;
      visibleArray[s] = this.pointAnimationData[s].alive;
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positionArray, 3)
    );

    geometry.setAttribute(
      "startPos",
      new THREE.Float32BufferAttribute(positionArray, 3)
    );
    geometry.setAttribute(
      "angle",
      new THREE.Float32BufferAttribute(angleArray, 1)
    );
    geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizeArray, 1)
    );

    geometry.setAttribute(
      "opacity",
      new THREE.Float32BufferAttribute(opacityArray, 1)
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorArray, 3)
    );

    geometry.setAttribute(
      "visible",
      new THREE.Float32BufferAttribute(visibleArray, 1)
    );
    this.state = true;
  }

  panelsVisible = false;
  //控制台显示（调试面板）
  showPanel() {
    this.panels = new GUI();
    let name;
    if (this.name) {
      name = this.name;
    } else {
      name = "粒子动画管理器";
    }

    const parentPanels = this.panels.addFolder(name);
    parentPanels.open();

    parentPanels
      .add(this, "pointSec", 0, 1000, 1)
      .name("粒子数量")
      .onChange((e) => {
        this.particleNumChange(e, this.mesh.geometry);
      });
    parentPanels.add(this, "density", 0, 1, 0.01).name("粒子密度百分比");

    const baseSetting = parentPanels.addFolder("基础设置");
    baseSetting.open();

    baseSetting
      .add(this, "shapeType", ["sphere", "cube"])
      .name("初始位置类型")
      .onChange((e) => {
        this.shapeType = e;
      });
    const initPos = baseSetting.addFolder("cube类型初始位置");

    const posPanel = initPos.addFolder("cube位置初始范围");
    // const poss={x:this.position.x,y:this.position.y,z:this.position.}
    posPanel
      .add(this.position, "x", -500, 500, 1)
      .name("位置X")
      .onChange((e) => {
        this.position.x = e;
      });

    posPanel
      .add(this.position, "y", -500, 500, 1)
      .name("位置Y")
      .onChange((e) => {
        this.position.y = e;
      });

    posPanel
      .add(this.position, "z", -500, 500, 1)
      .name("位置Z")
      .onChange((e) => {
        this.position.z = e;
      });

    const posRange = initPos.addFolder("cube位置随机范围");

    posRange
      .add(this.positionRange, "x", -500, 500, 1)
      .name("x")
      .onChange((e) => {
        this.positionRange.x = e;
      });

    posRange
      .add(this.positionRange, "y", -500, 500, 1)
      .name("y")
      .onChange((e) => {
        this.positionRange.y = e;
      });

    posRange
      .add(this.positionRange, "z", -500, 500, 1)
      .name("z")
      .onChange((e) => {
        this.positionRange.z = e;
      });

    const spherePanel = baseSetting.addFolder("sphere类型初始位置");

    spherePanel
      .add(this, "positionRadius", 0, 100, 0.1)
      .name("球体发射半径")
      .onChange((e) => {
        this.positionRadius = e;
      });

    spherePanel
      .add(this, "positionRadiusRange", 0, 100, 0.1)
      .name("球体发射半径随机范围")
      .onChange((e) => {
        this.positionRadiusRange = e;
      });

    baseSetting
      .add(this, "velocityShape", ["sphere", "cube"])
      .name("发射方向类型")
      .onChange((e) => {
        this.velocityShape = e;
      });

    const cubeSpeedPanel = baseSetting.addFolder("发射类型cube速度");

    cubeSpeedPanel
      .add(this.velocity, "x", -50, 50, 0.1)
      .name("x")
      .onChange((e) => {
        this.velocity.x = e;
      });

    cubeSpeedPanel
      .add(this.velocity, "y", -50, 50, 0.1)
      .name("y")
      .onChange((e) => {
        this.velocity.y = e;
      });

    cubeSpeedPanel
      .add(this.velocity, "z", -50, 50, 0.1)
      .name("z")
      .onChange((e) => {
        this.velocity.z = e;
      });

    const cubeRange = cubeSpeedPanel.addFolder("发射类型cube随机速度范围");

    cubeRange
      .add(this.velocityRange, "x", -50, 50, 0.1)
      .name("x")
      .onChange((e) => {
        this.velocity.x = e;
      });

    cubeRange
      .add(this.velocityRange, "y", -50, 50, 0.1)
      .name("y")
      .onChange((e) => {
        this.velocity.y = e;
      });

    cubeRange
      .add(this.velocityRange, "z", -50, 50, 0.1)
      .name("z")
      .onChange((e) => {
        this.velocity.z = e;
      });

    const sphereSpeedPanel = baseSetting.addFolder("发射类型sphere速度");

    sphereSpeedPanel
      .add(this, "speed", 0, 100, 0.1)
      .name("球状发射速度")
      .onChange((e) => {
        this.speed = e;
      });

    sphereSpeedPanel
      .add(this, "speedRange", 0, 100, 0.1)
      .name("球状发射速度变化范围")
      .onChange((e) => {
        this.speedRange = e;
      });

    const accelerate = baseSetting.addFolder("加速度");
    const startAcc = accelerate.addFolder("初始化加速度");
    startAcc
      .add(this.acceleration, "x", -100, 100, 0.1)
      .name("x")
      .onChange((e) => {
        this.acceleration.x = e;
      });

    startAcc
      .add(this.acceleration, "y", -100, 100, 0.1)
      .name("y")
      .onChange((e) => {
        this.acceleration.y = e;
      });

    startAcc
      .add(this.acceleration, "z", -100, 100, 0.1)
      .name("z")
      .onChange((e) => {
        this.acceleration.z = e;
      });

    const rangeAcc = accelerate.addFolder("加速度随机范围");
    rangeAcc
      .add(this.accelerationRange, "x", -100, 100, 0.1)
      .name("x")
      .onChange((e) => {
        this.accelerationRange.x = e;
      });

    rangeAcc
      .add(this.accelerationRange, "y", -100, 100, 0.1)
      .name("y")
      .onChange((e) => {
        this.accelerationRange.y = e;
      });

    rangeAcc
      .add(this.accelerationRange, "z", -100, 100, 0.1)
      .name("z")
      .onChange((e) => {
        this.accelerationRange.z = e;
      });

    //////////////////////////////////////////////////////

    const timePanel = parentPanels.addFolder("时间周期");

    timePanel
      .add(this, "age", 0, 120, 0.1)
      .name("播放时间")
      .listen()
      .onChange((e) => {
        this.age = e;
      });

    timePanel
      .add(this, "_deathAge", 0, 120, 1)
      .name("生命周期")
      .onChange((e) => {
        this._deathAge = e;
      });

    timePanel
      .add(this, "pointDeathAge", 0, 60, 0.01)
      .name("内部粒子生命周期")
      .onChange((e) => {
        this.pointDeathAge = e;
      });

    timePanel
      .add(this, "alive")
      .name("持续播放")
      .onChange((e) => {
        this.alive = e;
      });

    timePanel
      .add(this, "_loop")
      .name("是否循环")
      .onChange((e) => {
        this._loop = e;
      });

    //////////////////粒子状态//////////////////////

    const pointStatePanel = parentPanels.addFolder("粒子状态");

    const anglePanel = pointStatePanel.addFolder("角度状态");

    anglePanel
      .add(this, "angle", 0, 360, 0.1)
      .name("初始化角度")
      .onChange((e) => {
        this.angle = e;
      });

    anglePanel
      .add(this, "angleRange", 0, 360, 0.1)
      .name("初始化角度随机范围")
      .onChange((e) => {
        this.angleRange = e;
      });

    anglePanel
      .add(this, "angleVelocity", 0, 360, 0.1)
      .name("角度旋转速度")
      .onChange((e) => {
        this.angleVelocity = e;
      });

    anglePanel
      .add(this, "angleVelocityRange", 0, 360, 0.1)
      .name("角度旋转速度随机范围")
      .onChange((e) => {
        this.angleVelocityRange = e;
      });

    anglePanel
      .add(this, "angleAcceleration", 0, 360, 0.1)
      .name("角度加速度")
      .onChange((e) => {
        this.angleAcceleration = e;
      });

    anglePanel
      .add(this, "angleAccelerationRange", 0, 360, 0.1)
      .name("角度加速度范围")
      .onChange((e) => {
        this.angleAccelerationRange = e;
      });

    const sizePanel = pointStatePanel.addFolder("大小状态");

    sizePanel
      .add(this, "size", 0, 100, 0.1)
      .name("大小尺寸")
      .onChange((e) => {
        this.size = e;
      });

    sizePanel
      .add(this, "sizeRange", 0, 100, 0.1)
      .name("大小随机范围")
      .onChange((e) => {
        this.sizeRange = e;
      });

    const sizeT = sizePanel.addFolder("大小变化动画");

    let sizeTws = {
      startTime: this.sizeTween.times[0] || 0,
      centerTime: this.sizeTween.times[1] || 0,
      finalTime: this.sizeTween.times[2] || 0,
      startTws: this.sizeTween.values[0] || 0,
      centerTws: this.sizeTween.values[1] || 0,
      finalTws: this.sizeTween.values[2] || 0,
    };

    sizeT
      .add(sizeTws, "startTime", 0, 60, 0.1)
      .name("起始时间")
      .onChange((e) => {
        this.sizeTween.times[0] = e;
      });

    sizeT
      .add(sizeTws, "centerTime", 0, 60, 0.1)
      .name("时间节点一")
      .onChange((e) => {
        this.sizeTween.times[1] = e;
      });

    sizeT
      .add(sizeTws, "finalTime", 0, 60, 0.1)
      .name("时间节点二")
      .onChange((e) => {
        this.sizeTween.times[2] = e;
      });

    sizeT
      .add(sizeTws, "startTws", 0, 100, 0.1)
      .name("初始状态")
      .onChange((e) => {
        this.sizeTween.values[0] = e;
      });

    sizeT
      .add(sizeTws, "centerTws", 0, 100, 0.1)
      .name("中间状态")
      .onChange((e) => {
        this.sizeTween.values[1] = e;
      });

    sizeT
      .add(sizeTws, "finalTws", 0, 100, 0.1)
      .name("最终状态")
      .onChange((e) => {
        this.sizeTween.values[2] = e;
      });

    const OpTws = {
      startTime: this.opacityTween.times[0] || 0,
      centerTime: this.opacityTween.times[1] || 0,
      finalTime: this.opacityTween.times[2] || 0,
      startTws: this.opacityTween.values[0] || 0,
      centerTws: this.opacityTween.values[1] || 0,
      finalTws: this.opacityTween.values[2] || 0,
    };

    const opacityPanel = pointStatePanel.addFolder("透明度状态");

    opacityPanel
      .add(this, "opacity", 0, 1, 0.01)
      .name("透明度")
      .onChange((e) => {
        this.opacity = e;
      });

    opacityPanel
      .add(this, "opacityRange", 0, 1, 0.01)
      .name("透明度范围")
      .onChange((e) => {
        this.opacityRange = e;
      });

    const opt = opacityPanel.addFolder("透明参数渐变动画");
    opt
      .add(OpTws, "startTime", 0, 60, 0.1)
      .name("初始时间")
      .onChange((e) => {
        this.opacityTween.times[0] = e;
      });

    opt
      .add(OpTws, "centerTime", 0, 60, 0.1)
      .name("状态时间一")
      .onChange((e) => {
        this.opacityTween.times[1] = e;
      });

    opt
      .add(OpTws, "finalTime", 0, 60, 0.1)
      .name("状态时间二")
      .onChange((e) => {
        this.opacityTween.times[2] = e;
      });

    opt
      .add(OpTws, "startTws", 0, 1, 0.01)
      .name("初始透明状态")
      .onChange((e) => {
        this.opacityTween.values[0] = e;
      });

    opt
      .add(OpTws, "centerTws", 0, 1, 0.01)
      .name("透明状态一")
      .onChange((e) => {
        this.opacityTween.values[1] = e;
      });

    opt
      .add(OpTws, "finalTws", 0, 1, 0.01)
      .name("透明状态二")
      .onChange((e) => {
        this.opacityTween.values[2] = e;
      });

    const colorParentPanel = pointStatePanel.addFolder("粒子颜色状态");

    const colorValue = {
      color: this.getColor(this.color),
      colorRange: this.getColor(this.colorRange),
      startTime: this.colorTween.times[0] || 0,
      centerTime: this.colorTween.times[1] || 0,
      finalTime: this.colorTween.times[2] || 0,
      startTW: this.getColor(this.colorTween.values[0]),
      centerTW: this.getColor(this.colorTween.values[1]),
      finalTW: this.getColor(this.colorTween.values[2]),
    };

    // console.log(colorValue);
    colorParentPanel
      .addColor(colorValue, "color")
      .name("初始化颜色")
      .onChange((e) => {
        this.color = this.toColor(e);
      });

    colorParentPanel
      .addColor(colorValue, "colorRange")
      .name("颜色随机范围")
      .onChange((e) => {
        this.colorRange = this.toColor(e);
      });

    const colorPanel =
      colorParentPanel.addFolder("粒子颜色动画（注:先颜色后时间）");

    colorPanel
      .add(colorValue, "startTime", 0, 60, 0.1)
      .name("初始时间")
      .onChange((e) => {
        this.colorTween.times[0] = e;
      });

    colorPanel
      .add(colorValue, "centerTime", 0, 60, 0.1)
      .name("时间状态一")
      .onChange((e) => {
        this.colorTween.times[1] = e;
      });

    colorPanel
      .add(colorValue, "finalTime", 0, 60, 0.1)
      .name("时间状态二")
      .onChange((e) => {
        this.colorTween.times[2] = e;
      });

    colorPanel
      .addColor(colorValue, "startTW")
      .name("初始颜色状态")
      .onChange((e) => {
        this.colorTween.values[0] = this.toColor(e);
      });

    colorPanel
      .addColor(colorValue, "centerTW")
      .name("颜色状态一")
      .onChange((e) => {
        this.colorTween.values[1] = this.toColor(e);
      });

    colorPanel
      .addColor(colorValue, "finalTW")
      .name("颜色状态二")
      .onChange((e) => {
        this.colorTween.values[2] = this.toColor(e);
      });

    const getImg = () => {
      this.importImg((img) => {
        // console.log(img);
        const texture = new THREE.TextureLoader().load(img);
        console.log(texture, "图");
        this.textureURL = img;
        this.map = texture;
      });
    };

    const exportValue = () => {
      const result = this.exportDate();
      console.log(result);
      alert("具体参数请看控制台");
    };
    const events = {
      changeTex: getImg,
      export: exportValue,
      modelView: "AdditiveBlending",
    };
    parentPanels.add(events, "changeTex").name("更换贴图");

    parentPanels.add(events, "export").name("导出调整参数");

    parentPanels
      .add(this, "blendMode", ["AdditiveBlending", "NormalBlending"])
      .name("混合模式")
      .onChange((e) => {
        // console.log(e);
        this.blendMode = e;
        this.mesh.material.blending = THREE[this.blendMode];
      });

    this.panelsVisible = true;

    document.getElementsByClassName("dg ac")[0].style.zIndex = 100000;
  }

  //销毁调试面板
  destroyPanel() {
    this.panelsVisible = false;
    this.panels.destroy();
  }

  getColor(vec3) {
    if (vec3) {
      const cols = new THREE.Color()
        .setHSL(vec3.x, vec3.y, vec3.z)
        .getHexString();

      const colora = `#${cols}`;
      return colora;
    } else {
      const cols = new THREE.Color().setHSL(0, 0, 0).getHexString();
      return `#${cols}`;
    }
  }

  toColor(colors) {
    const color = new THREE.Color(colors);
    let hsl = color.getHSL();
    return new THREE.Vector3(hsl.h, hsl.s, hsl.l);
  }

  importImg(func) {
    let input = document.createElement("input");
    input.type = "file";

    const readFile = () => {
      if (!input.files) {
        return;
      }

      const files = input.files[0];
      const rule = /image.*/;
      if (files.type.match(rule)) {
        const reader = new FileReader();
        reader.onload = () => {
          const image = reader.result;
          if (func) {
            func(image);
          }

          input.removeEventListener("change", readFile, false);
          input = null;
        };
        reader.readAsDataURL(files);
      }
    };

    input.addEventListener("change", readFile, false);
    input.click();
  }

  //导出动画参数
  exportDate() {
    const value = {
      pointSec: this.pointSec,
      name: this.name,
      position: this.position,
      shapeType: this.shapeType,
      positionRange: this.positionRange,
      positionRadius: this.positionRadius,
      positionRadiusRange: this.positionRadiusRange,

      velocityShape: this.velocityShape,
      velocity: this.velocity,
      velocityRange: this.velocityRange,
      speed: this.speed,
      speedRange: this.speedRange,
      acceleration: this.acceleration,
      accelerationRange: this.accelerationRange,

      // age:this.age,
      _deathAge: this._deathAge,
      // pointAge:this.pointAge,
      pointDeathAge: this.pointDeathAge,
      alive: this.alive,
      _loop: this._loop,

      pointNum: this.pointNum,

      angle: this.angle,
      angleRange: this.angleRange,
      angleVelocity: this.angleVelocity,
      angleVelocityRange: this.angleVelocityRange,
      angleAcceleration: this.angleAcceleration,
      angleAccelerationRange: this.angleAccelerationRange,

      size: this.size,
      sizeRange: this.sizeRange,
      sizeTween: this.sizeTween,

      opacity: this.opacity,
      opacityRange: this.opacityRange,
      opacityTween: this.opacityTween,

      color: this.color,
      colorRange: this.colorRange,
      colorTween: this.colorTween,
      textureURL: this.textureURL,
      _texture: this._texture,

      blendMode: this.blendMode,
    };

    return value;
  }

  //单个粒子自身销毁
  dispose() {
    this.mesh.parent.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
