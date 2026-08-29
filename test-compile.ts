import { generateThemeFiles } from './src/components/builder/compiler';

const mockDoc = {
  metadata: {
    name: "Test Theme",
    description: "Test theme description",
    version: "1.0.0",
    author: "Test Author"
  },
  settings: {
    colors: {}, typography: {}
  },
  blocks: {},
  pages: {}
};

const files = generateThemeFiles(mockDoc as any);
console.log(files["package.json"]);
console.log(files["assets/css/screen.css"]);
