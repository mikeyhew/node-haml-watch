# node-haml-watch

Watches .haml files in the given directories and automatically compiles them to .html using [`haml-coffee`](https://github.com/netzpirat/haml-coffee).

## Usage:

```bash
npm install -g haml-watch
haml-watch ./dir1 ./dir2 ...
```

## Notes

- Due to a bug in `gaze` ([#177](https://github.com/shama/gaze/issues/177)), if a directory that you are watching doesn't have any .haml files in it at the time you start `haml-coffee`, new .haml files added to the directory won't be noticed until `haml-coffee` is restarted. 
