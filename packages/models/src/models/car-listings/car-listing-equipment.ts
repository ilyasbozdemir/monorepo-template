// car-listing-equipment.ts

import { BaseDocument } from "../_base/document.base";

export interface SelectedFeature {
  featureId: string; // "abs", "ebd", "hiz-sabitleyici" gibi
  groupId: string; // "guvenlik", "konfor" gibi
}

export interface CarListingEquipmentModel extends BaseDocument {
  baseId: string; // Core / Details ile ilişki

  selectedEquipmentFeatures?: SelectedFeature[];
}
