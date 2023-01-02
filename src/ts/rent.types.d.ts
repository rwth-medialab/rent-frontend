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

export type TagType = { name: string; id?: number; description: string }