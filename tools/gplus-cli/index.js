#!/usr/bin/env node
import inquirer from "inquirer";

async function main() {
  console.log("🌟 Welcome to APP_NAME CLI");

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [
        { name: "Initialize project", value: "init" },
        { name: "Start local services", value: "start" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);

  if (action === "init") {
    console.log("🚀 APP_NAME project initialized!");
  } else if (action === "start") {
    console.log("▶️ Starting local APP_NAME services...");
  } else {
    console.log("👋 Goodbye!");
    process.exit(0);
  }

  // Tekrar menüyü göster (opsiyonel)
  main();
}

main();
