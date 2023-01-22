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

export type ReservationPrototypeType = {
  count: number;
  start: Date;
  end: Date;
  maxDuration?: number;
  reserver?: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
    };
  };
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

export type RentalObjectType = {
  internal_identifier: number;
};

export type UserType = {
  last_name: string;
  first_name: string;
  email: string;
};

export type ReservationType = {
  id: number;
  selectedObjects?: RentalObjectType[];
  selectableObjects?: RentalObjectType[];
  objecttype: RentalObjectTypeType;
  reserver: { user: UserType };
  reserved_from: string;
  reserved_until: string;
  count: number;
};

export type RentalFormType = {
  reserver: { user: { first_name: string; last_name: string; email: string } };
  objecttype: { name: string; prefix_identifier: string };
  slectedObjects: [pk: int];
  reserved_from: string;
  reserved_until: string;
};

export type UserStoreType = {
  expiry: string;
  token: string;
  user: {
    email: string;
    groups: [string];
    is_staff: boolean;
    is_admin: boolean;
    user_permissions: [string];
    username: string;
    profile: {
      automatically_verifiable: boolean;
      verified: boolean;
    };
  };
};
