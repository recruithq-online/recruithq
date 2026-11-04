"use client";
import { About } from "./about";
import { CreateProfile } from "./create-profile";
import { Profile } from "./expert-profile";
import { Explore } from "./explore";
import { Hire } from "./hiring";
import { Messages } from "./messages";
import { Reputation } from "./reputation";
import { Settings } from "./settings";
import { Work } from "./work";

export function MarketplaceView({ view }: { view: string[] }) {
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
