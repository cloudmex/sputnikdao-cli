# SputnikDAO-cli - Tools for managing Sputnik DAO v2
Sputnik DAO is one of the most powerful tools that NEAR ecosystem have. Version 2 brings a wide variety of funcionalities that enhance the meaning of a DAO in NEAR. This CLI tool helps users to interact with this functionalities.


## Post in Governance Forum
You can follow the discussion and add your own ideas and colaboration in [the post at NEAR Gov Forum](https://gov.near.org/t/project-sputnikdao-cli-tools-for-managing-sputnik-dao-v2-at-terminal/4726)


## User stories 

### Creating a DAO
Dave wants to create a new sputnik DAO without using UI or deploying the contract by himself, instead he opt for sputnikdao-cli as the option to deploy sputnik. He add the name, councils members and environment. 

Dave obtains from CLI the info about the recent created sputnik DAO.

### Adding a proposal

Sophia wants to create a proposal to a sputnik DAO, she requires a payout and a call to an external contract. She uses sputnikdao-cli to propose a call giving target contract and arguments to be used, in a second line she request a payout with description and amount required.

Sophia obtains from CLI the ID's of the proposals.

```bash
sputnikdao-cli proposal payout 5 --daoAcc mydao_alan --accountId alan1.testnet
```

### Listing proposals

Anne wants to know which are the proposals in a sputnik DAO, she wants to know which ones are open, which ones are accepted and rejected.

Anne obtains from CLI a list of proposals order by ID and could be filtered by current state (Open, accepted, rejected)

```bash
sputnikdao-cli list proposals  --daoAcc mydao_alan
```

### Voting a proposal

Mark is part of the DAO council and is required his participation for voting a proposal. He uses sputnikdao-cli for giving his vote to proposal.

Sputnikdao-cli returns new state after votation.

```bash
PROPOSAL_ID=2
DAO_ACC=mydao_alan
SIGNER_ID=alan1.testnet  
sputnikdao-cli vote approve $PROPOSAL_ID --daoAcc $DAO_ACC --account $SIGNER_ID
sputnikdao-cli vote unapprove $PROPOSAL_ID --daoAcc $DAO_ACC --account $SIGNER_ID
```

### Switching network

Maria is using sputnikdao-cli as a tool for develop NEAR DApps, she now wants to change from testnet to mainnet for putting in production his DApp, she is able to do that by indicating the option inside the command.

She now is deploying DAO functionalities to mainnet.


## Credits

basic structure based in meta-pool-utils by Narwallets.

