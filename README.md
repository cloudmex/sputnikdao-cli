# sputnikdao - Tools for managing Sputnik DAO v2
Sputnik DAO is one of the most powerful tools that NEAR ecosystem have. Version 2 brings a wide variety of funcionalities that enhance the meaning of a DAO in NEAR. This CLI tool helps users to interact with this functionalities.

## Table of contents
- [sputnikdao - Tools for managing Sputnik DAO v2](#sputnikdao---tools-for-managing-sputnik-dao-v2)
  - [Table of contents](#table-of-contents)
  - [Post in Governance Forum](#post-in-governance-forum)
    - [Installation and requirements](#installation-and-requirements)
  - [Miscelaneous commands](#miscelaneous-commands)
    - [`sputnikdao create`](#sputnikdao-create)
    - [`sputnikdao info`](#sputnikdao-info)
    - [`sputnikdao get_policy`](#sputnikdao-get_policy)
    - [`sputnikdao openui`](#sputnikdao-openui)
    - [`sputnikdao get-staking`](#sputnikdao-get-staking)
    - [`sputnikdao token-balance`](#sputnikdao-token-balance)
    - [`sputnikdao get_bounties`](#sputnikdao-get_bounties)
    - [`sputnikdao bounty_claim`](#sputnikdao-bounty_claim)
    - [`sputnikdao bounty_giveup`](#sputnikdao-bounty_giveup)
  - [Listing commands](#listing-commands)
    - [`sputnikdao list proposals`](#sputnikdao-list-proposals)
    - [`sputnikdao list bounties`](#sputnikdao-list-bounties)
    - [`sputnikdao list daos`](#sputnikdao-list-daos)
  - [Proposals commands](#proposals-commands)
    - [`sputnikdao proposal payout`](#sputnikdao-proposal-payout)
    - [`sputnikdao proposal policy`](#sputnikdao-proposal-policy)
    - [`sputnikdao proposal council`](#sputnikdao-proposal-council)
    - [`sputnikdao proposal tokenfarm`](#sputnikdao-proposal-tokenfarm)
    - [`sputnikdao proposal staking-contract`](#sputnikdao-proposal-staking-contract)
    - [`sputnikdao proposal addBounty`](#sputnikdao-proposal-addbounty)
    - [`sputnikdao proposal bountyDone`](#sputnikdao-proposal-bountydone)
    - [`sputnikdao proposal poll`](#sputnikdao-proposal-poll)
    - [`sputnikdao proposal call`](#sputnikdao-proposal-call)
    - [`sputnikdao proposal self-upgrade`](#sputnikdao-proposal-self-upgrade)
    - [`sputnikdao proposal upgrade`](#sputnikdao-proposal-upgrade)
  - [Voting commands](#voting-commands)
    - [`sputnikdao vote approve`](#sputnikdao-vote-approve)
    - [`sputnikdao vote unapprove`](#sputnikdao-vote-unapprove)
    - [`sputnikdao vote reject`](#sputnikdao-vote-reject)
  - [User stories](#user-stories)
    - [Creating a DAO](#creating-a-dao)
    - [Adding a proposal](#adding-a-proposal)
    - [Listing proposals](#listing-proposals)
    - [Voting a proposal](#voting-a-proposal)
    - [Get DAO info](#get-dao-info)
    - [Switching network](#switching-network)
  - [Credits](#credits)

## Post in Governance Forum
You can follow the discussion and add your own ideas and colaboration in [the post at NEAR Gov Forum](https://gov.near.org/t/project-sputnikdao-tools-for-managing-sputnik-dao-v2-at-terminal/4726)

**THIS TOOL IS STILL UNDER DEVELOPMENT AND PROVIDED 'AS IS' WITHOUTH WARRANTY**

### Installation and requirements

> Make sure you have a current version of `npm` and `NodeJS` installed.
> Have a [NEAR account](https://learn.figment.io/network-documentation/near/tutorials/intro-pathway-write-and-deploy-your-first-near-smart-contract/2.-creating-your-first-near-account-using-the-sdk) 
> Use near CLI and login

---
## Miscelaneous commands

### `sputnikdao create`

> Create a new Sputnik V2 DAO.

-   arguments: `name` `council`
-   options: `daoAcc` `accountId`

**Example:**

```bash
COUNCIL_MEMBER=alan1.testnet
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
sputnikdao create $DAO_ACCOUNT $COUNCIL_MEMBER --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: true
```

</p>
</details>

---
### `sputnikdao info`

> Create a new Sputnik V2 DAO.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
sputnikdao info --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: true
```

</p>
</details>

---
### `sputnikdao get_policy`

> Create a new Sputnik V2 DAO.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
sputnikdao get_policy --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: true
```

</p>
</details>

---
### `sputnikdao openui`

> Create a new Sputnik V2 DAO.

-   arguments: 
-   options:

**Example:**

```bash
sputnikdao openui
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
Opens UI web site
```

</p>
</details>

---
### `sputnikdao get-staking`

> Create a new Sputnik V2 DAO.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
sputnikdao get_staking --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: true
```

</p>
</details>

---
### `sputnikdao token-balance`

> Create a new Sputnik V2 DAO.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
sputnikdao token-balance --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: true
```

</p>
</details>

---


### `sputnikdao get_bounties`

> Get the list of all the Bounties approved in the vote politicy.

-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao get_bounties --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
{
    id: 0,
    description: 'propose a bounty',
    token: '',
    amount: '1000000000000000000000000',
    times: 2,
    max_deadline: '1000'
  },
{
  id: 1,
  description: 'propose a bounty',
  token: '',
  amount: '2000000000000000000000000',
  times: 3,
  max_deadline: '1000'
}

```

</p>
</details>

<p></p>

> Get the information of an specific Bounty approved in the vote politicy.

-   options: `id` `daoAcc` `accountId`

**Example:**

```bash
sputnikdao get_bounties --id 1 --daoAcc mydao_canales -a joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
{
  id: 1,
  description: 'propose a bounty',
  token: '',
  amount: '2000000000000000000000000',
  times: 3,
  max_deadline: '1000'
}

```

</p>
</details>

---

### `sputnikdao bounty_claim`

> Claim a Bounty.

-   arguments: `Idbounty`
-   options: `deadline` `daoAcc` `accountId`

**Example:**

```bash
sputnikdao bounty_claim 1 --deadline 1000 --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
Bounty Claimed
```

</p>
</details>

---

### `sputnikdao bounty_giveup`

> Give up for a Bounty claimed.

-   arguments: `IdBounty`
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao bounty_giveup 1 --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
Bounty Give Up Done
```

</p>
</details>

---
## Listing commands

### `sputnikdao list proposals`

> Give up for a Bounty claimed.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao list proposals --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
Bounty Give Up Done
```

</p>
</details>

---

### `sputnikdao list bounties`

> Give up for a Bounty claimed.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao list bounties --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
Bounty Give Up Done
```

</p>
</details>

---

### `sputnikdao list daos`

> Give up for a Bounty claimed.

-   arguments: `factoryAcc`
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao list daos <factoryAcc> --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
Bounty Give Up Done
```

</p>
</details>

---

## Proposals commands

### `sputnikdao proposal payout`

> Do a proposal requesting a payout for signer.

-   arguments: `amount`
-   options: `daoAcc` `accountId`

**Example:**

```bash
AMOUNT=5
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
sputnikdao proposal payout $AMOUNT --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 0
```

</p>
</details>

---

### `sputnikdao proposal policy`

> Updates DAO voting policy recovering from a JSON file.

-   arguments: `policyFile`
-   options: `daoAcc` `accountId`

**Example:**

```bash
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
sputnikdao proposal policy new_policy.json --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 1
```

</p>
</details>

---

### `sputnikdao proposal council`

> Creates a proposal for adding or removing a council member.

-   arguments: `council`
-   options: `daoAcc` `accountId` `remove` `role`

**Example:**

```bash
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
COUNCIL_ACCOUNT=alantest.testnet
sputnikdao proposal council $COUNCIL_ACCOUNT --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 1
```

</p>
</details>

---

### `sputnikdao proposal tokenfarm`

> Creates a proposal for farming a new token.

-   arguments: `token_name` `token_symbol` `token_amount`
-   options: `daoAcc` `accountId` `remove` `role`

**Example:**

```bash
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
COUNCIL_ACCOUNT=alantest.testnet
TOKEN_NAME=alan_token
TOKEN_SYM=ALAN
TOKEN_AMOUNT=100000
sputnikdao proposal tokenfarm $TOKEN_NAME $TOKEN_SYM $TOKEN_AMOUNT --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 1
```

</p>
</details>

---
### `sputnikdao proposal staking-contract`

> Creates a proposal for farming a new token.

-   arguments: `token_name` `token_symbol` `token_amount`
-   options: `daoAcc` `accountId` `remove` `role`

**Example:**

```bash
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
COUNCIL_ACCOUNT=alantest.testnet
TOKEN_NAME=alan_token
TOKEN_SYM=ALAN
TOKEN_AMOUNT=100000
sputnikdao proposal tokenfarm $TOKEN_NAME $TOKEN_SYM $TOKEN_AMOUNT --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 1
```

</p>
</details>

---

### `sputnikdao proposal addBounty`

> Create a proposal for a new Bounty.

-   arguments: `mount`
-   options: `times` `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal addBounty 2 --times 3 --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 1
1
```

</p>
</details>

---
### `sputnikdao proposal bountyDone`

> Add a proposal for a Bounty Done.

-   arguments: `Id`
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal bountyDone 1 --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 2
2
```

</p>
</details>

---
### `sputnikdao proposal poll`

> Add a proposal for a Bounty Done.

-   arguments: `question`
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal vote "Is this a poll" --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 2
2
```

</p>
</details>

---
### `sputnikdao proposal call`

> Add a proposal for a Bounty Done.

-   arguments: `question`
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal vote "Is this a poll" --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 2
2
```

</p>
</details>

---
### `sputnikdao proposal self-upgrade`

> Add a proposal for a self upgrading DAO contract.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal self-upgrade --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 2
2
```

</p>
</details>

---
### `sputnikdao proposal upgrade`

> Add a proposal for a self upgrading DAO contract.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal self-upgrade --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 2
2
```

</p>
</details>

---
## Voting commands

### `sputnikdao vote approve`

> Add a proposal for a self upgrading DAO contract.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal self-upgrade --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 2
2
```

</p>
</details>

---
### `sputnikdao vote unapprove`

> Add a proposal for a self upgrading DAO contract.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal self-upgrade --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 2
2
```

</p>
</details>

---
### `sputnikdao vote reject`

> Add a proposal for a self upgrading DAO contract.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal self-upgrade --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
result.status.SuccessValue: 2
2
```

</p>
</details>

---
## User stories 

### Creating a DAO
Dave wants to create a new sputnik DAO without using UI or deploying the contract by himself, instead he opt for sputnik as the option to deploy sputnik. He add the name, councils members and environment. 

Dave obtains from CLI the info about the recent created sputnik DAO.

```bash
sputnikdao create mydao_alan2 alantest.testnet --accountId alan1.testnet
```

### Adding a proposal

Sophia wants to create a proposal to a sputnik DAO, she requires a payout and a call to an external contract. She uses sputnikdao to propose a call giving target contract and arguments to be used, in a second line she request a payout with description and amount required.

Sophia obtains from CLI the ID's of the proposals.

```bash
sputnikdao proposal payout 5 --daoAcc mydao_alan --accountId alan1.testnet
```

### Listing proposals

Anne wants to know which are the proposals in a sputnik DAO, she wants to know which ones are open, which ones are accepted and rejected.

Anne obtains from CLI a list of proposals order by ID and could be filtered by current state (Open, accepted, rejected)

```bash
sputnikdao list proposals  --daoAcc mydao_alan
```

### Voting a proposal

Mark is part of the DAO council and is required his participation for voting a proposal. He uses sputnikdao for giving his vote to proposal.

sputnikdao returns new state after votation.

```bash
PROPOSAL_ID=2
DAO_ACC=mydao_alan
SIGNER_ID=alan1.testnet  
sputnikdao vote approve $PROPOSAL_ID --daoAcc $DAO_ACC --account $SIGNER_ID
sputnikdao vote unapprove $PROPOSAL_ID --daoAcc $DAO_ACC --account $SIGNER_ID
```

### Get DAO info

Recover policy, periods and bond:

```bash
sputnikdao get_policy --daoAcc mydao_alan
```

### Switching network

Maria is using sputnikdao as a tool for develop NEAR DApps, she now wants to change from testnet to mainnet for putting in production his DApp, she is able to do that by indicating the option inside the command.

She now is deploying DAO functionalities to mainnet.



## Credits

basic structure based in meta-pool-utils by Narwallets.

