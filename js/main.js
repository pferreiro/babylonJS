
const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine



const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
  groundMaterial.specularColor = BABYLON.Color3.Black();
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 5, height: 5 }, scene, false);
  ground.material = groundMaterial;

  BABYLON.SceneLoader.ImportMesh(
    "",
    "https://firebasestorage.googleapis.com/v0/b/yes4eutests.appspot.com/o/centralcervejas%2Fars%2",
    "F1693402803018_Sagres%20Esplanada%20Bege%20Mesa%20Alta.glb?alt=media&token=e6ea8e76-8163-4f5f-87f1-84d794677f95",
    scene,
    function (meshes) {
      const model = meshes[0]
      // console.log(model)
      scene.createDefaultCameraOrLight(true, true, true);
      scene.createDefaultEnvironment();

      model.position = new BABYLON.Vector3(0, 0, 1)

      // var sixDofDragBehavior = new BABYLON.SixDofDragBehavior()
      // model.addBehavior(sixDofDragBehavior)


      var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 0.1, 0) });
      pointerDragBehavior.useObjectOrientationForDragging = false;
      model.addBehavior(pointerDragBehavior);
    });

  var xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "local-floor"
    },
    optionalFeatures: true

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
// engine.runRenderLoop(function () {
//   scene.render();
// });
// Watch for browser/canvas resize events
window.addEventListener("resize", function () { engine.resize(); });