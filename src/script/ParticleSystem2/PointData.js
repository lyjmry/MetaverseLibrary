//创建一个点的变换属性的实例添加参数可以变换

import * as THREE from "three";

const alpha1 = Math.PI / 180;
export default class PointAttributeData {
  constructor(param) {
    this.shapeType = "sphere"; //cube方块型""cube"
    this.position = new THREE.Vector3();
    this.positionRange = new THREE.Vector3(); //针对shapeType==‘cube’有效果
    this.positionRadius = 0; //针对shapeType为sphere有效果
    this.positionRadiusRange = 0; //

    this.velocityShape = "cube"; //sphere 或者cube
    this.velocity = new THREE.Vector3(); //速度三个方向的速度
    this.velocityRange = new THREE.Vector3();
    this.speed = 0;
    this.speedRange = 0;
    this.acceleration = new THREE.Vector3(); //三个方向的加速度
    this.accelerationRange = new THREE.Vector3();

    this.alive = 0; //可见性

    this.age = 0;
    this.deathAge = 1;
    // this.deathAgeRange = 0; //随机生命周期（百分比）

    this.angle = 0; //角度
    this.angleRange = 0;
    this.angleVelocity = 0; //初始化旋转速度
    this.angleVelocityRange = 0;
    this.angleAcceleration = 0; //旋转加速度
    this.angleAccelerationRange = 0;

    this.size = 0; //尺寸大小
    this.sizeRange = 0;
    this.sizeTween = null; //尺寸变化补间动画

    this.opacity = 1; //透明度
    this.opacityRange = 0;
    this.opacityTween = null;

    this.color = new THREE.Color();
    this.colorRange = new THREE.Color();
    this.colorTween = null;

    this.dataCombine(param);
    this.dataSave();
    this.createRandomData();
  }

  

  //数据存储最开始的状态
  dataSave() {
    this.defaultPosition = this.position.clone();
  }

  //数据合并
  dataCombine(param) {
    Object.assign(this, param);
  }

  //点的位置随机变化规律
  createRandomData() {
    if (this.shapeType == "cube") {
      this.position = this.randomChange(this.position, this.positionRange);
    } else if (this.shapeType == "sphere") {
      this.positionRadius = this.randomChange(
        this.positionRadius,
        this.positionRadiusRange
      );
      const z = 2 * Math.random() - 1;
      const t = Math.PI * 2 * Math.random();
      const r = Math.sqrt(1 - z * z);
      const vec3 = new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z);
      this.position = new THREE.Vector3().addVectors(
        this.position,
        vec3.multiplyScalar(this.positionRadius)
      );
    }

    if (this.velocityShape == "cube") {
      this.velocity = this.randomChange(this.velocity, this.velocityRange);
    } else if (this.velocityShape == "sphere") {
      const direction = new THREE.Vector3().subVectors(
        this.position,
        this.defaultPosition
      );
      const speeds = this.randomChange(this.speed, this.speedRange);
      this.velocity = direction.normalize().multiplyScalar(speeds);
    }

    this.acceleration = this.randomChange(
      this.acceleration,
      this.accelerationRange
    );

    this.angle = this.randomChange(this.angle, this.angleRange);
    this.angleVelocity = this.randomChange(
      this.angleVelocity,
      this.angleVelocityRange
    );
    this.angleAcceleration = this.randomChange(
      this.angleAcceleration,
      this.angleAccelerationRange
    );

    this.size = this.randomChange(this.size, this.sizeRange);

    this.opacity = this.randomChange(this.opacity, this.opacityRange);

    const colors = this.randomChange(this.color, this.colorRange);
    this.color = new THREE.Color().setHSL(colors.x, colors.y, colors.z);
  }

  //在指定范围内部随机
  randomChange(min, max) {
    if (min instanceof THREE.Vector3 && max instanceof THREE.Vector3) {
      const randVec3 = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      );
      return new THREE.Vector3().addVectors(
        min,
        new THREE.Vector3().multiplyVectors(max, randVec3)
      );
    } else {
      return min + max * (Math.random() - 0.5);
    }
  }

  //参数同步更新
  update(time) {
    this.position.add(this.velocity.clone().multiplyScalar(time));
    this.velocity.add(this.acceleration.clone().multiplyScalar(time));

    this.angle += this.angleVelocity * alpha1 * time;
    this.angleVelocity += this.angleAcceleration * alpha1 * time;

    if (this.sizeTween.times.length > 0) {
      this.size = this.sizeTween.lerp(this.age);
    }

    if (this.opacityTween.times.length > 0) {
      this.opacity = this.opacityTween.lerp(this.age);
    }

    if (this.colorTween.times.length > 0) {
      const colorHSL = this.colorTween.lerp(this.age);
      this.color = new THREE.Color().setHSL(colorHSL.x, colorHSL.y, colorHSL.z);
    }

    this.age += time;
  }
}
