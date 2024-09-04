# Messaging API

## Overview

The **Messaging API** is a versatile service built using NestJS that allows users to register for messaging options such as Slack, Telegram, and email. Once registered, the service can send notifications and formatted emails to users when important events occur within an ERP system. The API is designed to operate independently of the ERP system, making it a flexible tool for various use cases.

## Features

- **User Registration:** Register users to messaging platforms (Slack, Telegram, Email).
- **Notification System:** Send notifications to users based on events triggered by an ERP system.
- **Email Formatting:** Send well-formatted emails to users based on event data.
- **ERP Independent:** Can operate as a standalone service, decoupled from the ERP system.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **MongoDB**: NoSQL database for storing user data and messaging logs.
- **Slack API**: For integrating with Slack messaging.
- **Telegram Bot API**: For integrating with Telegram messaging.
- **Nodemailer**: For sending emails via SMTP.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB
