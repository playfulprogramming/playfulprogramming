---
{
title: "Keep Your Email out of Recipients’ Spam Folders",
published: "2024-01-14T14:57:22Z",
tags: ["m365", "microsoft365"],
description: "Spam is a common problem for email users and administrators. Spam messages can clutter your inbox,...",
originalLink: "https://dev.to/this-is-learning/keep-your-email-out-of-recipients-spam-folders-177b",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Spam is a common problem for email users and administrators. Spam messages can clutter your inbox, waste your time, and expose you to malicious or fraudulent content. To protect their users from spam, email providers use various technologies and policies to filter out unwanted messages and deliver only legitimate ones. However, sometimes these filters can also block or divert legitimate messages that you send or receive. This can cause frustration, confusion, and missed opportunities for communication and collaboration.

In this article, we will explain how you can prevent your email from being marked as spam by the recipients’ email providers. We will focus on Microsoft 365, a cloud-based service that includes Exchange Online Protection (EOP) and Microsoft Defender for Office 365 as part of its email security features. We will also provide some general tips and best practices that apply to any email service.

## How Microsoft 365 protects against spam

Microsoft 365 uses a combination of anti-spam technologies and policies to identify and separate spam from legitimate email. These include:

- **Connection filtering**: This identifies good and bad email source servers early in the inbound email connection via the IP Allow List, IP Block List, and the safe list (a dynamic but non-editable list of trusted senders maintained by Microsoft).
- **Spam filtering (content filtering)**: This assigns a spam confidence level (SCL) to each message based on various factors, such as the sender’s reputation, the message content, and the message headers. The SCL determines how the message is processed by the recipient’s mailbox. For example, messages with a high SCL are moved to the Junk Email folder or rejected, while messages with a low SCL are delivered normally.
- **Outbound spam filtering**: This monitors the outbound email traffic from your organization and applies actions such as blocking, throttling, or redirecting messages that are suspected of being spam. This helps protect your organization’s reputation and prevent your domain from being blacklisted by other email providers.
- **Phishing protection**: This detects and blocks email messages that try to trick recipients into revealing personal or financial information, such as passwords, bank account numbers, or credit card details. Phishing messages often impersonate legitimate senders or organizations and use deceptive links or attachments to lure recipients into malicious websites or applications.
- **Spoof intelligence**: This identifies email messages that use spoofing techniques to forge the sender’s identity or domain. Spoofing is often used by spammers and phishers to bypass authentication and reputation checks and to trick recipients into trusting the message. Spoof intelligence allows you to review and authorize the senders who are spoofing your domain and block the ones who are not authorized.
- **Anti-spam policies**: These are rules that you can configure to customize how spam filtering works for your organization. You can create different policies for different groups of users, domains, or scenarios. You can also modify the default policy that applies to all recipients in your organization.

You can manage these anti-spam features in the Microsoft 365 Defender portal or in PowerShell. For more information, see [Anti-spam protection](https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/anti-spam-protection-about?view=o365-worldwide).

## How to prevent your email from being marked as spam

While Microsoft 365 provides a robust anti-spam solution for your organization, there are still some steps that you can take to ensure that your email messages are not mistakenly blocked or diverted by the recipients’ email providers. Here are some tips and best practices that you can follow:

- **Verify your domain**: This is the first and most important step to establish your identity and reputation as a legitimate sender. Verifying your domain means proving that you own it and that you have authorized Microsoft 365 to send email on your behalf. To verify your domain, you need to add some DNS records to your domain registrar’s website. These records include:

  - A TXT record for SPF (Sender Policy Framework), which specifies which servers are allowed to send email from your domain.
  - A CNAME record for DKIM (DomainKeys Identified Mail), which enables Microsoft 365 to digitally sign your outgoing messages with your domain name.
  - A TXT record for DMARC (Domain-based Message Authentication, Reporting, and Conformance), which tells other email providers how to handle messages from your domain that fail SPF or DKIM checks.

  These records help prevent spoofing and phishing attacks that use your domain name and improve your deliverability and trustworthiness as a sender. For more information, see \[Set up SPF in Office 365], \[Use DKIM to validate outbound email sent from your custom domain in Office 365], and \[Use DMARC to validate email in Office 365].

- **Avoid sending spam-like content**: Even if you verify your domain, your messages can still be flagged as spam if they contain content that resembles typical spam messages. Some examples of spam-like content are:

  - Misleading or deceptive subject lines or sender names.
  - Excessive use of punctuation, capitalization, or formatting.
  - Unsolicited or irrelevant offers, promotions, or requests.
  - Links or attachments that are not related to the message or that lead to suspicious websites or applications.
  - Requests for personal or financial information, such as passwords, bank account numbers, or credit card details.

  To avoid sending spam-like content, you should follow some basic guidelines for writing effective and professional email messages. For example, you should:

  - Use clear and concise subject lines that summarize the purpose of the message.
  - Use a recognizable and consistent sender name that matches your domain name.
  - Use appropriate tone, language, and style for your audience and context.
  - Provide relevant and useful information that meets the recipients’ needs and expectations.
  - Include only links or attachments that are necessary and trustworthy and that support the message content.
  - Respect the recipients’ privacy and security and never ask for sensitive information via email.

- **Maintain a good sender reputation**: Your sender reputation is a score that reflects how trustworthy you are as a sender based on various factors, such as your domain verification, your email volume and frequency, your bounce rate, your spam complaint rate, and your engagement rate. Your sender reputation affects how other email providers treat your messages and whether they deliver them to the inbox, the junk folder, or reject them altogether. To maintain a good sender reputation, you should:
  - Send email only to recipients who have opted in or given consent to receive email from you.
  - Segment your recipients based on their interests, preferences, and behaviors and send them relevant and personalized content.
  - Avoid sending too many or too few messages and find the optimal frequency and timing for your email campaigns.
  - Monitor your delivery reports and analytics and identify and fix any issues that affect your deliverability, such as bounces, blocks, or spam complaints.
  - Remove inactive or unresponsive recipients from your mailing list and keep it clean and up-to-date.

- **Test your email before sending**: Before you send your email to your recipients, you should test it to make sure that it looks good and works well across different devices, platforms, and email clients. You should also check if your email passes the spam filters of the most popular email providers, such as Gmail, Yahoo, Outlook.com, etc. You can use various tools and services to test your email, such as:
  - \[Litmus], which allows you to preview your email in over 90 email clients and devices, check your spam score, validate your links and images, and track your email performance.
  - \[Mail Tester], which allows you to send a test email to a temporary address and get a detailed report on how likely it is to be marked as spam by different email providers.
  - \[GlockApps], which allows you to test your email deliverability, spam score, authentication, reputation, and engagement across multiple email providers.

## Tips and examples of SPF records

- The record always starts with `v=spf1`, which indicates the version of SPF.
- The record can include one or more mechanisms, which are keywords or expressions that match a set of IP addresses or hostnames. For example, `a` matches the IP address of the domain, `mx` matches the IP addresses of the mail exchange servers for the domain, `ip4` and `ip6` match specific IPv4 and IPv6 addresses or ranges, and `include` references another SPF record from another domain.
- Each mechanism can be prefixed with a qualifier, which indicates the result of the SPF check if the mechanism matches. The qualifiers are `+` for pass, \`\` for fail, `~` for soft fail, and `?` for neutral. The default qualifier is `+`.
- The record usually ends with an `all` mechanism, which matches all IP addresses and specifies the default result if none of the previous mechanisms match. For example, `all` means that all other IP addresses are not authorized to send email from the domain, while `~all` means that they are not authorized but the result is only a soft fail.
- The record can also include modifiers, which are keywords that modify the behavior or output of the SPF check. For example, `redirect` replaces the current record with another one from another domain, and `exp` provides a URL for an explanation message in case of a fail result.

Here are some examples of SPF records with different syntax and values:

- `"v=spf1 -all"`: This record means that no IP address is authorized to send email from the domain. This is useful for domains that do not send any email at all.
- `"v=spf1 a -all"`: This record means that only the IP address of the domain is authorized to send email from the domain. This is useful for domains that have a single server that handles both web and email services.
- `"v=spf1 mx -all"`: This record means that only the IP addresses of the mail exchange servers for the domain are authorized to send email from the domain. This is useful for domains that have separate servers for web and email services.
- `"v=spf1 ip4:203.0.113.0/24 -all"`: This record means that only the IP addresses in the range 203.0.113.0 to 203.0.113.255 are authorized to send email from the domain. This is useful for domains that have a specific network of servers for email services.
- `"v=spf1 include:example.com -all"`: This record means that the IP addresses authorized to send email from the domain are the same as those authorized to send email from example.com. This is useful for domains that share email services with another domain.
- `"v=spf1 +a +mx ip4:203.0.113.0/24 include:example.com ~all"`: This record means that the IP addresses authorized to send email from the domain are those of the domain, those of the mail exchange servers for the domain, those in the range 203.0.113.0 to 203.0.113.255, and those authorized by example.com. All other IP addresses are not authorized but the result is only a soft fail.
- `"v=spf1 redirect=example.com"`: This record means that the SPF check for the domain is redirected to example.com, which means that the SPF record of example.com is used instead of this one.
- `"v=spf1 -all exp=http://example.com/spf-explanation.html"`: This record means that no IP address is authorized to send email from the domain, and if an IP address tries to do so, it will receive an explanation message from http://example.com/spf-explanation.html.

## Conclusion

Spam is a serious threat to email communication and collaboration. Microsoft 365 provides a comprehensive anti-spam solution that helps protect your organization from spam. However, you can also take some steps to prevent your email from being marked as spam by the recipients’ email providers. By verifying your domain, avoiding sending spam-like content, maintaining a good sender reputation, and testing your email before sending, you can improve your deliverability and trustworthiness as a sender and ensure that your messages reach the intended recipients.

---

![Dev Dispatch](./9x5aklqdjlp32k4xhu06.png)

If you enjoyed this blog post and want to learn more about C# development, you might be interested in subscribing to my bi-weekly newsletter called Dev Dispatch. By subscribing, you will get access to exclusive content, tips, and tricks, as well as updates on the latest news and trends in the development world. You will also be able to interact with me, and share your feedback and suggestions. To subscribe, simply navigate to https://buttondown.email/kasuken?tag=devto, enter your email address and click on the Subscribe button. You can unsubscribe at any time. Thank you for your support!
