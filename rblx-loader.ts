import { parse } from './parser/index'; // path'ini parsera göre ayarla
// Babylon.js türleri varsa, kurulu olmalı: npm i @babylonjs/core

const fileInput = document.getElementById('rbxmFile') as HTMLInputElement;
const runBtn = document.getElementById('runBtn') as HTMLButtonElement;
const output = document.getElementById('output') as HTMLElement;
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

let engine: BABYLON.Engine;
let scene: BABYLON.Scene;

function log(msg: string) {
  output.textContent = msg;
}

async function loadRBXM(file: File) {
  log('Dosya okunuyor...');
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  log('Parse ediliyor...');
  const model = parse(buffer);
  log('Parse tamamlandı!\n' + JSON.stringify(model, null, 2));

  createSceneFromModel(model);
}

function createSceneFromModel(model: any) {
  if (!engine) {
    engine = new BABYLON.Engine(canvas, true);
  }
  scene = new BABYLON.Scene(engine);

  // Basit kamera ve ışık
  const camera = new BABYLON.ArcRotateCamera('cam', Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

  // Modeldeki parçaları dönüp mesh yap
  if (model.Parts && Array.isArray(model.Parts)) {
    model.Parts.forEach((part: any) => {
      const mesh = BABYLON.MeshBuilder.CreateBox(part.Name || 'part', {
        width: part.Size?.X || 1,
        height: part.Size?.Y || 1,
        depth: part.Size?.Z || 1
      }, scene);

      mesh.position = new BABYLON.Vector3(
        part.Position?.X || 0,
        part.Position?.Y || 0,
        part.Position?.Z || 0
      );

      mesh.material = new BABYLON.StandardMaterial('mat', scene);
      const c = part.Color || { R: 1, G: 1, B: 1 };
      mesh.material.diffuseColor = new BABYLON.Color3(c.R, c.G, c.B);
    });
  }

  engine.runRenderLoop(() => {
    if (scene) scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
}

runBtn.addEventListener('click', () => {
  if (!fileInput.files?.length) {
    log('Önce bir .rbxm dosyası seç!');
    return;
  }
  loadRBXM(fileInput.files[0]);
});
