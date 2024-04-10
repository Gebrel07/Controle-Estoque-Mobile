import { CheckedAccessory } from "./accessoryTypes";
import { Client } from "./clientTypes";
import { Printer, PrinterCheck } from "./printerTypes";
import { User } from "./userTypes";

export interface PrinterCheckData {
  printerCheck: PrinterCheck;
  accessories: CheckedAccessory[] | null;
  user: User;
}

export interface PrinterData {
  printer: Printer;
  client: Client;
  lastCheck: PrinterCheckData | null;
}
