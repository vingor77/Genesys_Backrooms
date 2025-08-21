// Scrap generation utilities

// NEW: Weighted scrap selection based on moon spawn chances
export const selectScrapByWeight = (scrapItems) => {
  if (!scrapItems || scrapItems.length === 0) return null;
  
  // Filter out special spawn chance items (like Apparatus)
  const weightedScrap = scrapItems.filter(item => 
    typeof item.spawnChance === 'number' && item.spawnChance > 0
  );
  
  if (weightedScrap.length === 0) return null;
  if (weightedScrap.length === 1) return weightedScrap[0];

  // Calculate total weight (spawnChance is a percentage)
  const totalWeight = weightedScrap.reduce((sum, item) => sum + item.spawnChance, 0);

  // Generate random number between 0 and total weight
  let randomWeight = Math.random() * totalWeight;

  // Select scrap based on weight
  for (const item of weightedScrap) {
    randomWeight -= item.spawnChance;

    if (randomWeight <= 0) {
      return item;
    }
  }

  // Fallback (shouldn't happen, but just in case)
  return weightedScrap[0];
};

// Helper function to get scrap icon
export const getScrapIcon = (scrapName) => {
  const iconMap = {
    // Engine/Mechanical
    'V-Type Engine': '🔧',
    'Large Axle': '⚙️',
    'Metal Sheet': '📄',
    'Scrap Metal': '🔩',
    
    // Electronics
    'Old Phone': '📞',
    'Remote': '📺',
    'Toy Robot': '🤖',
    'Cash Register': '💰',
    'Laser Pointer': '🔴',
    'Apparatus': '⚡',
    'Battery Pack': '🔋',
    'Radio': '📻',
    
    // Decorative/Mansion items
    'Painting': '🖼️',
    'Fancy Lamp': '💡',
    'Perfume Bottle': '🧴',
    'Brass Bell': '🔔',
    'Stop Sign': '🛑',
    'Steering Wheel': '🎛️',
    'Gold Bar': '🟨',
    'Tea Kettle': '🫖',
    
    // Laboratory/Research items
    'Flask': '🧪',
    'Chemical Jug': '🧪',
    'Comedy Mask': '🎭'
  };
  
  return iconMap[scrapName] || '📦';
};

// Helper function to determine rarity based on spawn chance
export const getRarity = (spawnChance) => {
  if (spawnChance >= 10) return 'Common';
  if (spawnChance >= 5) return 'Uncommon';
  if (spawnChance >= 1) return 'Rare';
  return 'Ultra Rare';
};

// Fallback scrap generation for moons without scrap data
export const generateFallbackScrap = (roomType) => {
  const fallbackScrap = [
    { name: "Scrap Metal", icon: "🔩", valueRange: [6, 18], weight: 8, rarity: 'Common' },
    { name: "Old Phone", icon: "📞", valueRange: [5, 25], weight: 8, rarity: 'Common' },
    { name: "Battery Pack", icon: "🔋", valueRange: [15, 25], weight: 4, rarity: 'Common' },
    { name: "Metal Sheet", icon: "📄", valueRange: [6, 18], weight: 12, rarity: 'Common' },
    { name: "Remote", icon: "📺", valueRange: [2, 10], weight: 2, rarity: 'Common' }
  ];
  
  const selectedScrap = fallbackScrap[Math.floor(Math.random() * fallbackScrap.length)];
  const value = Math.floor(Math.random() * (selectedScrap.valueRange[1] - selectedScrap.valueRange[0] + 1)) + selectedScrap.valueRange[0];
  
  return {
    ...selectedScrap,
    value,
    id: `scrap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

// NEW: Generate scrap based on moon data and weighted selection
export const generateScrapFromMoonData = (roomType, currentMoon) => {
  if (!currentMoon || !currentMoon.scrapItems) {
    return generateFallbackScrap(roomType);
  }

  // Use moon's scrap items with weighted selection
  const selectedScrap = selectScrapByWeight(currentMoon.scrapItems);
  
  if (!selectedScrap) {
    return generateFallbackScrap(roomType);
  }

  // Generate value within the item's range
  const value = Math.floor(
    Math.random() * (selectedScrap.value.max - selectedScrap.value.min + 1)
  ) + selectedScrap.value.min;
  
  // Get icon based on scrap type
  const icon = getScrapIcon(selectedScrap.name);
  
  return {
    id: `scrap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: selectedScrap.name,
    icon: icon,
    value: value,
    weight: selectedScrap.weight,
    twoHanded: selectedScrap.twoHanded,
    conductive: selectedScrap.conductive,
    spawnChance: selectedScrap.spawnChance,
    rarity: getRarity(selectedScrap.spawnChance)
  };
};