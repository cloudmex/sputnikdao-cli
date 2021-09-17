# sputnikdao - Tools for managing Sputnik DAO v2
Sputnik DAO is one of the most powerful tools that NEAR ecosystem have. Version 2 brings a wide variety of funcionalities that enhance the meaning of a DAO in NEAR. This CLI tool helps users to interact with this functionalities.

## Table of contents
- [sputnikdao - Tools for managing Sputnik DAO v2](#sputnikdao---tools-for-managing-sputnik-dao-v2)
  - [Table of contents](#table-of-contents)
  - [Post in Governance Forum](#post-in-governance-forum)
    - [Installation and requirements](#installation-and-requirements)
  - [Overview](#overview)
    - [`sputnikdao create`](#sputnikdao-create)
    - [`sputnikdao proposal payout`](#sputnikdao-proposal-payout)
    - [`sputnikdao proposal policy`](#sputnikdao-proposal-policy)
    - [`sputnikdao proposal council`](#sputnikdao-proposal-council)
    - [`sputnikdao proposal tokenfarm`](#sputnikdao-proposal-tokenfarm)
    - [`sputnikdao proposal addBounty`](#sputnikdao-proposal-addbounty)
    - [`sputnikdao get_bounties`](#sputnikdao-get_bounties)
    - [`Under development`](#under-development)
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

## Overview

_Click on a command for more information and examples._
| Ready commands |
| Command                                               | Description                                             |
| ----------------------------------------------------- | ------------------------------------------------------- |
| **Deploy a new sputnik DAO**                          |                                                         |
| [`sputnikdao create`](#sputnikdao-create)             | Creates a new Sputnik V2 DAO in testnet                 |                                                                                             
| **Add proposal**                                      |                                                         |
| [`sputnikdao proposal payout`](#sputnikdao-proposal-payout)            | Request a payout                       |
| [`sputnikdao proposal policy`](#sputnikdao-proposal-policy)            | Upgrade DAO policy                     |
| [`sputnikdao proposal council`](#sputnikdao-proposal-council)            | Add a council member/Also can propose to remove|
| [`sputnikdao proposal tokenfarm`](#sputnikdao-proposal-tokenfarm)            | Farm a new fungible token|
| [`sputnikdao proposal addBounty`](#sputnikdao-proposal-addbounty)            | Add a bounty |
| **VOTE**                                              |                                        |                                                                                                
| [`sputnikdao vote approve <proposal_id> `](#voting-a-proposal)           | Approve a proposal |
| [`sputnikdao vote unapprove <proposal_id> `](#voting-a-proposal)            | Unapprove a proposal |
| **Listing**                                              |                      |                                                                                                                  
| [`sputnikdao list proposals`](#near-create-account)            | List proposals|
| [`sputnikdao list get_bounties`](#sputnikdao-get_bounties)           | List bounties |



---
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

### `sputnikdao get_bounties`

> Get the list of all the Bounties approved in the vote politicy.

-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao get_bounties --daoAcc mydao_canales -accountId joehank.testnet
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

### `Under development`

> Claim a Bounty.

-   arguments: `Idbounty`
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal bounty_claim 1 --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
Under development
```

</p>
</details>

<p><p>

> Give up for a Bounty claimed.

-   arguments: `IdBounty`
-   options: `daoAcc` `accountId`

**Example:**

```bash
sputnikdao proposal bounty_giveup 1 --daoAcc mydao_canales --accountId joehank.testnet
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
Under development
```

</p>
</details>

<p><p>

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
Under development
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

