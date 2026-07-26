import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import { Link } from "react-router";

export default function MyFooter() {
  return (
    <Footer container className="z-10 rounded-none bg-gray-100">
      <FooterCopyright
        href="https://github.com/pawllo01"
        by="pawllo01"
        year={2026}
      />
      <FooterLinkGroup>
        <FooterLink as={Link} to="/faq">
          FAQ
        </FooterLink>
        <FooterLink
          href="https://github.com/pawllo01/apple-music-artist-browser"
          target="_blank"
        >
          GitHub Project
        </FooterLink>
      </FooterLinkGroup>
    </Footer>
  );
}
