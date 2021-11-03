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
- [About Token Weighted Policy](#about-token-weighted-policy)

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

> Gets info from a Sputnik DAO.

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
{
  roles: [
    {
      name: 'all',
      kind: 'Everyone',
      permissions: [ '*:AddProposal', '*:Finalize' ],
      vote_policy: {}
    },
    {
      name: 'council',
      kind: { Group: [ 'alan1.testnet' ] },
      permissions: [ '*:*' ],
      vote_policy: {
        Group: { weight_kind: 'RoleWeight', quorum: '0', threshold: [ 1, 8 ] }
      }
    }
  ],
  default_vote_policy: { weight_kind: 'RoleWeight', quorum: '0', threshold: [ 1, 2 ] },
  proposal_bond: '10000000000000000000000',
  proposal_period: '604800000000000',
  bounty_bond: '1000000000000000000000000',
  bounty_forgiveness_period: '86400000000000'
}
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
{
  roles: [
    {
      name: 'all',
      kind: 'Everyone',
      permissions: [ '*:AddProposal', '*:Finalize' ],
      vote_policy: {}
    },
    {
      name: 'council',
      kind: { Group: [ 'alan1.testnet' ] },
      permissions: [ '*:*' ],
      vote_policy: {
        Group: { weight_kind: 'RoleWeight', quorum: '0', threshold: [ 1, 8 ] }
      }
    }
  ],
  default_vote_policy: { weight_kind: 'RoleWeight', quorum: '0', threshold: [ 1, 2 ] },
  proposal_bond: '10000000000000000000000',
  proposal_period: '604800000000000',
  bounty_bond: '1000000000000000000000000',
  bounty_forgiveness_period: '86400000000000'
}
```

</p>
</details>

---
### `sputnikdao openui`

> Open current sputnik UI.

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

> Recovers staking contract attached to DAO.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
DAO_ACCOUNT=mydao_alan6
SIGNER_ACCOUNT=alan1.testnet
sputnikdao get-staking --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
'staking-149576567.generic.testnet'
```

</p>
</details>

---
### `sputnikdao token-balance`

> Recover balance from a custom token.

-   arguments: `token_id`
-   options: `daoAcc` `accountId`

**Example:**

```bash
DAO_ACCOUNT=mynewdao1
SIGNER_ACCOUNT=alan1.testnet
TOKEN_ID=nalan9
sputnikdao token-balance $TOKEN_ID --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT 
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
'1000000000'
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
BOUNTY_ID=1
BOUNTY_DEADLINE=1000
DAO_ACCOUNT=mydao_canales
ACCOUNT_ID=joehank.testnet
sputnikdao bounty_claim $BOUNTY_ID --deadline $BOUNTY_DEADLINE --daoAcc  $DAO_ACCOUNT --accountId $ACCOUNT_ID
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
BOUNTY_ID=1
DAO_ACCOUNT=mydao_canales
ACCOUNT_ID=joehank.testnet
sputnikdao bounty_giveup $BOUNTY_ID --daoAcc $DAO_ACCOUNT --accountId $ACCOUNT_ID
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

> Returns list of proposals in a DAO.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
DAO_ACCOUNT=mydao_canales
ACCOUNT_ID=joehank.testnet
sputnikdao list proposals --daoAcc $DAO_ACCOUNT --accountId $ACCOUNT_ID
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
[
  {
    id: 0,
    proposer: 'joehank.testnet',
    description: 'propose a payout',
    kind: {
      Transfer: {
        token_id: '',
        receiver_id: 'joehank.testnet',
        amount: '5000000000000000000000000',
        msg: null
      }
    },
    status: 'Approved',
    vote_counts: { council: [ 1, 0, 0 ] },
    votes: { 'joehank.testnet': 'Approve' },
    submission_time: '1630543224324233593'
  }
]
```

</p>
</details>

---

### `sputnikdao list bounties`

> Returns list of bounties in a dao.

-   arguments: 
-   options: `daoAcc` `accountId`

**Example:**

```bash
DAO_ACCOUNT=mydao_canales
ACCOUNT_ID=joehank.testnet
sputnikdao list bounties --daoAcc $DAO_ACCOUNT --accountId $ACCOUNT_ID
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
[
  {
    id: 0,
    description: 'propose a bounty',
    token: '',
    amount: '1000000000000000000000000',
    times: 0,
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
]
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
FACTORY_ID=daofactory.testnet
DAO_ACCOUNT=mydao_canales
ACCOUNT_ID=joehank.testnet
sputnikdao list daos $FACTORY_ID --daoAcc $DAO_ACCOUNT --accountId $ACCOUNT_ID
```

<details>
<summary> <strong>Example Response</strong> </summary>
<p>

```
[
  'newdao.tutorials.testnet',
  'dao2.tutorials.testnet',
  'dao3.tutorials.testnet',
  'daos.tutorials.testnet',
  'daos1.tutorials.testnet'
]
SmartContract {
  contract_account: 'tutorials.testnet',
  signer: 'tutorials.testnet',
  signer_private_key: 'ed25519:4yQWH8NAgbprGFvRRZnq4H1LTGgAXCEkUNRNaLxamuVAWbw8LJ8BU4nnhsgTHuKsFbSkNTBP67o7BkNAmgdYyazZ'
}
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
'success'
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
'success'
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
'success'
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

# About Token Weighted Policy

Still under testing:

```bash//Nombre del DAO
//Nombre del DAO
DAO_ACC=finaldao

// Nombre del token
TOKEN_NAME=finaltkn

// Simbolo del token
TOKEN_SYM=ftkn

// Cantidad de tokens a ser farmeados
TOKEN_AMOUNT=1000

// Miembro del consejo
COUNCIL_ACC=alan1.testnet

// Nombre de la cuenta que hará las llamadas
SIGNER_ACC=alan1.testnet

// Se crea una nueva DAO con su consejo
sputnikdao create $DAO_ACC $COUNCIL_ACC --accountId $SIGNER_ACC

//Se crea un proposal para farmear un nuevo token y se aprueba
//Los tokens los recibe la DAO
sputnikdao proposal tokenfarm $TOKEN_NAME $TOKEN_SYM $TOKEN_AMOUNT --daoAcc $DAO_ACC --accountId $SIGNER_ACC

sputnikdao vote approve 0 --daoAcc $DAO_ACC --accountId $SIGNER_ACC

// Se ve la cantidad de tokens
sputnikdao token-balance $TOKEN_SYM --daoAcc $DAO_ACC --accountId $SIGNER_ACC

sputnikdao staking-contract $TOKEN_SYM.tokenfactory.testnet --daoAcc $DAO_ACC --accountId $SIGNER_ACC --key 8gzjvfJBxrHiUKiuhUebuC6X9HdmRt3PBMvJ2ChSXdTD

sputnikdao vote approve 1 --daoAcc $DAO_ACC --accountId $SIGNER_ACC

sputnikdao get-staking --daoAcc $DAO_ACC --accountId $SIGNER_ACC

STAKING_ACC=staking-276683170.generic.testnet

sputnikdao proposal payout 600 --daoAcc $DAO_ACC --accountId $SIGNER_ACC --token $TOKEN_SYM

sputnikdao vote approve 2 --daoAcc $DAO_ACC --accountId $SIGNER_ACC

//IMPORTANTE: Dejar el espacio en blanco cuando se quiere registrar el Signer_Acc
//Los parámetros deben de quedar vacíos cuando se autoregistra
//Storage deposit es basicamente registrar una cuenta en el staking

sputnikdao storage-staking  --daoAcc $DAO_ACC --accountId $SIGNER_ACC

// Se crea espacio de almacenamiento en el contrato del token fungible
sputnikdao storage-ft $TOKEN_SYM.tokenfactory.testnet --daoAcc $DAO_ACC --accountId $SIGNER_ACC --target $STAKING_ACC

// Se transfieren 100 tokens fungibles de la cuenta del signer
// a la cuenta del contrato de staking
sputnikdao transfer-ft $TOKEN_SYM.tokenfactory.testnet 100 --daoAcc $DAO_ACC --accountId $SIGNER_ACC

// Estando los tokens fungibles en el contrato de staking
// Se delegan para tener peso de votación en la DAO
sputnikdao delegate-ft $SIGNER_ACC 50 --daoAcc $DAO_ACC --accountId $SIGNER_ACC

// Se obtiene el balance que tiene el signer en el contrato de staking
// También nos retorna cuantos tokens han sido delegados
sputnikdao get-staking-balance --daoAcc $DAO_ACC --accountId $SIGNER_ACC

//Mostramos el total de tokens delegados en la DAO
sputnikdao total-delegation-supply --daoAcc $DAO_ACC --accountId $SIGNER_ACC

//Comando para corrección de bug en las Daos que no permitía votación por tokens, actualiza la Dao
sputnikdao proposal self-upgrade --daoAcc $DAO_ACC --accountId $SIGNER_ACC

//Se vota para aprobar el proposal
sputnikdao vote approve 3 --daoAcc $DAO_ACC --accountId $SIGNER_ACC

//Comando para corregir los errores de la política de votación por tokens, actualiza la politica
sputnikdao proposal policy token_policy.json --daoAcc $DAO_ACC --accountId $SIGNER_ACC

//Se vota para aprobar el proposal
sputnikdao vote approve 4 --daoAcc $DAO_ACC --accountId $SIGNER_ACC

//Treshold es la variable que cuando se cumple el total, se puede aprobar la votación con los tokens, es decir que 400 tokens voten en total por una opción y ese sea el máximo
//Cuando pusimos la cantidad total de tokens en el treshold funcionó

sputnikdao proposal poll "Are we token weighted?" --daoAcc $DAO_ACC --accountId $SIGNER_ACC

// Votamos con la cuenta que tiene tokens delegados
sputnikdao vote unapprove 10 --daoAcc $DAO_ACC --accountId $SIGNER_ACC

sputnikdao list proposals --daoAcc $DAO_ACC --accountId $SIGNER_ACC

// Podemos repetir el proceso con otro signer
// al cual le podemos delegar otra cantidad de tokens
// y hacer la prueba de votación con dos cuentas con tokens delegados
sputnikdao vote approve 10 --daoAcc $DAO_ACC --accountId $SIGNER_ACC2

sputnikdao list proposals --daoAcc $DAO_ACC --accountId $SIGNER_ACC2
```