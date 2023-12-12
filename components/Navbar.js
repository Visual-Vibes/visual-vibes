// components/Navbar
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="container flex bg-primaryBackground border-solid border-primaryText">
      <Link href="/"></Link>
    </div>
  );
};

export default Navbar;
