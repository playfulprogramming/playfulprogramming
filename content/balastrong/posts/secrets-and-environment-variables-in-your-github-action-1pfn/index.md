---
{
title: "Secrets and Environment Variables in your GitHub Action",
published: "2023-07-03T10:32:02Z",
tags: ["github", "githubactions", "devops", "security"],
description: "If you need to use some secret values in your pipeline, for example an API key to send a Slack...",
originalLink: "https://leonardomontini.dev/github-actions-secrets-variables/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "21246",
order: 1
}
---

If you need to use some secret values in your pipeline, for example an API key to send a Slack message or to deploy to a server, first of all you'd like those values to be... secret!

With GitHub Action you also have a way to store and use secrets in your workflows to make sure the values are not exposed in the logs or in the code. Similarly, there's also the possibility to use environment variables or values in general that can be kept in clear and shared across the different steps of the workflow.

That's what I'm going to show you today!

![Repository Variables](./og5krcfo0skh7qi08p2b.png)

## Secrets vs Variables vs Environments

First of all, secrets never show their value, you can just create, delete or overwrite them, but you'll never see the current value in the UI or in the logs once set.

Variables instead are always displayed and can be edited.

I haven't mentioned environments yet... so here's where they come into play: you can group variables (and secrets) at an organization level, so that they can be shared across all repositories in that specific organization. There's also a repository level, so all workflows on that specific repo have shared access and... environments!

You can set up an environment inside a repository and define variables and secrets there.

In case of conflicts, organization is overridden by repository and repository is overridden by environment.

## How to use secrets and variables

Once set, you can access your values in many different ways inside your workflows and even from external scripts. I recorded a video to showcase a demo and this is the code of the workflow:

```yaml
name: Secrets and Environment Variables

on: workflow_dispatch

jobs:
  top-secret:
    runs-on: ubuntu-latest
    env:
      MY_APP_ID: ${{ vars.APP_ID }}

    steps:
      - name: Read a variable
        run: echo "My APP_ID value is ${{ vars.APP_ID }}"

      - name: Tell me a secret!
        run: echo "My existing secret is ${{ secrets.API_KEY }}"

      - name: Unset secret
        run: echo "My unknown secret is ${{ secrets.DOES_NOT_EXIST }}"

      - name: Github stuff
        run: echo "My Github repo is called ${{ github.repository }}"

      - name: Read an env variable
        run: echo "My APP_ID value is ${{ env.APP_ID }} (also accessible as $MY_APP_ID)"

      - uses: actions/checkout@v2
      - name: Read the env from an external script
        run: |
          chmod +x .github/scripts/custom.sh
          .github/scripts/custom.sh
        shell: bash

  top-secret-production:
    runs-on: ubuntu-latest
    environment: production
    env:
      APP_ID: ${{ vars.APP_ID }}

    steps:
      - name: Read a variable
        run: echo "My APP_ID value in the production job is $APP_ID"
```

The ones above are some possible ways of accessing the values, assuming they're existing and set in your settings (repository/organization).

If you want to learn more and watch a live demo with that action being setup and executed, check out the video!

I will also go through each step, compare the code with the ouput and explain what's happening. Enjoy :)

{% youtube dPLPSaFqJmY %}

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
