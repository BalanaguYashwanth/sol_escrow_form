use anchor_lang::prelude::*;

declare_id!("KzXK3nTcUD6KaG5aBkBmRkMy61un83K8YoQNzv72zqb");

#[program]
pub mod sol_forms_escrow {
    use super::*;
    pub fn create_entry(
        ctx: Context<CreateEntry>,
        amount: u64,
        budget: u64,
        cpr: u64,
        entry_id: u64,
        title: String,
        creator: String
    ) -> Result<()> {
        let form_entry = &mut ctx.accounts.form_entry;
        form_entry.budget = budget;
        form_entry.cpr = cpr;
        form_entry.title = title;
        form_entry.creator = creator;
        form_entry.entry_id = entry_id;

        // Perform lamport transfer first (immutable reference needed here)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.owner.to_account_info(),
                    to: ctx.accounts.form_entry.to_account_info(),
                },
            ),
            amount,
        )?;

        Ok(())
    }

    pub fn reward(
        ctx: Context<Withdraw>,
    ) -> Result<()> {
        let form = &mut ctx.accounts.form_entry;
        let user = &mut ctx.accounts.user;

        // Transfer lamports from form_entry to user
        let form_lamports = **form.to_account_info().try_borrow_mut_lamports()?;
        
        // Ensure form entry has enough funds
        if form_lamports < form.cpr {
            return Err(ProgramError::InsufficientFunds.into());
        }

        **form.to_account_info().try_borrow_mut_lamports()? -= form.cpr; 
        **user.to_account_info().try_borrow_mut_lamports()? += form.cpr;

        Ok(())
    }
}

#[account]
pub struct FormState {
    pub cpr: u64,
    pub budget: u64,
    pub entry_id: u64,
    pub title: String,
    pub creator: String,
}

#[derive(Accounts)]
pub struct CreateEntry<'info> {
    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + std::mem::size_of::<FormState>()
    )]
    pub form_entry: Account<'info, FormState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub form_entry: Account<'info, FormState>,
    #[account(mut)]
    /// CHECK: The user account must be a valid wallet address to receive the reward.
    pub user: AccountInfo<'info>, 
    #[account(mut)]
    pub owner: Signer<'info>,
}
