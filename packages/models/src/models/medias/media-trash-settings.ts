// media-core.ts
import { BaseDocument } from "../_base/document.base";
import { EMediaGeneralCategory, EMediaType } from "./media-details";
import { TVisibility } from "./media-permissions";



export interface IMediaTrashSettingsModel extends BaseDocument {
  id?: string; // Firebase veya eski sistemden gelen ID, MongoDB _id ile maplemek için

  retentionPeriod: number; // Gün cinsinden
  autoDelete: boolean;
  notifyBeforeDelete: boolean;
  notifyDaysBefore?: number;
}
