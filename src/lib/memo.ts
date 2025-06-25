// initialize a new global client for memo:
// example
// import MemoryClient from 'mem0ai';

// const apiKey = 'm0-VRUFYiiDTfKnHDJpxnTIHHjpPLuv9qqoEjeIk1Lg';
// const client = new MemoryClient({ apiKey: apiKey });

import MemoryClient from 'mem0ai';

const apiKey = process.env.MEMO_API_KEY as string;
const client = new MemoryClient({ apiKey: apiKey });

export default client;