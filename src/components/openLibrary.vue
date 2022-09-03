<template>
  <div id="open3d"></div>
</template>

<script>
import { onBeforeUnmount, onMounted } from "vue";
import VueScene from "../script/View3D";
import * as THREE from "three";
import Particles from "../script/ParticleSystem2/ParticleEngine";
import TWEEN from "tween";
// import { getApi } from "../script/getData";

let opens;
let screen, screen1, screen2;
let centerBook;

let particles;
let books;
let mixer;
let clips;

let booksOpen;
let ps;

let inputBbd;
let pages;

export default {
  setup() {
    onMounted(() => {
      opens = new VueScene("open3d");
      window.opens = opens;
      opens.camera.position.set(10, 13, -20);
      opens.camera.lookAt(0, 2, 0);

      opens.initCSS3DRender();

      opens.control.target = new THREE.Vector3(0, 2, 0);
      opens.control.enablePan = false;
      opens.control.maxDistance=24
      opens.control.maxPolarAngle=Math.PI/2.1

      opens.control.enableDamping = true;

      const sphere = opens.createSphere(100, 100, 100);
      const spmat = new THREE.MeshBasicMaterial({
        map: opens.loadTexture("./skycube/主场景贴图.png"),
        side: THREE.BackSide,
      });
      const skySphere = new THREE.Mesh(sphere, spmat);
      opens.scene.add(skySphere);
      opens.ambientLight.intensity = 0.8;

      const light = opens.addDirectionLight(0xffffff, 2);
      light.position.set(10, 20, 10);
      opens.scene.add(light);

      const light2 = opens.addSpotlight(0xffffff, 1);
      light2.position.set(0, 5, 0);
      const helper = opens.spotHelper(light2);
      opens.scene.add(light2);
      // opens.scene.add(helper);

      //辉光
      opens.UnrealBloomMode();
      // opens.bloomPass.strength = 1.8;
      opens.bloomPass.radius = 1;

      //点击事件
      initClickEvent();

      ps = 0;
      initModel();
      let num = 0;
      let rot = 0.005;
      opens.updates = () => {
        TWEEN.update();
        if (screen && screen1 && screen2) {
          screen.rotation.y += rot;
          screen1.rotation.y += rot;
          screen2.rotation.y += rot;
        }
        if (centerBook) {
          centerBook.rotation.y += 0.004;
          centerBook.position.y = Math.sin(num) / 2 + 3.5 + ps;

          num += 0.01;
        }
        if (mixer) {
          mixer.update(0.012);
        }

        if (particles) {
          particles.update(0.013);
        }
      };

      initParticle();

      initSearch();
    });

    onBeforeUnmount(() => {
      window.removeEventListener("click", clickEvents, false);
      opens.SceneDestory();
    });

    //点击事件
    const initClickEvent = () => {
      opens.clickMode();

      window.addEventListener("click", clickEvents, false);
    };

    const clickEvents = (event) => {
      opens.onMouseMove(event);
      opens.ClickUpdate((clickObject) => {
        console.log(clickObject.object, "鼠标点击的对象");
        if (clickObject.object.name == "zhongjiantushulight") {
          ps = -10;
          moveTween();
        } else if (clickObject.object.name == "up") {
        } else if (clickObject.object.name == "down") {
        } else if (clickObject.object.name == "exit") {
          exits();
          ps = 0;
        }
      });
    };

    const initModel = async () => {
      const mat1 = new THREE.MeshBasicMaterial({
        color: "#46A9E6",
        alphaMap: new THREE.TextureLoader().load(
          "./textures/yuan.png",
          (map) => {
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.repeat.set(-1, -1);
            map.offset.set(-0.02, 0);
          }
        ),
        transparent: true,
        side: THREE.DoubleSide,
        // emissive: "skyblue",
      });

      const mat2 = new THREE.MeshBasicMaterial({
        color: "#46A9E6",
        alphaMap: new THREE.TextureLoader().load(
          "./textures/library.png",
          (map) => {
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.repeat.set(-1, -1);
            // console.log(map);
            map.offset.set(0.02, 0);
          }
        ),
        transparent: true,
        side: THREE.DoubleSide,
        // emissive: "skyblue",
      });

      const library = await opens.LoadModel(
        "./library/builds1.glb",
        (xhr) => {
          const loads = (xhr.loaded / xhr.total) * 100 + "% loaded";
          console.log(loads);
        }
      );

      library.scene.traverse((child) => {
        if (child.name.indexOf("light") > -1) {
          opens.BloomObjectAdd(child);
        } else if (child.name == "shujia") {
          // console.log(child);
          child.children[2].material = new THREE.MeshStandardMaterial({
            color: "#40E6B3",
            emissive: "#40E6B3",
            emissiveIntensity: 2,
          });
        }

        if (child.name == "zhongjiantushulight") {
          centerBook = child;
          opens.clickGroup.push(child);
        } else if (child.name == "pingmu1light") {
          child.material = mat1;
          screen = child;
          child.renderOrder = 20;
        } else if (child.name == "pingmu13light") {
          screen1 = child;
          child.material = mat2;
          child.renderOrder = 10;
        } else if (child.name == "pingmu2light") {
          screen2 = child;
          child.material = mat2;
          child.renderOrder = 15;
        }
        // else if (child.name == "tianhuaban") {
        //   console.log(child, "天花板");
        //   child.children[0].material = child.children[1].material =
        //     new THREE.MeshBasicMaterial({
        //       map: new THREE.TextureLoader().load(
        //         "./textures/stars.jpeg"
        //       ),
        //     });
        // }

        if (child.material) {
          if (child.material.name == "pingmucaizhi") {
            child.material = new THREE.MeshBasicMaterial({
              map: new THREE.TextureLoader().load(
                "./textures/stars.jpeg"
              ),
            });
          }
          // if (child.material.emissive) {
          //   if (
          //     child.material.emissive.r == 0 &&
          //     child.material.emissive.g == 0 &&
          //     child.material.emissive.b == 0
          //   ) {
          //     child.material.emissive = child.material.color;
          //   }
          // }
        }
        //   }
        // }
      });

      opens.scene.add(library.scene);

      const littlebooks = await opens.LoadModel(
        "./library/newBooks.fbx"
      );

      littlebooks.traverse((child) => {
        if (child.isMesh) {
          if (child.name == "up") {
            child.material = new THREE.MeshBasicMaterial({
              map: new THREE.TextureLoader().load(
                "./textures/上一页.png"
              ),
              // color: "red",
              transparent: true,
            });
            opens.clickGroup.push(child);
            child.renderOrder = 20;
          } else if (child.name == "down") {
            child.material = new THREE.MeshBasicMaterial({
              // color: "green",
              map: new THREE.TextureLoader().load(
                "./textures/下一页.png"
              ),
              transparent: true,
            });
            opens.clickGroup.push(child);
            child.renderOrder = 21;
          } else if (child.name == "exit") {
            child.material = new THREE.MeshStandardMaterial({
              alphaMap: new THREE.TextureLoader().load(
                "./textures/退出.png"
              ),
              color: "skyblue",
              emissive: "skyblue",
              emissiveIntensity: 2,
              transparent: true,
              // depthWrite: false,
            });
            opens.clickGroup.push(child);
            child.renderOrder = 100;
          } else if (child.name == "pages") {
            child.material = new THREE.MeshStandardMaterial({
              map: new THREE.TextureLoader().load(
                "./textures/pics.jpeg",
                (map) => {
                  map.wrapS = map.wrapT = THREE.RepeatWrapping;
                  map.repeat.set(5, 5);
                }
              ),
              transparent: true,
              // emissive: "white",
            });
            child.renderOrder = 23;
          } else if (child.name == "screen") {
            child.material = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
            });
            pages = child;
          } else {
            console.log(child);
          }
        }
      });

      books = new THREE.Group();
      books.add(littlebooks);

      books.visible = false;
      // books.rotation.z = -Math.PI / 2;
      mixer = new THREE.AnimationMixer(littlebooks);
      clips = littlebooks.animations;
      books.scale.setScalar(0.1);
      books.rotation.y = Math.PI / 2 + Math.PI / 3;
      // books.rotation.x = -Math.PI / 2;
      opens.scene.add(books);

      playAnimate();
    };

    const exits = () => {
      particles.state = true;

      const move = opens.camera.position;
      move.a = 1;
      const tws = new TWEEN.Tween(move);
      tws.to({ x: 16, y: 11, z: -27, a: 0 }, 3000);
      // playAnimate("end");
      tws.onUpdate(() => {
        books.traverse((child) => {
          if (child.material) {
            child.material.opacity = move.a;
          }
        });
      });
      tws.onComplete(() => {
        books.position.y = 0;
        centerBook.visible = true;
        opens.control.enabled = true;
        books.visible = false;
      });
      tws.start();
    };

    //相机移动靠近
    const moveTween = () => {
      books.position.y = 4;
      particles.state = false;
      centerBook.visible = false;
      // centerBook.position.y = -10;
      opens.control.enabled = false;
      books.visible = true;
      const moves = {
        x: opens.camera.position.x,
        y: opens.camera.position.y,
        z: opens.camera.position.z,
        a: 0,
      };

      const tws = new TWEEN.Tween(moves);
      tws.to({ x: 1.08, y: 3.97, z: -1.84, a: 1 }, 3500);
      tws.onUpdate(() => {
        // books.lookAt(opens.camera.position);
        opens.camera.lookAt(0, 4, 0);
        opens.control.target = new THREE.Vector3(0, 4, 0);
        opens.camera.position.set(moves.x, moves.y, moves.z);
        books.traverse((child) => {
          if (child.material) {
            child.material.opacity = moves.a;
          }
        });
      });
      tws.onComplete(() => {
        inputBbd.visible = true;
      });
      tws.start();
      // books.time = 0;
      booksOpen.play();
      // playAnimate().play();
    };

    //播放动画
    const playAnimate = () => {
      // console.log(clips);

      booksOpen = mixer.clipAction(clips[0]);
      booksOpen.loop = THREE.LoopOnce;
      booksOpen.timeScale = 0.5;
      window.bok = booksOpen;
      // booksOpen.clampWhenFinished=true
      // setTimeout(()=>{
      //   booksOpen.
      // })
      // booksOpen.play();
    };

    const colorVec3 = (color) => {
      const colors = {};
      new THREE.Color(color).getHSL(colors);
      return new THREE.Vector3(colors.h, colors.s, colors.l);
    };

    //初始化粒子系统
    const initParticle = () => {
      particles = new Particles({
        name: "星球",
        shapeType: "sphere",
        position: new THREE.Vector3(0, 2, 0),
        // positionRange: new THREE.Vector3(10, 20, 10),
        positionRadius: 2,
        velocityShape: "cube",
        velocity: new THREE.Vector3(0, 0.5, 0),

        // velocityRange: new THREE.Vector3(0.1, 0.1, 0.1),
        textureURL: "./textures/spark.png",
        color: new THREE.Vector3(0.3, 1.0, 0.6),
        colorRange: colorVec3("blue"),
        size: 0.5,
        sizeRange: 1,
        pointSec: 100,
        pointDeathAge: 8,
      });

      particles.setParent(opens.scene);

      // console.log(particles);
    };

    const initSearch = () => {
      const div = document.getElementById("search");
      const divs = document.createElement("div");

      divs.style.backgroundColor = "red";
      divs.style.width = "100px";
      divs.style.height = "30px";

      const inputs = document.createElement("input");
      inputs.type = "text";
      inputs.placeholder = "请输入书名";
      inputs.style.width = "100%";
      inputs.style.height = "90%";
      inputs.style.fontSize = "1px";
      divs.appendChild(inputs);

      const button = document.createElement("button");
      button.innerText = "提交";
      // button.type='submit'
      divs.appendChild(button);

      button.onclick = () => {
        console.log("你好", inputs.value);
        changePages(inputs.value);
      };

      const obj = opens.addCSS3Sprite(divs);
      // obj.lookAt(opens.camera.position);
      obj.scale.setScalar(0.0025);
      obj.position.y = 4.64;
      obj.position.x = 0.57;
      opens.scene.add(obj);
      inputBbd = obj;
      inputBbd.visible = false;
    };

    const changePages = (value) => {
      // const textures = await getApi();

      // console.log(value);
      // console.log(pages);
      // pages.visible = false;
      // pages.position.z = 0.2;
      // pages.material.color = new THREE.Color("red");
      // const image = new Image();
      // image.src = textures;
      // console.log(image);
      // pages.material.map =
      // new THREE.TextureLoader().load(
      //   "https://ipfs.io/ipfs/QmbX7DPUwERpTMiMYHY7ita5bV7w1Eb43xTeEHTyzN9Moh?filename=3.jpg",
      //   (map) => {
      //     pages.material.map = map;
      //   }
      // );
      const maps = new THREE.TextureLoader().load(
        "https://ipfs.io/ipfs/QmbX7DPUwERpTMiMYHY7ita5bV7w1Eb43xTeEHTyzN9Moh?filename=3.jpg",
        (map) => {
          pages.material.map = map;
          pages.material.needsUpdate = true;
        }
      );
      // setTimeout(() => {
      //   pages.material.map = maps;
      //   console.log(maps);
      // }, 1000);
    };
  },
};
</script>

<style scoped>
#open3d {
  height: 100%;
  width: 100%;
}
</style>
