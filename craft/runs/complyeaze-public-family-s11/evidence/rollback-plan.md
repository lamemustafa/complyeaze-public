# S11 rollback plan

If production verification or the deployed public route regresses, revert the
single selected Decision Register integration commit, redeploy the preceding
public artifact, and repeat the public homepage smoke at desktop and 390px.

No package artifact, private application, customer data, or product runtime is
changed by this surface. Rollback therefore remains limited to the public-site
commit and deployment artifact.
