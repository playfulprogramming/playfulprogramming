---
{
title: "Securing Secrets in the Age of GitOps",
published: "2023-10-27T09:07:21Z",
edited: "2023-11-04T18:01:50Z",
tags: ["kubernetes", "security", "git", "cloud"],
description: "Kubernetes and GitOps offer a powerful way to manage your infrastructure and applications. However,...",
originalLink: "https://www.davideimola.dev/blog/securing-secrets-in-the-gitops-era",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Kubernetes and GitOps offer a powerful way to manage your infrastructure and applications. However, when it comes to securing sensitive information like passwords, tokens, and certificates, challenges arise. In this article, we'll explore different methods to secure secrets in the GitOps era and how to seamlessly integrate them into your workflows.

## The Power of Kubernetes Secrets

Kubernetes provides a dedicated solution for safeguarding sensitive data: Secrets. These are Kubernetes objects designed to securely store information like passwords, OAuth tokens, and SSH keys. Using Secrets is a safer and more versatile approach compared to embedding sensitive data directly into Pod definitions or container images.

But, as powerful as Secrets are, there's a significant challenge when it comes to managing them within a GitOps workflow.

## The GitOps Conundrum

GitOps revolves around using Git as the single source of truth for declarative infrastructure and applications. With Git at the heart of your delivery pipelines, developers can accelerate application deployments and streamline operations tasks in Kubernetes through pull requests.

However, when it comes to secrets, things get complicated. Secrets can't be stored directly in a Git repository because the data isn't encrypted; it's merely encoded in `base64`. Here's an example:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
  namespace: default
data:
  foo: YmFy
```

To highlight the security issue with this approach, let's decode the data:

```bash
$ echo YmFy | base64 -d
bar
```

As you can see, if someone gains access to the Git repository, they can effortlessly decode the data and compromise the secret.

## Introducing Sealed Secrets

The solution to this problem is Sealed Secrets, a Kubernetes Custom Resource Definition Controller. It enables the encryption of Secrets, allowing you to store them in Git repositories safely. A Sealed Secret is shareable, even in public repositories, and can be given to colleagues, all while remaining impenetrable. Only the controller running in the target cluster can decrypt the Sealed Secret.

Using Sealed Secrets is straightforward. First, install the controller in your cluster using a Helm chart:

```bash
$ helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
$ helm install sealed-secrets sealed-secrets/sealed-secrets
```

After installation, you can use the `kubeseal` CLI to retrieve the public key and encrypt your secrets with it:

```bash
# Retrieve the public key
$ kubeseal --fetch-cert --controller-namespace=sealed-secrets --controller-name=sealed-secrets > pub-cert.pem

# Encrypt a secret
$ kubeseal --cert=pub-cert.pem --format=yaml < mysecret.yaml > mysealedsecret.yaml
```

The beauty of Sealed Secrets is that you can store the sealed secret in a Git repository and apply it to the cluster. The controller will decrypt the secret, creating the original Secret without requiring any changes to your app's Deployment.

## Exploring Secrets Managers

Another approach for managing secrets in a GitOps workflow is using a Secrets Manager. These tools offer secure storage and management of secrets and come with numerous features, including encryption, access control, auditing, secret rotation, and more. Notable examples include:

- [HashiCorp Vault](https://www.vaultproject.io/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)

While Secrets Managers offer robust security, they come with certain drawbacks, such as not being Kubernetes-native, a steep learning curve, costs (except for HashiCorp Vault's open-source version), and complex installation and maintenance.

## Bridging the Gap with Secret Store CSI Driver

To incorporate a Secrets Manager seamlessly into your GitOps workflow, consider using the Secret Store CSI Driver. It's a Kubernetes CSI driver that allows you to store and manage secrets in Kubernetes using your preferred Secrets Manager. This Kubernetes-native solution is easy to install and maintain, free, and open source. It supports a variety of Secrets Managers through provider-specific modules:

- [Vault Provider](https://github.com/hashicorp/secrets-store-csi-driver-provider-vault)
- [Azure Provider](https://azure.github.io/secrets-store-csi-driver-provider-azure/)
- [GCP Provider](https://github.com/GoogleCloudPlatform/secrets-store-csi-driver-provider-gcp)
- [AWS Provider](https://github.com/aws/secrets-store-csi-driver-provider-aws)

For detailed guidance on implementing these providers, refer to the [documentation](https://secrets-store-csi-driver.sigs.k8s.io/getting-started/getting-started).

## Leveraging SDKs

Alternatively, you can integrate a Secrets Manager into your GitOps workflow by using SDKs provided by the Secrets Manager. These SDKs are available for various programming languages and can be incorporated into your application code to retrieve secrets. This approach offers flexibility but comes with the need to modify application code, manage SDKs within the application, and control access to the Secrets Manager.

## Making the Right Choice

In this post, we've explored multiple methods for securing secrets in a GitOps workflow. The decision ultimately rests with you, as you choose the solution that best aligns with your specific needs. However, it's crucial to prioritize security in your decision-making process. Choose wisely, and ensure your secrets remain safe and sound.
