---
{
    title: "What I Did When I Inherited Bad Tech",
    description: "How I helped turn around a struggling engineering team by rethinking our approach to development.",
    published: "2025-11-24T13:45:00.284Z",
    tags: ['leadership', 'opinion'],
    license: 'cc-by-4',
    order: 2
}
---

During a kickoff call with PDRT's recruiter, they had mentioned a strong emphasis on mentorship. Once I had joined the company, I found out why:

They had two junior frontend engineers on staff, but their sole senior engineer on the frontend left within a few meager months after they had joined. The search for a new frontend lead had taken the company some time — half a year — and, up until this point, the juniors were left with mostly high-level tasks that did little to move the needle on business needs.

Moreover, it was clear one of PDRT's larger projects was left in a rough state. It was rebuilt a number of times and — from what I was told was due to time constraints — was built upon a shaky foundation from a previous rewrite while still missing many features an earlier iteration had.

It was clear they needed someone to come in and help mitigate the problems set forth.

I'm not sure about you, but this led me to face a number of questions at the time:

1) Does this project _yet_ need another rewrite if the foundation is unstable?
2) If I do initiate another rewrite, how can I manage to build out new features at the same with such a small team?
3) Should I prioritize the development work or skills up-leveling of the junior engineers?

In the end, I decided that the following answers made the most sense:

1) Yes; the user experience was sufficiently flawed that it required some level of architecture shift to solve.
2) Immense code reuse.
3) Yes. Both? Let's do both.

------

The thing about rewrites is that they're _expensive_. Not only is there downtime for your dev team while they work on the new codebase but in my time I've found that every project requires some level of work to be done in the old codebase during this time. If your older codebase doesn't see much usage, you may likely find a majority of your time being able to focus on the new product. However, if your existing infrastructure sees a bit of usage that you're unable to halt entirely, you're mandated to bifurcate your attention between the old and the new.

This split attention may not be bad if you have enough resources to enable supporting both products, but at PDRT we joked about needing at least 5x our team's size the entire time I was there.

While this might seem like an impossible task, there is a third option: Incremental migration.

See, while restarting development may be prohibitively expensive, you can often convince management to allow cycles of "new" and "old" development. While this might sound like the same problem as before but with longer lead cycles, there's a trick: You don't split the "old" and "new" code into different codebases or even projects — you merge them into the same product.

This can be done in a number of ways:

- A/B delivery systems.
- View embedding interoperability.
- Page-by-page tech stack switching.
- Microservices.

However it's done, as the new and old codebases communicate with one-another you can slowly phase out the old for the new while retaining the ability to switch back to older features as-needed.

Whether you're writing a website (where incremental migration is arguably the easiest conceptually due to shared language primitives), a low-level project (where Googling "FFI" might unlock some valuable insights for incremental migration) or a mobile app, I've found incremental migration to be the best option forward.

-----

Now that we had a strategy for how to solve problem #1, problem #2 crept up. After all, while incremental migration allowed for more time to be spent on the old codebase, there were still:

- Requirements to have iOS and Android builds
- The need to maintaining multiple variations of our mobile app for different clients
- Asks to build out a website from our main client's mobile app
- Growing needs for reusable components across multiple products

