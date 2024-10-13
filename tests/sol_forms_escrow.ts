import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

describe('sol_forms_escrow', async() => {

  let SOLANA_DERIVATION_PATH = `m/44'/501'/0'/0'`;
  let SOLANA_OWNER_PRIVATE_KEY = 'plunge lemon stone icon best pudding stable milk verify amused bless reason'
  const seed = await bip39.mnemonicToSeed(SOLANA_OWNER_PRIVATE_KEY); // Convert mnemonic to seed

  const seedBuffer = Buffer.from(seed).toString('hex');
  const { key } = derivePath(SOLANA_DERIVATION_PATH, seedBuffer); // Derive the key using the path

  // const keypair = Keypair.fromSeed(key); // Create Solana Keypair from secret key
  const keypair = anchor.web3.Keypair.generate();
  // it('Is initialized!', async () => {
   

  //   // return keypair;

  //   // const keypair = anchor.web3.Keypair.generate();
    
  //   anchor.setProvider(anchor.AnchorProvider.env());
  //   const program = anchor.workspace.SolFormsEscrow;

  //   const entryId = new anchor.BN(1);

  //   const [pda, _bump] = await anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("escrow")],
  //     program.programId
  //   );

  //   // Prepare the parameters for the createEntry method
    
  //   const budget = new anchor.BN(0.1 * Math.pow(10, 9));
  //   const cpr = new anchor.BN(0.01 * Math.pow(10, 9));
  //   const endDate = new anchor.BN(23332);
  //   const startDate = new anchor.BN(Date.now());
  //   const status = "active";
  //   const title = "Example Title222";
  //   const creator = "Creator Name333";


  //   // Create the entry using the smart contract method
  //   const tx = await program.methods.createEntry(
  //     new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL), // Amount to transfer
  //     budget,
  //     cpr,
  //     entryId,
  //     title,
  //     creator
  //   )
  //   .accounts({
  //     formEntry: keypair.publicKey,
  //     // escrowPda: pda,
  //     owner: program.provider.publicKey,
  //     systemProgram: anchor.web3.SystemProgram.programId
  //   })
  //   .signers([keypair])
  //   .rpc();

  //   console.log("Your transaction signature", tx);

  // });

  it('reward', async () => {
    const provider = anchor.AnchorProvider.env();

    anchor.setProvider(anchor.AnchorProvider.env());
    const userKeypair = anchor.web3.Keypair.generate(); // Replace with actual user keypair if needed
    const formEntryPublicKey = new PublicKey("2BtXXM8ec1GMFvEq71CbXRyRyMjzBNBaEqMN84dq9rbU");

    const program = anchor.workspace.SolFormsEscrow;


    const [escrowPdaPublicKey, _bump] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      program.programId
  );

    const rewardTx = await program.methods.reward(new anchor.BN(0.001 * anchor.web3.LAMPORTS_PER_SOL))
    .accounts({
      formEntry: formEntryPublicKey,
      // escrowPda: escrowPdaPublicKey,
      owner: keypair.publicKey,
      user: userKeypair.publicKey
    })
    .signers([keypair])
    .rpc();

    console.log("Reward transaction signature:", rewardTx);

   
  })
});
