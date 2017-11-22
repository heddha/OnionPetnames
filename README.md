# OnionPetnames

This is the experimental and non-finished version of a web extension that strives to make life easier for Tor-users. The idea comes from [a blog post from the tor project] in which different ideas to make the use of onion addresses easier are discussed. This here is a PoC of Idea 2.5.    


This web extension aims to store onion addresses under a "petname", very similar to a phone book. Entries can be modified, they can be exported and imported. If exported, the data is encrypted using a passphrase that the user has to enter. This passphrase is needed to decrypt the data again, upon importing entries.


To start using this work-in-progress, download the code, go to about:debugging and under "Load Temporary Add-on", select the file "manifest.json". 


If you feel like participating in this project, you're very welcome to!

[a blog post from the tor project]: https://blog.torproject.org/blog/cooking-onions-names-your-onions
