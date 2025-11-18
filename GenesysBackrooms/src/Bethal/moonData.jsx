// Grid system constants
export const GRID_SIZE = 13;

// Terrain codes for rendering
export const TERRAIN_CODES = {
  '~': 'open_ground',
  'W': 'water',
  'B': 'bridge', 
  'T': 'trees',
  'R': 'rocks',
  'L': 'lava_pit',
  'G': 'gas_vent',
  'M': 'metallic_growth',
  'P': 'radiation_puddle',
  'A': 'acid_pool',
  'V': 'steam_vent',
  'X': 'toxic_pool',
  'Q': 'quicksand',
  'I': 'ice_patch',
  'C': 'cliff',
  'F': 'forest',
  'H': 'facility',
  'S': 'ship',
  'E': 'fire_exit'
};

// Height maps with terrain codes - format: [terrain_code][elevation_number]
export const HEIGHT_MAPS = {
  // EASY: Experimentation - Abandoned R&D with scattered trees, toxic lakes, radiation puddles
  "41-Experimentation": [
    ['~4', 'T5', 'T5', 'T4', '~3', '~3', '~2', '~3', '~4', 'T5', '~4', '~3', '~2'],
    ['~3', '~4', 'H5', 'T4', '~3', 'M2', '~2', '~2', '~3', 'T4', 'T4', '~3', '~2'],
    ['~3', 'T4', 'T4', '~3', 'M2', 'T3', 'T2', '~2', '~2', '~3', 'T3', '~2', '~2'],
    ['~2', '~3', '~3', 'M2', 'T3', 'T3', 'T2', '~2', '~1', '~2', '~1', '~1', 'W0'],
    ['~2', '~3', '~4', 'T3', 'T3', 'T2', '~2', '~1', '~1', '~1', 'W0', 'W0', 'W0'],
    ['~3', '~4', '~3', '~2', 'T2', '~2', '~1', '~3', 'W0', 'W0', 'W0', 'W0', 'X0'],
    ['~3', '~3', '~2', 'S2', '~2', '~1', '~1', 'W0', 'W0', 'W0', 'W0', 'X0', 'X0'],
    ['~2', '~2', '~2', '~2', '~1', 'W0', 'W0', 'W0', 'W0', 'W0', 'W0', 'W0', 'W0'],
    ['~2', '~3', '~3', '~2', '~1', 'W0', 'W0', 'W0', 'W0', 'W0', 'W0', 'W0', 'W0'],
    ['R2', 'R3', 'R3', '~3', '~2', '~1', 'W0', 'W0', 'W0', 'W0', 'W0', 'X0', 'X0'],
    ['R2', 'R3', '~2', '~2', '~2', '~1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'E1'],
    ['~2', '~2', '~2', '~2', '~2', '~1', '~1', 'W0', 'W0', 'W0', 'W0', 'W0', '~1'],
    ['~2', '~3', '~3', '~2', '~2', '~2', '~1', '~1', 'W0', 'W0', '~1', '~1', '~1']
  ],

  // EASY: Assurance - Farmland with overgrown trees, toxic irrigation channels
  "220-Assurance": [
    ['~3', '~3', '~3', '~3', '~3', '~3', 'H3', '~3', '~3', '~3', '~3', '~3', '~3'],
    ['~3', 'T3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', 'T3', '~3'],
    ['~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2'],
    ['~2', 'W0', 'W0', 'X0', 'W0', 'X0', 'X0', 'X0', 'W0', 'X0', 'W0', '~2', '~2'],
    ['~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2'],
    ['~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1'],
    ['S1', '~1', '~1', 'W0', 'W0', 'W0', 'W0', 'W0', 'W0', 'W0', '~1', '~1', '~1'],
    ['~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1'],
    ['~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2'],
    ['~2', '~2', '~2', 'X0', 'X0', 'X0', 'X0', 'X0', 'X0', 'X0', '~2', '~2', '~2'],
    ['~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2', '~2'],
    ['~3', 'T3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', 'T3', 'E3'],
    ['~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3', '~3']
  ],

  // EASY: Vow - Industrial processing with acid pools, steam vents, conveyor systems
  "56-Vow": [
    ['M1', 'M1', 'M1', '~1', 'H1', '~1', '~1', '~1', 'M1', 'M1', 'M1', '~1', '~1'],
    ['M1', '~1', '~1', '~1', '~1', 'V1', 'V1', '~1', '~1', '~1', '~1', 'M1', '~1'],
    ['M1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', 'M1', '~1'],
    ['~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1'],
    ['~1', 'V1', '~1', '~1', 'A0', 'A0', 'A0', 'A0', '~1', '~1', 'V1', '~1', '~1'],
    ['~1', '~1', '~1', 'A0', 'A0', 'A0', 'A0', 'A0', 'A0', '~1', '~1', '~1', '~1'],
    ['~1', '~1', '~1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', '~1', '~1', '~1', '~1'],
    ['~1', '~1', '~1', 'A0', 'A0', 'A0', 'A0', 'A0', 'A0', '~1', '~1', '~1', '~1'],
    ['~1', 'V1', '~1', '~1', 'A0', 'A0', 'A0', 'A0', '~1', '~1', 'V1', '~1', '~1'],
    ['~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1', '~1'],
    ['M1', '~1', '~1', '~1', 'S1', '~1', '~1', '~1', '~1', '~1', '~1', 'M1', 'E1'],
    ['M1', '~1', '~1', '~1', '~1', 'V1', 'V1', '~1', '~1', '~1', '~1', 'M1', '~1'],
    ['M1', 'M1', 'M1', '~1', '~1', '~1', '~1', '~1', 'M1', 'M1', 'M1', '~1', '~1']
  ],

  // MEDIUM: Offense - Weapons testing with concrete bunkers, deep craters, radioactive zones
  "21-Offense": [
    ['~3', '~3', 'Q0', 'H3', 'Q0', '~3', '~3', '~2', 'Q0', '~2', '~2', '~2', '~2'],
    ['~3', 'Q0', 'Q0', 'Q0', 'Q0', 'Q0', '~2', 'Q0', 'Q0', 'Q0', '~2', '~2', '~2'],
    ['Q0', 'Q0', 'Q0', '~2', '~2', 'Q0', 'Q0', 'Q0', '~2', 'Q0', 'Q0', '~2', '~2'],
    ['~2', 'Q0', '~2', '~2', '~1', 'P0', 'B1', 'P0', '~1', '~2', 'Q0', 'Q0', '~2'],
    ['~2', '~2', '~1', '~1', 'P0', 'W0', 'B1', 'W0', 'P0', '~1', '~1', 'Q0', 'Q0'],
    ['~2', '~2', '~1', 'P0', 'W0', 'W0', 'B1', 'W0', 'W0', 'P0', '~1', '~2', 'Q0'],
    ['~2', 'S2', '~1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', '~1', '~2', '~2'],
    ['~2', '~2', '~1', 'P0', 'W0', 'W0', 'B1', 'W0', 'W0', 'P0', '~1', '~2', '~2'],
    ['~2', '~2', '~1', '~1', 'P0', 'W0', 'B1', 'W0', 'P0', '~1', '~1', 'Q0', '~2'],
    ['~2', 'Q0', '~2', '~2', '~1', 'P0', 'B1', 'P0', '~1', '~2', 'Q0', 'Q0', 'Q0'],
    ['Q0', 'Q0', 'Q0', '~2', '~2', 'Q0', 'Q0', 'Q0', '~2', 'Q0', 'Q0', 'Q0', 'Q0'],
    ['~2', 'Q0', 'Q0', 'Q0', 'Q0', 'Q0', '~2', 'Q0', 'Q0', 'Q0', '~2', 'E2', '~2'],
    ['~2', '~2', 'Q0', '~2', 'Q0', '~2', '~2', '~2', 'Q0', '~2', '~2', '~2', '~2']
  ],

  // MEDIUM: March - Deep mining with toxic frozen lakes, radioactive ice patches, ice bridges
  "61-March": [
    ['~4', 'I4', 'H4', 'I4', '~4', '~4', '~4', '~4', '~4', 'I4', '~4', '~4', '~4'],
    ['I4', 'P4', '~4', '~0', '~4', '~4', '~4', '~0', '~0', 'P4', 'I4', '~4', '~4'],
    ['~4', 'P4', '~0', '~0', '~4', '~4', '~4', '~4', '~0', '~4', '~4', 'I4', '~4'],
    ['~4', '~4', '~4', '~4', '~4', '~0', '~0', '~4', '~4', '~4', '~4', '~4', '~4'],
    ['E4', '~0', '~0', '~4', '~4', '~4', '~0', '~4', '~4', '~0', '~4', '~4', '~4'],
    ['~4', '~4', '~4', '~4', '~4', '~4', '~4', '~4', '~4', '~0', '~0', '~4', '~4'],
    ['~4', 'I4', 'I4', 'I4', '~0', '~0', '~0', '~0', '~4', '~4', '~4', '~4', '~4'],
    ['~4', '~0', '~0', '~0', '~0', '~4', '~4', '~4', '~4', '~4', '~0', '~4', '~4'],
    ['~4', '~4', '~4', '~4', '~4', '~4', '~4', '~4', '~0', '~0', '~0', '~4', '~4'],
    ['~4', 'I4', '~4', '~4', '~0', 'X0', 'X0', '~4', '~4', '~4', '~4', '~4', '~4'],
    ['~4', 'I4', 'P4', '~4', '~4', '~4', '~4', '~4', '~0', '~4', '~4', '~4', '~4'],
    ['~4', 'I4', 'I4', 'P4', 'I4', '~4', '~0', '~0', '~0', '~4', 'S4', '~4', '~4'],
    ['~4', '~4', 'I4', 'I4', 'I4', '~4', '~4', '~4', 'I4', 'I4', '~4', '~4', '~4']
  ],

  // MEDIUM: Adamance - Mountain mining with steep cliffs, narrow bridges, toxic mineral veins
  "20-Adamance": [
    ['~2', '~3', '~4', '~5', '~6', 'H7', '~8', '~8', '~9', '~9', 'R9', '~8', '~7'],
    ['~1', '~2', '~3', '~4', '~4', '~6', '~7', '~7', '~8', 'R8', '~8', '~7', '~6'],
    ['~2', '~1', '~2', '~3', 'L2', '~5', 'L4', '~6', '~7', '~7', '~6', '~5', '~5'],
    ['~3', '~3', '~1', '~2', '~3', '~4', '~5', '~5', '~6', 'L4', '~5', '~4', '~4'],
    ['L0', '~4', '~3', '~1', '~2', '~3', '~4', '~4', '~5', 'R5', '~4', '~3', '~3'],
    ['~2', '~1', '~2', '~1', '~2', '~3', '~3', '~4', '~4', '~4', '~3', '~2', '~2'],
    ['S2', 'L0', '~2', '~1', '~2', '~2', '~3', '~3', '~3', '~3', '~2', '~2', '~2'],
    ['~2', '~2', '~1', 'L0', '~2', '~2', '~3', '~3', '~3', '~3', '~2', '~2', '~2'],
    ['~3', '~2', '~1', '~2', '~2', '~3', '~3', 'L2', '~3', '~3', 'L1', '~3', '~3'],
    ['~4', '~3', '~2', '~2', '~3', '~3', '~4', '~4', '~4', 'R4', '~4', '~4', '~4'],
    ['~5', '~4', '~3', '~3', '~3', '~4', '~4', '~5', 'L3', '~5', '~5', '~5', '~5'],
    ['~6', '~5', '~4', '~4', '~4', '~5', '~5', '~6', '~6', '~6', '~6', 'E6', '~6'],
    ['~7', '~6', '~5', '~5', '~5', '~6', 'L4', '~7', '~7', '~7', '~7', '~7', '~7']
  ],

  // HARD: Rend - Volcanic heat processing with lava streams, toxic gas vents, deep fissures
  "85-Rend": [
    ['~4', '~4', '~5', '~5', '~6', '~6', 'H7', '~6', '~6', '~5', '~5', '~4', '~4'],
    ['~4', '~5', '~5', '~6', '~6', '~7', '~7', '~7', '~6', '~6', '~5', '~5', '~4'],
    ['~5', '~5', '~6', '~6', '~7', 'G7', 'L6', 'G7', '~7', '~6', '~6', '~5', '~5'],
    ['~5', '~6', '~6', '~7', 'V7', 'L6', 'L6', 'L6', 'V7', '~7', '~6', '~6', '~5'],
    ['~6', '~6', '~7', '~7', 'L6', 'L6', 'L6', 'L6', 'L6', '~7', '~7', '~6', '~6'],
    ['~6', '~7', 'G7', 'L6', 'L6', 'L6', 'L6', 'L6', 'L6', 'L6', 'G7', '~7', '~6'],
    ['~6', '~7', 'L6', 'L6', 'L6', 'L6', 'L6', 'L6', 'L6', 'L6', 'L6', '~7', '~6'],
    ['~6', '~6', 'B6', 'L6', 'B6', 'B6', 'L6', 'L6', 'B6', 'B6', 'B6', '~6', '~6'],
    ['~5', '~6', '~6', 'L5', 'L5', 'L5', 'G5', 'L5', 'L5', 'L5', '~6', '~6', '~5'],
    ['~5', '~5', '~6', '~6', 'L5', 'L5', 'L5', 'L5', '~6', '~6', '~6', '~5', '~5'],
    ['~4', '~5', '~5', '~6', '~6', 'L5', 'L5', '~6', '~6', '~6', '~5', '~5', '~4'],
    ['~4', '~4', 'S5', '~5', '~5', '~6', '~6', '~6', '~5', '~5', '~5', 'E5', '~4'],
    ['~3', '~4', '~4', '~4', '~5', '~5', '~5', '~5', '~5', '~4', '~4', '~4', '~3']
  ],

  // HARD: Dine - Waste processing with toxic swamp water, quicksand, twisted trees
  "7-Dine": [
    ['~2', 'W0', 'W0', 'H1', 'W0', 'W0', '~2', '~2', 'T2', '~2', '~2', '~2', '~2'],
    ['~2', 'W0', 'W0', 'W0', 'W0', '~2', '~2', '~2', 'T2', '~2', 'W0', 'W0', '~2'],
    ['W0', 'W0', '~2', '~2', '~2', '~2', '~2', '~2', '~2', 'W0', 'W0', 'W0', '~2'],
    ['W0', '~2', '~2', '~2', 'Q1', 'Q1', '~2', '~2', '~2', '~2', 'W0', '~2', '~2'],
    ['~2', '~2', '~2', 'Q1', 'Q1', 'Q1', 'Q1', '~2', '~2', '~2', '~2', '~2', '~2'],
    ['~2', '~2', 'B2', 'B2', 'Q1', 'T1', 'Q1', 'B2', '~2', '~2', '~2', 'X0', 'X0'],
    ['~2', '~2', 'W0', 'W0', 'Q1', 'S1', 'Q1', 'W0', '~2', '~2', 'X0', 'X0', 'X0'],
    ['~2', '~2', '~2', 'W0', 'Q1', 'T1', 'Q1', 'Q1', '~2', '~2', '~2', 'X0', '~2'],
    ['~2', '~2', '~2', '~2', 'Q1', 'Q1', 'Q1', 'Q1', '~2', '~2', '~2', '~2', '~2'],
    ['~2', 'W0', '~2', '~2', '~2', 'Q1', 'Q1', '~2', '~2', '~2', 'W0', '~2', '~2'],
    ['~2', 'W0', 'W0', '~2', '~2', '~2', '~2', '~2', '~2', 'W0', 'W0', 'T2', '~2'],
    ['~2', 'W0', 'W0', 'W0', '~2', '~2', '~2', '~2', 'W0', 'W0', 'T2', 'E2', '~2'],
    ['~2', '~2', 'W0', '~2', '~2', '~2', '~2', '~2', '~2', 'W0', '~2', '~2', '~2']
  ],

  // HARD: Titan - Manufacturing hub with deep gorges, massive metal bridges, waste pools
  "8-Titan": [
    ['E6', '~6', 'X0', 'X0', 'X0', '~6', '~6', '~6', 'B6', 'B6', 'B6', '~6', 'H6'],
    ['~6', '~6', 'X0', 'X0', 'X0', '~6', '~6', '~6', 'X0', 'X0', 'X0', '~6', '~6'],
    ['X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'X0', 'X0'],
    ['X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'X0', 'X0'],
    ['X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'X0', 'X0'],
    ['X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'X0', 'X0'],
    ['~6', '~6', '~6', 'X0', 'X0', '~6', '~6', '~6', 'X0', 'X0', 'X0', '~6', '~6'],
    ['~6', '~6', '~6', 'B6', 'B6', '~6', '~6', '~6', 'X0', 'X0', 'X0', '~6', '~6'],
    ['~6', '~6', '~6', 'X0', 'X0', '~6', '~6', '~6', 'X0', 'X0', 'X0', '~6', '~6'],
    ['X0', 'X0', 'X0', 'X0', 'X0', 'X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'X0', 'B6'],
    ['X0', 'X0', 'X0', 'X0', 'X0', 'X0', 'B6', 'X0', 'X0', 'X0', 'X0', 'X0', 'B6'],
    ['~6', '~6', 'X0', 'X0', 'X0', '~6', '~6', '~6', 'X0', 'X0', 'X0', '~6', '~6'],
    ['S6', '~6', 'B6', 'B6', 'B6', '~6', '~6', '~6', 'B6', 'B6', 'B6', '~6', '~6']
  ],

  // EXTREME: Artifice - Equipment research with massive craters, molten pools, severe radiation
"68-Artifice": [
  ['~5', 'M2', 'Q0', 'H7', '~3', 'R8', 'T1', 'Q0', '~6', 'V2', 'R4', '~7', '~3'],
  ['~8', '~3', 'T5', '~1', 'R6', '~2', 'Q0', '~4', 'Q1', 'M5', '~2', '~8', '~4'],
  ['~2', 'Q0', '~7', 'R4', 'M1', 'Q0', '~3', '~6', 'Q0', 'T3', '~6', '~1', 'R5'],
  ['~6', 'V3', '~1', 'P0', '~5', '~2', 'L0', '~2', '~4', 'R7', 'Q2', '~4', '~2'],
  ['~1', 'R5', '~4', 'M2', 'X0', '~6', 'L0', 'V4', 'Q1', '~3', '~5', 'T2', '~6'],
  ['~4', 'Q2', 'P0', '~5', 'X0', 'R3', 'T1', 'R6', '~3', 'M1', 'I2', '~4', '~3'],
  ['S3', '~6', 'T1', '~3', 'B3', 'B3', '~5', 'Q2', 'Q0', '~4', 'V2', '~5', 'M1'],
  ['~2', '~4', 'Q0', 'M6', 'X0', '~2', '~4', '~7', 'R3', '~1', 'P0', 'T3', '~6'],
  ['~7', 'V1', '~3', 'Q2', '~5', 'I1', 'R2', '~4', 'R8', 'Q3', 'Q0', '~6', 'M2'],
  ['~3', '~5', 'R4', '~7', 'M1', 'T3', '~6', 'Q2', '~4', 'Q0', '~5', 'V1', '~4'],
  ['~6', 'Q2', '~4', 'T1', 'Q0', '~5', 'R3', 'L0', '~6', 'M3', '~7', '~4', '~2'],
  ['~1', '~4', '~6', 'R3', 'V2', 'M4', 'Q0', '~5', 'T2', '~6', 'Q3', 'E5', '~7'],
  ['~5', '~7', 'M2', '~5', 'Q3', '~6', '~4', 'R2', '~5', 'T3', '~6', '~4', '~3']
]
}

// Helper function to get height at specific coordinates
export const getHeightAt = (moonName, x, y) => {
  const heightMap = HEIGHT_MAPS[moonName];
  if (!heightMap || y < 0 || y >= heightMap.length || x < 0 || x >= heightMap[0].length) {
    return 0;
  }
  const cell = heightMap[y][x];
  return parseInt(cell.slice(1)) || 0;
};

// Helper function to get terrain type at specific coordinates
export const getTerrainAt = (moonName, x, y) => {
  const heightMap = HEIGHT_MAPS[moonName];
  if (!heightMap || y < 0 || y >= heightMap.length || x < 0 || x >= heightMap[0].length) {
    return '~';
  }
  const cell = heightMap[y][x];
  return cell.charAt(0);
};

// Helper function to get full cell data
export const getCellAt = (moonName, x, y) => {
  const heightMap = HEIGHT_MAPS[moonName];
  if (!heightMap || y < 0 || y >= heightMap.length || x < 0 || x >= heightMap[0].length) {
    return '~0';
  }
  return heightMap[y][x];
};

// Helper function to find specific terrain type positions
export const findTerrainPositions = (moonName, terrainCode) => {
  const heightMap = HEIGHT_MAPS[moonName];
  const positions = [];
  
  if (!heightMap) return positions;
  
  for (let y = 0; y < heightMap.length; y++) {
    for (let x = 0; x < heightMap[y].length; x++) {
      if (heightMap[y][x].charAt(0) === terrainCode) {
        positions.push({ x, y, elevation: parseInt(heightMap[y][x].slice(1)) || 0 });
      }
    }
  }
  
  return positions;
};

// Helper function to get ship, facility, and fire exit positions
export const getShipPosition = (moonName) => {
  const positions = findTerrainPositions(moonName, 'S');
  return positions.length > 0 ? positions[0] : { x: 0, y: 12, elevation: 0 };
};

export const getFacilityPosition = (moonName) => {
  const positions = findTerrainPositions(moonName, 'H');
  return positions.length > 0 ? positions[0] : { x: 12, y: 0, elevation: 0 };
};

export const getFireExitPosition = (moonName) => {
  const positions = findTerrainPositions(moonName, 'E');
  return positions.length > 0 ? positions[0] : { x: 6, y: 6, elevation: 0 };
};

// Interior Layout Types
export const INTERIOR_TYPES = {
  FACTORY: "Factory",
  MANSION: "Mansion", 
  MINESHAFT: "Mineshaft"
};

// Room count estimates based on map size multiplier and interior type
export const calculateRoomCount = (multiplier, interiorType) => {
  let baseMin, baseMax;
  
  switch (interiorType) {
    case INTERIOR_TYPES.FACTORY:
      baseMin = 8;
      baseMax = 12;
      break;
    case INTERIOR_TYPES.MANSION:
      baseMin = 12;
      baseMax = 18;
      break;
    case INTERIOR_TYPES.MINESHAFT:
      baseMin = 6;
      baseMax = 10;
      break;
    default:
      baseMin = 8;
      baseMax = 12;
  }
  
  return {
    min: Math.round(baseMin * multiplier),
    max: Math.round(baseMax * multiplier)
  };
};

export const TIER_1_MOONS = [
  {
    name: "41-Experimentation",
    cost: 0,
    difficulty: "D",
    description: "Rolling hills with toxic lakes and research facilities",
    weatherTypes: {
      clear: 50,
      rainy: 25,
      stormy: 10,
      foggy: 15,
      flooded: 0,
      eclipsed: 0
    },
    mapSizeMultiplier: 1.0,
    defaultInterior: "Factory",
    interiorChances: { Factory: 71, Mansion: 25, Mineshaft: 5 },
    scrapRange: { min: 8, max: 12 },
    maxIndoorPower: 4,
    maxOutdoorPower: 4,
    maxDaytimePower: 7,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 13.7, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 11.5, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 7.9, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.2, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 6.7, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.5, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.8, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.9, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Tea Kettle", spawnChance: 4.4, value: { min: 32, max: 56 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 3.9, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.3, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Gold Bar", spawnChance: 2.1, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Spore Lizard", spawnChance: 35, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Thumper", spawnChance: 28, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 20, powerLevel: 1, maxCount: 8, dangerous: true },
      { name: "Hygrodere", spawnChance: 12, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Bracken", spawnChance: 5, powerLevel: 3, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Baboon Hawk", spawnChance: 70, powerLevel: 0.5, maxCount: 15, dangerous: true },
      { name: "Eyeless Dog", spawnChance: 30, powerLevel: 2, maxCount: 8, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 50, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 35, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 15, powerLevel: 1, maxCount: 6, dangerous: false }
    ],
    nighttimeStart: "6:00 PM"
  },
  {
    name: "220-Assurance", 
    cost: 0,
    difficulty: "C",
    description: "Deep canyon with facility at bottom requiring bridge navigation",
    weatherTypes: {
      clear: 40,
      rainy: 30,
      stormy: 15,
      foggy: 10,
      flooded: 5,
      eclipsed: 0
    },
    mapSizeMultiplier: 1.0,
    defaultInterior: "Factory",
    interiorChances: { Factory: 40, Mansion: 60, Mineshaft: 0 },
    scrapRange: { min: 13, max: 16 },
    maxIndoorPower: 6,
    maxOutdoorPower: 8,
    maxDaytimePower: 7,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 11.8, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 9.2, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 8.5, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 9.1, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 7.3, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 6.8, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.2, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.5, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.1, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Laser Pointer", spawnChance: 3.8, value: { min: 32, max: 100 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 3.5, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.2, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Spore Lizard", spawnChance: 32, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Snare Flea", spawnChance: 25, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 18, powerLevel: 1, maxCount: 8, dangerous: true },
      { name: "Bunker Spider", spawnChance: 15, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Bracken", spawnChance: 10, powerLevel: 3, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Baboon Hawk", spawnChance: 55, powerLevel: 0.5, maxCount: 15, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 45, powerLevel: 2, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 49, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 28, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 22, powerLevel: 1, maxCount: 6, dangerous: false }
    ],
    nighttimeStart: "5:00 PM"
  },
  {
    name: "56-Vow",
    cost: 0, 
    difficulty: "C",
    description: "Forested areas with large water systems and bridge crossings",
    weatherTypes: {
      clear: 35,
      rainy: 20,
      stormy: 20,
      foggy: 20,
      flooded: 3,
      eclipsed: 2
    },
    mapSizeMultiplier: 1.5,
    defaultInterior: "Factory",
    interiorChances: { Factory: 85, Mansion: 10, Mineshaft: 5 },
    scrapRange: { min: 11, max: 14 },
    maxIndoorPower: 7,
    maxOutdoorPower: 6,
    maxDaytimePower: 17,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 10.5, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 8.8, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 7.7, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.3, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 7.8, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 7.2, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.5, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.1, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 4.2, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 3.8, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.3, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Tea Kettle", spawnChance: 2.9, value: { min: 32, max: 56 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Hygrodere", spawnChance: 30, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Thumper", spawnChance: 24, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 17, powerLevel: 1, maxCount: 8, dangerous: true },
      { name: "Bunker Spider", spawnChance: 15, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Coil-Head", spawnChance: 14, powerLevel: 1, maxCount: 5, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Baboon Hawk", spawnChance: 50, powerLevel: 0.5, maxCount: 15, dangerous: true },
      { name: "Forest Keeper", spawnChance: 50, powerLevel: 3, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 43, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 28, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 27, powerLevel: 1, maxCount: 6, dangerous: false }
    ],
    nighttimeStart: "2:00 PM"
  }
];

export const TIER_2_MOONS = [
  {
    name: "21-Offense",
    cost: 0,
    difficulty: "B", 
    description: "Flat toxic wasteland with dangerous chemical hazards",
    weatherTypes: {
      clear: 30,
      rainy: 15,
      stormy: 25,
      foggy: 15,
      flooded: 5,
      eclipsed: 10
    },
    mapSizeMultiplier: 1.7,
    defaultInterior: "Mineshaft",
    interiorChances: { Factory: 90, Mansion: 10, Mineshaft: 0 },
    scrapRange: { min: 14, max: 17 },
    maxIndoorPower: 8,
    maxOutdoorPower: 8,
    maxDaytimePower: 15,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 12.2, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 10.8, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 8.3, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.7, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 8.1, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 7.5, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Flask", spawnChance: 6.8, value: { min: 16, max: 44 }, weight: 19, twoHanded: false, conductive: true },
      { name: "Comedy", spawnChance: 6.2, value: { min: 28, max: 52 }, weight: 11, twoHanded: false, conductive: false },
      { name: "Brass Bell", spawnChance: 5.4, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.7, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Stop Sign", spawnChance: 4.2, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.8, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Nutcracker", spawnChance: 28, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Thumper", spawnChance: 26, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Coil-Head", spawnChance: 20, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 14, powerLevel: 1, maxCount: 8, dangerous: true },
      { name: "Bunker Spider", spawnChance: 8, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Bracken", spawnChance: 4, powerLevel: 3, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Old Bird", spawnChance: 60, powerLevel: 3, maxCount: 20, dangerous: true },
      { name: "Baboon Hawk", spawnChance: 40, powerLevel: 0.5, maxCount: 15, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 100, powerLevel: 1, maxCount: 16, dangerous: false }
    ],
    nighttimeStart: "2:00 PM"
  },
  {
    name: "61-March",
    cost: 0,
    difficulty: "B",
    description: "Forested hills with toxic water systems and facility access challenges",
    weatherTypes: {
      clear: 45,
      rainy: 10,
      stormy: 25,
      foggy: 15,
      flooded: 0,
      eclipsed: 5
    },
    mapSizeMultiplier: 2.0,
    defaultInterior: "Factory",
    interiorChances: { Factory: 30, Mansion: 15, Mineshaft: 55 },
    scrapRange: { min: 13, max: 16 },
    maxIndoorPower: 14,
    maxOutdoorPower: 12,
    maxDaytimePower: 20,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 11.3, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 9.8, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 8.1, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.5, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 7.9, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 7.4, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.7, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Flask", spawnChance: 6.1, value: { min: 16, max: 44 }, weight: 19, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.3, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.6, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Stop Sign", spawnChance: 4.1, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.7, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Thumper", spawnChance: 35, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Hygrodere", spawnChance: 22, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Bracken", spawnChance: 18, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 12, powerLevel: 1, maxCount: 8, dangerous: true },
      { name: "Spore Lizard", spawnChance: 8, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Jester", spawnChance: 5, powerLevel: 3, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Earth Leviathan", spawnChance: 65, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Baboon Hawk", spawnChance: 35, powerLevel: 0.5, maxCount: 15, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Circuit Bee", spawnChance: 45, powerLevel: 1, maxCount: 6, dangerous: false },
      { name: "Manticoil", spawnChance: 35, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 20, powerLevel: 1, maxCount: 5, dangerous: false }
    ],
    nighttimeStart: "2:00 PM"
  },
  {
    name: "20-Adamance", 
    cost: 0,
    difficulty: "B",
    description: "Valley system requiring multiple bridge crossings to reach facility",
    weatherTypes: {
      clear: 35,
      rainy: 20,
      stormy: 30,
      foggy: 10,
      flooded: 3,
      eclipsed: 2
    },
    mapSizeMultiplier: 1.4,
    defaultInterior: "Factory",
    interiorChances: { Factory: 25, Mansion: 10, Mineshaft: 65 },
    scrapRange: { min: 15, max: 19 },
    maxIndoorPower: 13,
    maxOutdoorPower: 13,
    maxDaytimePower: 20,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 12.8, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 10.2, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 8.8, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.9, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 8.2, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 7.6, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.9, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Flask", spawnChance: 6.3, value: { min: 16, max: 44 }, weight: 19, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.7, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.9, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Stop Sign", spawnChance: 4.4, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.8, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Bunker Spider", spawnChance: 32, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Thumper", spawnChance: 24, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Nutcracker", spawnChance: 18, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Snare Flea", spawnChance: 11, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 10, powerLevel: 1, maxCount: 8, dangerous: true },
      { name: "Bracken", spawnChance: 5, powerLevel: 3, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Forest Keeper", spawnChance: 70, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Baboon Hawk", spawnChance: 30, powerLevel: 0.5, maxCount: 15, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 50, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 30, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 15, powerLevel: 1, maxCount: 6, dangerous: false },
      { name: "Tulip Snake", spawnChance: 5, powerLevel: 0.5, maxCount: 12, dangerous: false }
    ],
    nighttimeStart: "2:00 PM"
  }
];

