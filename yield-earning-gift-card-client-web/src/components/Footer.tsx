import React from "react";
import Image from "next/image";

const Footer = () => (
  <div className="footer" style={{ textAlign: "center" }}>
    <p>
      {" "}
      Built with ♥️ on{" "}
      <Image
        src="https://www.terra.cards/wp-content/uploads/2021/07/terra-small-1.png"
        width="60"
        height="15"
        alt="terra"
      ></Image>
    </p>{" "}
  </div>
);

export default Footer;
