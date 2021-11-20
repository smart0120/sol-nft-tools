import Arweave from "arweave";
import { ArweaveSigner } from "arbundles";

/**
 * Create an Arweave instance with sane defaults.
 */
function getArweave(): Arweave {
  return new Arweave({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: false,
    logger: console.log,
  });
}

type UploadGeneratorResult = Array<{
  link: string;
  name: string;
}>;

/**
 * Initialize the Arweave Bundle Upload Generator.
 * Returns a Generator function that allows to trigger an asynchronous bundle
 * upload to Arweave when calling generator.next().
 * The Arweave Bundle Upload Generator automatically groups assets file pairs
 * into appropriately sized bundles.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
 */
export function* makeArweaveBundleUploadGenerator(
  files: Array<{ file: File; buffer: ArrayBuffer }>,
  jwk: any
): Generator<Promise<UploadGeneratorResult>> {
  const signer = new ArweaveSigner(jwk);
  const arweave = getArweave();

  // Yield an empty result object before processing files
  // & uploading bundles for initialization.
  yield Promise.resolve([]);
}
