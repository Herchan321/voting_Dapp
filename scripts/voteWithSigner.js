import hre from "hardhat";

async function main() {
  const address = process.env.CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const index = Number(process.env.CANDIDATE_INDEX || 0);

  const [signer] = await hre.ethers.getSigners();
  console.log("Using signer:", signer.address);

  const ABI = [
    "function candidatesCount() view returns (uint256)",
    "function getCandidateDetails(uint256) view returns (string,uint256)",
    "function vote(uint256)",
    "function owner() view returns (address)",
    "function electionState() view returns (uint8)",
    "function addVoter(address)",
    "function startElection()",
  ];

  const contract = new hre.ethers.Contract(address, ABI, signer);

  const before = Number(await contract.candidatesCount());
  console.log("candidatesCount before:", before);

  // ensure election is in progress and signer is allowed to vote
  const owner = await contract.owner();
  const state = Number(await contract.electionState());
  // State: 0 = NotStarted, 1 = InProgress, 2 = Ended
  if (state === 0) {
    console.log("Election state: NotStarted");
    if (owner.toLowerCase() === signer.address.toLowerCase()) {
      console.log("Signer is owner — adding signer as voter and starting election...");
      // add signer as voter (owner only) and start election
      const txAdd = await contract.addVoter(signer.address);
      await txAdd.wait();
      const txStart = await contract.startElection();
      await txStart.wait();
      console.log("Added voter and started election");
    } else {
      console.error("Election not started and signer is not the owner. Ask the owner to add you as voter and start the election.");
      return;
    }
  } else if (state === 2) {
    console.error("Election already ended — cannot vote.");
    return;
  }

  console.log(`Sending vote for candidate index ${index}...`);
  try {
    const tx = await contract.vote(index);
    console.log("tx hash:", tx.hash);
    await tx.wait();
    console.log("tx mined");
  } catch (e) {
    // Handle common revert (already voted) gracefully
    const msg = String(e?.reason || e?.error?.message || e?.message || e);
    if (msg.includes("You have already voted")) {
      console.log("Le signataire a déjà voté pour un candidat. Aucune action supplémentaire effectuée.");
      return;
    }
    throw e;
  }

  // read candidate details (if available)
  try {
    const details = await contract.getCandidateDetails(index);
    console.log("candidate details after vote:", details);
  } catch (e) {
    console.warn("could not read candidate after vote:", e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
