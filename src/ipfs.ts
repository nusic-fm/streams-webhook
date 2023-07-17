import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { Web3Storage } from 'web3.storage'

function getAccessToken () {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return process.env.WEB3STORAGE_TOKEN
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}

export async function getMetadataFromCid(cid) {
    const client = makeStorageClient()
    try {
        const res = await client.get(cid)
        // const files = await res.files()
        // console.log(`Fetched ${cid}`)
        for await (const entry of res.unixFsIterator()) {
          // console.log(`got unixfs of type ${entry.type}. cid: ${entry.cid} path: ${entry.path} type: ${entry.type} size ${entry.size}`);
          // entry.content() returns another async iterator for the chunked file contents
          if (entry.type !== 'directory') {
            const size = entry.size;
            const bytes = new Uint8Array(size);
            let offset = 0;

            for await (const chunk of entry.content()) {
              bytes.set(chunk, offset)
              offset += chunk.length
            }
            const jsonString = Buffer.from(bytes).toString('utf8')
            const parsedData = JSON.parse(jsonString)

            // console.log(parsedData)
            return parsedData;
            // for await (const chunk of entry.content()) {
            //   console.log(`got a chunk of ${chunk.size} bytes of data`);
            //   console.log(JSON.parse(chunk.toString()))
            // }
          }
        }
    } catch(e) {
          console.log(e)
    }
    // console.log(`Got a response! [${res.status}] ${res.statusText}`)
    // if (!res.ok) {
    //   throw new Error(`failed to get ${cid}`)
    // }
  
    // request succeeded! do something with the response object here...
  }

  // getMetadataFromCid('bafybeieixx7z6wvcwhsknwfmdtx37h32w4cxhki5cyclcshpmtioxjmj4u')