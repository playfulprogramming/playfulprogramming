const { runAsWorker } = require('synckit');

runAsWorker(async (...args) => {
    const { getImage } = await import("@astrojs/image");
    const sharp_service = await import ("./node_modules/@astrojs/image/dist/loaders/sharp.js");

    // HACK: This is a hack that heavily relies on `getImage`'s internals :(
    globalThis.astroImage = {
        loader: sharp_service.default
    }

    // do expensive work
    return getImage(...args);
})