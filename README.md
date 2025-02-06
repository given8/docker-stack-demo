# Docker Stack Demo
This is a very basic node.js app that uses redis and MongoDB. The main purpose of creating this is to practice deploying a multi-container app using Docker Stack. It has 2 pages constructed from ejs templates. One page for viewing all the blog posts and the other for creating a new one. They can be reached at the root and the `/new` paths respectively 

## Infrastructure
The app was deployed onto a 5 VM cluster (3 Manager Nodes and 2 Worker Nodes). 
