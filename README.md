# Passport Uploader

**Passport Uploader** is a web application built using React, allowing users to upload passport images for processing. The app integrates with AWS services, including AWS Lambda, S3, and Textract, to handle image uploads, storage, and document text extraction.

**Demo** Hosted via aws amplify: https://main.d3lbmmwgezu1ng.amplifyapp.com/

## Features

- **User-friendly Image Upload**: Simple and intuitive interface to upload passport images.
- **Integration with AWS**: Leverages AWS Lambda, S3, and Textract to handle image uploads and process documents.
- **CORS Support**: Allows frontend to securely interact with backend services hosted on AWS.
- **Environment-specific Configuration**: Easy to manage configuration for different deployment environments using AWS Amplify.

## Tech Stack

- **Frontend**: React.js, Axios, HTML/CSS
- **Backend**: AWS Lambda (Node.js), API Gateway, S3, Textract
- **Deployment**: AWS Amplify for frontend hosting and backend services
- **Authentication (optional)**: AWS Cognito (can be added for user authentication)

## Setup

### Prerequisites

- Node.js and npm (or yarn) installed
- AWS Amplify CLI for deployment (if deploying to AWS)
- AWS account and API credentials for AWS services (Lambda, S3, Textract)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/passport-uploader.git
   cd passport-uploader
