---
{
    title: "Terraform: From Zero to Hero",
    description: "A guide to learning Terraform from scratch, including key concepts, setup, and workflow.",
    published: "2025-12-03",
    tags: ["terraform", "aws", "devops", "infrastructure-as-code"],
    license: "cc-by-4"
}
---

## 👋 Introduction

I’ve been doing software development for many years and have worn a few hats, often at the same time.  Over the last several years, I’ve been fortunate enough to dip into DevOps work as well.  I’ve seen how teams have implemented solutions in Azure, GCP, and AWS, and being able to jump in and help as well.

So when my latest job wanted the API I was developing hosted on AWS *and* provisioned with Terraform, I certainly was up to get the ball rolling.  I knew I’d have a learning curve ahead of me.  I’d tinkered with AWS in the past and seen Terraform setup at previous gigs, but I had never been the one to build a Terraform infrastructure from scratch.  This was the right kind of challenge.

In this age of AI, I’ve refined the mantra of “make it work, then make it right” to be more like:

**Make it work —> understand it —> then make it right.**

I already knew enough about AWS and Terraform to guide an AI assistant well enough.  But I also know myself well enough to admit that sometimes the best teacher is simply diving in, breaking things, and rebuilding things with intention.

When it comes to “vibe coding”, I tend to approach AI like a junior dev with me as the architect.  I feed the AI agent a small, well-defined problem, give it any additional context or patterns I can provide, review what is produced, and refine as needed.  Once the problem is solved (or solved well enough), I’ll start a brand new session with the AI agent for the next problem.

With that mindset, my goal here is to walk through the key concepts and my mental models that helped me learn Terraform.  I won’t dive into the ins and outs of AWS, permissions/authentication, or the like (I’ll offer up some broad strokes here and there in this article).  Instead, I’ll focus on the magic that is **Terraform** itself and how continuing to tinker with it has helped evolve my understanding of it.

---

## 💭 My Learning Process

I’ll start by talking through how I learned Terraform for myself, most to show that it’s completely okay to kick up plenty of dirt, make a mess, and refine as you go.

Full disclosure:  I use WebStorm and the Junie AI coding agent (plus a side window of whatever other AI tool I feel like chatting with so I don’t burn through all my credits).  There are plenty of fantastic tools out there these days, so certainly work with what you’re comfortable with even if it’s “unconventional” to others.

Within my Node.js project I was already working in, I simply kicked things off by asking my AI agent to help me setup an initial pass of Terraform files to deploy my API on AWS using ECS.  Once I had a baseline setup there (still very much a “mmhmm, I know a few of these words…” stage while looking through what was generated), I had a GitHub workflow spun up as well so I can take out multiple birds with one stone of getting Terraform setting up the AWS infrastructure.

This meant **a lot** of code commits pushed up to GitHub in order to get my workflows within GitHub Actions to work without error.  Eventually, though, I was able to get the API running and was able to access via the IP Address and port number.  Success!!

From there, I worked with my AI agent to add more functionality to my setup.

“Let’s get a nice, readable URL next.”

“Oh, we definitely need to make sure we setup the needed certificate so it’s an HTTPS url.”

“And what about scaling rules?”

And so on.  Slowly layering functionality really helped me understand how the AWS pieces fit together, even if some of the comprehension came *after* seeing it work first.  I’d get something deployed, then poke around the AWS UI to see how Terraform wired everything up.  That hands-on exploring filled in the mental gaps for me.

This chipping away also reinforced to me how truly powerful something like Terraform is.  Being able to programmatically spin up an entire infrastructure in minutes feels like magic, especially if you’ve ever done cloud setup manually like I have.  In past lives, I’ve set up a “dev” environment by hand, then “uat”, then “prod,” hoping my notes were accurate and I didn’t overlook some checkbox buried deep somewhere in the settings along the way.  After doing that enough times, Terraform feels like a superpower almost.

