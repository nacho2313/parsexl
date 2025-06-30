# Parsexl: Visualize and Debug Excel Formulas with Ease 📊✨

![GitHub Repo Size](https://img.shields.io/github/repo-size/nacho2313/parsexl)
![GitHub Issues](https://img.shields.io/github/issues/nacho2313/parsexl)
![GitHub License](https://img.shields.io/github/license/nacho2313/parsexl)

Welcome to **Parsexl**! This project allows you to visualize and debug Excel formulas using a live Abstract Syntax Tree (AST) viewer. With a custom Pratt parser at its core, Parsexl provides an intuitive way to explore the inner workings of Excel formulas. 

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [How It Works](#how-it-works)
6. [Contributing](#contributing)
7. [License](#license)
8. [Links](#links)

## Introduction

Excel is a powerful tool for data analysis, but its formulas can often be complex and difficult to debug. Parsexl aims to simplify this process by providing a live viewer that displays the structure of your formulas in real-time. This can help you identify errors and understand how different parts of your formula interact with each other.

## Features

- **Live AST Viewer**: Visualize your formulas as you type, with a clear representation of the structure.
- **Custom Pratt Parser**: Our parser efficiently handles various Excel formula components, ensuring accurate representation.
- **Syntax Highlighting**: Enjoy color-coded syntax highlighting to make your formulas easier to read.
- **React Integration**: Built with React, making it easy to integrate into existing applications.
- **TypeScript Support**: Enjoy type safety and improved developer experience.

## Installation

To get started with Parsexl, you need to clone the repository and install the dependencies. Follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/nacho2313/parsexl.git
   ```

2. Navigate to the project directory:
   ```bash
   cd parsexl
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

For the latest release, you can download it from [here](https://github.com/nacho2313/parsexl/releases). Make sure to execute the necessary files as instructed in the release notes.

## Usage

Using Parsexl is straightforward. Once you have the application running, you can input your Excel formulas into the designated text area. As you type, the live AST viewer will update to show the structure of your formula.

### Example

1. Input a simple formula:
   ```
   =SUM(A1:A10)
   ```

2. Observe the AST representation on the right side of the screen. Each component of the formula will be highlighted, making it easy to see how the formula is constructed.

## How It Works

### Abstract Syntax Tree (AST)

The AST is a tree representation of the syntactic structure of the formula. Each node in the tree represents a part of the formula, such as operators, functions, and references. 

### Pratt Parser

The Pratt parser is a powerful tool for parsing expressions. It uses a technique that allows for efficient handling of operator precedence and associativity. This makes it ideal for parsing complex Excel formulas.

### Visualization

The visualization component is built using React and leverages the Monaco Editor for syntax highlighting. The editor provides a rich text editing experience, making it easy to work with formulas.

## Contributing

We welcome contributions to Parsexl! If you have suggestions, bug fixes, or new features, please feel free to submit a pull request. 

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeature
   ```

3. Make your changes and commit them:
   ```bash
   git commit -m "Add Your Feature"
   ```

4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```

5. Create a pull request.

## License

Parsexl is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Links

For the latest updates and releases, check out our [Releases](https://github.com/nacho2313/parsexl/releases) section. Here, you can find the most recent versions and any additional files you need to download and execute.

Feel free to explore the repository and contribute to making Parsexl even better!