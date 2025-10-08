import { BaseDocument } from "../_base/document.base";

export interface IAppUserCoreModel  extends BaseDocument {
  uid: string; // Firebase Auth UID mappleme için,
  name: string;
  surname?: string;
  email: string;
}
