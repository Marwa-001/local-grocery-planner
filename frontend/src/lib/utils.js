import { ListItem } from "@/lib/schemas";
export const getFullListItem = (listItem, allProducts) => {
  const product = allProducts.find((p) => p.id === listItem.productId);
  
  return {
    ...listItem, 
    name: product?.name || "Unknown Product",
    categoryId: product?.categoryId || null,
    price: listItem.price ?? product?.price ?? 0, 
    unit: product?.unit || "",
  };
};


export function calculateListTotal(items){
  return items.reduce((sum, item) => {
    // Assuming price is a number and quantity is a number
    const itemPrice = item.price ?? 0;
    return sum + (itemPrice * item.quantity);
  }, 0);
}