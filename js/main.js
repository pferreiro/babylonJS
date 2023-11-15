
const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  // var assetsManager = new BABYLON.AssetsManager(scene);
  scene.createDefaultCameraOrLight(true, true, true);
  scene.createDefaultEnvironment();
  var objects = ['19 Heineken Chapeu.glb', '20 21 Heineken Esplanada.glb', '23 Heineken Bidon.glb', '25 Heineken Coluna.glb']

  // GUI
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  var panel = new BABYLON.GUI.StackPanel();
  const models = []
  advancedTexture.addControl(panel);

  var createButtons = function (object) {
    const addObjectButton = BABYLON.GUI.Button.CreateSimpleButton(object, object);
    addObjectButton.width = "150px"
    addObjectButton.height = "150px";
    addObjectButton.color = "white";
    addObjectButton.cornerRadius = 5;
    addObjectButton.background = "green";
    addObjectButton.top = "15px"
    addObjectButton.left = "15px"
    addObjectButton.horizontalAlignment = 0
    addObjectButton.verticalAlignment = 0
    addObjectButton.onPointerUpObservable.add(function () {
      BABYLON.SceneLoader.ImportMesh("", "assets/scenes/", object, scene, function (meshes) {
        const model = meshes[0]

        model.position = new BABYLON.Vector3(0, 0, 1);
        model.rotation = BABYLON.Vector3.Zero();

        models.push(model)

        var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 0.1, 0) });
        pointerDragBehavior.useObjectOrientationForDragging = false;

        model.addBehavior(pointerDragBehavior);
      });
    });
    panel.addControl(addObjectButton);
  }

  for (let i = 0; i < objects.length; i++) {
    createButtons(objects[i])
  }

  var gizmoManager = new BABYLON.GizmoManager(scene, 10)
  gizmoManager.boundingBoxGizmoEnabled = false
  gizmoManager.positionGizmoEnabled = false;
  gizmoManager.rotationGizmoEnabled = true;
  gizmoManager.gizmos.rotationGizmo.xGizmo.isEnabled = false;
  gizmoManager.gizmos.rotationGizmo.zGizmo.isEnabled = false;
  gizmoManager.attachableMeshes = models



  var xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "local-floor"
    },
    optionalFeatures: true

  });
  // Wait for the session to start
  // xr.baseExperience.sessionManager.onXRSessionInit.add((session) => {
  //   var videoElement = xr.baseExperience.sessionManager._session.baseLayer.context.canvas;

  //   var buttonCamera = BABYLON.GUI.Button.CreateSimpleButton('camera', '');
  //   buttonCamera.width = "50px"
  //   buttonCamera.height = "50px";
  //   buttonCamera.color = "white";
  //   buttonCamera.cornerRadius = 50;
  //   buttonCamera.bottom = "50px"
  //   buttonCamera.horizontalAlignment = 2
  //   buttonCamera.verticalAlignment = 1
  //   buttonCamera.onPointerUpObservable.add(function () {
  //     var width = 1280; // should match your AR video feed's width
  //     var height = 720; // should match your AR video feed's height

  //     var screenshotCanvas = document.createElement('canvas');
  //     screenshotCanvas.width = width;
  //     screenshotCanvas.height = height;

  //     var ctx = screenshotCanvas.getContext('2d');

  //     // assuming videoElement is your AR video feed,
  //     console.log("Canvas dimensions: ", canvas.width, canvas.height);
  //     console.log("Video Element dimensions: ", videoElement.width, videoElement.height);
  //     ctx.drawImage(videoElement, 0, 0, width, height);
  //     ctx.drawImage(canvas, 0, 0, width, height);

  //     var dataURL = screenshotCanvas.toDataURL("image/png");

  //     console.log(dataURL); // Here's your screenshot's data URL, handle it as you wish

  //     // If you want to download it directly:
  //     var link = document.createElement('a');
  //     link.download = 'screenshot.png';
  //     link.href = dataURL;
  //     link.click();

  //     // BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 400);
  //   });
  //   advancedTexture.addControl(buttonCamera);
  // });

  // assetsManager.load();
  const fm = xr.baseExperience.featuresManager
  const xrBackgroundRemover = fm.enableFeature(BABYLON.WebXRBackgroundRemover.Name);
  return scene;
};

var scene = createScene();

scene.then(_scene => {
  engine.runRenderLoop(function () {
    if (_scene) {
      // console.log(_scene)
      _scene.render();
    }
  });
})

window.addEventListener("resize", function () { engine.resize(); });