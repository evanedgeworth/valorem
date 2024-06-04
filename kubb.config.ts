import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTanstackQuery } from "@kubb/swagger-tanstack-query";
import { pluginTs } from "@kubb/swagger-ts";

export default defineConfig(() => {
  return [
    {
      root: ".",
      input: {
        path: "./Weather.openapi.json",
      },
      output: {
        path: "./src/models",
      },
      plugins: [pluginOas({}), pluginTs({}), pluginTanstackQuery({})],
    },
  ];
});
