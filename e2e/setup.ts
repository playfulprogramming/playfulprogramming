import { setupServer } from "msw/node";
import { handlers as oembedHandlers } from "./handlers/oembed";
import { urlMetadataHandler } from "./handlers/hoof/url-metadata";

setupServer(urlMetadataHandler, ...oembedHandlers).listen();
