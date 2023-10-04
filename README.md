# Toolbar Timer Chrome Extension
An easy to use Timer that add a Toolbar to your Browser, for meetings.
It can be used in Meeting where there is screen sharing used on any Website.
Such as a Meeting for a Code review on Github, or talking about a Notion page etc.

##FAQ

### Why does this extension need declaritive net request (change headers)
For this extenison to work on as many pages as possible, it pastes the toolbar and the website in seperate iframes.
Some websites send a header, to not allow being displayed in an iframe.
This extension just allows set the xframe police to none and will set it to same origin in the future, basically just circumventing the deny header without creating surface for Cross site scripting.


### WebNavigate to detect all navigation inside the iframes

### tabs to navigate the whole site if you are redirected in subframe

### My site is not working properly
Sometimes reloading solves the issue.
If it still doesn't work, please create a github issue with the Website url
and idealy with a good description and a Screenshot. 


#How to build
Install typescript
npm install chrome types and Jquery.
npm i -D @types/jquery
type 'tsc' in console
after that there may be some bundling necessary

