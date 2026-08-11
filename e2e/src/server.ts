import fastify from "fastify";
import { postImagesRoutes } from "./hoof/post-images.ts";
import { urlMetadataRoutes } from "./hoof/url-metadata.ts";

const app = fastify();
app.register(postImagesRoutes);
app.register(urlMetadataRoutes);
app.listen({ host: "0.0.0.0", port: 8080 });