To solve _this_, I realized that we could [alley-oop](https://en.wikipedia.org/wiki/Alley-oop) successes from our primary client's mobile app into many other projects: Reusing code as much as humanly possible.

Now, while a single version of this app this could be done with entirely separate codebases:

<!-- ::start:filetree -->
- `android_app/`
- `ios_app/`
- `website/`
<!-- ::end:filetree -->

It's easy to see how this could get out of hand rather quickly after adding even a single `Card` element that needs to be used in each project:

<!-- ::start:filetree -->
- `android_app/`
    - `src/`
        - `Card.kt`
        - `App.kt`
        - `...`
- `ios_app/`
    - `src/`
        - `Card.swift`
        - `App.swift`
        - `...`
- `website/`
    - `src/`
        - `Card.tsx`
        - `App.tsx`
        - `...`
<!-- ::end:filetree -->

This layout is made even more complicated by the need to maintain multiple variations of publishable apps on the respective app stores:

<!-- ::start:filetree -->
- `android_app_a/`
    - `src/`
        - `Card.kt`
        - `App.kt`
        - `...`
- `ios_app_a/`
    - `src/`
        - `Card.swift`
        - `App.swift`
        - `...`
- `android_app_b/`
    - `src/`
        - `Card.kt`
        - `App.kt`
        - `...`
- `ios_app_b/`
    - `src/`
        - `Card.swift`
        - `App.swift`
        - `...`
- `android_app_c/`
    - `src/`
        - `Card.kt`
        - `App.kt`
        - `...`
- `ios_app_c/`
    - `src/`
        - `Card.swift`
        - `App.swift`
        - `...`
- `website/`
    - `src/`
        - `Card.tsx`
        - `App.tsx`
        - `...`
<!-- ::end:filetree -->

Clearly, we needed a way to reuse code between mobile apps; bonus points if it enabled code reuse from the website also. We resolved ourselves on using web-technologies with the ability to compile down to mobile views.

This meant that instead of requiring our frontend team to know a number of programming languages:

- Java (older Android development)
-.kt (modern Android development)
- Objective-C (older iOS development)
- Swift (modern iOS development)
- JavaScript (web)
- TypeScript (web)
- HTML (web)
- CSS (web)

As well as any number of tooling built on top of each platform, we could reduce that to:

- JavaScript (web)
- TypeScript (web)
- HTML (web)
- CSS (web)

With a single toolkit across projects.

----------

While this decision to use web technologies did a lot to help reduce our learning (and maintenance) curve:

<!-- ::start:filetree -->
- `mobile_app_a/`
    - `src/`
        - `Card.tsx`
        - `App.tsx`
        - `...`
- `mobile_app_b/`
    - `src/`
        - `Card.tsx`
        - `App.tsx`
        - `...`
- `mobile_app_c/`
    - `src/`
        - `Card.tsx`
        - `App.tsx`
        - `...`
- `website/`
    - `src/`
        - `Card.tsx`
        - `App.tsx`
        - `...`
<!-- ::end:filetree -->

It did little to reduce the frequency of which we needed to copy+paste code between projects. Moreover, even if we could reasonably copy+paste code between projects to sync their states, it became challenging to know what was the most recent version of a given piece of code.

> Did I update app A?

> Did app B's version get done first or did app C's?

> Which parts of A or B did I need to merge in to C?

These questions became a communication challenge, especially with less experienced engineers on our team that may have been less familiar with tools like `git blame`.

To solve _this_ problem, I borrowed a slightly different philosophy: Why use multiple places to store multiple code projects when you can consolidate all of your projects to a single codebase?

<!-- ::start:filetree -->
- `apps/`
    - `mobile_app_a/`
        - `src/`
            - `Card.tsx`
            - `App.tsx`
            - `...`
    - `mobile_app_b/`
        - `src/`
            - `Card.tsx`
            - `App.tsx`
            - `...`
    - `mobile_app_c/`
        - `src/`
            - `Card.tsx`
            - `App.tsx`
            - `...`
    - `website/`
        - `src/`
            - `Card.tsx`
            - `App.tsx`
            - `...`
<!-- ::end:filetree -->

This practice is used widely in larger organizations and is called a "monorepo". This idea might sound obtuse, but comes with a number of benefits:

- Single choke-point of communication

  Forces changes to be made to a single location, enabling better insights across teams and team members.

- Easier access for groups of developers

  No need to check if a user has permissions to the codebase for app `A`, `B` **and** `C`.

- Holistic view of the entire system

  This makes it easier to understand how different parts of the codebase interact with each other.

- Better code sharing patterns

It's that last point that really stuck out to us: What if you could take that `Card.tsx` file and use it verbatim across all of the projects?

<!-- ::start:filetree -->
- `./`
    - `shared/`
        - `src/`
            - `Card.tsx`
    - `mobile_app_a/`
        - `src/`
            - `App.tsx`
            - `...`
    - `mobile_app_b/`
        - `src/`
            - `App.tsx`
            - `...`
    - `mobile_app_c/`
        - `src/`
            - `App.tsx`
            - `...`
    - `website/`
        - `src/`
            - `App.tsx`
            - `...`
<!-- ::end:filetree -->


While this is technically possible with multiple distinct codebases, it's comparatively trivial with a monorepo!

This meant that, pragmatically, we only had to maintain a single shared codebase with multiple adapters for their respective platforms and branding along the way; a huge win.

-----

Between the incremental migration and moving to a monorepo, we had out work cut out for us. Luckily, there was suddenly a huge influx of low-hanging fruit that needed addressing. I say "luckily", because its environments like that where I've found junior engineers to thrive.

When provided an opportunity to teach: I took it. I held regular 1:1s to schedule time with them, did frequent "lunch and learn"s to train on the tooling we'd be adapting next, and even built out scaffolding for them to reference on their own time. They did exceptionally at these tasks; making sure to regularly check-in when needed, but otherwise forging their path into the belly of this beast we were set on conquering.

> While I wish I could take all of the credit for that, it's truly their willingness to learn and execute that allowed us to move forward as quickly as we had. I was genuinely so impressed with their abilities and that's not just lip-service.

This, alone, came with a number of lessons for myself:

- It's extremely important to budget time for training.

  While it's often easy to overlook the need to assign tasks for "do research", these often end up being the most important in the grand scheme of things. Doing so provides insights into what your team is doing in a given moment; without them your team may find themselves in an endless game of "task whackamole" where they feel the need to ignore training in favor of executing.

- Having code to reference is intensely more helpful than speaking at a high-level about concepts.

  While this may not be universally true (some adapt to concepts faster than usage), I've seen time-and-time again how referential material is more helpful than spoken concepts. By having something to look back towards, your mentees can:

  - Execute through copying the reference material.
  - Look up unknowns after-the-fact without having to admit to a knowledge gap.
  - Notice discrepancies between how things _can_ be done and how they _should_ be done.

- Code review ended up being incredibly valuable teaching lessons.

  Not only did they help enforce a standard for code quality, but it allowed you to point out better ways of doing things subjectively. This wasn't a one-way exercise, either. Instead, I enforced the requirement that "all code must require at least one additional reviewer before being merged" for everyone on the team; myself included.

  This helped the juniors feel more empowered (and encouraged, even) to share their own knowledge, fact-check my work, and learn from it all.

------

> "This is a good outline of the technical decision-making matrix, but what was the end result for the business?"

The rewrite was completed within the first six months, the website within the first year, and the primary client's app saw an increase of usage by 350%.

As it turns out, the app was being broadly replaced in-house by our client; not by tech but instead by more antiquated methodologies that slowed down their pipeline but was more reliable in the short term. While I don't have the insights into how things went for our client after-the-fact, I'd assume that it drastically improved their time-to-execution.

Within those months of delivery, I learned a lot:

- How incremental migrations could lead to tangible organizational wins and enable a more stable path for the future.
- How bad tech can stagnate usage when the root problems are left unaddressed.
- How technical organization can lead to better collaboration.
