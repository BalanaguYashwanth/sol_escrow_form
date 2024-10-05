import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolFormsEscrow } from '../target/types/sol_forms_escrow';

describe('sol_forms_escrow', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.SolFormsEscrow as Program<SolFormsEscrow>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
