![Carioca](packages/carioca-test-app/src/logo.png)

# Carioca

![Tests](https://img.shields.io/github/workflow/status/cereallarceny/carioca/Tests)
![Coverage](https://img.shields.io/codecov/c/github/cereallarceny/carioca)
![License](https://img.shields.io/github/license/cereallarceny/carioca)
![Version](https://img.shields.io/github/lerna-json/v/cereallarceny/carioca)

> Sit back, drink a caipirinha, vai ficar tudo bem!

A starter project that gives you everything you need to start building great looking websites and web applications.

- :raised_hands: Zero-config development for React web applications
- :rocket: Full support for SPA (single-page applications) or SSR (server-side rendered) applications
- :couplekiss: Support for both Typescript and Javascript
- :see_no_evil: Built-in ESLint and Prettier for code formatting suggestions
- :fire: Full hot-module replacement with error overlays in development
- :thumbsup: Never worry about configuring Webpack for local development, builds, or deployments
- :muscle: Write in the latest Javascript (we support up to ES2020)
- TODO: Write better features section

[Skip to installation instructions](#installation)

## Why do I need this?

There's no shortage of generator projects out there! Two of the most popular are [Create React App](https://create-react-app.dev/) for single-page applications and [Razzle](https://github.com/jaredpalmer/razzle/) for server-rendered applications, but of course, there are many others. Carioca isn't special, but it is simple. Here's a few things that make this project a little different:

- **Carioca supports both single-page applications (SPA's) and server-side rendering (SSR).** Create React App has made it very clear that they never have any intention of supporting SSR and directly tell you to use Razzle or Next.js to solve this purpose. Razzle also supports for SPA's and SSR.
- **Carioca is actively maintained.** Razzle is not - at least the original author has loosely handed over development to a few other contributors. No shame there, that's the way open-source development goes. However, I'm paid to do only open-source development and I use Carioca in all of my projects (most notably [OpenMined](https://openmined.org) uses Carioca for all of its web applications). I'm going to be maintaining this for a while.
- **Carioca doesn't tie your builds to specific development environments.** Razzle does. When you build, you're building for production. You can't build for development, which I find somewhat annoying when I find descreapancies between my development build using HMR and the final compiled build. It sucks to have to do that testing against production data - not cool!
- **Carioca is opinionated.** I think you'll like Carioca's opinions. There are a few, but not too many to be obnoxious. I'm not interested in supporting every possible configuration of a React application, but I'm always open to PR's for new functionality. Razzle suffered from too much code complexity, not enough internal documentation to follow how things work, and conflicting dependencies across projects. Not here, we're gonna keep it simple. We presume you're going to use React, React Router, and Jest, but we're not going to give you so many confiruation options that makes Carioca difficult to maintain.
- **Carioca is very well documented.** The entire codebase should read like a book and virtually every line in the project is well-explained so that you have context to follow along.
- **Carioca support service workers and PWA's.** Let us handle all that Webpack and Workbox nonsense for you - ain't no thang.
- **Carioca supports custom templates.** What do you do every time you run `npx create-react-app`? You delete all the crap you don't need, remove all the styles, and spinning logos. Nonsense! With Carioca, we support your own custom templates so that whenever you start a new project it follows your project structure - not what I think is best for you.
- **Carioca support smart SEO defaults.** One of the opinions we've determined for you is how to handle SEO `<meta>` tags. Let's be honest, you don't like doing this anyhow. SEO is notoriously hard to implement on the server-side, but our reusable `<Page>` component make this stupid simple. If you really want to extend it to support your own tags, go for it!
- **Carioca supports internationalization by default.** One of the last opinions we have is that websites should be built for the entire world to use. While it's not a requirement for your website to support more than one language, we've create some smart internationalization defaults so that its one less thing you need to think about. Considering internationalization is one of the hardest things I've come across in writing websites. Next.js is notorious for having internalization hiccups like adding the locale to the main `<html>` tag of the page... silliness.
- **Carioca supports multiple domain deployment by default.** Speaking of internationalization, are you deploying multiple versions to multiple domains? I've been there, super tough. Carioca has support for multi-domain deployment combined with internationalization.

## Installation

### Creating a new project

```bash
npx @carioca/generator my-app
cd my-app
```

Once you've scaffolded your new web application you can run:

- `yarn dev` (or `npm run dev`) to start the development server
- `yarn build` (or `npm run build`) to build your application
- `yarn test` (or `npm run test`) to test your application
- `yarn start` (or `npm run start`) to start your application (must run the `build` command first)

[See the CLI documentation for more command options](#cli)

### Adding to an existing project

Using Yarn:

```bash
yarn add @carioca/scripts
```

Using NPM:

```bash
npm install @carioca/scripts
```

From there, you can run any of the following commands:

`carioca dev` - Runs a live-reload server for local development
`carioca build` - Builds your application
`carioca test` - Runs the Jest test suite
`carioca start` - Starts your build application

[See the CLI documentation for more command options](#cli)

## CLI

TODO: Insert CLI options here

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests and documentation as appropriate. PR's without proper tests and documentation will not be accepted - period.

### Folder structure

Inside of the `packages` folder sit all of the various projects in the carioca ecosystem. Here's a description of what each project does:

`generator` - A CLI to generate a full app when the user is starting from scratch (think of this as the equivalent to `npx create-react-app my-app`). This is deployed to NPM as `@carioca/generator`.
`scripts` - A CLI to run the various `build`, `dev`, `test`, and `start` functions that all implementers will need to call. If you're familiar with `react-scripts`, this is carica's equivalent project. This is deployed to NPM as `@carioca/scripts`.
`server` - A sample server and some helper functions to make building the server portion of SSR a little easier. This is deployed to NPM as `@carioca/server`.
`test-app` - A test application that we use to test everything. It has local dependencies to `scripts` and `server` to make local development easier. This is not deployed to NPM.
`utils` - A project to help organize all shared code between the other modules. This is not deployed to NPM.

### Setting up the development environment

To get started, simply run `yarn bootstrap`. This will use Lerna to install all the appropriate dependencies and get your project set up.

If you need to reset this environment to test additional functionality you've created, run `yarn reset`, which will clean up all the dependencies, remove all the `node_modules` folders, and then run `yarn bootstrap` itself.

### Local development workflow

If you make a change to the `generators`, `scripts`, `server`, or `utils` packages, then your workflow will look something like this:

1. Run the initial `yarn bootstrap` command
2. Make a change in some file - do your work here!
3. **From the root of the project**, run `yarn reset`
4. \*\*From the `packages/carioca-test-app` folder, run the command that will trigger your change (`yarn dev`, `yarn build`, `yarn test`, `yarn start`, etc.)
5. If you need to fix something, go back to step 2

If you want to make a change to the `test-app` itself, you generally don't need to run `yarn reset` every time since the dependencies are already wired together locally.

### Testing

You can run the test suite across all our projects by running `yarn test` from the root of the project.

## Acknowledgements

No doubt, this project shares about 80% of its logical inspiration from [Razzle](https://github.com/jaredpalmer/razzle/). However, this library has become quite bloated in my opinion, and is no longer maintained actively by Jared Palmer. I wanted a simpler, more opinionated library for abstracting away build concerns for building SSR and SPA-based web applications.

I also internally forked [universal-hot-loader](https://github.com/yusinto/universal-hot-reload), which assists in serving our development builds (SSR and SPA) via HMR. This work is notoriously difficult, and is only made harder when you're running multiple, simultaneous Webpack builds, and proxying requests across ports - yuck. The project seems to have died a natural death, and I needed some additional modifications, so... "fork it". :wink:

## License

[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)
