import { Timestamp } from "firebase/firestore";

export interface Printer {
  id: string;
  imgUrl: string | null;
  model: string;
  serialNumber: string;
}

export interface PrinterCheck {
  id: string;
  userId: string;
  printerId: string;
  note: string | null;
  date: Timestamp;
  // NOTE: default must be false. Mark as completed after all
  // PrinterCheckAccessories have been inserted in database
  completed: boolean;
}

export interface PrinterCheckDto extends Omit<PrinterCheck, "id"> {}
