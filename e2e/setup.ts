import { setupServer } from "msw/node";
import { urlMetadataHandlers } from "./handlers/hoof/url-metadata";
import { postImagesHandler } from "./handlers/hoof/post-images";

setupServer(...urlMetadataHandlers, postImagesHandler).listen();
