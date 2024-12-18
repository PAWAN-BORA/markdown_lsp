import { assertEquals } from "@std/assert/equals";
import { getDefinitionPosition } from "./analysis.ts";
import { State } from "./state.ts";
import { encodeMessage, ResponseMessage } from "../rpc.ts";

const sampleText = `[![progress-banner](https://backend.codecrafters.io/progress/http-server/38002165-fcac-415a-89e4-ee4733f9dbb9)](https://app.codecrafters.io/users/codecrafters-bot?r=2qF)

This is a starting point for TypeScript solutions to the
["Build Your Own HTTP server" Challenge](https://app.codecrafters.io/courses/http-server/overview).

[HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) is the
protocol that powers the web. In this challenge, you'll build a HTTP/1.1 server
that is capable of serving multiple clients.

Along the way you'll learn about TCP servers,
[HTTP request syntax](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html),
and more.

**Note**: If you're viewing this repo on GitHub, head over to
[codecrafters.io](https://codecrafters.io) to try the challenge.

# Passing the first stage

The entry point for your HTTP server implementation is in. Study
and uncomment the relevant code, and push your changes to pass the first stage:


Time to move on to the next stage!

# Stage 2 & beyond

Note: This section is for stages 2 and beyond.`

Deno.test(function testGetDefinitionPos(){
  const position = {line:19, character:14}
  const defiPosition = getDefinitionPosition(sampleText, position);
  assertEquals(defiPosition.line, 2);
  assertEquals(defiPosition.character, 53);
})
