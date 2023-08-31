import { Agent as HttpsAgent } from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import got, { type ExtendOptions } from 'got';
import { JAVBUS_TIMEOUT, USER_AGENT } from './constants.js';

const PROXY_URL = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;

export let agent: HttpsAgent | undefined = undefined;

if (PROXY_URL) {
  if (/^https?:\/\//.test(PROXY_URL)) {
    agent = new HttpsProxyAgent(PROXY_URL);
  } else if (/^socks/.test(PROXY_URL)) {
    agent = new SocksProxyAgent(PROXY_URL);
  }
}

const extendOptions: ExtendOptions = {
  headers: {
    'User-Agent': USER_AGENT,
  },
  timeout: {
    request: JAVBUS_TIMEOUT,
  },
};

if (agent) {
  extendOptions.agent = { http: agent, https: agent };
}

const client = got.extend(extendOptions);

export default client;