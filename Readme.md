# gif-sharer

Small fun module for exploring the `fs-blob-store` API that allows uploading
gifs and share them with your friends.

## Get it to work

```
git clone https://github.com/finnp/gif-sharer
cd gif-sharer
npm install
npm start
```
If you have a `DATABASE_URL` containing a postgres url in the env, it will
try to use this for storage, otherwise it will use the filesystem. You can also
specify the port with `PORT`.


![Cat gif](cat.gif)