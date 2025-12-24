# Step-by-Step Setup: Resume CI/CD Pipeline

## What This Does (Simple Explanation)

When you update your LaTeX resume file in your resume repository, GitHub will automatically:
1. Turn your LaTeX file into a PDF
2. Put that PDF into your portfolio repository
3. Your portfolio website will automatically show the new resume!

---

## STEP 1: In Your Resume Repository

### 1.1: Create the Workflow Folder

In your resume repository, you need to create a special folder structure:

```
your-resume-repo/
  ├── .github/
  │   └── workflows/
  │       └── build-resume.yml    ← Create this file
  ├── resume.tex                  ← Your LaTeX file (already exists)
  └── (other files...)
```

**How to create it:**

If using GitHub web interface:
1. Go to your resume repository on GitHub
2. Click "Add file" → "Create new file"
3. Type: `.github/workflows/build-resume.yml`
4. GitHub will automatically create the folders

If using command line (in your resume repo folder):
```bash
mkdir -p .github/workflows
cd .github/workflows
```

### 1.2: Create the Workflow File

Create a file named `build-resume.yml` inside `.github/workflows/`

Copy and paste this content (I'll give you the exact code below):

---

## STEP 2: Get the Workflow Code

Here's the exact code to put in `.github/workflows/build-resume.yml`:

```yaml
name: Build and Deploy Resume

on:
  push:
    branches:
      - main  # Change to 'master' if your default branch is 'master'
    paths:
      - '*.tex'
      - '*.cls'
      - '*.sty'
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout resume repository
        uses: actions/checkout@v4
      
      - name: Compile LaTeX to PDF
        uses: xu-cheng/latex-action@v3
        with:
          root_file: resume.tex  # ⚠️ CHANGE THIS to your actual LaTeX file name!
          latexmk_use_xelatex: false
          args: -pdf -file-line-error -halt-on-error -interaction=nonstopmode
      
      - name: Setup Git
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
      
      - name: Clone portfolio repository
        env:
          TOKEN: ${{ secrets.PORTFOLIO_TOKEN }}
        run: |
          git clone https://$TOKEN@github.com/vidyutraj/Vidyut-Portfolio.git portfolio-repo
      
      - name: Copy PDF to portfolio
        run: |
          mkdir -p portfolio-repo/public/resume
          cp resume.pdf portfolio-repo/public/resume/latest.pdf
      
      - name: Commit and push to portfolio
        run: |
          cd portfolio-repo
          git add public/resume/latest.pdf
          git commit -m "chore: update resume PDF [skip ci]" || exit 0
          git push || exit 0
```

### 2.1: Important Changes You MUST Make

In the workflow file, find this line (line 31):
```yaml
root_file: resume.tex
```

**Change `resume.tex` to your actual LaTeX file name!**

For example, if your file is called `my-resume.tex`, change it to:
```yaml
root_file: my-resume.tex
```

And on line 49, if your PDF output has a different name, change:
```yaml
cp resume.pdf portfolio-repo/public/resume/latest.pdf
```

For example, if your PDF is called `my-resume.pdf`:
```yaml
cp my-resume.pdf portfolio-repo/public/resume/latest.pdf
```

---

## STEP 3: Create a GitHub Personal Access Token

The workflow needs permission to push files to your portfolio repository. You need to create a "token" (like a password) for this.

### 3.1: Go to GitHub Settings

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"

### 3.2: Configure the Token

- **Note:** Type: `portfolio-resume-updater` (or any name you want)
- **Expiration:** Choose how long it should last (90 days, or no expiration)
- **Select scopes:** Check the box for `repo` (this gives it permission to access repositories)

### 3.3: Generate and Copy

1. Click "Generate token" at the bottom
2. **IMPORTANT:** Copy the token immediately! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. You won't be able to see it again, so save it somewhere safe

---

## STEP 4: Add the Token as a Secret

Now you need to tell your resume repository about this token.

### 4.1: Go to Your Resume Repository Settings

1. Go to your resume repository on GitHub
2. Click on "Settings" (top menu)
3. In the left sidebar, click "Secrets and variables" → "Actions"

### 4.2: Add the Secret

1. Click "New repository secret"
2. **Name:** Type exactly: `PORTFOLIO_TOKEN`
3. **Secret:** Paste the token you copied in Step 3
4. Click "Add secret"

---

## STEP 5: Test It!

### 5.1: Make a Small Change

1. Go to your resume repository
2. Open your LaTeX file (e.g., `resume.tex`)
3. Make a tiny change (add a comment, fix a typo, add a space)
4. Commit and push the change

### 5.2: Watch It Work

1. Go to your resume repository on GitHub
2. Click the "Actions" tab
3. You should see a workflow running called "Build and Deploy Resume"
4. Click on it to watch the progress
5. Wait for it to finish (usually takes 1-2 minutes)

### 5.3: Check Your Portfolio Repository

1. Go to your portfolio repository: `vidyutraj/Vidyut-Portfolio`
2. Go to the `public/resume/` folder
3. You should see `latest.pdf` there!
4. Your portfolio website will now automatically have the updated resume

---

## Troubleshooting

**"Workflow failed" error:**
- Check the Actions tab → click on the failed workflow → read the error message
- Common issues:
  - Wrong LaTeX file name in `root_file:`
  - Wrong PDF file name in `cp resume.pdf`
  - Token secret not set correctly

**"Permission denied" error:**
- Make sure the Personal Access Token has the `repo` scope checked
- Make sure the secret is named exactly: `PORTFOLIO_TOKEN`

**PDF doesn't appear:**
- Check the workflow logs in the Actions tab
- Make sure the workflow completed successfully (green checkmark)

---

## Summary Checklist

- [ ] Created `.github/workflows/build-resume.yml` in resume repo
- [ ] Updated `root_file:` to match your LaTeX file name
- [ ] Updated `cp resume.pdf` to match your PDF output name (if different)
- [ ] Created GitHub Personal Access Token with `repo` scope
- [ ] Added token as secret named `PORTFOLIO_TOKEN` in resume repo
- [ ] Tested by making a change and pushing to resume repo
- [ ] Verified PDF appears in portfolio repo at `public/resume/latest.pdf`

That's it! Once set up, every time you update your LaTeX resume and push it, your portfolio will automatically get the new PDF.

