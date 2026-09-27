# 🤝 Contributing to LLM Guard

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Style Guides](#style-guides)

---

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [your.email@example.com].

---

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](./README.md).

Before you ask a question, it is best to search for existing [Issues](https://github.com/YOUR_USERNAME/llm-guard/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/YOUR_USERNAME/llm-guard/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (Node.js, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

---

## I Want To Contribute

> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions.
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/YOUR_USERNAME/llm-guard/issues?q=label%3Abug).
- Collect information about the bug:
  - Stack trace (Traceback)
  - OS, Platform and Version (Windows, Linux, macOS, x64, ARM)
  - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
  - Possibly your input and the output
  - Can you reliably reproduce the issue?

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to [your.email@example.com].

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/YOUR_USERNAME/llm-guard/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags, and the issue will be left to be implemented by someone.

---

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for LLM Guard, **including completely new features and minor improvements to existing functionality**.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](./README.md) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/YOUR_USERNAME/llm-guard/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/YOUR_USERNAME/llm-guard/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to.
- **Explain why this enhancement would be useful** to most LLM Guard users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

---

### Your First Code Contribution

#### Step 1: Fork the Repository

Fork the repository by clicking on the 'Fork' button on the repository's page. This creates a copy of the code under your GitHub user account.

#### Step 2: Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/llm-guard.git
cd llm-guard
```

#### Step 3: Create a Branch

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation updates
- `refactor/` - for code refactoring
- `test/` - for adding tests

#### Step 4: Make Your Changes

Make your changes to the codebase. Please follow these guidelines:

- Write clean, readable code
- Add comments for complex logic
- Follow the existing code style
- Update documentation if needed
- Add tests if applicable

#### Step 5: Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Commit message format:
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

#### Step 6: Push to Your Fork

```bash
git push origin feature/your-feature-name
```

#### Step 7: Submit a Pull Request

Go to your fork on GitHub and click the "Compare & pull request" button. Fill out the pull request template with:

- A clear title
- A detailed description of your changes
- Any relevant issue numbers
- Screenshots if applicable

---

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` when improving the format/structure of the code
  - 🐎 `:racehorse:` when improving performance
  - 🚱 `:non-potable_water:` when plugging memory leaks
  - 📝 `:memo:` when writing docs
  - 🐛 `:bug:` when fixing a bug
  - 🚑 `:ambulance:` when critical hotfix
  - ✨ `:sparkles:` when introducing new features
  - 📈 `:chart_with_upwards_trend:` when adding analytics
  - 🔒 `:lock:` when dealing with security
  - 🔖 `:bookmark:` when releasing / version tags

### JavaScript/TypeScript Style Guide

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused
- Use const/let, never var

### CSS/Tailwind Style Guide

- Use Tailwind utility classes
- Follow existing naming conventions
- Keep components modular
- Use semantic class names when needed
- Avoid inline styles

### Documentation Style Guide

- Use Markdown for all documentation
- Include code examples where helpful
- Keep language clear and concise
- Update README when adding features
- Add comments to complex code

---

## 🎉 Thank You!

Your contributions to open source, no matter how small, make a difference. We appreciate your help in making LLM Guard better for everyone!

---

## 📞 Questions?

If you have any questions, feel free to:

- Open an [issue](https://github.com/YOUR_USERNAME/llm-guard/issues)
- Reach out via [email](mailto:your.email@example.com)
- Join our [Discussions](https://github.com/YOUR_USERNAME/llm-guard/discussions)

---

**Happy contributing! 🚀**
