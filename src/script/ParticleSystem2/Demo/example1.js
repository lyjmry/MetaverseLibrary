const star = {
    pointSec: 2000,
    name: "流星",
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    shapeType: "sphere",
    positionRange: {
      x: 0,
      y: 0,
      z: 0,
    },
    positionRadius: 1,
    positionRadiusRange: 0,
    velocityShape: "sphere",
    velocity: {
      x: 9,
      y: 0,
      z: 0,
    },
    velocityRange: {
      x: 0,
      y: 0,
      z: 0,
    },
    speed: 5.4,
    speedRange: 0,
    acceleration: {
      x: 100,
      y: 0,
      z: 0,
    },
    accelerationRange: {
      x: 0,
      y: 0,
      z: 0,
    },
    // age:1,
    _deathAge: 60,
    pointDeathAge: 1,
    alive: true,
    _loop: true,
    pointNum: 2000,
    angle: 27.200000000000003,
    angleRange: 19,
    angleVelocity: 43.6,
    angleVelocityRange: 51.900000000000006,
    angleAcceleration: 84.80000000000001,
    angleAccelerationRange: 35.4,
    size: 5.300000000000001,
    sizeRange: 3,
    sizeTween: {
      times: [0, 3, 3],
      values: [11, 2.6, 0],
    },
    opacity: 1,
    opacityRange: 1,
    opacityTween: {
      times: [0, 0.5, 1],
      values: [1, 0.55, 0],
    },
    color: {
      x: 0.43137254901960786,
      y: 0.43137254901960786,
      z: 0.43137254901960786,
    },
    colorRange: {
      x: 1,
      y: 1,
      z: 1,
    },
    colorTween: {
      times: [],
      values: [],
    },
    textureURL:
      "data:image/png;base64,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",
    _texture: {
      metadata: {
        version: 4.5,
        type: "Texture",
        generator: "Texture.toJSON",
      },
      uuid: "D4D97EDB-D95F-4A06-88BF-5A3943AAB61E",
      name: "",
      mapping: 300,
      repeat: [1, 1],
      offset: [0, 0],
      center: [0, 0],
      rotation: 0,
      wrap: [1001, 1001],
      format: 1023,
      type: 1009,
      encoding: 3000,
      minFilter: 1008,
      magFilter: 1006,
      anisotropy: 1,
      flipY: true,
      premultiplyAlpha: false,
      unpackAlignment: 4,
      image: "A5FBC358-27DE-418C-B712-B0AF9C60526D",
    },
    blendMode: "AdditiveBlending",
  };




  const exampleData={
      star:star
  }




  export {exampleData}