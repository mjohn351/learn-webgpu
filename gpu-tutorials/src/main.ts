
import $ from 'jquery';
import { CheckWebGPU } from './helper';
import { Shaders } from './shaders';


const CreateTriangle = async () => {
 const checkgpu = CheckWebGPU();
 if (checkgpu.includes('Your current browser does not support WebGPU')) {
   console.log(checkgpu);
   throw('Your current browser does not support WebGPU!');
 }

 const canvas = document.getElementById('gpucanvas') as HTMLCanvasElement;
 const adapter = await navigator.gpu?.requestAdapter() as GPUAdapter;
 const device = await adapter?.requestDevice() as GPUDevice;
 const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
 
 const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
 context.configure({
   device: device,
   format: presentationFormat,
 });

  const shader = Shaders();
  const pipeline = device.createRenderPipeline({
    vertexStage: {
      module: device.createShaderModule({
        code: shader.vs
      }),
      entryPoint: "main",
    },
    fragmentStage: {
      module: device.createShaderModule({
        code: shader.fs
      }),
      entryPoint: "main",
      targets: [{format: presentationFormat}],
    },
    primitiveTopology: "triangle-list",
  });

  const renderPassDescriptor = {
    colorAttachments: [
      {
      view: context.getCurrentTexture().createView(),
      clearValue: [0.3, 0.3, 0.3, 1],
      loadOp: 'clear',
      storeOp: 'store',
      },
    ],
  };

  function render() {
    const encoder = device.CreateCommandEncoder();
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.draw(3, 1, 0, 0);
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
  }

  render();
}

CreateTriangle();

//positions = [ [-1,1], [1,1], [-1,-1], [1,-1] ]
//uv = [ [0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0] ]
