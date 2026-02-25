// Product-specific images from Unsplash
const productImages: Record<string, string> = {
  // Apple
  'iPhone': 'https://images.unsplash.com/photo-1591337676887-a217a6970a8c?w=400',
  'iPad': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
  'MacBook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
  'Apple Watch': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
  'AirPods': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
  
  // Samsung
  'Galaxy S': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
  'Galaxy Tab': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
  'Galaxy Watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
  'Samsung TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
  
  // Google
  'Pixel': 'https://images.unsplash.com/photo-1598324604414-2abfb8f395ba?w=400',
  
  // Dell
  'XPS': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
  
  // Lenovo
  'ThinkPad': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
  
  // Sony
  'PlayStation': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
  'WH-1000XM': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
  'Alpha': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
  
  // Microsoft
  'Xbox': 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400',
  
  // Canon
  'EOS R': 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400',
  
  // DJI
  'DJI': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
  
  // Nike
  'Nike Air Max': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  'Nike Air Jordan': 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400',
  'Nike Brasilia': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
  'Nike Metcon': 'https://images.unsplash.com/photo-1517904329008-6e4a4e8b1c4e?w=400',
  
  // Adidas
  'Adidas': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
  'Ultraboost': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
  
  // Roleks
  'Rolex': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
  
  // Herschel
  'Herschel': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
  
  // Champion
  'Champion': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
  
  // Dyson
  'Dyson': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
  'Airwrap': 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400',
  
  // La Mer
  'La Mer': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
  
  // KitchenAid
  'KitchenAid': 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400',
  
  // Ninja
  'Ninja': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
  
  // Samsung Fridge
  'Refrigerator': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400',
  
  // West Elm
  'West Elm': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  
  // Herman Miller
  'Herman Miller': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
  
  // Peloton
  'Peloton': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  
  // Title Boxing
  'Boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400',
  
  // Garmin
  'Garmin': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
  
  // Dashcam
  'Dashcam': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d4?w=400',
  
  // LEGO
  'LEGO': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
  
  // DualSense
  'DualSense': 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400',
  
  // HP
  'HP Printer': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400',
  
  // Bose
  'Bose': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
  'QC45': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
  
  // JBL
  'JBL': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
  
  // Fitbit
  'Fitbit': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
  
  // Instant Pot
  'Instant Pot': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
  
  // Weber
  'Weber': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
};

// Get image for product by name
function getProductImage(name: string): string {
  const lower = name.toLowerCase();
  
  for (const [key, url] of Object.entries(productImages)) {
    if (lower.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  // Default
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';
}

export { getProductImage };
