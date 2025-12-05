type Author = {
  name: string;
  image: string;
  designation: string;
};

// types/ticket.ts
export type Ticket = {
  id: number;
  title: string;
  image: string;
  publishDate: string;
  paragraph?: string;  // optional болгох
  author?: string;     // optional болгох
  tags?: string[];     // optional болгох
};