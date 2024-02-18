

# Code Editor with Zip File Handling 

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the development server using `npm start`.
4. Open the application in your browser at http://localhost:3000.

## Technical Stack

The project is built using the following technologies and tools:

- Frontend:
    - React.js: JavaScript library for building user interfaces.
    - TypeScript: Superset of JavaScript that adds static typing and other features.
    - Create React App (CRA): using CLI CRA to create project by default.
- Styling: 
    - CSS modules: A technique for achieving local scope for CSS style.
- State Management: 
    - Redux Toolkit: Manage application state in a single global store.
    - React Hooks (useState, useEffect): Used for managing local component state within functional components.
- Other libraries: 
    - Monaco Editor: A browser-based code editor from https://github.com/microsoft/monaco-editor.
    - React App Rewire: Using for support project works with Monaco webpack plugin.
    - JSZip: JavaScript library that enables to create, read, and manipulate ZIP files.
    - React Icons: JavaScript library includes popular icons for building UI.

## Architecture Overview

- components: Contains React components organized by feature or functionality.
- hooks: Contains custom React hooks used to encapsulate logic and behavior that can be reused across components.
- utils: Contains utility functions and helper modules used across the application.
- stores: Contains modules responsible for managing application state. This project uses Redux for state management, with stores organized into slices using Redux Toolkit. 
- types: Contains TypeScript type definitions used throughout the project. 

## Design and functional description

- Toolbars: At the left top, there 2 buttons:
    - Upload Button:  allows users to upload a file (zip file)
    - Download Button: after change / update file in editor, the button is enabled to allow user download file zip again.
- File Tree: At the left side, the contents inside the zip file are displayed as a tree.
    - User can drag-drop file in file tree to upload the new zip file (because the top toolbar is small so I decide user can drag-drop action here).
    - User can add/delete file in the file tree by hovering the file - the button add / delete will be displayed.

- Tabs: At the right top, there are tabs including all the zip files user uploaded, files in the tab can be closed.
- Main screen: User can view the contents from zip file in here. Base on type file, user can view editor or media (images / video / audio)
    - Editor: Allows user edit / change content. If there are changes to a file, the `Save Update` button at the bottom is enabled to save all the changes. User can also press `Ctrl(cmd) + S` from keyboard to save the file changes. The language of each file will be display with different highlight / syntax depends on type file to edit in Monaco Editor.
    - Media: With binary file such as images/video/audio, the content will be shown just for viewing - user can see picture, video or music. I determine the file is binary base on extension of its.
