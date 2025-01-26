---
{
    title: "Mongoose to Postman Converter: Simplifying API Development",
    description: "A Visual Studio Code extension that converts Mongoose schemas into Postman-compatible JSON, generating realistic test data with AI-powered automation.",
    published: '2025-01-26T00:00:00.000Z',
    tags: ['mongoose', 'postman', 'api development', 'vscode extension'],
    license: 'cc-by-nc-sa-4',
    originalLink: 'https://bamacharan.hashnode.dev/mongoose-to-postman-converter'
}
---

# Mongoose to Postman Converter: Simplifying Your API Development

## Overview

The Mongoose to Postman Converter is a free Visual Studio Code extension designed to streamline API development by converting Mongoose schemas into Postman-compatible JSON data.

## Features

- **Right-Click Conversion**: Easily convert Mongoose schemas to Postman-ready JSON
- **AI-Powered Data Generation**: Produces context-aware and realistic sample data
- **Time-Saving**: Eliminates manual sample data creation

## Installation

1. Open Visual Studio Code
2. Navigate to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Mongoose to Postman Converter"
4. Click **Install**

## Usage

1. Open a file with your Mongoose schema
2. Select the schema code
3. Right-click and choose `Convert to Postman Raw`
4. View converted JSON in a new editor tab

## Demo Video
<video width="640" height="360" controls>
  <source src="./mongooseToSchema.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Example

### Input (Mongoose Schema)
```javascript
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 18, max: 100 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```
### Output (Postman-ready JSON)
```javascript
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "age": 30,
  "isActive": true,
  "createdAt": "2023-08-15T10:30:00Z"
}
```
# Conclusion
The Mongoose to Postman Converter simplifies API development with its user-friendly functionality and automatic data generation, making the testing process more efficient and straightforward.