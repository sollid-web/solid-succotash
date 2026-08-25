(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,375143,799008,e=>{"use strict";var t=e.i(846932),o=e.i(522016);function r(e=8){if("undefined"!=typeof navigator&&"function"==typeof navigator.vibrate)try{navigator.vibrate(e)}catch{}}e.s(["triggerHaptic",()=>r],799008);let a=t.motion.create(o.default);e.s(["MotionLink",0,a,"pressableTapProps",0,{whileTap:{scale:.97},transition:{type:"spring",stiffness:400,damping:30},onTap:()=>r()}],375143)},356836,e=>{"use strict";var t=`{
  "connect_wallet": {
    "label": "Connect Wallet",
    "wrong_network": {
      "label": "Wrong network"
    }
  },

  "intro": {
    "title": "What is a Wallet?",
    "description": "A wallet is used to send, receive, store, and display digital assets. It's also a new way to log in, without needing to create new accounts and passwords on every website.",
    "digital_asset": {
      "title": "A Home for your Digital Assets",
      "description": "Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs."
    },
    "login": {
      "title": "A New Way to Log In",
      "description": "Instead of creating new accounts and passwords on every website, just connect your wallet."
    },
    "get": {
      "label": "Get a Wallet"
    },
    "learn_more": {
      "label": "Learn More"
    }
  },

  "sign_in": {
    "label": "Verify your account",
    "description": "To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account.",
    "message": {
      "send": "Sign message",
      "preparing": "Preparing message...",
      "cancel": "Cancel",
      "preparing_error": "Error preparing message, please retry!"
    },
    "signature": {
      "waiting": "Waiting for signature...",
      "verifying": "Verifying signature...",
      "signing_error": "Error signing message, please retry!",
      "verifying_error": "Error verifying signature, please retry!",
      "oops_error": "Oops, something went wrong!"
    }
  },

  "connect": {
    "label": "Connect",
    "title": "Connect a Wallet",
    "new_to_ethereum": {
      "description": "New to Ethereum wallets?",
      "learn_more": {
        "label": "Learn More"
      }
    },
    "learn_more": {
      "label": "Learn more"
    },
    "recent": "Recent",
    "status": {
      "opening": "Opening %{wallet}...",
      "connecting": "Connecting",
      "connect_mobile": "Continue in %{wallet}",
      "not_installed": "%{wallet} is not installed",
      "not_available": "%{wallet} is not available",
      "confirm": "Confirm connection in the extension",
      "confirm_mobile": "Accept connection request in the wallet"
    },
    "secondary_action": {
      "get": {
        "description": "Don't have %{wallet}?",
        "label": "GET"
      },
      "install": {
        "label": "INSTALL"
      },
      "retry": {
        "label": "RETRY"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Need the official WalletConnect modal?",
        "compact": "Need the WalletConnect modal?"
      },
      "open": {
        "label": "OPEN"
      }
    }
  },

  "connect_scan": {
    "title": "Scan with %{wallet}",
    "fallback_title": "Scan with your phone"
  },

  "connector_group": {
    "installed": "Installed",
    "recommended": "Recommended",
    "other": "Other",
    "popular": "Popular",
    "more": "More",
    "others": "Others"
  },

  "get": {
    "title": "Get a Wallet",
    "action": {
      "label": "GET"
    },
    "mobile": {
      "description": "Mobile Wallet"
    },
    "extension": {
      "description": "Browser Extension"
    },
    "mobile_and_extension": {
      "description": "Mobile Wallet and Extension"
    },
    "mobile_and_desktop": {
      "description": "Mobile and Desktop Wallet"
    },
    "looking_for": {
      "title": "Not what you're looking for?",
      "mobile": {
        "description": "Select a wallet on the main screen to get started with a different wallet provider."
      },
      "desktop": {
        "compact_description": "Select a wallet on the main screen to get started with a different wallet provider.",
        "wide_description": "Select a wallet on the left to get started with a different wallet provider."
      }
    }
  },

  "get_options": {
    "title": "Get started with %{wallet}",
    "short_title": "Get %{wallet}",
    "mobile": {
      "title": "%{wallet} for Mobile",
      "description": "Use the mobile wallet to explore the world of Ethereum.",
      "download": {
        "label": "Get the app"
      }
    },
    "extension": {
      "title": "%{wallet} for %{browser}",
      "description": "Access your wallet right from your favorite web browser.",
      "download": {
        "label": "Add to %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} for %{platform}",
      "description": "Access your wallet natively from your powerful desktop.",
      "download": {
        "label": "Add to %{platform}"
      }
    }
  },

  "get_mobile": {
    "title": "Install %{wallet}",
    "description": "Scan with your phone to download on iOS or Android",
    "continue": {
      "label": "Continue"
    }
  },

  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "extension": {
      "refresh": {
        "label": "Refresh"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "desktop": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    }
  },

  "chains": {
    "title": "Switch Networks",
    "wrong_network": "Wrong network detected, switch or disconnect to continue.",
    "confirm": "Confirm in Wallet",
    "switching_not_supported": "Your wallet does not support switching networks from %{appName}. Try switching networks from within your wallet instead.",
    "switching_not_supported_fallback": "Your wallet does not support switching networks from this app. Try switching networks from within your wallet instead.",
    "disconnect": "Disconnect",
    "connected": "Connected"
  },

  "profile": {
    "disconnect": {
      "label": "Disconnect"
    },
    "copy_address": {
      "label": "Copy Address",
      "copied": "Copied!"
    },
    "explorer": {
      "label": "View more on explorer"
    },
    "transactions": {
      "description": "%{appName} transactions will appear here...",
      "description_fallback": "Your transactions will appear here...",
      "recent": {
        "title": "Recent Transactions"
      },
      "clear": {
        "label": "Clear All"
      }
    }
  },

  "wallet_connectors": {
    "ready": {
      "qr_code": {
        "step1": {
          "description": "Add Ready to your home screen for faster access to your wallet.",
          "title": "Open the Ready app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "berasig": {
      "extension": {
        "step1": {
          "title": "Install the BeraSig extension",
          "description": "We recommend pinning BeraSig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "best": {
      "qr_code": {
        "step1": {
          "title": "Open the Best Wallet app",
          "description": "Add Best Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bifrost Wallet on your home screen for quicker access.",
          "title": "Open the Bifrost Wallet app"
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "bitget": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bitget Wallet on your home screen for quicker access.",
          "title": "Open the Bitget Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Bitget Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitget Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitski": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Bitski to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitski extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitverse": {
      "qr_code": {
        "step1": {
          "title": "Open the Bitverse Wallet app",
          "description": "Add Bitverse Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bloom": {
      "desktop": {
        "step1": {
          "title": "Open the Bloom Wallet app",
          "description": "We recommend putting Bloom Wallet on your home screen for quicker access."
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you have a wallet, click on Connect to connect via Bloom. A connection prompt in the app will appear for you to confirm the connection.",
          "title": "Click on Connect"
        }
      }
    },

    "bybit": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bybit on your home screen for faster access to your wallet.",
          "title": "Open the Bybit app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Bybit Wallet for easy access.",
          "title": "Install the Bybit Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Bybit Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "binance": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Binance on your home screen for faster access to your wallet.",
          "title": "Open the Binance app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Binance Wallet extension",
          "description": "We recommend pinning Binance Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "coin98": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coin98 Wallet on your home screen for faster access to your wallet.",
          "title": "Open the Coin98 Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Coin98 Wallet for easy access.",
          "title": "Install the Coin98 Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Coin98 Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coinbase Wallet on your home screen for quicker access.",
          "title": "Open the Coinbase Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Coinbase Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Coinbase Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "compass": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Compass Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Compass Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "core": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Core on your home screen for faster access to your wallet.",
          "title": "Open the Core app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Core to your taskbar for quicker access to your wallet.",
          "title": "Install the Core extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "fox": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting FoxWallet on your home screen for quicker access.",
          "title": "Open the FoxWallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "frontier": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Frontier Wallet on your home screen for quicker access.",
          "title": "Open the Frontier Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Frontier Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Frontier Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Open the imToken app",
          "description": "Put imToken app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "iopay": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting ioPay on your home screen for faster access to your wallet.",
          "title": "Open the ioPay app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      }
    },

    "kaikas": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaikas to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaikas extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaikas app",
          "description": "Put Kaikas app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kaia": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaia to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaia extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaia app",
          "description": "Put Kaia app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kraken": {
      "qr_code": {
        "step1": {
          "title": "Open the Kraken Wallet app",
          "description": "Add Kraken Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "kresus": {
      "qr_code": {
        "step1": {
          "title": "Open the Kresus Wallet app",
          "description": "Add Kresus Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "magicEden": {
      "extension": {
        "step1": {
          "title": "Install the Magic Eden extension",
          "description": "We recommend pinning Magic Eden to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Open the MetaMask app",
          "description": "We recommend putting MetaMask on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the MetaMask extension",
          "description": "We recommend pinning MetaMask to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "nestwallet": {
      "extension": {
        "step1": {
          "title": "Install the NestWallet extension",
          "description": "We recommend pinning NestWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "okx": {
      "qr_code": {
        "step1": {
          "title": "Open the OKX Wallet app",
          "description": "We recommend putting OKX Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the OKX Wallet extension",
          "description": "We recommend pinning OKX Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "omni": {
      "qr_code": {
        "step1": {
          "title": "Open the Omni app",
          "description": "Add Omni to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your home screen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "1inch": {
      "qr_code": {
        "step1": {
          "description": "Put 1inch Wallet on your home screen for faster access to your wallet.",
          "title": "Open the 1inch Wallet app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Open the TokenPocket app",
          "description": "We recommend putting TokenPocket on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the TokenPocket extension",
          "description": "We recommend pinning TokenPocket to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "trust": {
      "qr_code": {
        "step1": {
          "title": "Open the Trust Wallet app",
          "description": "Put Trust Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Trust Wallet extension",
          "description": "Click at the top right of your browser and pin Trust Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up Trust Wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Open the Uniswap app",
          "description": "Add Uniswap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Open the Zerion app",
          "description": "We recommend putting Zerion on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Zerion extension",
          "description": "We recommend pinning Zerion to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Open the Rainbow app",
          "description": "We recommend putting Rainbow on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "You can easily backup your wallet using our backup feature on your phone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "enkrypt": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Enkrypt Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Enkrypt Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "frame": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Frame to your taskbar for quicker access to your wallet.",
          "title": "Install Frame & the companion extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "one_key": {
      "extension": {
        "step1": {
          "title": "Install the OneKey Wallet extension",
          "description": "We recommend pinning OneKey Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "paraswap": {
      "qr_code": {
        "step1": {
          "title": "Open the ParaSwap app",
          "description": "Add ParaSwap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "phantom": {
      "extension": {
        "step1": {
          "title": "Install the Phantom extension",
          "description": "We recommend pinning Phantom to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rabby": {
      "extension": {
        "step1": {
          "title": "Install the Rabby extension",
          "description": "We recommend pinning Rabby to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "ronin": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Ronin Wallet on your home screen for quicker access.",
          "title": "Open the Ronin Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Ronin Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Ronin Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "ramper": {
      "extension": {
        "step1": {
          "title": "Install the Ramper extension",
          "description": "We recommend pinning Ramper to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safeheron": {
      "extension": {
        "step1": {
          "title": "Install the Core extension",
          "description": "We recommend pinning Safeheron to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "taho": {
      "extension": {
        "step1": {
          "title": "Install the Taho extension",
          "description": "We recommend pinning Taho to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "wigwam": {
      "extension": {
        "step1": {
          "title": "Install the Wigwam extension",
          "description": "We recommend pinning Wigwam to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "talisman": {
      "extension": {
        "step1": {
          "title": "Install the Talisman extension",
          "description": "We recommend pinning Talisman to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import an Ethereum Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "ctrl": {
      "extension": {
        "step1": {
          "title": "Install the CTRL Wallet extension",
          "description": "We recommend pinning CTRL Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "zeal": {
      "qr_code": {
        "step1": {
          "title": "Open the Zeal app",
          "description": "Add Zeal Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Zeal extension",
          "description": "We recommend pinning Zeal to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safepal": {
      "extension": {
        "step1": {
          "title": "Install the SafePal Wallet extension",
          "description": "Click at the top right of your browser and pin SafePal Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up SafePal Wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SafePal Wallet app",
          "description": "Put SafePal Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "desig": {
      "extension": {
        "step1": {
          "title": "Install the Desig extension",
          "description": "We recommend pinning Desig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "subwallet": {
      "extension": {
        "step1": {
          "title": "Install the SubWallet extension",
          "description": "We recommend pinning SubWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SubWallet app",
          "description": "We recommend putting SubWallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "clv": {
      "extension": {
        "step1": {
          "title": "Install the CLV Wallet extension",
          "description": "We recommend pinning CLV Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the CLV Wallet app",
          "description": "We recommend putting CLV Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "okto": {
      "qr_code": {
        "step1": {
          "title": "Open the Okto app",
          "description": "Add Okto to your home screen for quick access"
        },
        "step2": {
          "title": "Create an MPC Wallet",
          "description": "Create an account and generate a wallet"
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Tap the Scan QR icon at the top right and confirm the prompt to connect."
        }
      }
    },

    "ledger": {
      "desktop": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "Set up a new Ledger or connect to an existing one."
        },
        "step3": {
          "title": "Connect",
          "description": "A connection prompt will appear for you to connect your wallet."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "You can either sync with the desktop app or connect your Ledger."
        },
        "step3": {
          "title": "Scan the code",
          "description": "Tap WalletConnect then Switch to Scanner. After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "valora": {
      "qr_code": {
        "step1": {
          "title": "Open the Valora app",
          "description": "We recommend putting Valora on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "gate": {
      "qr_code": {
        "step1": {
          "title": "Open the Gate app",
          "description": "We recommend putting Gate on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Gate extension",
          "description": "We recommend pinning Gate to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "gemini": {
      "qr_code": {
        "step1": {
          "title": "Open keys.gemini.com",
          "description": "Visit keys.gemini.com on your mobile browser - no app download required."
        },
        "step2": {
          "title": "Create Your Wallet Instantly",
          "description": "Set up your smart wallet in seconds using your device's built-in authentication."
        },
        "step3": {
          "title": "Scan to Connect",
          "description": "Scan the QR code to instantly connect your wallet - it just works."
        }
      },
      "extension": {
        "step1": {
          "title": "Go to keys.gemini.com",
          "description": "No extensions or downloads needed - your wallet lives securely in the browser."
        },
        "step2": {
          "title": "One-Click Setup",
          "description": "Create your smart wallet instantly with passkey authentication - easier than any wallet out there."
        },
        "step3": {
          "title": "Connect and Go",
          "description": "Approve the connection and you're ready - the unopinionated wallet that just works."
        }
      }
    },

    "xportal": {
      "qr_code": {
        "step1": {
          "description": "Put xPortal on your home screen for faster access to your wallet.",
          "title": "Open the xPortal app"
        },
        "step2": {
          "description": "Create a wallet or import an existing one.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "mew": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting MEW Wallet on your home screen for quicker access.",
          "title": "Open the MEW Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "zilpay": {
      "qr_code": {
        "step1": {
          "title": "Open the ZilPay app",
          "description": "Add ZilPay to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "nova": {
      "qr_code": {
        "step1": {
          "title": "Open the Nova Wallet app",
          "description": "Add Nova Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "meco": {
      "qr_code": {
        "step1": {
          "title": "Open the MeCo Wallet app",
          "description": "Put MeCo Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "anchorage_digital": {
      "extension": {
        "step1": {
          "title": "Install the Anchorage Digital extension",
          "description": "We recommend pinning Anchorage Digital to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Scan the QR code to login",
          "description": "Securely connect your organization's wallets to dApps with institutional-grade security."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you log in, click below to refresh the browser and load up the extension."
        }
      }
    }
  }
}
`;e.s(["en_US_default",()=>t])},746256,e=>{"use strict";let t=(0,e.i(538463).defineChain)({id:56,name:"BNB Smart Chain",blockTime:750,nativeCurrency:{decimals:18,name:"BNB",symbol:"BNB"},rpcUrls:{default:{http:["https://56.rpc.thirdweb.com"]}},blockExplorers:{default:{name:"BscScan",url:"https://bscscan.com",apiUrl:"https://api.bscscan.com/api"}},contracts:{multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:0xf2f12c}}});e.s(["bsc",0,t])},75164,e=>{"use strict";e.i(247167);var t=e.i(843476),o=e.i(722652),r=e.i(574983),a=e.i(746256),n=e.i(619273),s=e.i(286491),i=e.i(540143),l=e.i(915823),c=class extends l.Subscribable{constructor(e={}){super(),this.config=e,this.#e=new Map}#e;build(e,t,o){let r=t.queryKey,a=t.queryHash??(0,n.hashQueryKeyByOptions)(r,t),i=this.get(a);return i||(i=new s.Query({client:e,queryKey:r,queryHash:a,options:e.defaultQueryOptions(t),state:o,defaultOptions:e.getQueryDefaults(r)}),this.add(i)),i}add(e){this.#e.has(e.queryHash)||(this.#e.set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){let t=this.#e.get(e.queryHash);t&&(e.destroy(),t===e&&this.#e.delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){i.notifyManager.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}get(e){return this.#e.get(e)}getAll(){return[...this.#e.values()]}find(e){let t={exact:!0,...e};return this.getAll().find(e=>(0,n.matchQuery)(t,e))}findAll(e={}){let t=this.getAll();return Object.keys(e).length>0?t.filter(t=>(0,n.matchQuery)(e,t)):t}notify(e){i.notifyManager.batch(()=>{this.listeners.forEach(t=>{t(e)})})}onFocus(){i.notifyManager.batch(()=>{this.getAll().forEach(e=>{e.onFocus()})})}onOnline(){i.notifyManager.batch(()=>{this.getAll().forEach(e=>{e.onOnline()})})}},p=e.i(114272),u=l,d=class extends u.Subscribable{constructor(e={}){super(),this.config=e,this.#t=new Set,this.#o=new Map,this.#r=0}#t;#o;#r;build(e,t,o){let r=new p.Mutation({client:e,mutationCache:this,mutationId:++this.#r,options:e.defaultMutationOptions(t),state:o});return this.add(r),r}add(e){this.#t.add(e);let t=h(e);if("string"==typeof t){let o=this.#o.get(t);o?o.push(e):this.#o.set(t,[e])}this.notify({type:"added",mutation:e})}remove(e){if(this.#t.delete(e)){let t=h(e);if("string"==typeof t){let o=this.#o.get(t);if(o)if(o.length>1){let t=o.indexOf(e);-1!==t&&o.splice(t,1)}else o[0]===e&&this.#o.delete(t)}}this.notify({type:"removed",mutation:e})}canRun(e){let t=h(e);if("string"!=typeof t)return!0;{let o=this.#o.get(t),r=o?.find(e=>"pending"===e.state.status);return!r||r===e}}runNext(e){let t=h(e);if("string"!=typeof t)return Promise.resolve();{let o=this.#o.get(t)?.find(t=>t!==e&&t.state.isPaused);return o?.continue()??Promise.resolve()}}clear(){i.notifyManager.batch(()=>{this.#t.forEach(e=>{this.notify({type:"removed",mutation:e})}),this.#t.clear(),this.#o.clear()})}getAll(){return Array.from(this.#t)}find(e){let t={exact:!0,...e};return this.getAll().find(e=>(0,n.matchMutation)(t,e))}findAll(e={}){return this.getAll().filter(t=>(0,n.matchMutation)(e,t))}notify(e){i.notifyManager.batch(()=>{this.listeners.forEach(t=>{t(e)})})}resumePausedMutations(){let e=this.getAll().filter(e=>e.state.isPaused);return i.notifyManager.batch(()=>Promise.all(e.map(e=>e.continue().catch(n.noop))))}};function h(e){return e.options.scope?.id}var m=e.i(175555),y=e.i(814448),f=class{#a;#n;#s;#i;#l;#c;#p;#u;constructor(e={}){this.#a=e.queryCache||new c,this.#n=e.mutationCache||new d,this.#s=e.defaultOptions||{},this.#i=new Map,this.#l=new Map,this.#c=0}mount(){this.#c++,1===this.#c&&(this.#p=m.focusManager.subscribe(async e=>{e&&(await this.resumePausedMutations(),this.#a.onFocus())}),this.#u=y.onlineManager.subscribe(async e=>{e&&(await this.resumePausedMutations(),this.#a.onOnline())}))}unmount(){this.#c--,0===this.#c&&(this.#p?.(),this.#p=void 0,this.#u?.(),this.#u=void 0)}isFetching(e){return this.#a.findAll({...e,fetchStatus:"fetching"}).length}isMutating(e){return this.#n.findAll({...e,status:"pending"}).length}getQueryData(e){let t=this.defaultQueryOptions({queryKey:e});return this.#a.get(t.queryHash)?.state.data}ensureQueryData(e){let t=this.defaultQueryOptions(e),o=this.#a.build(this,t),r=o.state.data;return void 0===r?this.fetchQuery(e):(e.revalidateIfStale&&o.isStaleByTime((0,n.resolveStaleTime)(t.staleTime,o))&&this.prefetchQuery(t),Promise.resolve(r))}getQueriesData(e){return this.#a.findAll(e).map(({queryKey:e,state:t})=>[e,t.data])}setQueryData(e,t,o){let r=this.defaultQueryOptions({queryKey:e}),a=this.#a.get(r.queryHash),s=a?.state.data,i=(0,n.functionalUpdate)(t,s);if(void 0!==i)return this.#a.build(this,r).setData(i,{...o,manual:!0})}setQueriesData(e,t,o){return i.notifyManager.batch(()=>this.#a.findAll(e).map(({queryKey:e})=>[e,this.setQueryData(e,t,o)]))}getQueryState(e){let t=this.defaultQueryOptions({queryKey:e});return this.#a.get(t.queryHash)?.state}removeQueries(e){let t=this.#a;i.notifyManager.batch(()=>{t.findAll(e).forEach(e=>{t.remove(e)})})}resetQueries(e,t){let o=this.#a;return i.notifyManager.batch(()=>(o.findAll(e).forEach(e=>{e.reset()}),this.refetchQueries({type:"active",...e},t)))}cancelQueries(e,t={}){let o={revert:!0,...t};return Promise.all(i.notifyManager.batch(()=>this.#a.findAll(e).map(e=>e.cancel(o)))).then(n.noop).catch(n.noop)}invalidateQueries(e,t={}){return i.notifyManager.batch(()=>(this.#a.findAll(e).forEach(e=>{e.invalidate()}),e?.refetchType==="none")?Promise.resolve():this.refetchQueries({...e,type:e?.refetchType??e?.type??"active"},t))}refetchQueries(e,t={}){let o={...t,cancelRefetch:t.cancelRefetch??!0};return Promise.all(i.notifyManager.batch(()=>this.#a.findAll(e).filter(e=>!e.isDisabled()&&!e.isStatic()).map(e=>{let t=e.fetch(void 0,o);return o.throwOnError||(t=t.catch(n.noop)),"paused"===e.state.fetchStatus?Promise.resolve():t}))).then(n.noop)}fetchQuery(e){let t=this.defaultQueryOptions(e);void 0===t.retry&&(t.retry=!1);let o=this.#a.build(this,t);return o.isStaleByTime((0,n.resolveStaleTime)(t.staleTime,o))?o.fetch(t):Promise.resolve(o.state.data)}prefetchQuery(e){return this.fetchQuery(e).then(n.noop).catch(n.noop)}fetchInfiniteQuery(e){return e._type="infinite",this.fetchQuery(e)}prefetchInfiniteQuery(e){return this.fetchInfiniteQuery(e).then(n.noop).catch(n.noop)}ensureInfiniteQueryData(e){return e._type="infinite",this.ensureQueryData(e)}resumePausedMutations(){return y.onlineManager.isOnline()?this.#n.resumePausedMutations():Promise.resolve()}getQueryCache(){return this.#a}getMutationCache(){return this.#n}getDefaultOptions(){return this.#s}setDefaultOptions(e){this.#s=e}setQueryDefaults(e,t){this.#i.set((0,n.hashKey)(e),{queryKey:e,defaultOptions:t})}getQueryDefaults(e){let t=[...this.#i.values()],o={};return t.forEach(t=>{(0,n.partialMatchKey)(e,t.queryKey)&&Object.assign(o,t.defaultOptions)}),o}setMutationDefaults(e,t){this.#l.set((0,n.hashKey)(e),{mutationKey:e,defaultOptions:t})}getMutationDefaults(e){let t=[...this.#l.values()],o={};return t.forEach(t=>{(0,n.partialMatchKey)(e,t.mutationKey)&&Object.assign(o,t.defaultOptions)}),o}defaultQueryOptions(e){if(e._defaulted)return e;let t={...this.#s.queries,...this.getQueryDefaults(e.queryKey),...e,_defaulted:!0};return t.queryHash||(t.queryHash=(0,n.hashQueryKeyByOptions)(t.queryKey,t)),void 0===t.refetchOnReconnect&&(t.refetchOnReconnect="always"!==t.networkMode),void 0===t.throwOnError&&(t.throwOnError=!!t.suspense),!t.networkMode&&t.persister&&(t.networkMode="offlineFirst"),t.queryFn===n.skipToken&&(t.enabled=!1),t}defaultMutationOptions(e){return e?._defaulted?e:{...this.#s.mutations,...e?.mutationKey&&this.getMutationDefaults(e.mutationKey),...e,_defaulted:!0}}clear(){this.#a.clear(),this.#n.clear()}},b=e.i(912598);let g=(0,o.getDefaultConfig)({appName:"WolvCapital",projectId:"34355655",chains:[a.bsc],ssr:!1}),w=new f;function x({children:e}){return(0,t.jsx)(r.WagmiProvider,{config:g,children:(0,t.jsx)(b.QueryClientProvider,{client:w,children:(0,t.jsx)(o.RainbowKitProvider,{modalSize:"compact",children:e})})})}e.s(["WalletProvider",()=>x],75164)},330257,e=>{"use strict";var t=e.i(843476),o=e.i(522016),r=e.i(271645),a=e.i(770703),n=e.i(846932),s=e.i(75164),i=e.i(209165),l=e.i(375143);let c=(0,a.default)(()=>e.A(773936).then(e=>({default:e.WolvWalletSection})),{loadableGenerated:{modules:[169579]},ssr:!1}),p=(0,a.default)(()=>e.A(155700),{loadableGenerated:{modules:[419176]},ssr:!1});function u(e){if(e<=0)return null;let t=Math.floor(e/86400),o=Math.floor(e%86400/3600),r=Math.floor(e%3600/60);return`${t}d ${o}h ${r}m`}function d(e){return Number.isFinite(e)?new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(e):"$0.00"}function h(e){if(!e)return null;let t=new Date(e);return Number.isNaN(t.getTime())?null:t}function m(e,t){return Math.floor((t.getTime()-e.getTime())/864e5)}function y(e){return e?e.toLocaleDateString("en-GB",{year:"numeric",month:"2-digit",day:"2-digit"}):"-"}let f={deposit:{label:"Deposit",icon:"↓",color:"#7dd3fc",bg:"rgba(59,130,246,0.12)"},withdrawal:{label:"Withdrawal",icon:"↑",color:"#fca5a5",bg:"rgba(248,113,113,0.12)"},profit:{label:"Profit",icon:"◈",color:"#fbbf24",bg:"rgba(251,191,36,0.12)"},investment:{label:"Investment",icon:"⬡",color:"#93c5fd",bg:"rgba(59,130,246,0.12)"},bonus:{label:"Bonus",icon:"★",color:"#c7d2fe",bg:"rgba(148,163,184,0.12)"},fee:{label:"Fee",icon:"−",color:"#9ca3af",bg:"rgba(156,163,175,0.12)"}},b={approved:{color:"#7dd3fc",bg:"rgba(59,130,246,0.12)",dot:"#7dd3fc"},completed:{color:"#7dd3fc",bg:"rgba(59,130,246,0.12)",dot:"#7dd3fc"},pending:{color:"#facc15",bg:"rgba(250,204,21,0.12)",dot:"#facc15"},rejected:{color:"#fca5a5",bg:"rgba(248,113,113,0.12)",dot:"#fca5a5"},failed:{color:"#fca5a5",bg:"rgba(248,113,113,0.12)",dot:"#fca5a5"}},g={hidden:{},show:{transition:{staggerChildren:.05,delayChildren:.05}}},w={hidden:{opacity:0,y:16},show:{opacity:1,y:0,transition:{type:"spring",stiffness:120,damping:20}}};function x(){let[e,a]=(0,r.useState)(null),[x,v]=(0,r.useState)([]),[W,C]=(0,r.useState)([]),[j,S]=(0,r.useState)(!0),[I,P]=(0,r.useState)(null),[O]=(0,r.useState)(()=>new Date),[q,T]=(0,r.useState)(u(0x6a6f69aa-Math.floor(Date.now()/1e3))),[R,_]=(0,r.useState)(Math.floor(Date.now()/1e3)>=0x6a6f69aa);(0,r.useEffect)(()=>{let e=setInterval(()=>{let e=0x6a6f69aa-Math.floor(Date.now()/1e3);T(u(e)),_(e<=0)},6e4);return()=>clearInterval(e)},[]),(0,r.useEffect)(()=>{let e=!1;return async function(){S(!0),P(null);try{let[t,o,r]=await Promise.allSettled([(0,i.apiFetch)("/api/wallet/"),(0,i.apiFetch)("/api/investments/my/"),(0,i.apiFetch)("/api/transactions/")]),n="fulfilled"===t.status?t.value:null,s="fulfilled"===o.status?o.value:null,l="fulfilled"===r.status?r.value:null;if(n?.status===401||s?.status===401||l?.status===401||n?.status===403||s?.status===403||l?.status===403)throw Error("Session expired. Please log in again.");if(!n||!n.ok)throw Error(`Wallet fetch failed (${n?.status||"network"})`);if(!s||!s.ok)throw Error(`Investments fetch failed (${s?.status||"network"})`);let c=await n.json(),p=await s.json(),u=l&&l.ok?await l.json():[];if(e)return;a(c),v(Array.isArray(p)?p:[]),C(Array.isArray(u)?u:[])}catch(t){e||P(t?.message||"Failed to load dashboard data")}finally{e||S(!1)}}(),()=>{e=!0}},[]);let N=(0,r.useMemo)(()=>x.filter(e=>["active","approved"].includes(String(e.status))),[x]),B=(0,r.useMemo)(()=>N.reduce((e,t)=>e+(Number(t.amount)||0),0),[N]),A=(0,r.useMemo)(()=>W.filter(e=>"profit"===String(e.tx_type)&&["approved","completed"].includes(String(e.status))).reduce((e,t)=>e+(Number(t.amount)||0),0),[W]),M=(0,r.useMemo)(()=>[...W].sort((e,t)=>{let o=h(e.created_at)?.getTime()||0;return(h(t.created_at)?.getTime()||0)-o}),[W]),D=B>0?(A/B*100).toFixed(1):"0.0",Q=[{from:"#193a93",to:"#0f2f89"},{from:"#0f5c7a",to:"#0f5c7a"},{from:"#212c50",to:"#212c50"},{from:"#053257",to:"#053257"}];return Q[0],Q[1],Q[2],Q[3],(0,t.jsxs)("div",{className:"min-h-screen",style:{background:"#0a0f1e",fontFamily:"'DM Sans', system-ui, sans-serif"},children:[(0,t.jsx)("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        
        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-top: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: rgba(0,168,150,0.4);
          transform: translateY(-2px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .plan-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.3s ease;
        }
        .plan-card:hover {
          border-color: rgba(0,168,150,0.35);
          box-shadow: 0 0 40px rgba(0,168,150,0.08);
        }
        .glass-surface {
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
        }
        .glow-teal { box-shadow: 0 0 30px rgba(0,168,150,0.2); }
        .progress-bar {
          background: linear-gradient(90deg, #00a896, #1a3a8f);
          border-radius: 99px;
          transition: width 1s ease;
        }
        .tx-row { transition: background 0.15s; }
        .tx-row:hover { background: rgba(255,255,255,0.03); }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .card-mini {
          background: linear-gradient(135deg, #1a3a8f 0%, #1e4db7 35%, #1a8fc1 75%, #0ea5c9 100%);
        }
      `}),(0,t.jsx)("main",{className:"max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-28 sm:pb-10",children:(0,t.jsxs)(n.motion.div,{variants:g,initial:"hidden",animate:"show",children:[I&&(0,t.jsxs)(n.motion.div,{variants:w,className:"mb-6 rounded-2xl p-4",style:{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#fca5a5"},children:["⚠ ",I]}),!R&&(0,t.jsxs)(l.MotionLink,{href:"/presale",variants:w,...l.pressableTapProps,className:"glass-surface mb-6 block",style:{borderRadius:"20px",background:"linear-gradient(135deg, rgba(245,158,11,0.16) 0%, rgba(217,119,6,0.08) 100%)",border:"1px solid rgba(245,158,11,0.3)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",textDecoration:"none"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",minWidth:0},children:[(0,t.jsx)("span",{style:{width:"8px",height:"8px",borderRadius:"50%",background:"#f59e0b",flexShrink:0},className:"animate-pulse"}),(0,t.jsxs)("div",{style:{minWidth:0},children:[(0,t.jsx)("div",{style:{color:"#fbbf24",fontWeight:700,fontSize:"13px"},children:"🔥 WOLV Presale Live — $0.50 / WOLV"}),(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.55)",fontSize:"11px",marginTop:"2px"},children:q?`${q} left \xb7 $50,000 hard cap`:"Hard cap $50,000"})]})]}),(0,t.jsx)("span",{style:{padding:"8px 16px",borderRadius:"10px",flexShrink:0,background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.35)",color:"#fbbf24",fontSize:"12px",fontWeight:700,whiteSpace:"nowrap"},children:"Buy Now →"})]}),(0,t.jsxs)(n.motion.div,{variants:w,className:"glass-surface mb-6",style:{borderRadius:"20px",background:"linear-gradient(135deg, rgba(26,58,143,0.6) 0%, rgba(14,165,201,0.4) 100%)",border:"1px solid rgba(0,168,150,0.3)",boxShadow:"0 8px 32px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.06)",padding:"0",overflow:"hidden",display:"flex",alignItems:"stretch"},children:[(0,t.jsxs)("div",{className:"card-mini",style:{width:"120px",flexShrink:0,padding:"16px 14px",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative",overflow:"hidden"},children:[(0,t.jsx)("div",{style:{position:"absolute",top:0,right:0,width:"80px",height:"80px",background:"rgba(255,255,255,0.07)",borderRadius:"50%",transform:"translate(30px,-30px)"}}),(0,t.jsx)("div",{style:{color:"#fff",fontSize:"9px",fontWeight:700,letterSpacing:"1px"},children:"WOLVCAPITAL"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{width:"28px",height:"20px",borderRadius:"3px",background:"linear-gradient(135deg, #b8860b, #f5d06e, #b8860b)",marginBottom:"8px"}}),(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.7)",fontSize:"8px",fontFamily:"monospace",letterSpacing:"1px"},children:"•••• 7717"})]})]}),(0,t.jsxs)("div",{style:{flex:1,padding:"18px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{color:"#fff",fontWeight:600,fontSize:"15px",marginBottom:"3px"},children:"Virtual Card"}),(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.5)",fontSize:"12px"},children:"Visa Infinite · Digital payments worldwide"})]}),(0,t.jsx)(l.MotionLink,{href:"/dashboard/card",...l.pressableTapProps,style:{padding:"9px 18px",borderRadius:"10px",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",whiteSpace:"nowrap",backdropFilter:"blur(10px)",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"},children:"View Card →"})]})]}),(0,t.jsxs)(n.motion.div,{variants:w,className:"grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3",children:[(0,t.jsx)(k,{label:"Total Invested",value:d(B),sub:"Active capital",icon:"⬡",accent:"#3b82f6",loading:j}),(0,t.jsx)(k,{label:"Locked ROI",value:d(A),sub:"Profit earned",icon:"◈",accent:"#f59e0b",loading:j}),(0,t.jsx)(k,{label:"Available Balance",value:d(e?.balance??0),sub:"Ready to deploy",icon:"◎",accent:"#10b981",loading:j}),(0,t.jsx)(k,{label:"Total Deposits",value:d(e?.total_deposits??0),sub:"All time",icon:"↓",accent:"#00a896",loading:j})]}),!j&&B>0&&(0,t.jsxs)(n.motion.div,{variants:w,className:"glass-surface mb-6 rounded-2xl px-5 py-4 flex items-center justify-between",style:{background:"linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))",border:"1px solid rgba(245,158,11,0.15)"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.5)",fontSize:"13px"},children:"Overall ROI Rate"}),(0,t.jsx)(o.default,{href:"/dashboard/wolv-token",style:{color:"rgba(255,255,255,0.3)",fontSize:"11px",marginTop:"4px",display:"inline-block",textDecoration:"underline"},children:"These profits become WOLV tokens →"})]}),(0,t.jsxs)("div",{style:{color:"#f59e0b",fontWeight:700,fontSize:"20px",fontFamily:"Inter, 'DM Sans', system-ui, sans-serif",fontVariantNumeric:"tabular-nums"},children:["+",D,"%"]})]}),(0,t.jsxs)(n.motion.section,{variants:w,className:"mb-6",children:[(0,t.jsxs)(o.default,{href:"/dashboard/wolv-token",style:{textDecoration:"none",display:"block",marginBottom:"16px"},children:[(0,t.jsx)("h2",{style:{color:"#fff",fontSize:"18px",fontWeight:600},children:"WOLV Token"}),(0,t.jsx)("p",{style:{color:"rgba(255,255,255,0.35)",fontSize:"12px",marginTop:"2px"},children:"Connect your wallet and view WOLV token rewards without leaving the dashboard."})]}),(0,t.jsx)("div",{style:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(0,168,150,0.2)",borderRadius:"20px",padding:"24px",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.05), 0 20px 50px rgba(0,0,0,0.25)"},children:(0,t.jsx)(s.WalletProvider,{children:(0,t.jsx)(c,{})})})]}),(0,t.jsxs)(n.motion.section,{variants:w,className:"mb-6",children:[(0,t.jsxs)(o.default,{href:"/referral",style:{textDecoration:"none",display:"block",marginBottom:"16px"},children:[(0,t.jsx)("h2",{style:{color:"#fff",fontSize:"18px",fontWeight:600},children:"Referral Program"}),(0,t.jsx)("p",{style:{color:"rgba(255,255,255,0.35)",fontSize:"12px",marginTop:"2px"},children:"Share your link and earn lifetime commissions on every investment your referrals make."})]}),(0,t.jsx)(p,{})]}),(0,t.jsxs)(n.motion.section,{variants:w,className:"mb-8",children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{style:{color:"#fff",fontSize:"18px",fontWeight:600},children:"Active Plans"}),(0,t.jsxs)("p",{style:{color:"rgba(255,255,255,0.35)",fontSize:"12px",marginTop:"2px"},children:[N.length," plan",1!==N.length?"s":""," running"]})]}),(0,t.jsx)(l.MotionLink,{href:"/dashboard/new-investment",...l.pressableTapProps,style:{color:"#bfdbfe",fontSize:"13px",fontWeight:500,textDecoration:"none",padding:"6px 14px",borderRadius:"8px",border:"1px solid rgba(59,130,246,0.25)",background:"rgba(59,130,246,0.08)"},children:"+ Add Plan"})]}),j?(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[1,2].map(e=>(0,t.jsx)("div",{className:"shimmer rounded-2xl",style:{height:"220px"}},e))}):0===N.length?(0,t.jsxs)("div",{style:{borderRadius:"20px",padding:"48px 24px",textAlign:"center",background:"rgba(255,255,255,0.03)",border:"1px dashed rgba(255,255,255,0.1)"},children:[(0,t.jsx)("div",{style:{fontSize:"40px",marginBottom:"12px"},children:"📊"}),(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.6)",fontWeight:500,marginBottom:"6px"},children:"No active plans yet"}),(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.3)",fontSize:"13px",marginBottom:"20px"},children:"Start investing to grow your portfolio"}),(0,t.jsx)(o.default,{href:"/dashboard/new-investment",style:{padding:"10px 24px",borderRadius:"10px",background:"linear-gradient(135deg, #1d4ed8, #2563eb)",color:"#fff",fontWeight:600,fontSize:"14px",textDecoration:"none"},children:"Start Investing"})]}):(0,t.jsx)(n.motion.div,{variants:g,initial:"hidden",animate:"show",className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:N.map((e,o)=>{let r=e.plan_name||e.plan?.name||`Plan #${String(e.id)}`,a=Number(e.plan_daily_roi??e.plan?.daily_roi??e.plan?.roi_rate)||0,s=Number(e.plan_duration_days??e.plan?.duration_days)||0,i=h(e.started_at)||h(e.created_at),c=h(e.ends_at);!c&&i&&s>0&&(c=new Date(i)).setDate(c.getDate()+s);let p=i?Math.max(0,m(i,O)):0,u=c?Math.max(0,m(O,c)):0,f=Number(e.total_earned),b=Number(e.expected_total),g=s>0?Math.min(100,Math.round(p/s*100)):0,x=r.toLowerCase().includes("pioneer")?"pioneer":r.toLowerCase().includes("vanguard")?"vanguard":r.toLowerCase().includes("horizon")?"horizon":r.toLowerCase().includes("summit")?"summit":null,k=[{from:"#1d4ed8",to:"#1d4ed8"},{from:"#0f5c7a",to:"#0f5c7a"},{from:"#212c50",to:"#212c50"},{from:"#053257",to:"#053257"}],v=k[o%k.length];return(0,t.jsxs)(n.motion.div,{variants:w,className:"plan-card rounded-2xl p-5",children:[(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"},children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"},children:[(0,t.jsx)("div",{style:{width:"32px",height:"32px",borderRadius:"8px",background:`linear-gradient(135deg, ${v.from}, ${v.to})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px"},children:"⬡"}),(0,t.jsx)("span",{style:{color:"#fff",fontWeight:700,fontSize:"16px"},children:r})]}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,t.jsx)("span",{style:{padding:"2px 10px",borderRadius:"99px",fontSize:"11px",fontWeight:600,background:"rgba(16,185,129,0.15)",color:"#10b981",border:"1px solid rgba(16,185,129,0.25)"},children:"● ACTIVE"}),a>0&&(0,t.jsxs)("span",{style:{color:"rgba(255,255,255,0.4)",fontSize:"12px"},children:[a,"% APY"]})]})]}),(0,t.jsxs)("div",{style:{textAlign:"right"},children:[(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.35)",fontSize:"10px",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"2px"},children:"Amount"}),(0,t.jsx)("div",{style:{color:"#fff",fontWeight:700,fontSize:"22px",fontFamily:"Inter, 'DM Sans', system-ui, sans-serif",fontVariantNumeric:"tabular-nums"},children:d(Number(e.amount)||0)})]})]}),s>0&&(0,t.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"},children:[(0,t.jsx)("span",{style:{color:"rgba(255,255,255,0.4)",fontSize:"11px"},children:"Plan Progress"}),(0,t.jsxs)("span",{style:{color:"#fff",fontSize:"12px",fontWeight:600},children:[g,"%"]})]}),(0,t.jsx)("div",{style:{height:"6px",borderRadius:"99px",background:"rgba(255,255,255,0.07)",overflow:"hidden"},children:(0,t.jsx)("div",{className:"progress-bar",style:{width:`${g}%`,height:"100%"}})})]}),(0,t.jsx)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"14px"},children:[{label:"Started",value:y(i)},{label:"End Date",value:y(c)},{label:"Duration",value:s>0?`${s} days`:"-"},{label:"Days Left",value:s>0?`${u}`:"-"}].map(e=>(0,t.jsxs)("div",{style:{padding:"10px 12px",borderRadius:"10px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"},children:[(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.35)",fontSize:"10px",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"3px"},children:e.label}),(0,t.jsx)("div",{style:{color:"#fff",fontSize:"13px",fontWeight:500},children:e.value})]},e.label))}),(Number.isFinite(f)||Number.isFinite(b))&&(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"14px"},children:[(0,t.jsxs)("div",{style:{padding:"12px",borderRadius:"10px",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.15)"},children:[(0,t.jsx)("div",{style:{color:"#10b981",fontSize:"10px",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"3px"},children:"Total Earned"}),(0,t.jsx)("div",{style:{color:"#10b981",fontSize:"15px",fontWeight:700,fontFamily:"Inter, 'DM Sans', system-ui, sans-serif",fontVariantNumeric:"tabular-nums"},children:Number.isFinite(f)?d(f):"-"})]}),(0,t.jsxs)("div",{style:{padding:"12px",borderRadius:"10px",background:"rgba(0,168,150,0.08)",border:"1px solid rgba(0,168,150,0.15)"},children:[(0,t.jsx)("div",{style:{color:"#00a896",fontSize:"10px",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"3px"},children:"Expected Total"}),(0,t.jsx)("div",{style:{color:"#00a896",fontSize:"15px",fontWeight:700,fontFamily:"Inter, 'DM Sans', system-ui, sans-serif",fontVariantNumeric:"tabular-nums"},children:Number.isFinite(b)?d(b):"-"})]})]}),(0,t.jsx)(l.MotionLink,{href:x?`/plans/${x}`:"/plans",...l.pressableTapProps,style:{display:"block",textAlign:"center",padding:"10px",borderRadius:"10px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",fontSize:"13px",fontWeight:500,textDecoration:"none",transition:"all 0.2s"},children:"View Details →"})]},String(e.id))})})]}),(0,t.jsxs)(n.motion.section,{variants:w,className:"mb-8",children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{style:{color:"#fff",fontSize:"18px",fontWeight:600},children:"Recent Activity"}),(0,t.jsx)("p",{style:{color:"rgba(255,255,255,0.35)",fontSize:"12px",marginTop:"2px"},children:"Latest transactions"})]}),(0,t.jsx)(l.MotionLink,{href:"/dashboard/transactions",...l.pressableTapProps,style:{color:"#7dd3fc",fontSize:"13px",fontWeight:500,textDecoration:"none",padding:"6px 14px",borderRadius:"8px",border:"1px solid rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.08)"},children:"View All"})]}),(0,t.jsx)("div",{className:"glass-surface",style:{borderRadius:"20px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",overflow:"hidden"},children:j?(0,t.jsx)("div",{style:{padding:"24px"},children:[1,2,3].map(e=>(0,t.jsx)("div",{className:"shimmer rounded-xl",style:{height:"52px",marginBottom:"8px"}},e))}):0===M.length?(0,t.jsx)("div",{style:{padding:"48px 24px",textAlign:"center",color:"rgba(255,255,255,0.3)",fontSize:"14px"},children:"No transactions yet"}):(0,t.jsxs)(n.motion.div,{variants:g,initial:"hidden",animate:"show",children:[(0,t.jsx)("div",{style:{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:"12px",padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"},children:["Type","Activity","Amount"].map(e=>(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.3)",fontSize:"10px",letterSpacing:"1.5px",textTransform:"uppercase",fontWeight:600},children:e},e))}),M.slice(0,10).map((e,o)=>{let r=h(e.created_at),a=f[String(e.tx_type)]||{label:String(e.tx_type),icon:"·",color:"#9ca3af",bg:"rgba(156,163,175,0.1)"},s=b[String(e.status)]||{color:"#9ca3af",bg:"rgba(156,163,175,0.1)",dot:"#9ca3af"},i=["deposit","profit","bonus"].includes(String(e.tx_type));return(0,t.jsxs)(n.motion.div,{variants:w,className:"tx-row",style:{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:"12px",padding:"14px 20px",alignItems:"center",borderBottom:o<M.slice(0,10).length-1?"1px solid rgba(255,255,255,0.04)":"none"},children:[(0,t.jsx)("div",{style:{width:"36px",height:"36px",borderRadius:"10px",background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",color:a.color,fontWeight:700,flexShrink:0},children:a.icon}),(0,t.jsxs)("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",columnGap:"8px",rowGap:"4px",minWidth:0},children:[(0,t.jsxs)("div",{style:{minWidth:0},children:[(0,t.jsx)("div",{style:{color:"#fff",fontSize:"13px",fontWeight:500,marginBottom:"2px"},children:a.label}),(0,t.jsxs)("div",{style:{color:"rgba(203,213,225,0.65)",fontSize:"11px",fontFamily:"Inter, system-ui, sans-serif"},children:[r?r.toLocaleDateString("en-GB"):"-"," · ",r?r.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):""]})]}),(0,t.jsxs)("div",{style:{padding:"3px 10px",borderRadius:"99px",background:s.bg,fontSize:"11px",fontWeight:600,color:s.color,whiteSpace:"nowrap"},children:[(0,t.jsx)("span",{style:{marginRight:"4px"},children:"●"}),String(e.status).charAt(0).toUpperCase()+String(e.status).slice(1)]})]}),(0,t.jsxs)("div",{style:{color:i?"#bfdbfe":"#fca5a5",fontFamily:"Inter, system-ui, sans-serif",fontWeight:600,fontSize:"14px",whiteSpace:"nowrap"},children:[i?"+":"-",d(Number(e.amount)||0)]})]},e.id)})]})})]})]})})]})}function k({label:e,value:o,sub:r,icon:a,accent:s,loading:i,className:c}){return(0,t.jsx)(n.motion.div,{variants:w,...l.pressableTapProps,className:`stat-card rounded-2xl p-4 ${c||""}`,children:i?(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"shimmer rounded-lg",style:{height:"12px",width:"60%",marginBottom:"12px"}}),(0,t.jsx)("div",{className:"shimmer rounded-lg",style:{height:"24px",width:"80%",marginBottom:"8px"}}),(0,t.jsx)("div",{className:"shimmer rounded-lg",style:{height:"10px",width:"40%"}})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"},children:[(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.4)",fontSize:"11px",letterSpacing:"0.5px",textTransform:"uppercase"},children:e}),(0,t.jsx)("div",{style:{width:"28px",height:"28px",borderRadius:"8px",background:`rgba(${"#3b82f6"===s?"59,130,246":"#f59e0b"===s?"245,158,11":"#10b981"===s?"16,185,129":"#00a896"===s?"0,168,150":"139,92,246"},0.15)`,display:"flex",alignItems:"center",justifyContent:"center",color:s,fontSize:"14px"},children:a})]}),(0,t.jsx)("div",{style:{color:"#fff",fontSize:"20px",fontWeight:700,fontFamily:"Inter, 'DM Sans', system-ui, sans-serif",fontVariantNumeric:"tabular-nums",marginBottom:"4px",letterSpacing:"-0.5px"},children:o}),(0,t.jsx)("div",{style:{color:"rgba(255,255,255,0.3)",fontSize:"11px"},children:r})]})})}e.s(["default",()=>x])},101139,e=>{e.v(t=>Promise.all(["static/chunks/034083a8ec975080.js"].map(t=>e.l(t))).then(()=>t(109963)))},625932,e=>{e.v(e=>Promise.resolve().then(()=>e(776267)))},432003,e=>{e.v(t=>Promise.all(["static/chunks/114e4bca1054d186.js"].map(t=>e.l(t))).then(()=>t(313037)))},66216,e=>{e.v(t=>Promise.all(["static/chunks/b6327b280c5bfcc7.js","static/chunks/d642e7b8906a6f09.js","static/chunks/f5bf1e03cb9199bc.js"].map(t=>e.l(t))).then(()=>t(477350)))},224814,e=>{e.v(t=>Promise.all(["static/chunks/3ebda3b8113d1f59.js","static/chunks/4be4fdd2a879eaf5.js"].map(t=>e.l(t))).then(()=>t(653806)))},470308,e=>{e.v(t=>Promise.all(["static/chunks/7460ada9d262f98e.js"].map(t=>e.l(t))).then(()=>t(915618)))},474683,e=>{e.v(t=>Promise.all(["static/chunks/fc73d50b9c310502.js"].map(t=>e.l(t))).then(()=>t(289329)))},381024,e=>{e.v(t=>Promise.all(["static/chunks/11c58f2c95beea88.js","static/chunks/6a5c385f9305b599.js"].map(t=>e.l(t))).then(()=>t(607627)))},437436,e=>{e.v(t=>Promise.all(["static/chunks/b707b1c59d254ffd.js"].map(t=>e.l(t))).then(()=>t(887763)))},677892,e=>{e.v(t=>Promise.all(["static/chunks/8b34c099cd2615bd.js"].map(t=>e.l(t))).then(()=>t(92211)))},939802,e=>{e.v(t=>Promise.all(["static/chunks/aae956db9cc07e28.js"].map(t=>e.l(t))).then(()=>t(639484)))},594369,e=>{e.v(t=>Promise.all(["static/chunks/f6d66a98116b99f6.js"].map(t=>e.l(t))).then(()=>t(360030)))},667221,e=>{e.v(t=>Promise.all(["static/chunks/e371a50da2c84bf7.js"].map(t=>e.l(t))).then(()=>t(521546)))},412515,e=>{e.v(t=>Promise.all(["static/chunks/d4104c1a10ac690f.js"].map(t=>e.l(t))).then(()=>t(702592)))},411020,e=>{e.v(t=>Promise.all(["static/chunks/a28c6e5f53708b37.js"].map(t=>e.l(t))).then(()=>t(494205)))},406565,e=>{e.v(t=>Promise.all(["static/chunks/db2b51b87a2c0c26.js"].map(t=>e.l(t))).then(()=>t(696599)))},955428,e=>{e.v(t=>Promise.all(["static/chunks/4d5773e898297cb1.js"].map(t=>e.l(t))).then(()=>t(757128)))},908553,e=>{e.v(t=>Promise.all(["static/chunks/8ca14039286a119e.js"].map(t=>e.l(t))).then(()=>t(672849)))},204101,e=>{e.v(t=>Promise.all(["static/chunks/5851e654d155b829.js"].map(t=>e.l(t))).then(()=>t(238087)))},262330,e=>{e.v(t=>Promise.all(["static/chunks/def8047c6ab4b6bb.js"].map(t=>e.l(t))).then(()=>t(348365)))},631199,e=>{e.v(t=>Promise.all(["static/chunks/9ef221fdb3df52ea.js"].map(t=>e.l(t))).then(()=>t(276241)))},850866,e=>{e.v(t=>Promise.all(["static/chunks/032c922418f73d79.js"].map(t=>e.l(t))).then(()=>t(979249)))},438815,e=>{e.v(t=>Promise.all(["static/chunks/ed953a56a1d0d7bd.js"].map(t=>e.l(t))).then(()=>t(499412)))},558014,e=>{e.v(t=>Promise.all(["static/chunks/bb886d450803b068.js"].map(t=>e.l(t))).then(()=>t(114824)))},640066,e=>{e.v(t=>Promise.all(["static/chunks/9ae68285b13d7657.js"].map(t=>e.l(t))).then(()=>t(556693)))},35808,e=>{e.v(t=>Promise.all(["static/chunks/8b134f739a19ad12.js"].map(t=>e.l(t))).then(()=>t(887831)))},891149,e=>{e.v(t=>Promise.all(["static/chunks/a7fc9d999e4bb549.js"].map(t=>e.l(t))).then(()=>t(135597)))},442086,e=>{e.v(t=>Promise.all(["static/chunks/cdf4d277428d3411.js"].map(t=>e.l(t))).then(()=>t(67881)))},105872,e=>{e.v(t=>Promise.all(["static/chunks/fd55b5c44095d849.js"].map(t=>e.l(t))).then(()=>t(864976)))},271711,e=>{e.v(t=>Promise.all(["static/chunks/f20a5acf8b08ad4d.js"].map(t=>e.l(t))).then(()=>t(29311)))},567031,e=>{e.v(t=>Promise.all(["static/chunks/1d23d7bb99a3c6fd.js"].map(t=>e.l(t))).then(()=>t(75789)))},575685,e=>{e.v(t=>Promise.all(["static/chunks/e625a34073f9e963.js"].map(t=>e.l(t))).then(()=>t(786882)))},604414,e=>{e.v(t=>Promise.all(["static/chunks/1fbab4c19bf07056.js"].map(t=>e.l(t))).then(()=>t(352164)))},777210,e=>{e.v(t=>Promise.all(["static/chunks/bb7631c2e765bae5.js"].map(t=>e.l(t))).then(()=>t(745141)))},230454,e=>{e.v(t=>Promise.all(["static/chunks/febaee82fe46dd12.js"].map(t=>e.l(t))).then(()=>t(516267)))},80911,e=>{e.v(t=>Promise.all(["static/chunks/31312a55a741195b.js"].map(t=>e.l(t))).then(()=>t(138783)))},197615,e=>{e.v(t=>Promise.all(["static/chunks/000d5aaae1649753.js"].map(t=>e.l(t))).then(()=>t(540804)))},485284,e=>{e.v(t=>Promise.all(["static/chunks/3f89b7b695a6d7dc.js"].map(t=>e.l(t))).then(()=>t(303962)))},346977,e=>{e.v(t=>Promise.all(["static/chunks/98f04ecab8ba803d.js"].map(t=>e.l(t))).then(()=>t(370564)))},736033,e=>{e.v(t=>Promise.all(["static/chunks/07353aebad6bc3dc.js"].map(t=>e.l(t))).then(()=>t(472299)))},557289,e=>{e.v(t=>Promise.all(["static/chunks/12dab76068ded989.js"].map(t=>e.l(t))).then(()=>t(920685)))},649149,e=>{e.v(t=>Promise.all(["static/chunks/9b3f225083ef0a3d.js"].map(t=>e.l(t))).then(()=>t(418891)))},9974,e=>{e.v(t=>Promise.all(["static/chunks/bf12f4c1f32f80d6.js"].map(t=>e.l(t))).then(()=>t(761011)))},485155,e=>{e.v(t=>Promise.all(["static/chunks/0c91bd755a4f9dab.js"].map(t=>e.l(t))).then(()=>t(421618)))},759968,e=>{e.v(t=>Promise.all(["static/chunks/a197228ba3c59a4c.js"].map(t=>e.l(t))).then(()=>t(251012)))},38898,e=>{e.v(t=>Promise.all(["static/chunks/87d8b1e64f99f9aa.js"].map(t=>e.l(t))).then(()=>t(900368)))},822574,e=>{e.v(t=>Promise.all(["static/chunks/b8670320de73bd6e.js"].map(t=>e.l(t))).then(()=>t(248530)))},101716,e=>{e.v(t=>Promise.all(["static/chunks/0763922dc86777d7.js"].map(t=>e.l(t))).then(()=>t(839444)))},24530,e=>{e.v(t=>Promise.all(["static/chunks/6ccf8e284ca75052.js"].map(t=>e.l(t))).then(()=>t(723557)))},768769,e=>{e.v(t=>Promise.all(["static/chunks/f855adf781fbabb6.js"].map(t=>e.l(t))).then(()=>t(880804)))},667285,e=>{e.v(t=>Promise.all(["static/chunks/5e52b85b2272e504.js"].map(t=>e.l(t))).then(()=>t(804453)))},193126,e=>{e.v(t=>Promise.all(["static/chunks/d4398ab35b431f0d.js"].map(t=>e.l(t))).then(()=>t(973024)))},708036,e=>{e.v(t=>Promise.all(["static/chunks/102c06659c7540e5.js"].map(t=>e.l(t))).then(()=>t(481675)))},811338,e=>{e.v(t=>Promise.all(["static/chunks/d7d3a2be52dabc28.js"].map(t=>e.l(t))).then(()=>t(385710)))},321625,e=>{e.v(t=>Promise.all(["static/chunks/9c0b5f5ffab2a5bb.js"].map(t=>e.l(t))).then(()=>t(656395)))},345304,e=>{e.v(t=>Promise.all(["static/chunks/3ada4ad80b724a17.js"].map(t=>e.l(t))).then(()=>t(382042)))},738278,e=>{e.v(t=>Promise.all(["static/chunks/5894511f7316295f.js"].map(t=>e.l(t))).then(()=>t(619124)))},792872,e=>{e.v(t=>Promise.all(["static/chunks/e5d550b9732ab661.js"].map(t=>e.l(t))).then(()=>t(371659)))},226755,e=>{e.v(t=>Promise.all(["static/chunks/3f039b77c6180d48.js"].map(t=>e.l(t))).then(()=>t(446495)))},504937,e=>{e.v(t=>Promise.all(["static/chunks/e74d6a3a94fc6c26.js"].map(t=>e.l(t))).then(()=>t(156255)))},410758,e=>{e.v(t=>Promise.all(["static/chunks/b7eedf15854f081e.js"].map(t=>e.l(t))).then(()=>t(908254)))},886422,e=>{e.v(t=>Promise.all(["static/chunks/383937fef5e1ddb5.js"].map(t=>e.l(t))).then(()=>t(652860)))},274604,e=>{e.v(t=>Promise.all(["static/chunks/a8aa6ff78e82658e.js"].map(t=>e.l(t))).then(()=>t(505209)))},426975,e=>{e.v(t=>Promise.all(["static/chunks/6d71cfc1f7683d60.js"].map(t=>e.l(t))).then(()=>t(6938)))},106369,e=>{e.v(t=>Promise.all(["static/chunks/dce3f3842db52dbe.js"].map(t=>e.l(t))).then(()=>t(358134)))},507518,e=>{e.v(t=>Promise.all(["static/chunks/528cda09397ca281.js"].map(t=>e.l(t))).then(()=>t(221274)))},396057,e=>{e.v(t=>Promise.all(["static/chunks/a0342869754663ac.js"].map(t=>e.l(t))).then(()=>t(432867)))},192150,e=>{e.v(t=>Promise.all(["static/chunks/04f0d42768e79133.js"].map(t=>e.l(t))).then(()=>t(42941)))},703354,e=>{e.v(t=>Promise.all(["static/chunks/ce5d6995e254e19e.js"].map(t=>e.l(t))).then(()=>t(185157)))},422316,e=>{e.v(t=>Promise.all(["static/chunks/e9abab00795bfca8.js"].map(t=>e.l(t))).then(()=>t(460012)))},932219,e=>{e.v(t=>Promise.all(["static/chunks/3f8afd6e6837c4b6.js"].map(t=>e.l(t))).then(()=>t(467138)))},437039,e=>{e.v(t=>Promise.all(["static/chunks/17727e254efd0ba9.js"].map(t=>e.l(t))).then(()=>t(21043)))},31273,e=>{e.v(t=>Promise.all(["static/chunks/604c018433c5d66d.js"].map(t=>e.l(t))).then(()=>t(444733)))},812921,e=>{e.v(t=>Promise.all(["static/chunks/ba246cf12e0a4cd0.js"].map(t=>e.l(t))).then(()=>t(327052)))},93305,e=>{e.v(t=>Promise.all(["static/chunks/27282591893e9efa.js"].map(t=>e.l(t))).then(()=>t(823233)))},65212,e=>{e.v(t=>Promise.all(["static/chunks/aa612cb4451d0ce2.js"].map(t=>e.l(t))).then(()=>t(879917)))},961315,e=>{e.v(t=>Promise.all(["static/chunks/b45bf4586b657794.js"].map(t=>e.l(t))).then(()=>t(4245)))},588300,e=>{e.v(t=>Promise.all(["static/chunks/280b3e1534b10084.js"].map(t=>e.l(t))).then(()=>t(227574)))},801705,e=>{e.v(t=>Promise.all(["static/chunks/38b3107693596d8f.js"].map(t=>e.l(t))).then(()=>t(211722)))},630764,e=>{e.v(t=>Promise.all(["static/chunks/9504e5769209c030.js"].map(t=>e.l(t))).then(()=>t(558160)))},254566,e=>{e.v(t=>Promise.all(["static/chunks/8fdd0d89755b8508.js"].map(t=>e.l(t))).then(()=>t(164540)))},873830,e=>{e.v(t=>Promise.all(["static/chunks/7bd87e064f4afcf8.js"].map(t=>e.l(t))).then(()=>t(631690)))},554610,e=>{e.v(t=>Promise.all(["static/chunks/ba77a1136b640f8a.js"].map(t=>e.l(t))).then(()=>t(93227)))},773936,e=>{e.v(t=>Promise.all(["static/chunks/944452d7b22533dc.js","static/chunks/f10393d4479c8cf4.js"].map(t=>e.l(t))).then(()=>t(169579)))},155700,e=>{e.v(t=>Promise.all(["static/chunks/7f5012eae5a24f9e.js"].map(t=>e.l(t))).then(()=>t(419176)))}]);