export interface Product {
  id: string;
  name: string;
  glb: string;
  usdz: string;
  price: number;
}

export const products: Product[] = [
  {
    id: "test-astronaut",
    name: "Тестовый Астронавт",
    price: 0,
    glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    usdz: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz",
  },
  {
    id: "my-model",
    name: "Моя Модель",
    price: 0,
    glb: "/partisan-ar/models/Untitled.glb",
    usdz: "/partisan-ar/models/Untitled.usdz",
  }
];
