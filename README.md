# ProfileMe

## Demo

Demo it at http://profileme.1379.tech

## Overview

ProfileMe is a simple demo app that primarily focuses on the backend. The project was intended to originally be strictly an API, but has since had some simple views built into it for demonstration purposes.

The focus of this project is the backend code. The frontend is very basic HTML to provide means to an end.

## Concept

We live in an age where we have many public-facing social media accounts. Just to name a few more popular ones, we have Facebook, Google, Twitter, YouTube, Github, Steam, Battle.Net, Origin, Twitch.tv.

Many account provides offer OAuth, a means of identifying a user on a different website using their own authentication platform.

Public faces, especially people such as streamers on Twitch, operate multiple accounts. Sometimes it's hard to know what accounts they have--and other times, it can be difficult to verify and validate the user is who they say they are.


This app, ProfileMe, allows a person to list all of their OAuth identifiable accounts in one place, and verify they're all operated by the same user.

This works by having the user first sign up for a local account at profileme. This is the "anchor" point of which all other accounts will become associated.

After the user signs up with a local account here, they will then be able to go to a page listing all the currently built in OAuth accounts that exist within profileme. At the click of a button, they can be directed to an OAuth page for that provider, and upon signing in, a link will be made for that account to their ProfileMe account -- an "association".

## Setup & Configuration

### Special Notes

This app is built strictly for proof of concept. There are some conventions not handled in this that should be done for a production app. Please keep this in mind when viewing this demo and especially in any sort of use/deploy scenario.

* Passwords are stored in plaintext for local accounts. You should *always* secure your passwords by encrypting them. A personal suggestion is [bcrypt](https://www.npmjs.com/package/bcrypt) for node.js.
* No email verification is used for account verification. Conventionally, this is recommended, especially for a concept such as this. [Nodemailer](https://www.npmjs.com/package/nodemailer) is a great starting point for this.


### Setup

* Have Node v6.9.5 or greater installed
* Have MySQL v5.7.16 or greater installed
* Clone this repository into a working directory
* Import the database from file (located at /database.sql)
* run `npm install` once cloned
* Copy the config sample file to config.js (in the working directory) `mv config.sample.js config.js`
* Fill in config.js file accordingly. providing github and twitter API development keys. mysql information is in accordance to the current machine's mysql information.
* `node server.js`

Once the application is up and running, visit http://127.0.0.1:2000 (default port is 2000 unless changed in config file).

### Usage

Going to the homepage should redirect any user to the login page for this example. Once authenticated, the user will be redirected to their "public profile" page. This profile page is perma-linkable to others to show their "landing page" for associated accounts.

If viewing one's home page as onself (while authenticated), the user has the option to remove associated accounts, or add new ones.
