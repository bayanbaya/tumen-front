
import Ticket from "@/components/Ticket";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Түмэн сугалаанаас",
  description: "Tumen sugalaa",
  // other metadata
};

export default function Home() {
  return (
    <>
      <Hero />
      <Pricing />
      <Ticket />
    </>
  );
}