export const TIER_3_MOONS = [
  {
    name: "85-Rend",
    cost: 550,
    difficulty: "A",
    description: "Volcanic mountainous terrain with lava pits and gas vents",
    weatherTypes: {
      clear: 25,
      rainy: 15,
      stormy: 35,
      foggy: 15,
      flooded: 2,
      eclipsed: 8
    },
    mapSizeMultiplier: 1.8,
    defaultInterior: "Mansion",
    interiorChances: { Factory: 80, Mansion: 5, Mineshaft: 15 },
    scrapRange: { min: 18, max: 23 },
    maxIndoorPower: 10,
    maxOutdoorPower: 6,
    maxDaytimePower: 0,
    scrapItems: [
      { name: "Painting", spawnChance: 14.2, value: { min: 60, max: 124 }, weight: 31, twoHanded: true, conductive: false },
      { name: "Fancy Lamp", spawnChance: 11.8, value: { min: 60, max: 128 }, weight: 21, twoHanded: true, conductive: true },
      { name: "Perfume Bottle", spawnChance: 10.4, value: { min: 76, max: 104 }, weight: 3, twoHanded: false, conductive: false },
      { name: "V-Type Engine", spawnChance: 10.1, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Gold Bar", spawnChance: 8.7, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 7.3, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 6.9, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 5.8, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 5.2, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 4.6, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 4.1, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Brass Bell", spawnChance: 3.7, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Jester", spawnChance: 22, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Butler", spawnChance: 20, powerLevel: 2, maxCount: 4, dangerous: true },
      { name: "Hygrodere", spawnChance: 18, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Thumper", spawnChance: 16, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Bracken", spawnChance: 12, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 8, powerLevel: 1, maxCount: 8, dangerous: true },
      { name: "Barber", spawnChance: 4, powerLevel: 1, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Old Bird", spawnChance: 75, powerLevel: 4, maxCount: 20, dangerous: true },
      { name: "Baboon Hawk", spawnChance: 25, powerLevel: 1, maxCount: 15, dangerous: false }
    ],
    nighttimeStart: "1:00 PM"
  },
  {
    name: "7-Dine",
    cost: 600,
    difficulty: "S", 
    description: "Swampy wetlands with minimal terrain obstacles but environmental hazards",
    weatherTypes: {
      clear: 20,
      rainy: 25,
      stormy: 20,
      foggy: 15,
      flooded: 15,
      eclipsed: 5
    },
    mapSizeMultiplier: 1.9,
    defaultInterior: "Mansion",
    interiorChances: { Factory: 75, Mansion: 20, Mineshaft: 5 },
    scrapRange: { min: 20, max: 25 },
    maxIndoorPower: 15,
    maxOutdoorPower: 6,
    maxDaytimePower: 0,
    scrapItems: [
      { name: "Painting", spawnChance: 15.1, value: { min: 60, max: 124 }, weight: 31, twoHanded: true, conductive: false },
      { name: "Fancy Lamp", spawnChance: 12.5, value: { min: 60, max: 128 }, weight: 21, twoHanded: true, conductive: true },
      { name: "Perfume Bottle", spawnChance: 11.2, value: { min: 76, max: 104 }, weight: 3, twoHanded: false, conductive: false },
      { name: "V-Type Engine", spawnChance: 10.8, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Gold Bar", spawnChance: 9.3, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 8.1, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 7.4, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 6.2, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 5.5, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 4.8, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 4.1, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Brass Bell", spawnChance: 2.0, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Hygrodere", spawnChance: 25, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Butler", spawnChance: 21, powerLevel: 2, maxCount: 7, dangerous: true },
      { name: "Bracken", spawnChance: 15, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Bunker Spider", spawnChance: 12, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Jester", spawnChance: 11, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Maneater", spawnChance: 8, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 5, powerLevel: 1, maxCount: 8, dangerous: true },
      { name: "Ghost Girl", spawnChance: 3, powerLevel: 2, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Earth Leviathan", spawnChance: 60, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Eyeless Dog", spawnChance: 40, powerLevel: 2, maxCount: 8, dangerous: true }
    ],
    nighttimeStart: "3:00 PM"
  },
  {
    name: "8-Titan",
    cost: 700,
    difficulty: "S+",
    description: "Massive elevated platform with steep drop-offs and limited bridge access",
    weatherTypes: {
      clear: 30,
      rainy: 15,
      stormy: 25,
      foggy: 20,
      flooded: 5,
      eclipsed: 5
    },
    mapSizeMultiplier: 2.2,
    defaultInterior: "Factory",
    interiorChances: { Factory: 95, Mansion: 5, Mineshaft: 0 },
    scrapRange: { min: 28, max: 31 },
    maxIndoorPower: 18,
    maxOutdoorPower: 7,
    maxDaytimePower: 0,
    scrapItems: [
      { name: "Painting", spawnChance: 13.2, value: { min: 60, max: 124 }, weight: 31, twoHanded: true, conductive: false },
      { name: "V-Type Engine", spawnChance: 11.8, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Fancy Lamp", spawnChance: 10.5, value: { min: 60, max: 128 }, weight: 21, twoHanded: true, conductive: true },
      { name: "Gold Bar", spawnChance: 10.3, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 9.1, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Perfume Bottle", spawnChance: 8.4, value: { min: 76, max: 104 }, weight: 3, twoHanded: false, conductive: false },
      { name: "Large Axle", spawnChance: 7.2, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 6.1, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 5.5, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 4.8, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 4.2, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Brass Bell", spawnChance: 3.6, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 2.3, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Butler", spawnChance: 22, powerLevel: 2, maxCount: 7, dangerous: true },
      { name: "Coil-Head", spawnChance: 18, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Nutcracker", spawnChance: 16, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Maneater", spawnChance: 12, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Hygrodere", spawnChance: 10, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Bracken", spawnChance: 9, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Jester", spawnChance: 7, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Snare Flea", spawnChance: 4, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 2, powerLevel: 1, maxCount: 8, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Old Bird", spawnChance: 65, powerLevel: 3, maxCount: 20, dangerous: true },
      { name: "Forest Keeper", spawnChance: 35, powerLevel: 3, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [],
    nighttimeStart: "1:00 PM"
  },
  {
    name: "68-Artifice",
    cost: 1500, 
    difficulty: "S++",
    description: "Industrial wasteland with toxic zones and bridge choke points",
    weatherTypes: {
      clear: 15,
      rainy: 10,
      stormy: 30,
      foggy: 20,
      flooded: 10,
      eclipsed: 15
    },
    mapSizeMultiplier: 1.6,
    defaultInterior: "Mansion",
    interiorChances: { Factory: 60, Mansion: 25, Mineshaft: 15 },
    scrapRange: { min: 26, max: 30 },
    maxIndoorPower: 13,
    maxOutdoorPower: 13,
    maxDaytimePower: 15,
    scrapItems: [
      { name: "Gold Bar", spawnChance: 15.2, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Painting", spawnChance: 13.8, value: { min: 60, max: 124 }, weight: 31, twoHanded: true, conductive: false },
      { name: "Fancy Lamp", spawnChance: 11.5, value: { min: 60, max: 128 }, weight: 21, twoHanded: true, conductive: true },
      { name: "Cash Register", spawnChance: 10.3, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "V-Type Engine", spawnChance: 9.7, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Perfume Bottle", spawnChance: 8.9, value: { min: 76, max: 104 }, weight: 3, twoHanded: false, conductive: false },
      { name: "Large Axle", spawnChance: 6.8, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Stop Sign", spawnChance: 5.2, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 4.5, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.8, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Scrap Metal", spawnChance: 3.1, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 2.4, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 1.8, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Hygrodere", spawnChance: 18, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Bracken", spawnChance: 16, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Jester", spawnChance: 14, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Butler", spawnChance: 12, powerLevel: 2, maxCount: 7, dangerous: true },
      { name: "Coil-Head", spawnChance: 11, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Nutcracker", spawnChance: 10, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Ghost Girl", spawnChance: 7, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Spore Lizard", spawnChance: 4, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Barber", spawnChance: 4, powerLevel: 1, maxCount: 1, dangerous: true },
      { name: "Masked", spawnChance: 3, powerLevel: 1, maxCount: 3, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 1, powerLevel: 1, maxCount: 8, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Old Bird", spawnChance: 80, powerLevel: 3, maxCount: 20, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 15, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Eyeless Dog", spawnChance: 5, powerLevel: 2, maxCount: 8, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 60, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 25, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 15, powerLevel: 1, maxCount: 6, dangerous: false }
    ],
    nighttimeStart: "3:00 PM"
  }
];

export const moons = [...TIER_1_MOONS, ...TIER_2_MOONS, ...TIER_3_MOONS];