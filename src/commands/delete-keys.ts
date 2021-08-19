import { broadcast_tx_commit_actions, deleteKey, PublicKey } from "near-api-lite";
import { getCredentials } from "../util/setup";

export async function deleteFCAK(): Promise<void> {
  const keys =
    [
      {
        public_key: "ed25519:YAHjA3JMpgJQeMpT6Qgttmc3A3vMjVDP3mmZaeuCB8V",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "dev-1602564356279-3567853",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:ceRfxNkvw1LT8bobjdpxSamEkBnWpAQ5WzvrGdi2t3B",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "beta-1.nearswap.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:hmd5P9gDoj2atwez4nYpzhnXgPKfE1pkWsKDozxHJ2T",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "dev-1602564356279-3567853",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:2MFmkKcgC18B16MAgKxDV8rRTDGb1b65J2Zaq6uPcmCz",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:2ayUhNP2eF7cVZEN6DQMdekLLsokWjKSCR6dGAMHNtQW",
        access_key: { nonce: 205, permission: "FullAccess" }
      },
      {
        public_key: "ed25519:2goPFuHG4gjKbMfh6b8kLMPwAyVUif77sy4hsksEzLMp",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:3AYLFeag5uoJDrPCMj8ErCekD6WjwRSAZ537iboQRn3V",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "beta-1.nearswap.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:3LQnxWhUQ8qXetAPh5zv4oN1AWK3JZa5MRVREALV5pbx",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:3Vq79VUX76TSYcuNdkuorWYWbfm3DDeraZoCRbFPiYco",
        access_key: { nonce: 35, permission: "FullAccess" }
      },
      {
        public_key: "ed25519:5ghw9VKseJqG4Efz37zk2aD9727x9mBa1nQstEHxZ8jz",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "dev-1602564356279-3567853",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:5oVfnvhBBC93RMaDxM4aj9PRYr81vTmLXx9RfsAtX41G",
        access_key: { nonce: 0, permission: "FullAccess" }
      },
      {
        public_key: "ed25519:67gqpZAMdGMZEEw2gVKztG4fBRgcuYGWVALviFDi7NC6",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:7XAF5BeoAyRVcSFhfYhodEsq4yKzCwxBYMq953e1yVj8",
        access_key: {
          nonce: 4,
          permission: {
            FunctionCall: {
              allowance: "245552081866771200000000",
              receiver_id: "meta.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:7YkCdW3EDX8hiJgutomvmxUMDJB784cXVNimXV4RGKgA",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "dev-1602564356279-3567853",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:87ea5r77kYeXjxdRfcRuaxPrzp21D8Fq5jMhW5ifq3cV",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "dev-1602564356279-3567853",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:8KH1RxeE92VUYbrBW2DCZC1cWDyBBQUwmsQAUs6RScag",
        access_key: { nonce: 29, permission: "FullAccess" }
      },
      {
        public_key: "ed25519:8PBtqgmVKNi4A5ypjZUFLp5VqVwvZe1SvwbdVhj3JC1y",
        access_key: { nonce: 4, permission: "FullAccess" }
      },
      {
        public_key: "ed25519:9Kbhu8EwQ7nqGgEno3G9wpurhGZDDTPsUCjnQjddsEYZ",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "f.ropsten.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:A6M3tVTgsTvCfscaT8M9AUFiFmXSiA7XQ3SYx3bXQWc4",
        access_key: { nonce: 242, permission: "FullAccess" }
      },
      {
        public_key: "ed25519:AjQuiXiQ18h9xqafm4e2s5s26mocn2c7n5qtgyQevPS9",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "beta-1.nearswap.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:BBVhhTWPXWsCMYPrqKvGUS6EeDxNxhEdFNHPSP4yMcvG",
        access_key: {
          nonce: 1,
          permission: {
            FunctionCall: {
              allowance: "248326970809253000000000",
              receiver_id: "meta-v2.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:Beq8Dvie3wByaGgCe4MsmFhpbTNJguvgVHAm9LtqLTg2",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "beta-1.nearswap.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:CP2eovbLb74WQcCymFgbNzxG3wgMYumzFSQwVwEeF9sf",
        access_key: { nonce: 31, permission: "FullAccess" }
      },
      {
        public_key: "ed25519:CPEkwBzF3Z4maVWsCAjFNgSm6surc2w6muwGUcKeQY8M",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta-v2.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:Cvqie7SJ6xmLNA5KoTAYoUAkhD25KaJLG6N9oSmzT9FK",
        access_key: { nonce: 376, permission: "FullAccess" }
      },
      {
        public_key: "ed25519:DzDJ8WtGSj1WwJtSfviipKAqunrm4v74vJpsksQpxCbC",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:EcpX2oQZryXkvseR3vyc53CfXqyujvevhmRpfJynuXYK",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:EsnEo7uUahGpnGc3hLiLNTp32N4K9NkkWUaPWSfWaCpp",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta-v2.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:F1rFTecvw3y2Hkz6eS9Dkaf2qnatEfJJUi1HbKAKFKyF",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "beta-1.nearswap.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:FRv7xr8PBcuaTkpErBsmhaW2NFJVNYQb5vzofFBjacKg",
        access_key: { nonce: 2, permission: "FullAccess" }
      },
      {
        public_key: "ed25519:FhR4GbDLTcdpUuhNWQKupqgHBdLU85kVbayopqaYv2SH",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "beta-1.nearswap.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:GD4wWg2Ks8sQNR8aCr2z5qBQYuGKqKoR7RVdYjEbof6E",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta-v2.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:GKaqAX4twxqQ9in5kcbAkswuXNorkMzH5kpr7Asz6tuG",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "beta-1.nearswap.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:GdGzoT47JovrsnJJJDC2zhc968598dTSFe8GyTZ8XN7t",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "meta-v2.pool.testnet",
              method_names: []
            }
          }
        }
      },
      {
        public_key: "ed25519:HDudUeHyvdaNhDsZMQQFykYo1wsinaH16ZDrtG9hVZkn",
        access_key: {
          nonce: 10,
          permission: {
            FunctionCall: {
              allowance: "242905903954012947680000",
              receiver_id: "meta.pool.testnet",
              method_names: []
            }
          }
        }
      }
    ];

  const cred = getCredentials("lucio.testnet");

  for (const key of keys) {
    if (key.access_key.permission != "FullAccess") {
      console.log(key.access_key.nonce, JSON.stringify(key.access_key.permission));
      const actions = [deleteKey(PublicKey.fromString(key.public_key))];
      await broadcast_tx_commit_actions(actions, "lucio.testnet", "lucio.testnet", cred.private_key);
    }
  }

}
