const { Server, got } = require("../src");
const { sleep } = require("../src/util/main");
const headers = {
  "Accept": "*/*",
  "Connection": "keep-alive",
  "User-Agent": `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36`,
  "accept-language": `en-US,en;q=0.9,ar;q=0.8`,
  "cache-control": "no-cache",
  "pragma": "no-cache",
  "sec-ch-ua": `"Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"`,
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": `"macOS"`,
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
}

test("Should Start And Connect To Proxy Client", async () => {
  var connected = await Server.connect();
  expect(connected).toEqual(true);
});
test('Should receive JSON request from JAS3', async ()=>{
  if(!Server.isConnected()){
    throw new Error()
  }
  var configs = {
    headers:headers,
    debug: true

  }
  var request = await got.get("https://ja3er.com/json", configs)
  expect(request.success).toEqual(true)
})
test('should receive Nike.com', async()=>{
  var configs = {
    headers:headers,
    debug: true
  }
  var request = await got.get("https://www.nike.com", configs)
  expect(request.success).toEqual(true)
})