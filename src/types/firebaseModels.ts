import { Timestamp } from "firebase/firestore";

export interface Printer {
  id: string;
  imgUrl: string | null;
  model: string;
  serialNumber: string;
}

export interface PrinterAccessory {
  accessoryId: string;
  hasAccessory: boolean;
  printerId: string;
}

export interface Accessory {
  id: string;
  category: string;
  serialNumber: string;
  type: string;
}

export interface AccessoryForCheck extends Accessory {
  hasAccessory: boolean;
}

export interface PrinterCheck {
  id: string;
  printerId: string;
  note: string | null;
  date: Timestamp;
  // NOTE: default must be false. Mark as completed after all
  // PrinterCheckAccessories have been inserted in database
  completed: boolean;
}

export interface PrinterCheckDto extends Omit<PrinterCheck, "id"> {}

export interface PrinterCheckAccessory {
  id: string;
  accessoryId: string;
  hasAccessory: boolean;
  printerCheckId: string;
}

export interface PrinterCheckAccessoryDto extends Omit<PrinterCheckAccessory, "id"> {}
