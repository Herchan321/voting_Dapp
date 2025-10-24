import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("Election", function () {
  let Election, election, owner, voter1, voter2;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    Election = await ethers.getContractFactory("Election");
    election = await Election.connect(owner).deploy();
    if (typeof election.waitForDeployment === "function") {
      await election.waitForDeployment();
    }
  });

  it("has two initial candidates", async function () {
    const count = await election.candidatesCount();
    expect(count).to.equal(2);
    const c0 = await election.getCandidateDetails(0);
    expect(c0[0]).to.be.a('string');
  });

  it("owner can add voter and voter can vote once", async function () {
    // owner adds voter1
    await (await election.addVoter(voter1.address)).wait();

    // start election
    await (await election.startElection()).wait();

    // voter1 votes for candidate 0
    await (await election.connect(voter1).vote(0)).wait();

    const c0 = await election.getCandidateDetails(0);
    expect(c0[1]).to.equal(1);

    // voter1 cannot vote twice
    await expect(election.connect(voter1).vote(0)).to.be.revertedWith("You have already voted");
  });

  it("non-voter cannot vote and cannot vote after election ended", async function () {
    // start election
    await (await election.startElection()).wait();

    // voter2 is not added -> should revert
    await expect(election.connect(voter2).vote(0)).to.be.revertedWith("Non authorised user cannot vote");

    // add voter2 then end election and try vote
    await (await election.addVoter(voter2.address)).wait();
    // end election
    await (await election.endElection()).wait();

    await expect(election.connect(voter2).vote(0)).to.be.revertedWith("Election is not in progress");
  });
});
