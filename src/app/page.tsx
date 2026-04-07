import ARShowroom from "@/components/ARShowroom";
import { products } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <ARShowroom 
        initialProduct={products[0]} 
        products={products} 
      />
    </main>
  );
}
