import slash from "slash";

/**
 * Matches:
 * - ftp://
 * - https://
 * - //
 */
export const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

export const isRelativePath = (str: string) => {
  const isAbsolute = absolutePathRegex.exec(str);
  if (isAbsolute) return false;
  return true;
};

var pathJoin = function(...pathArr){
  return pathArr.map(function(path){
      if(path[0] === "/"){
          path = path.slice(1);        
      }
      if(path[path.length - 1] === "/"){
          path = path.slice(0, path.length - 1);   
      }
      return path;     
  }).join("/");
}

export const getFullRelativePath = (...paths: string[]) => {
  return isRelativePath(paths[paths.length - 1])
    ? slash(pathJoin(...paths))
    : paths[paths.length - 1];
};

export const trimTrailingSlash = (path: string) => {
  if (path.endsWith("/")) return path.slice(0, path.length - 1);
  return path;
};
