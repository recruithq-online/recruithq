import Image from "next/image";
import logo from "@/app/logo.jpeg";

export function Brand() {
  return (
    <a className="brand" href="#top" aria-label="rEcruit home">
      <Image
        className="logo-image"
        src={logo}
        alt="rEcruit"
        priority
        sizes="128px"
      />
    </a>
  );
}
