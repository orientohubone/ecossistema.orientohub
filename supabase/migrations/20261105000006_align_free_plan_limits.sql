begin;

-- Align the advertised Free offer with enforcement for existing and new accounts.
-- Individual founder overrides remain unchanged; Pro/Enterprise are preserved.
update public.plan_entitlements
set max_ideas=10,
    max_projects=5,
    max_solutions=2,
    updated_at=now()
where plan='free';

commit;
