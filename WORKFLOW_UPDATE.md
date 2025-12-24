# Update Your Resume Repository Workflow

You need to update your GitHub Actions workflow in your **resume repository** to use `resumecyber.pdf` instead of `latest.pdf`.

## Change This Line in Your Workflow

In `.github/workflows/build-resume.yml`, find this step:

```yaml
- name: Copy PDF to portfolio
  run: |
    mkdir -p portfolio-repo/public/resume
    cp resumecyber.pdf portfolio-repo/public/resume/latest.pdf
```

**Change it to:**

```yaml
- name: Copy PDF to portfolio
  run: |
    mkdir -p portfolio-repo/public/resume
    cp resumecyber.pdf portfolio-repo/public/resume/resumecyber.pdf
```

That's it! This keeps the filename consistent with your LaTeX source file name.

