"use client";

import { About, CreateProfile, Explore, Profile } from "./discovery";
import { Hire } from "./hiring";
import { Work } from "./work";
import { Messages, Reputation, Settings } from "./workspace";
export function MarketplaceView({
  view
}: {
  view: string[];
}) {
  switch (view[0]) {
    case "explore":
      return <Explore />;
    case "list":
      return <CreateProfile />;
    case "hire":
      return <Hire />;
    case "profile":
      return <Profile id={Number(view[1])} />;
    case "work":
      return <Work />;
    case "messages":
      return <Messages />;
    case "reputation":
      return <Reputation />;
    case "settings":
      return <Settings />;
    case "about":
      return <About />;
    default:
      return null;
  }
}
