// car-listing-note.ts

import { BaseDocument } from "../_base/document.base";

interface CarListingNote {
  id: string;
  createdBy: string; // uid
  name_surname: string;
  role: "user" | "admin";
  text: string;
  at: number; // timestamp
}
export interface CarListingNoteModel extends BaseDocument {
  baseId: string;   

  notes?: CarListingNote[];
}
