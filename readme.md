# ShawnL.ink

![Build](https://github.com/shawnwildermuth/shawnlink/workflows/Build/badge.svg)
![Deploy](https://github.com/shawnwildermuth/shawnlink/workflows/Deploy/badge.svg)

My project for my short link site. Bitly is cool, but 
you can't edit the links. Let's see how much trouble I 
get into here!

I use bit.ly but I hate that I can't edit the links to 
update them. So I decided to build a tiny project to handle
my common links that I might want to update for vanity short
urls. 

Couple of things to note:

- I purposely avoided using MVC or any framework.
- I wanted to use top-level statements to shorten the code.
- I wanted it to be aggresively cached to speed up the expansion.
- Ended up using Azure SQL when Cosmos DB was too slow and too expensive.
- Supports more than one domain.
- I am using Azure AD just to only allow me to get to the admin pages and API. 

Take a look. It's not perfect or production solid. But it was fun. 

Here are a couple of shortened links:

- https://shawnl.ist/ps
- https://shawnl.ist/yt
- https://imfinel.ink/teaser 

I explained what I was doing in a recent talk. 

Feel free to fork and use it on your own. 