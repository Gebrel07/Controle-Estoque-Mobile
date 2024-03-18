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
