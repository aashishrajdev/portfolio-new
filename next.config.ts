import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 blocks cross-origin requests to dev assets by default, so a phone
  // on the LAN hitting http://<this-machine>:3000 gets HTML but no JS — and
  // the motion-driven sections ship as opacity:0 until JS runs, i.e. a blank
  // page. Allow this machine's LAN addresses in dev. Production is unaffected.
  allowedDevOrigins: ["192.168.1.19", "192.168.56.1"],
};

export default nextConfig;
