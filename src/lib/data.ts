export interface Product {
  id: string;
  name: string;
  glb: string;
  usdz: string;
  price: number;
}

export const products: Product[] = [
  {
    id: "my-model",
    name: "Моя Модель",
    price: 0,
    glb: "/models/Untitled.glb",
    usdz: "/models/Untitled.usdz",
  },
  {
    id: "tiksha",
    name: "Стул Тикша",
    price: 45000,
    glb: "https://modelviewer.dev/shared-assets/models/Chair.glb",
    usdz: "https://modelviewer.dev/shared-assets/models/Chair.usdz",
  },
  {
    id: "kasauri",
    name: "Стол Касаури",
    price: 120000,
    glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    usdz: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz",
  },
  {
    id: "alva",
    name: "Кресло Альва",
    price: 85000,
    glb: "https://modelviewer.dev/shared-assets/models/Chair.glb",
    usdz: "https://modelviewer.dev/shared-assets/models/Chair.usdz",
  }
];
