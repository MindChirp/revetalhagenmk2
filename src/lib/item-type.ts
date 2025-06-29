export const ItemTypePriceTypeMap: Record<ItemType, string> = {
  "1": "kr/natt per person", // Overnatting
  "2": "kr/dag", // Arrangementsrom
  "3": "kr/sesong", // Hageutstyr
  "4": "kr/time", // Møterom
};

export enum ItemType {
  OVERNATTING = 1,
  ARRANGEMENTSROM = 2,
  HAGEUTSTYR = 3,
  MØTEROM = 4,
}
