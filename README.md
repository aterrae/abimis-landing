# Abimis Landing
Abimis landing is based on the [Abimis framework](https://https://github.com/aterrae/abimis) by [Aterrae](http://aterrae.com)

### Requirements
To get started with Abimis you have to get some basic tools ready, these are:
- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/en/)
- [Bower](https://bower.io)

### Getting started
First things first let's get our dependencies ready!
To do so open your command line and type:
```bash
cd your_project_path
npm install
bower install
```
Now you can start compiling everything, to do so you have to run the command:
```bash
npm start
```
This will start the watch task that'll compile all your files and take care of your project.
When you are ready to get a production copy of your work just type
```bash
npm run deploy
```

### Customization
Abimis landing is highly customizable in a quick and effective way.
Most of the customization is centered around the strings file located in `src/data/strings.json`, this file manages most of the strings and contents used in the page.
You can also change many aspects of the style using the SASS settings file located in `src/scss/_settings.scss`.
There is native support for Mailchimp newsletter subscription. You can link your newsletter simply changing the Mailchimp string in the strings file.

---
Made with plenty of ❤️ by two guys from the **Aterrae** team in Rubano (Padova), Italy

Copyright © 2017 Aterrae | Digital Growth.
