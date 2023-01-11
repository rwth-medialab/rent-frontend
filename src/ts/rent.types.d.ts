export type RentalObjectTypeType = {
  category: number;
  shortdescription: string;
  description: string;
  manufacturer: string;
  id?: number;
  image: string;
  name: string;
  prefix_identifier: string;
  tags: number[];
  visible: boolean;
  count?: number;
};

export type TagType = { name: string; id?: number; description: string };

export type TextType = { name: string; id?: number; content: string };

export type AvailableType = {
  [id: string | number]: { [date: string]: number; available: number };
};

export type SettingsType = {
  [type: "returning_day" | "lenting_day" | string]: { value: string };
};
