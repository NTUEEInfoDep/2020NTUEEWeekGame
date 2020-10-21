const ASSET_NAMES = [
  // maps
  "map1.png",
  "map2.png",

  // characters
  "crt1.png",
  "crt2.png",
  "crt3.png",
  "crt4.png",
  "num1_frozen.png",
  "num2_frozen.png",
  "num3_frozen.png",
  "num4_frozen.png",
  "crt1_distracted.PNG",
  "crt2_distracted.png",
  "crt3_distracted.PNG",
  "crt4_distracted.PNG",
  "crt1_slipped.png",
  "crt2_slipped.png",
  "crt3_slipped.png",
  "crt4_slipped.png",

  // bullets
  "bullet1.png",
  "bullet2.png",
  "bullet3.png",
  "bullet4.png",
  "fart.png",
  "ice.png",
  "banana.png",

  // gameover
  "lose.png",
  "win.png",
];

const assets = {};

function downloadAsset(assetName) {
  return new Promise((resolve) => {
    const asset = new Image();

    asset.onload = () => {
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

export const downloadAssets = () => downloadPromise;

export const getAsset = (assetName) => assets[assetName];
