import { BaseDocument } from "../_base/document.base";

export interface ITermsVersion {
  version: string;
  content: string;
  createdDate: number;
  updatedDate?: number;
  isLastVersion: boolean;
}

export interface TermsAgreement {
  id: string;
  name: string;
  acceptedAt?: number;
  version?: string;
  lastUpdated?: number;
  documentUrl?: string; // PDF veya belge URL'si
}

export interface IAppUserTermsModel extends BaseDocument {
  baseId: string;
  termsAccepted?: TermsAgreement[];
}
