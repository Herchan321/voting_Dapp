import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  // signer.getBalance may not be available depending on ethers/hardhat versions.
  // Use the provider to fetch the account balance reliably.
  const provider = hre.ethers.provider;
  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  const Election = await hre.ethers.getContractFactory("Election");
  const election = await Election.deploy();
  // ethers v6 / Hardhat: waitForDeployment() ensures contract is mined/deployed
  if (typeof election.waitForDeployment === "function") {
    await election.waitForDeployment();
  }
  const deployedAddress = election.target ?? election.address;
  console.log("Election deployed to:", deployedAddress);

  // Persist the deployed address into the frontend env file so the UI
  // automatically uses the correct address for localhost redeploys.
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.join(__dirname, "..", "frontend", ".env.local");
    const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${deployedAddress}\n`;
    fs.writeFileSync(envPath, envContent, { encoding: "utf8" });
    console.log("Wrote contract address to:", envPath);
  } catch (err) {
    console.warn("Could not write frontend/.env.local:", err && err.message ? err.message : err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
