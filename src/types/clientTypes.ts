export interface Address {
  street: string;
  number: number;
  city: string;
  state: string;
  zipCode: string;
}

export interface Client {
  id: string;
  name: string;
  address: Address;
}
