---
{
title: "How to Configure YubiKey with GitHub",
published: "2025-05-25T17:56:31Z",
edited: "2025-05-25T17:57:36Z",
tags: ["github", "security"],
description: "If you're anything like me, you’ve probably typed in authenticator codes a hundred times a day, just...",
originalLink: "https://dev.to/this-is-learning/how-to-configure-yubikey-with-github-3lga",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

If you're anything like me, you’ve probably typed in **authenticator codes a hundred times a day**, just to push code, review a PR, merge something trivial or log in to another organization (I am part of like 7-8 of them).
It's secure, sure, but also kind of exhausting.

That's why I switched to a **YubiKey** (or at least one of the reason).

YubiKey is a small physical device that lets you log in securely with a single touch — no need to pull out your phone, open the app, copy a 6-digit code, and race against the clock. Since I started using it with GitHub, authentication has been both **faster** and **safer** (but I care more about the speed here, for my mental health 😃)

---

## Prerequisites

Before we get started, make sure you have everything you need:

- 🔐 A **YubiKey**  
  Any model that supports FIDO2/WebAuthn will work. Popular ones include:
  - YubiKey 5 Series
  - Security Key by Yubico

- 🌐 A **compatible browser**  
  You’ll need a browser that supports security keys, such as:
  - **Google Chrome**
  - **Mozilla Firefox**
  - **Microsoft Edge**

> 💡 Tip: If you have multiple YubiKeys (e.g., one for backup), you can register them later — GitHub supports more than one.

---

## Step 1: Enable Two-Factor Authentication on GitHub

Before you can add a YubiKey, GitHub requires that you enable **two-factor authentication (2FA)**. If you’ve already done this, feel free to skip to the next section.

### 🛠 How to enable 2FA:

1. Go to your GitHub [**Settings**](https://github.com/settings/profile).
2. In the left sidebar, click **“Passwords and authentication.”**
3. Under **“Two-factor authentication”**, click **“Enable two-factor authentication.”**
4. GitHub will guide you through setting up a primary 2FA method:
   - Choose **“Authenticator app”**
   - Scan the QR code with your app (e.g., Microsoft Authenticator, Google Authenticator)
   - Enter the 6-digit code to confirm
5. Save your **recovery codes** somewhere secure — this is important if you lose access to your 2FA device.

Once that’s done, you’re ready to pair your YubiKey.

---

## Step 2: Add YubiKey as a Security Key

With 2FA enabled, you can now register your YubiKey with GitHub. This allows you to log in with a tap — no code-copying, no app-switching.

### 🔐 Add your YubiKey:

1. Go to your GitHub [**Settings > Passwords and authentication**](https://github.com/settings/security).
2. Scroll down to the **"Security keys"** section.
3. Click **“Register new security key.”**
4. Insert your YubiKey into a USB port.
5. Tap the **gold disk** (or side button, depending on your model) when prompted by your browser.
6. Give your key a recognizable name (e.g., `YubiKey-Work`, `YubiKey-Home`).
7. Click **“Register”** to complete the setup.

Once registered, your YubiKey will appear in the list of authentication methods on your account.

---

## Step 3: Test Your YubiKey Login

Now that your YubiKey is set up, let’s confirm everything works as expected.

### 🔁 Log out and test:

1. **Log out** of your GitHub account.
2. Go to [github.com/login](https://github.com/login) and sign in with your username and password.
3. GitHub will now ask for your second factor. Choose **“Use security key”**.
4. Insert your YubiKey and **tap the button** when prompted.
5. You should be logged in — no phone, no code, just one tap.

That’s it! You’re now logging in with a physical hardware key — a small step that makes a **huge difference in account security**.

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

{% embed https://dev.to/kasuken %}

