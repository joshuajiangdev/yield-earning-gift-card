import Link from "next/link";
import type { NextPage } from "next";
import { Text } from "../src/coreui-components";

const Home: NextPage = () => {
  return (
    <ul>
      <li>
        <Link href="/send">
          <a>
            <Text>Send</Text>
          </a>
        </Link>
      </li>
      <li>
        <Link href="/receive">
          <a>
            <Text>Receive</Text>
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default Home;
