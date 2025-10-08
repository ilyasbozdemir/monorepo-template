// media-tags.ts
import { BaseDocument } from "../_base/document.base";

export type MediaTag = string;

export interface IMediaTagModel extends BaseDocument {
  baseId: string;

  tags: MediaTag[];
}
