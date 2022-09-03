import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { ARButton } from "../../../yuan-universe2/src/script/ARButtonChange";

import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory";
// import { VRButton } from "../../../yuan-universe2/src/script/VRButton";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import {
  CSS3DRenderer,
  CSS3DObject,
  CSS3DSprite
} from "three/examples/jsm/renderers/CSS3DRenderer";

var checkScene = {
  EnterAR: false,
  hitTestSource: null,
  hitTestSourceRequested: false,
  EnterVR: false,
};

export { checkScene };

class VueScene {
  constructor(id) {
    this.getContainer(id);
    this.initScene();
    this.initRender();
    this.initCamera();
    this.initARCamera();
    this.initControls();
    this.initAmbLight();
    this.EventListen();
    this.Update();
  }

  getContainer(id) {
    let container = document.getElementById(id);
    // console.log(container, "获取到的对象");
    return (this.container = container);
  }

  initScene() {
    let scene = new THREE.Scene();
    // console.log(this.container.offsetHeight, "获取到的div高度");
    // console.log(this.container.offsetWidth, "获取到的宽度");
    return (this.scene = scene);
  }

  initRender() {
    let renders = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renders.setSize(this.container.offsetWidth, this.container.offsetHeight);
    renders.setPixelRatio(window.devicePixelRatio);

    this.container.appendChild(renders.domElement);

    return (this.renders = renders);
  }

  initCSS3DRender() {
    this.css3Render = new CSS3DRenderer();
    this.css3Render.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    );
    this.css3Render.domElement.style.position = "absolute";
    this.css3Render.domElement.style.top = "0%";
    this.container.appendChild(this.css3Render.domElement);

