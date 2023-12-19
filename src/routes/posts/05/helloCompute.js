export const createScene = async (el, onLoaded) => {
    onLoaded();

    //Checks to see if WebGPU is available
    if("gpu" in window.navigator){
        console.log("gpu in navigator");
    }
    else{
        console.log("gpu not in navigator");
    }

    //The adapter represents the physicsal gpu device.
    //This method can not fail but it may be null.
    const adapter = await navigator.gpu.requestAdapter();
    if(!adapter){
        console.log("no adapter");
        return;
    }

    //This is the logical connection of the gpu. It allows you to create thins like buffers and textures.
    const device = await adapter.requestDevice();
    if(!device){
        console.log("no device");
        return;
    }

    //Creates a buffer that can read and write from the GPU
    const gpuWriteBuffer = device.createBuffer({
        mappedAtCreation: true,//This allows us to write to the buffer immediately
        size: 4,
        usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC  //Allows us to write to the buffer and copy it to another buffer
    });
    const arrayBuffer = gpuWriteBuffer.getMappedRange();

    //Writing data to the buffer
    new Uint8Array(arrayBuffer).set([0,1,2,3]);

    //Unmapping the buffer. This is required for the GPU to be able to read the buffer. It lets it know you are done writing.
    gpuWriteBuffer.unmap();

    const gpuReadBuffer = device.createBuffer({
        mappedAtCreation: false,
        size: 4,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    //Creating a command encoder. This is used to create commands that can be sent to the GPU.
    const copyEncoder = device.createCommandEncoder();

    copyEncoder.copyBufferToBuffer(
        gpuWriteBuffer, //source buffer
        0, //offset of source buffer
        gpuReadBuffer, //destination buffer
        0, //offset of destination buffer
        4 //number of bytes to copy
    );

    //Finalizes the commands and creates a command buffer
    const copyCommands = copyEncoder.finish();

    //Submits the command buffer to the GPU
    device.queue.submit([copyCommands]);

    //waits for the GPU to finish processing the commands and data is ready to be read
    await gpuReadBuffer.mapAsync(GPUMapMode.READ);

    //Allows us to read the data from the buffer
    const copyArrayBuffer = gpuReadBuffer.getMappedRange();

    console.log(new Uint8Array(copyArrayBuffer));
    
}