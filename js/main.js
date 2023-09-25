
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
  advancedTexture.addControl(panel);

  var createButtons = function (object) {
    var button = BABYLON.GUI.Button.CreateSimpleButton(object, object);
    button.width = "150px"
    button.height = "150px";
    button.color = "white";
    button.cornerRadius = 5;
    button.background = "green";
    button.top = "15px"
    button.left = "15px"
    button.horizontalAlignment = 0
    button.verticalAlignment = 0
    button.onPointerUpObservable.add(function () {
      BABYLON.SceneLoader.ImportMesh("", "assets/scenes/", object, scene, function (meshes) {
        var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 0.1, 0) });
        pointerDragBehavior.useObjectOrientationForDragging = false;
        const model = meshes[0]

        model.position = new BABYLON.Vector3(0, 0, 1)
        model.rotation = BABYLON.Vector3.Zero()
        model.addBehavior(pointerDragBehavior);
        // console.log(model)
      });
    });
    panel.addControl(button);
  }

  for (let i = 0; i < objects.length; i++) {
    createButtons(objects[i])
  }

  var buttonCamera = BABYLON.GUI.Button.CreateSimpleButton('camera', '');
  buttonCamera.width = "50px"
  buttonCamera.height = "50px";
  buttonCamera.color = "white";
  buttonCamera.cornerRadius = 50;
  buttonCamera.bottom = "50px"
  buttonCamera.horizontalAlignment = 2
  buttonCamera.verticalAlignment = 1
  buttonCamera.onPointerUpObservable.add(function () {
    BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 400);
  });
  advancedTexture.addControl(buttonCamera);

  var xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "local-floor"
    },
    optionalFeatures: true

  });

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
// engine.runRenderLoop(function () {
//   scene.render();
// });
// Watch for browser/canvas resize events
window.addEventListener("resize", function () { engine.resize(); });