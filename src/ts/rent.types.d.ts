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

export type ReservationType = {
  count: number;
  start: Date;
  end: Date;
  maxDuration?: number;
  available?: {
    // do it like this because we cant have watchers for each item in shopping cart
    start: Date;
    end: Date;
    count: number;
  };
} & RentalObjectTypeType;

export type TagType = { name: string; id?: number; description: string };

export type TextType = { name: string; id?: number; content: string };

export type AvailableType = {
  [id: string | number]: { [date: string]: number; available: number };
};

export type SettingsType = {
  [type: "returning_day" | "lenting_day" | string]: { value: string };
};

export type MaxdurationType = {
  id?: number;
  prio: number;
  duration: number | string;
  rental_object_type: number;
  duration_in_days?: number;
};

export type PriorityType = {
  id?: number;
  name: string;
  description: string;
  prio: number | string;
};
