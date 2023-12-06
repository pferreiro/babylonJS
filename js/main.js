
const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const takeScreenshot = function () {
  engine.onEndFrameObservable.addOnce(() => {
    const canvas = engine.getRenderingCanvas();
    const dataUrl = canvas.toDataURL("image/png");

    // Create an 'a' element
    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = dataUrl;
    // Use the 'a' element to download the image
    link.click();
  });
};

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
  var objects = ['12 Sagres Quadros.glb', '19 Heineken Chapeu.glb', '20 21 Heineken Esplanada.glb', '23 Heineken Bidon.glb', '25 Heineken Coluna.glb']

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

  const screenshotBtn = BABYLON.GUI.Button.CreateSimpleButton("screenshotBtn", "Take Screenshot");
  screenshotBtn.width = 0.2;
  screenshotBtn.height = "40px";
  screenshotBtn.color = "white";
  screenshotBtn.background = "black";
  advancedTexture.addControl(screenshotBtn);

  screenshotBtn.onPointerUpObservable.add(() => {
    takeScreenshot();
  });


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