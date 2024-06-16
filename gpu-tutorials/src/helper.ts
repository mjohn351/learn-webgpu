export const CheckWebGPU = () => {
  let result = 'Great, your current browser supports WebGPU!';
  if (!navigator.gpu) {
    result = `Your current browser does not support WebGPU. Make sure you are on a system with WebGPU enabled. You can check all browsers and versions that support WebGPU at <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API"></a>`;
  }
    return result;
}
