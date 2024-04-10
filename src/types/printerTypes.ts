import { Timestamp } from "firebase/firestore";
import { Address } from "./clientTypes";

export interface Printer {
  id: string;
  imgUrl: string | null;
  model: string;
  serialNumber: string;
  clientId: string;
}

export interface PrinterCheck {
  id: string;
  userId: string;
  printerId: string;
  serialNumberOk: boolean;
  serialNumber: string;
  addressOk: boolean;
  address: Address;
  note: string | null;
  date: Timestamp;
  // NOTE: default must be false. Mark as completed after all
  // PrinterCheckAccessories have been inserted in database
  completed: boolean;
}

export interface PrinterCheckDto extends Omit<PrinterCheck, "id"> {}
