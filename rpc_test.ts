import { assertEquals } from "@std/assert/equals";
import { decodeMessage, encodeMessage, RequestMessage, ResponseMessage } from "./rpc.ts";



Deno.test(function testEncodeMessage(){

  const testData:ResponseMessage = {
    jsonrpc:"2.0",
    id:4
  }
  const expected = 'Content-Length: 24\r\n\r\n{"jsonrpc":"2.0","id":4}'
  const encodeData = encodeMessage(testData);

  assertEquals(expected, encodeData)
})
Deno.test(function testDecodeMessage(){
  const testData:RequestMessage = {
    jsonrpc:"2.0",
    method:"initialize",
    id:4
  }
  const byteData = new TextEncoder().encode(`Content-Length: 46\r\n\r\n${JSON.stringify(testData)}`)
  const decodedData = decodeMessage(byteData);

  assertEquals(decodedData.method, "initialize")
  assertEquals((decodedData as ResponseMessage).id, 4)
  assertEquals(decodedData.jsonrpc, "2.0")
})