    this.control = new OrbitControls(this.camera, this.css3Render.domElement);
  }

  //渲染阴影的种类
  RendersShadow() {
    const type = THREE.BasicShadowMap;
    return type;
  }

  initCamera() {
    let camera = new THREE.PerspectiveCamera(
      45,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    this.scene.add(camera);
    return (this.camera = camera);
  }

  initARCamera() {
    let ARcamera = new THREE.PerspectiveCamera(
      45,
      this.container.offsetWidth / this.container.offsetHeight,
      0.01,
      20
    );
    this.scene.add(ARcamera);
    return (this.ARcamera = ARcamera);
  }

  initControls() {
    let control = new OrbitControls(this.camera, this.renders.domElement);
    control.enableDamping = true;
    return (this.control = control);
  }

  //帧率显示
  initState() {
    const state = new Stats();
    this.container.appendChild(state.dom);
    return (this.state = state);
  }

  EnterAR = false;

  sceneAnimationId = null;

  Update() {
    this.sceneAnimationId = requestAnimationFrame(this.Update.bind(this));

    if (checkScene.EnterAR == false && checkScene.EnterVR == false) {
      if (this.state) {
        this.state.update();
      }
      this.control.update();

      if (this.bloommodes != true) {
        this.renders.clear();
        this.renders.render(this.scene, this.camera);
      } else if (this.bloommodes == true) {
        this.UnrealBloomUpdate();
      }
    }

    if (this.updates) {
      this.updates();
    }

    if (this.css3Render) {
      this.css3Render.render(this.scene, this.camera);
    }

    // console.log('个人内心');
  }

  //场景销毁
  SceneDestory() {
    cancelAnimationFrame(this.sceneAnimationId);
    this.scene.traverse((child) => {
      if (child.material) {
        child.material.dispose();
      }
      if (child.geometry) {
        child.geometry.dispose();
      }
      child = null;
    });

    this.container.innerHTML = "";
    this.renders.dispose();
    this.scene.clear();
    this.scene = null;
    this.renders.forceContextLoss();
    this.renders = null;
    this.camera = null;
    this.control = null;
    this.container = null;

    this.destroyAppleARButton();

    // window.removeEventListener('resize', this.windowResize.bind(this), true)

    console.log("场景销毁完成");
  }

  EventListen() {
    window.addEventListener("resize", this.windowResize.bind(this), false);
  }

  windowResize() {
    if (this.camera) {
      this.camera.aspect =
        this.container.offsetWidth / this.container.offsetHeight;
      this.camera.updateProjectionMatrix();
    }
    if (this.renders) {
      this.renders.setSize(
        this.container.offsetWidth,
        this.container.offsetHeight
      );
    }

    if (this.css3Render) {
      this.css3Render.setSize(
        this.container.offsetWidth,
        this.container.offsetHeight
      );
    }

    // console.log('窗口自适应');
  }

  initAmbLight() {
    let amb = new THREE.AmbientLight("#fff", 0.2);
    this.scene.add(amb);
    return (this.ambientLight = amb);
  }

  axesHelper(length = 100) {
    let axeshelper = new THREE.AxesHelper(length);
    this.scene.add(axeshelper);
    return (this.axeshelper = axeshelper);
  }

  setVideoAsTexture(video) {
    return new THREE.VideoTexture(video);
  }

  //设置canvas贴图
  setCanvasTexture(data) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = data;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1024, 1024);
        const texture = new THREE.CanvasTexture(canvas, (map) => {
          map.wrapS = map.wrapT = THREE.RepeatWrapping;
        });
        resolve(texture);
      };
    });
  }

  loadTexture(fileUrl) {
    let textures = new THREE.TextureLoader().load(fileUrl);
    return textures;
  }

  loadTexture_Y(fileUrl) {
    return new Promise((r) => {
      new THREE.TextureLoader().load(fileUrl, (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        r(texture);
      });
    });
  }

  loadSkyBox(url) {
    let skycube = new THREE.CubeTextureLoader()
      .setPath(url)
      .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
    return skycube;
  }

  SetMaterial(objects, side) {
    if (objects) {
      let materials = new THREE.MeshStandardMaterial(objects);
      if (side == true) {
        materials.side = THREE.DoubleSide;
      }
      return materials;
    }
  }
  setRawShaderMaterial(object) {
    if (object) {
      const material = new THREE.RawShaderMaterial(object);
      material.side = THREE.DoubleSide;
      return material;
    }
  }

  setShaderMaterial(object) {
    if (object) {
      const material = new THREE.ShaderMaterial(object);
      material.side = THREE.DoubleSide;
      return material;
    }
  }

  addSpotlight(color = "#fff", intensity = 1, shadow) {
    let lights = new THREE.SpotLight(color, intensity);
    if (shadow == true) {
      lights.castShadow = true;
    }
    return lights;
  }

  spotHelper(spot) {
    let helper = new THREE.SpotLightHelper(spot);
    return helper;
  }

  addPointLight(color = 0xffffff, intensity = 1, distance = 100) {
    let lights = new THREE.PointLight(color, intensity, distance);
    return lights;
  }

  PointlightHelper(light, size = 1) {
    let helper = new THREE.PointLightHelper(light, size);
    return helper;
  }

  AddHemisphereLight(
    skyColor = "0xfff",
    groundColor = "0xfff",
    intensity = 0.5
  ) {
    let lights = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    return lights;
  }

  addDirectionLight(color, intensity) {
    // else if (type == "direction") {
    let light = new THREE.DirectionalLight(color, intensity);
    return light;
    // }
  }

  DracoLoaders(url) {
    let draconian = new DRACOLoader();
    draconian.setDecoderPath(url);
    return draconian;
  }

  initRaycaster() {
    const raycaster = new THREE.Raycaster();
    return (this.raycaster = raycaster);
  }

  async TextModel(contain, objects, fontsUrl) {
    const loaders = new FontLoader();

    if (fontsUrl == null) {
      fontsUrl = "./regular.json";
    }

    return new Promise((r) => {
      loaders.load(fontsUrl, function (fonts) {
        let textGeo = new TextGeometry(contain, {
          font: fonts,
          size: 30,
          height: 1,
          curveSegments: 5,
          bevelEnabled: true,
          bevelThickness: 5,
          bevelSize: 2,
          bevelSegments: 2,
        });

        let materials = new THREE.MeshStandardMaterial(objects);
        let textMesh = new THREE.Mesh(textGeo, materials);
        textMesh.castShadow = true;
        r(textMesh);
      });
    });
  }

  //获取模型自身动画
  GetMixer(object) {
    this.mixer = true;
    let mixer = new THREE.AnimationMixer(object);
    return mixer;
  }

  SetGroup() {
    let groups = new THREE.Group();
    return groups;
  }

  Clocks() {
    let clocks = new THREE.Clock();
    return clocks;
  }

  //获取加载进度
  getprogress(data) {
    console.log(data);
  }

  LoadModel(FileUrl, func, Draco) {
    return new Promise((resolve) => {
      let loaders = null;
      if (FileUrl.indexOf("gl") > -1 || FileUrl.indexOf("glb") > -1) {
        // console.log("你好");
        loaders = new GLTFLoader();
        if (Draco) {
          loaders.setDRACOLoader(Draco);
        }
        loaders.load(
          FileUrl,
          (object) => {
            object.scene.receiveShadow = true;
            resolve(object);
          },
          (xhr) => {
            if (func) {
              func(xhr);
            }
          }
        );
      } else if (FileUrl.indexOf("fbx") > -1) {
        loaders = new FBXLoader();
        loaders.load(
          FileUrl,
          (object) => {
            object.receiveShadow = true;
            resolve(object);
          },
          (xhr) => {
            if (func) {
              func(xhr);
            }
          }
        );
      }
    });
  }

  //外部加载
  ModelLoaderFrom(filename, data) {
    return new Promise((resolve) => {
      let loader;
      if (filename.indexOf(".fbx") > -1) {
        loader = new FBXLoader(new THREE.LoadingManager());
        let loadmode = loader.parse(data);
        resolve(loadmode);
      } else if (filename.indexOf(".gl") > -1) {
        loader = new GLTFLoader();
        loader.parse(data, "", (result) => {
          resolve(result.scene);
        });
      }
    });
  }

  createBox(
    size,
    styles = {
      color: "#fff",
    }
  ) {
    const geos = new THREE.BoxBufferGeometry(size, size, size);
    const mats = new THREE.MeshStandardMaterial(styles);
    mats.side = THREE.DoubleSide;
    const box = new THREE.Mesh(geos, mats);
    return box;
  }

  createPlaneGeometry(
    height = 1000,
    width = 1000,
    heightSize = 99,
    wigthSize = 99
  ) {
    const geometry = new THREE.PlaneGeometry(
      height,
      width,
      heightSize,
      wigthSize
    );
    return geometry;
  }

  createSphere(radis = 15, widthseg = 32, heightseg = 16) {
    const geometry = new THREE.SphereGeometry(radis, widthseg, heightseg);
    return geometry;
  }

  createMesh(geo, mat) {
    const model = new THREE.Mesh(geo, mat);
    return model;
  }

  Vec3Obj(x, y, z) {
    return new THREE.Vector3(x, y, z);
  }

  Obj3D() {
    let objects = new THREE.Object3D();
    return objects;
  }

  //初始化导出插件的下载按钮
  initExport() {
    this.downloadLink = document.createElement("a");
    this.downloadLink.style.display = "none";
  }

  //gltf模型导出器(第三个属性值为导出的gltf模型格式false为gltf若为true则为glb)
  glTF_Export(inputModel, filename = "model", type = false) {
    const options = {
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      binary: type,
      maxTextureSize: 4096,
    };

    const exporter = new GLTFExporter();
    exporter.parse(
      inputModel,
      (result) => {
        if (result instanceof ArrayBuffer) {
          this.saveArrayBuffer(result, `${filename}.glb`);
        } else {
          const output = JSON.stringify(result, null, 2);
          console.log(output, "输出值");
          this.saveString(output, `${filename}.gltf`);
        }
      },
      (error) => {
        console.log("导出错误", error);
      },
      options
    );
  }

  saveString(text, filename) {
    this.saveDownLoad(new Blob([text], { type: "text/plain" }), filename);
  }

  saveArrayBuffer(buffer, filename) {
    this.saveDownLoad(
      new Blob([buffer], { type: "application/octet-stream" }),
      filename
    );
  }

  saveDownLoad(blob, filename) {
    this.downloadLink.href = URL.createObjectURL(blob);
    this.downloadLink.download = filename;
    this.downloadLink.click();
  }

  //默认给AR控制器的事件监听
  onSelects() {
    if (this.MoveCursor == true) {
      //双击摄像机屏幕之后，在圆环出创建模型（圆柱）
      if (this.reticle.visible) {
        const geometry = new THREE.CylinderGeometry(
          0.1,
          0.1,
          0.2,
          32
        ).translate(0, 0.1, 0);
        const material = new THREE.MeshPhongMaterial({
          color: 0xffffff * Math.random(),
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.setFromMatrixPosition(this.reticle.matrix);
        mesh.scale.y = Math.random() * 2 + 1;
        this.scene.add(mesh);
      }
    }
  }

  //增加AR控制器的事件监听
  addAREvent(event = "select", func = this.onSelects.bind(this)) {
    this.ARcontroller.addEventListener(event, () => {
      func();
    });
  }

  //AR地面光标
  ARreticle() {
    this.reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial()
    );

    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    this.scene.add(this.reticle);
  }

  MoveCursor = false; //是否启用定位游标

  ARmode(state) {
    if (state == "移动光标") {
      this.MoveCursor = true;
      this.ARreticle();
    }
    //--------------------
    this.renders.xr.enabled = true;
    // let AR_contain = document.createElement("div");
    this.container.appendChild(
      ARButton.createButton(this.renders, {
        requiredFeatures: ["hit-test"],
      })
    );

    this.ARcontroller = this.renders.xr.getController(0);
    //AR控制器的事件监听
    // this.ARcontroller.addEventListener("select", this.onSelects.bind(this));

    this.scene.add(this.ARcontroller);

    this.ARUpdate();
  }

  ARUpdate() {
    this.renders.setAnimationLoop(this.ARDataUpdate.bind(this));
  }

  ARDataUpdate(timestamp, frame) {
    if (frame) {
      const referenceSpace = this.renders.xr.getReferenceSpace();
      const session = this.renders.xr.getSession();

      if (checkScene.hitTestSourceRequested == false) {
        console.log(session, "数据s");
        session.requestReferenceSpace("viewer").then(function (referenceSpace) {
          console.log(referenceSpace, "创建数据");
          session
            .requestHitTestSource({
              space: referenceSpace,
            })
            .then(function (source) {
              console.log(source);
              checkScene.hitTestSource = source;
              // console.log(this,"对象");
            });
        });

        session.addEventListener("end", function () {
          checkScene.hitTestSourceRequested = false;
          checkScene.hitTestSource = null;
        });

        checkScene.hitTestSourceRequested = true;
      }

      if (checkScene.hitTestSource) {
        const hitTestResults = frame.getHitTestResults(
          checkScene.hitTestSource
        );

        if (this.MoveCursor == true) {
          if (hitTestResults.length) {
            const hit = hitTestResults[0];

            this.reticle.visible = true;
            this.reticle.matrix.fromArray(
              hit.getPose(referenceSpace).transform.matrix
            );
          } else {
            this.reticle.visible = false;
          }
        }
      }
    }
    if (checkScene.EnterAR == true) {
      this.renders.render(this.scene, this.ARcamera);
    }
  }

  ARforApple() {
    this.renders.toneMapping = THREE.ACESFilmicToneMapping;
    this.renders.outputEncoding = THREE.sRGBEncoding;

    const pmremGenerator = new THREE.PMREMGenerator(this.renders);

    this.scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    // const loader=new GLTFLoader().setPath('')

    this.appleARExporter = new USDZExporter();
  }

  AppleARButton(blob) {
    this.applelinks = document.createElement("a");
    this.applelinks.rel = "ar";
    this.applelinks.id = "link";
    this.applelinks.href = "";
    this.applelinks.download = "Tokay.usdz";
    document.body.appendChild(this.applelinks);
    const img = document.createElement("img");
    img.id = "button";
    img.width = "100";
    img.src = "./arkit.png";
    this.applelinks.appendChild(img);
    this.applelinks.style.position = "absolute";
    this.applelinks.style.bottom = "15px";
    this.applelinks.style.left = "calc(50%-40px)";
    this.applelinks.href = URL.createObjectURL(blob);
    img.onclick = () => {
      this.applelinks.click();
      alert("按钮点击");
    };
  }

  async ARMeshForApple(mesh) {
    const arraybuffer = await this.appleARExporter.parse(mesh);
    const blob = new Blob([arraybuffer], {
      type: "application/octet-stream",
    });
    this.AppleARButton(blob);
  }

  destroyAppleARButton() {
    if (this.applelinks) {
      document.body.removeChild(this.applelinks);
      this.applelinks = null;
    }
  }

  //--------------------------=========----------------------
  //创建2套UV(AoMap)
  CreateUV2(geometry) {
    geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
    );
  }

  //--------------------------后期通道-------------------------------------

  EffectsPass() {
    const effectcomposers = new EffectComposer(this.renders);
    return (this.effectcomposers = effectcomposers);
  }

  EffectsPassResize() {
    this.effectcomposers.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    );
  }

  EffectsPass2() {
    const effectcomposers2 = new EffectComposer(this.renders);
    return (this.effectcomposers2 = effectcomposers2);
  }

  Effects2PassResize() {
    this.effectcomposers2.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    );
  }

  RenderScenePass() {
    const renderSceneComposer = new RenderPass(this.scene, this.camera);
    return (this.renderSceneComposer = renderSceneComposer);
  }

  SceneShaderPASS() {
    const shadersmat = new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: {
          value: null,
        },
        bloomTexture: {
          value: this.effectcomposers.renderTarget2.texture,
        },
      },
      vertexShader:
        "varying vec2 vUv;" +
        "void main() {" +
        "vUv = uv;" +
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );" +
        "}",
      fragmentShader:
        "uniform sampler2D baseTexture;" +
        "uniform sampler2D bloomTexture;" +
        "varying vec2 vUv;" +
        "void main() {" +
        " gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );" +
        " }",
    });
    const Sceneshaderpass = new ShaderPass(shadersmat, "baseTexture");
    Sceneshaderpass.needsSwap = true;
    return (this.Sceneshaderpass = Sceneshaderpass);
  }

  BloomLayer() {
    const bloom_Layer = new THREE.Layers();
    bloom_Layer.set(this.Bloom_Scene);
    return (this.bloom_Layer = bloom_Layer);
  }

  //开启辉光模式（调用）
  UnrealBloomMode() {
    this.bloommodes = true;
    this.Init_Scene = 0;
    this.Bloom_Scene = 1;
    this.renders.toneMapping = THREE.ReinhardToneMapping;

    this.EffectsPass();
    this.EffectsPass2();
    this.RenderScenePass();
    this.BloomLayer();

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        this.container.offsetWidth,
        this.container.offsetHeight
      ),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = 0;
    this.bloomPass.strength = 1.5; //5
    this.bloomPass.radius = 0;

    this.effectcomposers.renderToScreen = false;
    this.effectcomposers.addPass(this.renderSceneComposer);
    this.effectcomposers.addPass(this.bloomPass);
    this.SceneShaderPASS();

    // console.log(this.effectcomposers2);
    this.effectcomposers2.addPass(this.renderSceneComposer);
    this.effectcomposers2.addPass(this.Sceneshaderpass);
    this.UnrealBloomUpdate();
  }

  materials = {};

  darkMaterial = new THREE.MeshBasicMaterial({
    color: "black",
  });

  //辉光渲染更新（调用）(已经集成了)
  UnrealBloomUpdate() {
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.isMesh && this.bloom_Layer.test(obj.layers) === false) {
          this.materials[obj.uuid] = obj.material;
          obj.material = this.darkMaterial;
        }
      });
    }

    this.effectcomposers.render();

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (this.materials[obj.uuid]) {
          obj.material = this.materials[obj.uuid];
          delete this.materials[obj.uuid];
        }
      });
    }

    this.effectcomposers2.render();
  }

  //给对象增加辉光效果
  BloomObjectAdd(object) {
    object.layers.toggle(1);
  }

  //------------------------------VR模式--------------------------

  EnterVR() {
    this.renders.outputEncoding = THREE.sRGBEncoding;
    this.renders.xr.enabled = true;

    this.initVRMovePlane(); //初始化VR移动台
    this.container.appendChild(VRButton.createButton(this.renders));
    this.initVRCamera(); //初始化VR相机
    this.initVRControl(); //初始化VR控制器
    this.VRUpdate(); //VR场景更新
  }

  initVRMovePlane() {
    this.VRmovePlane = this.Obj3D();
    this.VRmovePlane.name = "VR移动台";
    this.VRmovePlane.position.z = 2;
    this.scene.add(this.VRmovePlane);
  }

  //VR控制器
  initVRControl() {
    this.VRcontroller1 = this.renders.xr.getController(0);
    this.VRcontroller1.addEventListener(
      "selectstart",
      this.VROnSelectStart.bind(this)
    );
    this.VRcontroller1.addEventListener(
      "selected",
      this.VROnSelectEnd.bind(this)
    );
    this.VRcontroller2 = this.renders.xr.getController(1);
    this.VRcontroller2.addEventListener(
      "selectstart",
      this.VROnSelectStart.bind(this)
    );
    this.VRcontroller2.addEventListener(
      "selected",
      this.VROnSelectEnd.bind(this)
    );

    // this.scene.add(this.VRcontroller1);
    // this.scene.add(this.VRcontroller2);
    this.VRmovePlane.add(this.VRcontroller1);
    this.VRmovePlane.add(this.VRcontroller2);

    this.initVRChooseGroup();
    this.initTempMatrix();
    this.VRControlModel();
    this.initRaycaster();
  }

  VRControlModel() {
    const controllerModelFactory = new XRControllerModelFactory();

    this.controllerGrip1 = this.renders.xr.getControllerGrip(0);
    this.controllerGrip1.add(
      controllerModelFactory.createControllerModel(this.controllerGrip1)
    );
    // this.scene.add(this.controllerGrip1);
    this.VRmovePlane.add(this.controllerGrip1);

    this.controllerGrip2 = this.renders.xr.getControllerGrip(1);
    this.controllerGrip2.add(
      controllerModelFactory.createControllerModel(this.controllerGrip2)
    );
    // this.scene.add(this.controllerGrip2);
    this.VRmovePlane.add(this.controllerGrip2);
    this.VRControlLine();
  }

  VRControlLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]);
    const line = new THREE.Line(geometry);
    line.name = "VRline";
    line.scale.z = 5;
    this.controllerGrip1.add(line.clone());
    this.controllerGrip2.add(line.clone());
  }

  initTempMatrix() {
    this.tempMatrix = new THREE.Matrix4();
  }

  initVRChooseGroup() {
    this.VRchooseGroup = this.SetGroup();
    this.VRchooseGroup.name = "可以被VR手柄选中的对象";
    this.scene.add(this.VRchooseGroup);
  }

  initVRCamera() {
    this.VRCamera = new THREE.PerspectiveCamera(
      50,
      this.container.offsetWidth / this.container.offsetHeight,
      0.01,
      100
    );
    this.VRCamera.position.set(0, 1.6, 3);
    this.VRmovePlane.add(this.VRCamera);
  }

  //VR手柄选择开始事件
  VROnSelectStart(event) {
    const controller = event.target;
    const intersections = this.getIntersections(controller);
    if (intersections.length > 0) {
      const intersection = intersections[0];
      const object = intersection.object;
      object.material.emissive.b = 1;
      controller.attach(object);
      controller.userData.selected = object;
    }
  }

  VROnSelectEnd(event) {
    const controller = event.target;
    if (controller.userData.selected !== undefined) {
      const object = controller.userData.selected;
      object.material.emissive.b = 0;
      this.VRchooseGroup.attach(object);
      controller.userData.selected = undefined;
    }
  }

  getIntersections(controller) {
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
    return this.raycaster.intersectObjects(this.VRchooseGroup.children);
  }

  intersected = []; //被手柄划过的物体组
  //物体被手柄指到
  ObjectBeChoose(controller) {
    if (controller.userData.selected !== undefined) return;
    const line = controller.getObjectByName("VRline");
    const intersections = this.getIntersections(controller);
    if (intersections.length > 0) {
      const intersection = intersections[0];
      const object = intersection.object;
      object.material.emissive.r = 1;
      this.intersected.push(object);
      if (line) {
        line.scale.z = intersection.distance;
      }
    } else {
      if (line) {
        line.scale.z = 5;
      }
    }
  }

  ClearObjectBeChoose() {
    while (this.intersected.length) {
      const object = this.intersected.pop();
      object.material.emissive.r = 0;
    }
  }
  VRUpdate() {
    this.renders.setAnimationLoop(this.VRdataUpdate.bind(this));
  }

  VRdataUpdate() {
    if (checkScene.EnterVR == true) {
      this.ClearObjectBeChoose();
      this.ObjectBeChoose(this.VRcontroller1);
      this.ObjectBeChoose(this.VRcontroller2);
      this.renders.clear();
      this.renders.render(this.scene, this.VRCamera);
    }
  }

  //点击模式
  initMouse() {
    this.mouse = new THREE.Vector2();
  }

  //点击模式
  clickMode() {
    // this.initRayCaster();
    this.initMouse();
    this.initRaycaster();
    this.clickGroup = [];
  }

  //鼠标移动事件(鼠标移动必定加)
  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  //点击射线更新事件
  ClickUpdate(func, func2) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 计算物体和射线的焦点
    const intersects = this.raycaster.intersectObjects(this.clickGroup);
    // console.log(intersects, "结果");
    if (intersects.length > 0) {
      const clickObject = intersects[0];
      if (func) {
        func(clickObject);
      }
    } else {
      if (func2) {
        func2();
      }
    }
  }

  addCSS3Object(div) {
    const object = new CSS3DObject(div);
    return object;
  }


  addCSS3Sprite(div) {
    const object = new CSS3DSprite(div);
    return object;
  }

  powerDesiger() {
    this.designer = {
      Name: "米大饭",
      EnglishName: "Wade",
      blog: "https://blog.csdn.net/weixin_43980651?spm=1010.2135.3001.5343",
      // descirbe:""
    };
  }
}

export default VueScene;
