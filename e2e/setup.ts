import { setupServer } from "msw/node";
import { handlers as oembedHandlers } from "./handlers/oembed";
import { urlMetadataHandler } from "./handlers/hoof/url-metadata";
import { postImagesHandler } from "./handlers/hoof/post-images";

setupServer(urlMetadataHandler, postImagesHandler, ...oembedHandlers).listen();