Granted, it takes a bit of elbow grease upfront.  But once I had my dev environment nailed down with Terraform, I was easily able to spin up any other environment with a few keystrokes, a triggered GitHub workflow, and waiting a few minutes.

So after I actually had a working URL, plus Terraform doing its thing reliably, I felt ready to step back and explore how others use these tools, adding that outside perspective to the hands-on experience I’d gained from jumping straight in.

---

## 🧠 What is Terraform?

The [Terraform website](https://developer.hashicorp.com/terraform/intro) is a great resource to dive a bit more into what it is, but essentially Terraform is an infrastructure-as-code (IaC) tool that allows you to define configuration files that let Terraform to create and manage resources on the provider/cloud-platform automatically.  And when used alongside with “state” (essentially the means for the Terraform configuration to know what infrastructure it has setup), updates to and tear-downs of the infrastructure can be painless and worry-free.

### 🙈 One Thing I Wish I Knew

As far as “state” goes, I think this is one of the big things I wish I understood before diving into Terraform.  Instead of worrying about not tripping over existing resources you’ve already setup when running Terraform, let Terraform track what it has already created and update/destroy accordingly as your configuration changes.  I initially was trying to be proactive and ensure things were configured in a way that the configuration itself accounted for existing items, when in fact Terraform already does this out of the box when it tracked its “state”.

> That being said, when running Terraform on something like AWS, definitely leverage a [Remote State](https://developer.hashicorp.com/terraform/language/state/remote) setup for the peace of mind of knowing your IaC will only touch the pieces and parts it has setup (leaving everything else alone).  That way when you re-run your Terraform workflow pipeline, it’ll just make the needed adjustments based off what it knows of what it has setup already thanks to the state already stored.
>

---

# 💨 Terraform - Quick Setup

We’ll run through a quick setup of what your Terraform infrastructure might look like for AWS (I’m sure much of the same principles apply for other cloud platforms).  Further along, I’ll elaborate a bit more of what things are doing in detail.  A lot of this assumes you know how to install the needed CLI (or know how to find out), but just in case, [here’s a link](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).

These files could honestly be named whatever you want, the Terraform CLI will simply look within the designated directory and review all the `.tf` files available and work from there.  Below are some conventional names to use, but feel free to be rebellious and unconventional if you don’t plan to maintain the code (just kidding).

## 📁 Project Structure

A simple Terraform project may look like this:

```
./terraform-demo
  ├── main.tf
  ├── variables.tf
  ├── outputs.tf
  ├── provider.tf
  └── backend.tf
```

---

## 🌍 provider.tf — Configuring AWS Provider

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
```

---

## 🗂️ backend.tf — Remote State (AWS S3 + DynamoDB)

Using remote state is best practice especially when working in a team. Here's an example configuration:

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "demo/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

### Required AWS Setup

You must separately create (ie, Terraform doesn’t automatically set this up in AWS):

- An S3 bucket (for state)
- A DynamoDB table (for state locking)

You can bootstrap these manually or with a one-time script.  But this must exist before successfully running `terraform init` down the road.

Something along the lines of this GitHub Action Workflow could be used to create the bucket and table:

```yaml
name: Setup Terraform Backend

on:
  push:
    branches:
      - main
    paths:
      - 'backend-setup/**' # Trigger only on changes in the backend-setup directory

env:
  AWS_REGION: us-east-1 # Specify your desired AWS region
  S3_BUCKET_NAME: my-terraform-state-bucket-unique-name # Replace with a unique S3 bucket name
  DYNAMODB_TABLE_NAME: my-terraform-lock-table # Replace with your desired DynamoDB table name

jobs:
  setup-backend:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Required for OIDC
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/GitHubActionsOIDC # Replace with your OIDC role ARN
          aws-region: ${{ env.AWS_REGION }}

      - name: Create S3 Bucket
        id: create-s3
        run: |
          aws s3api head-bucket --bucket ${{ env.S3_BUCKET_NAME }} || \
          aws s3api create-bucket \
            --bucket ${{ env.S3_BUCKET_NAME }} \
            --region ${{ env.AWS_REGION }} \
            --create-bucket-configuration LocationConstraint=${{ env.AWS_REGION }}
          aws s3api put-bucket-versioning --bucket ${{ env.S3_BUCKET_NAME }} --versioning-configuration Status=Enabled
          aws s3api put-bucket-encryption \
            --bucket ${{ env.S3_BUCKET_NAME }} \
            --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'

      - name: Create DynamoDB Table
        id: create-dynamodb
        run: |
          aws dynamodb describe-table --table-name ${{ env.DYNAMODB_TABLE_NAME }} || \
          aws dynamodb create-table \
            --table-name ${{ env.DYNAMODB_TABLE_NAME }} \
            --attribute-definitions AttributeName=LockID,AttributeType=S \
            --key-schema AttributeName=LockID,KeyType=HASH \
            --billing-mode PAY_PER_REQUEST \
            --region ${{ env.AWS_REGION }}
```

### Running Locally?

If you’re trying to run Terraform locally against your AWS account, you can actually use a local state while initially troubleshooting. Just setup your [`backend.tf`](http://backend.tf) file as (not including the “s3” information):

```hcl
terraform {
}
```

Just know that this state would simply be on your local machine, so you may want to destroy any infrastructure generated this way to avoid confusion later on, assuming you switch over to a remote state.

---

## 📦 main.tf — Example Infrastructure (EC2 Instance)

> I’m using EC2 here simply because it’s the cleanest minimal example.

In reality my real project uses ECS, load balancers, certificates, and scaling rules — but EC2 keeps the demo focused.
>

```hcl
resource "aws_instance" "demo" {
	ami = "ami-0c02fb55956c7d316" # Amazon Linux 2 (us-east-1)
	instance_type = "t2.micro"
	tags = {
		Name = "DemoInstance"
	}
}
```

---

## 🔧 variables.tf

```hcl
variable "aws_region" {
  default = "us-east-1"
}
```

---

## 📤 outputs.tf

```hcl
output "instance_id" {
	value = aws_instance.demo.id
}

output "public_ip" {
	value = aws_instance.demo.public_ip
}
```

---

## 💻 Terraform Commands to Know

Run these in your project directory:

### 1. Initialize

```
terraform init
```

Downloads providers, sets up backend, prepares the workspace.

### 2. See What Changes Will Happen

```
terraform plan
```

Shows the actions Terraform *would* take.

### 3. Apply the Infrastructure

```
terraform apply
```

Provision the resources on AWS.

### 4. Destroy Everything

```
terraform destroy
```

Cleans up all resources created.

---

## ⏳ Typical Workflow

1. Write/change `.tf` files
2. `terraform plan`
3. `terraform apply`
4. Repeat

---

## 💡 Tips

- Always use remote state for production projects.
- Keep variables and outputs organized.
- Split your Terraform into modules as things grow.
- Version-control everything.
- Review documentation if you need additional functionality.

---

## 🧩 What This Terraform Configuration Actually Creates

### **1. An EC2 Instance**

Defined in `main.tf`:

```hcl
resource "aws_instance" "demo" {
	ami           = "ami-0c02fb55956c7d316"
	instance_type = "t2.micro"
}
```

Terraform will create **one new EC2 instance** in the AWS region specified (default: `us-east-1`). It will be tagged `DemoInstance`. The outputs will show the instance ID and public IP.

### **2. Remote State Infrastructure (Pre-existing)**

The S3 bucket and DynamoDB table for backend state must already exist. Terraform will **not create these**. But since they should be in place, they are used for:

- Storing the Terraform state file
- Locking the state during operations

### **3. Outputs**

Terraform provides:

- `instance_id`: the AWS instance ID of the provisioned EC2 instance
- `public_ip`: the public IP of the instance

---

### Terraform Workflow: What Happens Behind the Scenes

1. **`terraform init`**: sets up provider, configures backend, prepares workspace (does not create resources)
2. **`terraform plan`**: compares desired configuration with existing resources and produces a plan
3. **`terraform apply`**: provisions the EC2 instance and updates the state in S3
4. **`terraform destroy`**: deletes the EC2 instance and updates the state

This makes it clear that the only resource Terraform creates is the **EC2 instance**. Backend resources (S3/DynamoDB) are pre-existing.

---

# 🧱 Terraform Workflow: What Happens Behind the Scenes

Here’s what Terraform actually *does* at each step.

---

### 🔄 **1. `terraform init`**

Terraform:

1. Reads all `.tf` files
2. Downloads the AWS provider plugin (`hashicorp/aws`)
3. Configures the S3 backend
    - Contacts AWS
    - Verifies S3 bucket exists
    - Verifies DynamoDB table exists
    - Sets up local state → remote state sync
4. Creates a `.terraform` directory that stores provider binaries

**Nothing is created in AWS yet.**

---

### 📘 **2. `terraform plan`**

Terraform performs:

1. Reads the desired configuration
2. Loads existing remote state
3. Queries AWS for real-world resources

   (in this case: “does this EC2 instance already exist?”)

4. Compares desired vs actual state
5. Produces a diff like:

```
+ create aws_instance.demo
```

This shows **what *will* happen**, but does not create anything yet.

---

### 🚀 **3. `terraform apply`**

Terraform now takes the plan and executes it:

### **Step-by-step actions Terraform performs**

1. Checks DynamoDB for lock
    - If free → creates a lock
2. Calls AWS EC2 API:
    - `RunInstances` request to launch the EC2 instance
3. Waits for the instance to reach `running` status
4. Refreshes real state by calling:
    - `DescribeInstances`
5. Writes new state to a local temp file
6. Uploads the new state to the S3 state bucket
7. Releases the DynamoDB lock
8. Prints outputs (in this case: `instance_id` and `public_ip`)

Now your AWS account actually **contains a new EC2 instance**.

---

### 💣 **4. `terraform destroy`**

Terraform performs cleanup based on state:

1. Compares configuration → state
2. Determines which resources Terraform owns
3. Issues deletion API calls (e.g., `TerminateInstances`)
4. Removes resources from the state file
5. Uploads updated state to S3

> Backend resources (S3 bucket/DynamoDB table) are never deleted by Terraform.
>

---

## Conclusion

### 🎯 Key Takeaways

- Terraform allows you to provision, manage, and tear down infrastructure reliably using configuration files.
- Understanding state is key.  It keeps Terraform aware of what it has created and manages changes safely.
- Combining Terraform with remote state backends (like S3 + DynamoDB) ensures collaboration and safety when working in teams or simply a means to safely allow Terraform to make adjustments.
- Hands-on, incremental experimentation can build faster understanding than reading docs alone.

### 🚀 Next Steps

- Try creating more AWS resources (like VPCs, security groups, or S3 buckets) with Terraform to expand your knowledge.
- Explore Terraform modules to reuse infrastructure patterns across multiple projects.
- Integrate Terraform with CI/CD pipelines for fully automated deployments. 🤌

---

### 🪄 Parting Thoughts

Terraform is magic.

Having manually setup infrastructures to now seeing a fully automated infrastructure setup just by setting up configuration files and letting a tool like Terraform take it from there, I honestly won’t implement an infrastructure without some sort of IaC tool going forward.  I’m sure I may be overly simplifying some things, but from what I’ve learned just by diving into it hands-on and such, each day I get a better understanding of how to best use it.  I certainly encourage anyone to just dive in, make a few mistakes, but you’ll learn more that way.  Hopefully some of the insights shared help you on your journey of learning something new or perhaps seeing a familiar thing in a different way.

---

## Resources

- [Terraform Docs](https://developer.hashicorp.com/terraform/docs) - office guide and tutorials
    - [Terraform CLI Install](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) - direct link to help with installation
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) - reference for all the AWS resources Terraform supports
- [Remote State Concepts](https://developer.hashicorp.com/terraform/language/state/remote) - deep dive on using S3/DynamoDB backends