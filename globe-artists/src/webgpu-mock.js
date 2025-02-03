export class WebGPURenderer {
  constructor() {
    throw new Error('WebGPU is not supported in this build');
  }
}

export const isWebGPUAvailable = false;
