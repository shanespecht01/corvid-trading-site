# One-time setup: GitHub → Azure Static Web Apps (free)

You run these (they use your logged-in GitHub + Azure). After this, every push
to `main` deploys automatically. Replace the <angle-bracket> placeholders.

## Prerequisites
- Git installed, and the Azure CLI: https://aka.ms/InstallAzureCli
- (Optional) GitHub CLI `gh` for the shortcut in Step 1.

## Step 1 — Push this folder to a new GitHub repo

    cd corvid-site
    git init
    git add .
    git commit -m "Initial commit: Corvid Trading Co. site"
    git branch -M main
    git remote add origin https://github.com/<github-username>/<repo-name>.git
    git push -u origin main

(First create the empty repo at https://github.com/new, or do it all in one line
with the GitHub CLI:)

    gh repo create <repo-name> --public --source=. --remote=origin --push

## Step 2 — Create the free Static Web App and link the repo

    az login
    # if you have more than one subscription:
    # az account set --subscription "<subscription-name-or-id>"

    az group create --name corvid-rg --location centralus

    az staticwebapp create \
      --name corvid-trading \
      --resource-group corvid-rg \
      --source https://github.com/<github-username>/<repo-name> \
      --branch main \
      --app-location "/" \
      --api-location "" \
      --output-location "" \
      --sku Free \
      --login-with-github

`--login-with-github` opens a browser to authorize. Azure then commits a GitHub
Actions workflow into your repo and runs the first deploy. (`centralus` is the
closest Static Web Apps region to Fargo; `eastus2`, `westus2`, `westeurope` also
work.)

## Step 3 — Get your live URL

    az staticwebapp show --name corvid-trading --resource-group corvid-rg \
      --query "defaultHostname" -o tsv

That prints something like `corvid-trading-<hash>.azurestaticapps.net` — free
SSL included. Done. Push to `main` anytime to redeploy; pull requests get their
own temporary preview URLs.

## Later (not now)
- **Real quote form:** either set `FORM_ENDPOINT` in `js/main.js` to a form
  service, OR add an Azure Function at `/api/quote`, set `--api-location "api"`
  (via `az staticwebapp update`), and store secrets with
  `az staticwebapp appsettings set` — never in the repo.
- **Custom domain:** `az staticwebapp hostname set ...` (SSL auto-provisions).
