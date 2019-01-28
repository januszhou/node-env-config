import { path, mergeDeepLeft, isEmpty } from 'ramda';

const defaultOptions = {
  folderName: "config",
  localName: ".local.js",
  exampleName: ".example.js"
};

const loadFile = (optional: boolean) => (path: string) => {
  try {
    return require(path);
  } catch(e){
    if(!optional){
      throw new Error(`Config file ${path} cannot be read`);
    }
    return undefined;
  }
}

const getProperty = (object: any, property: string) => {
  const elems = property.split('.');
  return path(object, elems);
};

// overwrite priority .local.js > [env].js
let config = {};

const ConfigGet = (property: string): any => {
  const options = defaultOptions;
  const optionalLoadFile = loadFile(true);
  const requiredLoadFile = loadFile(false);
  if(isEmpty(config)){
    let localConfig;
    const envFilePath = `./${options.folderName}/${process.env.NODE_ENV}`;
    const envConfig = requiredLoadFile(envFilePath);

    // if NODE_ENV is undefined, local config is required
    if(!process.env.NODE_ENV){
      localConfig = requiredLoadFile(`./${options.localName}`);
    } else {
      localConfig = optionalLoadFile(`./${options.localName}`);
    }
    // const exampleConfig = optionalLoadFile(`./${options.localName}`);
    config = mergeDeepLeft(envConfig, localConfig);
  }

  return getProperty(config, property);
}

export default ConfigGet;