use anchor_lang::prelude::*;

declare_id!("CWXvXP8jaxjj78SxeAAFy2fiYXQg2sDtjJzeu45Z2pak");

#[program]
pub mod sol_forms_escrow {
    use super::*;
    pub fn create_entry(
        ctx: Context<CreateEntry>,
        amount: u64,
        budget: u64,
        cpr: u64,
        end_date: u64,
        start_date: u64,
        status: String,
        title: String,
        creator: String
    ) -> Result<()> {
        let form_entry = &mut ctx.accounts.form_entry;
        // form_entry.owner = ctx.accounts.owner.key();
        form_entry.budget = budget;
        form_entry.cpr = cpr;
        form_entry.end_date = end_date;
        form_entry.start_date = start_date;
        form_entry.title = title;
        form_entry.status = status;
        form_entry.creator = creator;

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
        amount: u64
    ) -> Result<()> {
        let form = &mut ctx.accounts.form_entry;
        let user = &mut ctx.accounts.user;

        // Perform the transfer of lamports from form to user
        **form.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[account]
pub struct FormState {
    pub cpr: u64,
    pub budget: u64,  // Ensure budget is part of the state
    pub entry_id: u64, // Entry ID for frontend indexing
    pub end_date: u64,
    pub start_date: u64,
    pub status: String,
    pub title: String,
    pub creator: String
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateEntry<'info> {
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        payer = owner,
        space = 8 + std::mem::size_of::<FormState>(),  // Updated space calculation
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
    pub user: Signer<'info>,
}
