Would love to contribute to @codling/network?

Awesome! We are not very organized yet. We don't have a plan or a roadmap. There are different ways you can contribute, all of which are valuable. Here's few guidelines that should help you as you prepare
your contribution.

## Initial steps

Before you start working on a contribution, create an issue describing what you want to build. It's possible someone else is already working on something similar, or perhaps there is a reason that feature isn't implemented. The maintainer will point you in the right direction.

<!-- ## Submitting a Pull Request

- Fork the repo
- Clone your forked repository: `git clone git@github.com:{your_username}/codling.git`
- Enter the codling directory: `cd codling`
- Create a new branch off the `main` branch: `git checkout -b your-feature-name`
- Implement your contributions (see the Development section for more information)
- Push your branch to the repo: `git push origin your-feature-name`
- Go to https://github.com/Olencki-Development/codling/compare and select the branch you just pushed in the "compare:" dropdown
- Submit the PR. The maintainer will follow up ASAP. -->

## Development

The following steps will get you setup to contribute changes to this repo:

1. Fork this repo.

2. Clone your forked repo: `git clone git@github.com:{your_username}/codling.git`

3. Run `npm i` to install dependencies.

4. Start playing with the code! 

### Commands

**`npm run build`**

- deletes `dist` and re-compiles `src` to `dist`

**`npm test`**

- runs all mocha tests

### Tests

Zod uses mocha for testing. After implementing your contribution, write tests for it. Just create a new file under `src/` or add additional tests to the appropriate existing file.

Before submitting your PR, run `npm test` to make sure there are no (unintended) breaking changes.

### Documentation

The @codling/network documentation lives in the README.md and inline on methods. Be sure to document any API changes you implement.

## License

By contributing your code to the @codling/network GitHub repository, you agree to
license your contribution under the MIT license.