// checks contract code at given addresses using the Hardhat network provider
import hre from "hardhat";

async function main() {
  const provider = hre.ethers.provider;

  const addrs = [
    // address reported by frontend earlier
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    // address you inspected in the hardhat console earlier
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  ];

  for (const a of addrs) {
    try {
      const code = await provider.getCode(a);
      console.log(`address: ${a}`);
      if (!code || code === "0x") {
        console.log("  code: 0x  (no contract deployed at this address on the configured RPC)");
      } else {
        console.log(`  code size: ${code.length / 2 - 1} bytes`);
        console.log(`  code (first 300 chars): ${code.slice(0, 300)}...`);
      }
    } catch (e) {
      console.error(`failed to getCode for ${a}:`, e);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
