export interface Accessory {
  id: string;
  category: string;
  serialNumber: string;
  type: string;
}

export interface PrinterAccessory {
  id: string;
  accessoryId: string;
  printerId: string;
}

export interface PrinterCheckAccessory {
  id: string;
  accessoryId: string;
  hasAccessory: boolean;
  printerCheckId: string;
}

export interface PrinterCheckAccessoryDto extends Omit<PrinterCheckAccessory, "id"> {}

export interface CheckedAccessory extends Accessory {
  hasAccessory: boolean;
}
