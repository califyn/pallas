# Pallas, the Athemath internal website

This is an internal website to manage logistics for [https://athemath.org](Athemath). It is hosted at https://pallas.athemath.org.

## Overview

Pallas is an integrated system that will handle most of, if not all, of student- and staff-facing logistics (i.e., pretty much everything except our fundraising and sponsorships.) Along with an interactive **online portal**, it will also be integrated with our email system through a dedicated email address, our Discord, and our Zoom Rooms.

Pallas is currently in an early stage of development. A first version should be complete and usable around August 2022.

### Major features (implemented)

#### Easy, secure account creation

Applicants are able to create accounts on Pallas to manage their applications, and depending on the account's access level, are able to access varying amounts of functionality on the online portal. Accounts currently support standard functions like changing the contact email and resetting password.

#### Creating and managing groups

Student-level users and above are allowed to create **groups** with other users, which can be used for classes, student interest groups, contest teams, and more. Eventually, groups will support **tasks** and **events** that allow the many different groups within Athemath to coordinate their activities.

#### Email integration

Pallas has the ability to send automatically generated emails through the [https://developers.google.com/gmail/api](Gmail API), as Athemath email uses the GSuite.

### Major features (to-be-implemented)

#### Task creation

Tasks can be assigned to groups. Upon each member's completion of the task, group administrators can view associated the task submission. Tasks will also include reminder emails as the deadline is reached. Special workflows and templates can be used for tasks, allowing tasks for problem set grading, student applications, event scheduling, and more.

#### Event creation

Events can be created and scheduled on Pallas through a [https://www.when2meet.com](when2meet)-like interface, complete with reminder emails.

#### Rich text

Rich text support for text boxes, including bold, italics, and attachments and file uploads.

#### Discord integration

Discord integration will include automatically creating roles and channels for groups, as well as email notifications for Discord pings.

#### Zoom integration

Zoom integration will include automatically setting up meetings for events and checking attendance.

#### pallas-bot: automating session workflows

Pallas is built to be unopinionated about Athemath's internal structure. A separate system called **pallas-bot** will be built to specifically automate creation of each new session and handle access level changes associated with sessions.

## Architecture

### Web portal

The Web portal is built with the MERN stack:
- **MongoDB** for storing all data in JSON format. (Currently it uses a local version; before deployment, it will be changed to one hosted through MongoDB itself.)
- **Express** runs the two web servers (frontend and backend), and for handling the backend API requests.
- **React** for the frontend.
- **Node.js** runtime environment.
A small Python script currently handles requests made to the Gmail API.

### API

The Pallas API is currently not meant to be used by users or developers. It is primarily divided into a public API, available at ``https://pallas.athemath.org/api``, and a private API, which is the main part of the API, intended for registered users, available at ``https://pallas.athemath.org/api/priv``. Currently, the database includes ``User`` and ``Group`` objects.

### Documentation

Documentation is planned, but there has been no progress on that yet. See [#10](/../../issues/10).

### About the name

Pallas is an epithet of unknown origin for the goddess Athena, used in _The Odyssey_ and other works.

Made by Ali Cy.
