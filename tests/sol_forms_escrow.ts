import * as anchor from "@coral-xyz/anchor";

describe('sol_forms_escrow', () => {
  
  it('Is initialized!', async () => {
    const keypair = anchor.web3.Keypair.generate();
    
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.SolFormsEscrow;

    const [formEntryPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("form_entry"), keypair.publicKey.toBuffer()],
      program.programId
    );

    // Prepare the parameters for the createEntry method
    const entryId = new anchor.BN(1333);
    const budget = new anchor.BN(0.1 * Math.pow(10, 9));
    const cpr = new anchor.BN(0.01 * Math.pow(10, 9));
    const endDate = new anchor.BN(23332);
    const startDate = new anchor.BN(Date.now());
    const status = "active";
    const title = "Example Title222";
    const creator = "Creator Name333";

    console.log('keypair--->', keypair.publicKey.toString(), 'formEntryPDA---->', formEntryPDA)
    // Create the entry using the smart contract method
    const tx = await program.methods.createEntry(
      new anchor.BN(0.02 * anchor.web3.LAMPORTS_PER_SOL), // Amount to transfer
      budget,
      cpr,
      entryId,
      title,
      creator
    )
    .accounts({
      formEntry: keypair.publicKey,
      owner: program.provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([keypair])
    .rpc();

    console.log("Your transaction signature", tx);

    // Fetch the transaction details
    // const txDetails = await program.provider.connection.getConfirmedTransaction(tx, "confirmed");
    // const txLogs = txDetails?.meta?.logMessages || null;
    // console.log('Transaction logs:', txLogs);

    // // Fetch the created account to verify its contents
    // const account = await program.account.formState.fetch(keypair.publicKey);
    // console.log('Account details:', account);

    // // Add assertions to verify the state of the account
    // expect(account.budget.toString()).toEqual(budget.toString());
    // expect(account.cpr.toString()).toEqual(cpr.toString());
    // expect(account.entryId.toString()).toEqual(entryId.toString());
    // expect(account.endDate.toString()).toEqual(endDate.toString());
    // expect(account.startDate.toString()).toEqual(startDate.toString());
    // expect(account.status).toEqual(status);
    // expect(account.title).toEqual(title);
    // expect(account.creator).toEqual(creator);
  });
});
