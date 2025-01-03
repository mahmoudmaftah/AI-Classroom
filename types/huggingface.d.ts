declare module '#app' {
  interface NuxtApp {
    $queryHuggingFaceModel: (prompt: string) => Promise<string>
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $queryHuggingFaceModel: (prompt: string) => Promise<string>
  }
}

export { }