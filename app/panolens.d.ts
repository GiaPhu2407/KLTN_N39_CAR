// panolens.d.ts
declare module "panolens" {
  export class Viewer {
    constructor(options?: any);
    add(panorama: any): void;
    // Add other methods or properties that you're using here
  }

  export class ImagePanorama {
    constructor(imagePath: string);
  }

  // You may need to define other classes/types from the panolens module here
}
